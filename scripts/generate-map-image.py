from __future__ import annotations

import json
from itertools import product
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public' / 'assets'
SPRITES = ASSETS / 'game-sprites'
SHEETS = ASSETS / 'generated-sheets'
OUT = SHEETS / 'developer-farm-map.png'
PIXELLAB_TERRAIN = ASSETS / 'pixellab' / 'terrain'

TILE = 16
OUTSIDE_WORLD_W = 32
OUTSIDE_WORLD_H = 22
INTERIOR_WORLD_W = 24
INTERIOR_WORLD_H = 16
WORLD_PIXEL_W = OUTSIDE_WORLD_W * TILE
WORLD_PIXEL_H = OUTSIDE_WORLD_H * TILE
INTERIOR_BG = SHEETS / 'farmhouse-interior-room.png'
INTERIOR_BG_SIZE = (INTERIOR_WORLD_W * TILE, INTERIOR_WORLD_H * TILE)

SHEET_TARGETS = {
    ASSETS / 'cozy-farming-village-tileset-4x3.png': (748, 561),
    SHEETS / 'developer-farmhouse-interior-sheet.png': (701, 561),
    SHEETS / 'developer-farmer-character-sheet.png': (768, 512),
}

PATH_TILESET = PIXELLAB_TERRAIN / 'grass-path-flat'
SOIL_TILESET = PIXELLAB_TERRAIN / 'grass-soil-flat-v2'
RUNTIME_PALETTE_REFS = [
    (SPRITES / 'sprite-50.png', 14),
    (SPRITES / 'sprite-48.png', 14),
    (SPRITES / 'sprite-47.png', 14),
]

TREES = [
    {'src': SPRITES / 'sprite-56.png', 'x': 1, 'y': 6, 'size': 38},
    {'src': SPRITES / 'sprite-63.png', 'x': 28, 'y': 3, 'size': 41},
    {'src': SPRITES / 'sprite-56.png', 'x': 27, 'y': 12, 'size': 35},
    {'src': SPRITES / 'sprite-63.png', 'x': 2, 'y': 19, 'size': 40},
    {'src': SPRITES / 'sprite-56.png', 'x': 27, 'y': 19, 'size': 38},
]

POND_BANK = '#80633a'
POND_BANK_LIGHT = '#b38b4e'
POND_WATER_DARK = '#245d68'
POND_WATER = '#398996'
POND_WATER_LIGHT = '#75c2b7'
RANCH_FENCE_DARK = '#5f3c24'
RANCH_FENCE = '#a66e37'
RANCH_FENCE_LIGHT = '#d59a4f'


def in_rect(x: int, y: int, left: int, right: int, top: int, bottom: int) -> bool:
    return left <= x <= right and top <= y <= bottom


def terrain_type(x: int, y: int) -> str:
    if in_rect(x, y, 2, 5, 2, 3) or in_rect(x, y, 10, 13, 2, 3):
        return 'path'
    if in_rect(x, y, 5, 10, 3, 4):
        return 'path'
    if in_rect(x, y, 7, 9, 4, 8):
        return 'path'
    if in_rect(x, y, 8, 9, 8, 18):
        return 'path'
    if in_rect(x, y, 8, 25, 8, 9):
        return 'path'
    if in_rect(x, y, 23, 26, 7, 10):
        return 'path'
    if in_rect(x, y, 9, 13, 13, 14):
        return 'path'
    if in_rect(x, y, 4, 9, 17, 18) or in_rect(x, y, 18, 22, 18, 19):
        return 'path'
    if in_rect(x, y, 15, 18, 13, 15):
        return 'soil'
    return 'grass'


def load_reference_colors(path: Path, count: int) -> list[tuple[int, int, int]]:
    source = Image.open(path).convert('RGB')
    width, height = source.size
    source = source.crop((width // 8, height // 8, width - width // 8, height - height // 8))
    quantized = source.quantize(
        colors=count,
        method=Image.Quantize.MEDIANCUT,
        dither=Image.Dither.NONE,
    )
    palette = quantized.getpalette()
    if palette is None:
        raise ValueError(f'Could not extract palette from {path}')

    color_counts = sorted(quantized.getcolors() or [], reverse=True)
    return [tuple(palette[index * 3:index * 3 + 3]) for _, index in color_counts]


def build_runtime_palette() -> Image.Image:
    colors: list[tuple[int, int, int]] = []
    for path, count in RUNTIME_PALETTE_REFS:
        for color in load_reference_colors(path, count):
            if color not in colors:
                colors.append(color)

    palette_values = [channel for color in colors[:256] for channel in color]
    palette_values.extend([0] * (768 - len(palette_values)))
    palette = Image.new('P', (1, 1))
    palette.putpalette(palette_values)
    return palette


def load_wang_tileset(folder: Path, palette: Image.Image) -> dict[tuple[str, str, str, str], Image.Image]:
    sheet = Image.open(folder / 'tileset.png').convert('RGBA')
    metadata = json.loads((folder / 'metadata.json').read_text(encoding='utf-8'))
    tile_size = metadata['tile_size']
    if tile_size != {'width': TILE, 'height': TILE} or metadata['transition_size'] != 0.0:
        raise ValueError(f'{folder} must be a flat {TILE}x{TILE} Wang tileset')

    matched = sheet.convert('RGB').quantize(palette=palette, dither=Image.Dither.NONE).convert('RGBA')
    matched.putalpha(sheet.getchannel('A'))
    tiles: dict[tuple[str, str, str, str], Image.Image] = {}

    for item in metadata['tileset_data']['tiles']:
        corners = item['corners']
        key = (corners['NW'], corners['NE'], corners['SW'], corners['SE'])
        box = item['bounding_box']
        tiles[key] = matched.crop((
            box['x'],
            box['y'],
            box['x'] + box['width'],
            box['y'] + box['height'],
        ))

    expected = set(product(('lower', 'upper'), repeat=4))
    if set(tiles) != expected:
        raise ValueError(f'{folder} does not contain all 16 flat Wang corner combinations')
    return tiles


def terrain_vertices(target: str) -> list[list[bool]]:
    vertices: list[list[bool]] = []
    for vertex_y in range(OUTSIDE_WORLD_H + 1):
        row: list[bool] = []
        for vertex_x in range(OUTSIDE_WORLD_W + 1):
            target_count = sum(
                1
                for cell_y, cell_x in (
                    (vertex_y - 1, vertex_x - 1),
                    (vertex_y - 1, vertex_x),
                    (vertex_y, vertex_x - 1),
                    (vertex_y, vertex_x),
                )
                if 0 <= cell_x < OUTSIDE_WORLD_W
                and 0 <= cell_y < OUTSIDE_WORLD_H
                and terrain_type(cell_x, cell_y) == target
            )
            row.append(target_count >= 2)
        vertices.append(row)
    return vertices


def wang_key(vertices: list[list[bool]], x: int, y: int) -> tuple[str, str, str, str]:
    return tuple(
        'upper' if value else 'lower'
        for value in (
            vertices[y][x],
            vertices[y][x + 1],
            vertices[y + 1][x],
            vertices[y + 1][x + 1],
        )
    )


def validate_terrain(canvas: Image.Image) -> None:
    pixels = list(canvas.get_flattened_data())
    if any(alpha != 255 for _, _, _, alpha in pixels):
        raise ValueError('Terrain contains transparent pixels')

    pale_neutral = sum(
        1
        for red, green, blue, _ in pixels
        if min(red, green, blue) > 220 and max(red, green, blue) - min(red, green, blue) < 18
    )
    if pale_neutral > len(pixels) // 1000:
        raise ValueError('Terrain contains repeated pale sheet-background pixels')


def draw_fishing_pond(canvas: Image.Image) -> None:
    draw = ImageDraw.Draw(canvas)
    bank = [
        (398, 222), (450, 222), (450, 230), (466, 230),
        (466, 282), (450, 282), (450, 290), (398, 290),
        (398, 282), (382, 282), (382, 230), (398, 230),
    ]
    inner_bank = [
        (402, 226), (446, 226), (446, 234), (462, 234),
        (462, 278), (446, 278), (446, 286), (402, 286),
        (402, 278), (386, 278), (386, 234), (402, 234),
    ]
    water = [
        (406, 230), (442, 230), (442, 238), (458, 238),
        (458, 274), (442, 274), (442, 282), (406, 282),
        (406, 274), (390, 274), (390, 238), (406, 238),
    ]
    draw.polygon(bank, fill=POND_BANK)
    draw.line(bank + [bank[0]], fill='#4d432c', width=2, joint='curve')
    draw.polygon(inner_bank, fill=POND_BANK_LIGHT)
    draw.polygon(water, fill=POND_WATER)
    draw.line(water + [water[0]], fill=POND_WATER_DARK, width=2)
    draw.rectangle((406, 244, 428, 245), fill=POND_WATER_LIGHT)
    draw.rectangle((433, 257, 452, 258), fill=POND_WATER_DARK)
    draw.rectangle((398, 266, 416, 267), fill=POND_WATER_LIGHT)
    draw.point((444, 241), fill='#a8ddd0')
    draw.point((421, 273), fill='#a8ddd0')


def draw_ranch_pen(canvas: Image.Image) -> None:
    draw = ImageDraw.Draw(canvas)
    left, top, right, bottom = 166, 274, 238, 338
    draw.rectangle((left + 3, top + 3, right - 3, bottom - 3), fill='#628f42')
    for x, y in ((174, 286), (205, 297), (227, 282), (184, 322), (218, 326)):
        draw.rectangle((x, y, x + 1, y + 1), fill='#86aa4c')
    for x, y in ((191, 283), (229, 310), (176, 307), (210, 332)):
        draw.point((x, y), fill='#4f7938')

    gate_left, gate_right = 194, 210
    draw.rectangle((left, top + 5, gate_left, top + 7), fill=RANCH_FENCE_DARK)
    draw.rectangle((left, top + 3, gate_left, top + 5), fill=RANCH_FENCE)
    draw.line((gate_right, top + 5, right, top + 5), fill=RANCH_FENCE_DARK, width=3)
    draw.line((gate_right, top + 3, right, top + 3), fill=RANCH_FENCE, width=2)
    draw.line((left + 3, bottom - 4, right - 3, bottom - 4), fill=RANCH_FENCE_DARK, width=3)
    draw.line((left + 3, bottom - 6, right - 3, bottom - 6), fill=RANCH_FENCE, width=2)
    draw.line((left + 4, top + 5, left + 4, bottom - 4), fill=RANCH_FENCE_DARK, width=3)
    draw.line((left + 2, top + 5, left + 2, bottom - 4), fill=RANCH_FENCE, width=2)
    draw.line((right - 4, top + 5, right - 4, bottom - 4), fill=RANCH_FENCE_DARK, width=3)
    draw.line((right - 2, top + 5, right - 2, bottom - 4), fill=RANCH_FENCE, width=2)

    for x in (left, gate_left, gate_right, right - 6):
        draw.rectangle((x, top, x + 5, top + 11), fill=RANCH_FENCE_DARK)
        draw.rectangle((x + 1, top, x + 4, top + 8), fill=RANCH_FENCE)
        draw.line((x + 2, top + 1, x + 3, top + 1), fill=RANCH_FENCE_LIGHT, width=1)
    for x in (left, left + 24, left + 48, right - 6):
        draw.rectangle((x, bottom - 11, x + 5, bottom), fill=RANCH_FENCE_DARK)
        draw.rectangle((x + 1, bottom - 9, x + 4, bottom - 1), fill=RANCH_FENCE)


def render_terrain() -> Image.Image:
    palette = build_runtime_palette()
    path_tiles = load_wang_tileset(PATH_TILESET, palette)
    soil_tiles = load_wang_tileset(SOIL_TILESET, palette)
    path_vertices = terrain_vertices('path')
    soil_vertices = terrain_vertices('soil')
    canvas = Image.new('RGBA', (WORLD_PIXEL_W, WORLD_PIXEL_H), (0, 0, 0, 255))

    for y in range(OUTSIDE_WORLD_H):
        for x in range(OUTSIDE_WORLD_W):
            canvas.alpha_composite(path_tiles[wang_key(path_vertices, x, y)], (x * TILE, y * TILE))

    for y in range(OUTSIDE_WORLD_H):
        for x in range(OUTSIDE_WORLD_W):
            key = wang_key(soil_vertices, x, y)
            if 'upper' in key:
                canvas.alpha_composite(soil_tiles[key], (x * TILE, y * TILE))

    graded = ImageEnhance.Color(canvas.convert('RGB')).enhance(0.9)
    graded = ImageEnhance.Brightness(graded).enhance(0.96)
    graded = ImageEnhance.Contrast(graded).enhance(1.03)
    canvas = graded.convert('RGBA')
    draw_ranch_pen(canvas)
    draw_fishing_pond(canvas)
    validate_terrain(canvas)
    return canvas


def resize_image(path: Path, size: tuple[int, int], *, cover: bool = False) -> bool:
    with Image.open(path) as source_image:
        source = source_image.convert('RGBA')
        if source.size == size:
            return False

        if cover:
            src_w, src_h = source.size
            target_w, target_h = size
            src_ratio = src_w / src_h
            target_ratio = target_w / target_h

            if src_ratio > target_ratio:
                crop_w = round(src_h * target_ratio)
                left = (src_w - crop_w) // 2
                source = source.crop((left, 0, left + crop_w, src_h))
            else:
                crop_h = round(src_w / target_ratio)
                top = (src_h - crop_h) // 2
                source = source.crop((0, top, src_w, top + crop_h))

        output = source.resize(size, Image.Resampling.BOX)
        output.save(path)
        return True


def main() -> None:
    canvas = render_terrain()

    # Keep large decorative trees in the terrain layer while runtime entities stay interactive.
    for tree in TREES:
        sprite = Image.open(tree['src']).convert('RGBA')
        ratio = tree['size'] / sprite.width
        sprite = sprite.resize((tree['size'], max(1, round(sprite.height * ratio))), Image.Resampling.NEAREST)
        x = tree['x'] * TILE
        y = tree['y'] * TILE - 12
        canvas.alpha_composite(sprite, (x, y))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT)
    print(f'wrote {OUT} {canvas.size[0]}x{canvas.size[1]}')

    if resize_image(INTERIOR_BG, INTERIOR_BG_SIZE, cover=True):
        print(f'downsampled {INTERIOR_BG} {INTERIOR_BG_SIZE[0]}x{INTERIOR_BG_SIZE[1]}')

    for sheet, target_size in SHEET_TARGETS.items():
        if resize_image(sheet, target_size):
            print(f'downsampled {sheet} {target_size[0]}x{target_size[1]}')


if __name__ == '__main__':
    main()

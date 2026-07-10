from __future__ import annotations

import json
from itertools import product
from pathlib import Path
from PIL import Image, ImageEnhance

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

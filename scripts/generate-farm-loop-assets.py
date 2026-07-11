from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public' / 'assets' / 'farm-loop'
SIZE = 32

INK = '#3b2818'
SOIL = '#9a5f2c'
SOIL_DARK = '#6e3f21'
SOIL_LIGHT = '#c88642'
GRASS = '#79bd45'
GRASS_LIGHT = '#a2d957'
WATER = '#6bc7dc'
LEAF = '#4f9a3c'
LEAF_DARK = '#2f6e32'
LEAF_LIGHT = '#83cf55'

CROP_PALETTES = {
    'frontend': {
        'accent': '#55c7d9',
        'fruit': '#ef6c5b',
        'fruit_light': '#ffb05f',
    },
    'backend': {
        'accent': '#f1c84f',
        'fruit': '#df963d',
        'fruit_light': '#ffe274',
    },
    'bim': {
        'accent': '#8db7e8',
        'fruit': '#9b78d0',
        'fruit_light': '#d9b2ed',
    },
}


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    return image, ImageDraw.Draw(image)


def save(image: Image.Image, relative_path: str) -> None:
    path = OUTPUT / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def draw_soil_mound(draw: ImageDraw.ImageDraw, y: int = 27) -> None:
    draw.rectangle((9, y - 2, 22, y), fill=INK)
    draw.rectangle((7, y - 1, 24, y + 1), fill=SOIL_DARK)
    draw.rectangle((10, y - 1, 21, y), fill=SOIL_LIGHT)


def draw_ground_tiles() -> None:
    image, draw = canvas()
    draw.rectangle((1, 1, 30, 30), outline=LEAF_DARK, width=2)
    draw.rectangle((3, 3, 28, 28), fill=GRASS)
    for x, y in ((6, 7), (23, 5), (10, 24), (26, 21), (17, 11)):
        draw.point((x, y), fill=GRASS_LIGHT)
        draw.point((x + 1, y), fill=LEAF_DARK)
    save(image, 'ground/untilled.png')

    image, draw = canvas()
    draw.rectangle((1, 1, 30, 30), fill=INK)
    draw.rectangle((3, 3, 28, 28), fill=SOIL)
    for y in (8, 15, 22):
        draw.rectangle((5, y, 26, y + 1), fill=SOIL_DARK)
        draw.point((8, y - 1), fill=SOIL_LIGHT)
        draw.point((20, y + 2), fill=SOIL_LIGHT)
    save(image, 'ground/tilled.png')

    image, draw = canvas()
    draw.rectangle((1, 1, 30, 30), fill=INK)
    draw.rectangle((3, 3, 28, 28), fill='#754424')
    for y in (8, 15, 22):
        draw.rectangle((5, y, 26, y + 1), fill='#55311e')
    for x, y in ((8, 5), (24, 12), (13, 19), (22, 26)):
        draw.point((x, y), fill=WATER)
        draw.point((x, y + 1), fill='#3c91b3')
    save(image, 'ground/watered.png')


def draw_seed_stage(crop: str, watered: bool) -> Image.Image:
    image, draw = canvas()
    palette = CROP_PALETTES[crop]
    draw_soil_mound(draw)
    draw.rectangle((14, 23, 17, 25), fill=INK)
    draw.rectangle((15, 22, 16, 24), fill=palette['accent'])
    if watered:
        draw.rectangle((21, 18, 22, 21), fill='#3c91b3')
        draw.rectangle((20, 20, 23, 22), fill=WATER)
        draw.point((21, 22), fill='#d8f4f1')
    return image


def draw_sprout(crop: str, large: bool) -> Image.Image:
    image, draw = canvas()
    palette = CROP_PALETTES[crop]
    draw_soil_mound(draw)
    stem_top = 12 if large else 17
    draw.rectangle((14, stem_top, 17, 26), fill=INK)
    draw.rectangle((15, stem_top, 16, 25), fill=LEAF_LIGHT)
    if large:
        leaves = [
            (8, 14, 14, 19),
            (17, 12, 24, 17),
            (9, 20, 15, 23),
            (17, 18, 23, 22),
        ]
    else:
        leaves = [(10, 18, 14, 22), (17, 16, 21, 20)]
    for x1, y1, x2, y2 in leaves:
        draw.rectangle((x1, y1, x2, y2), fill=INK)
        draw.rectangle((x1 + 1, y1 + 1, x2 - 1, y2 - 1), fill=LEAF)
    draw.rectangle((15, stem_top - 1, 17, stem_top + 1), fill=palette['accent'])
    return image


def draw_ready_crop(crop: str) -> Image.Image:
    image, draw = canvas()
    palette = CROP_PALETTES[crop]
    draw_soil_mound(draw)
    draw.rectangle((14, 8, 17, 26), fill=INK)
    draw.rectangle((15, 9, 16, 25), fill=LEAF_LIGHT)
    for x1, y1, x2, y2 in ((7, 12, 14, 17), (17, 10, 25, 15), (8, 18, 15, 23), (17, 17, 24, 22)):
        draw.rectangle((x1, y1, x2, y2), fill=INK)
        draw.rectangle((x1 + 1, y1 + 1, x2 - 1, y2 - 1), fill=LEAF)

    if crop == 'frontend':
        for x, y in ((10, 11), (20, 9), (12, 18), (21, 17)):
            draw.rectangle((x, y, x + 4, y + 4), fill=INK)
            draw.rectangle((x + 1, y + 1, x + 3, y + 3), fill=palette['fruit'])
            draw.point((x + 2, y + 1), fill=palette['fruit_light'])
    elif crop == 'backend':
        for x, y in ((10, 8), (20, 7), (8, 14), (22, 13)):
            draw.rectangle((x, y, x + 2, y + 7), fill=INK)
            draw.rectangle((x + 1, y + 1, x + 2, y + 6), fill=palette['fruit'])
            draw.point((x + 1, y + 2), fill=palette['fruit_light'])
            draw.point((x + 1, y + 5), fill=palette['fruit_light'])
    else:
        for x, y in ((10, 9), (20, 8), (11, 17), (21, 16)):
            draw.rectangle((x - 1, y + 1, x + 5, y + 3), fill=INK)
            draw.rectangle((x + 1, y - 1, x + 3, y + 5), fill=INK)
            draw.rectangle((x, y + 1, x + 4, y + 3), fill=palette['fruit'])
            draw.rectangle((x + 1, y, x + 3, y + 4), fill=palette['fruit_light'])
            draw.point((x + 2, y + 2), fill=palette['accent'])
    return image


def draw_crop_sprites() -> None:
    for crop in CROP_PALETTES:
        save(draw_seed_stage(crop, watered=False), f'crops/{crop}/planted.png')
        save(draw_seed_stage(crop, watered=True), f'crops/{crop}/watered.png')
        save(draw_sprout(crop, large=False), f'crops/{crop}/growing-1.png')
        save(draw_sprout(crop, large=True), f'crops/{crop}/growing-2.png')
        save(draw_ready_crop(crop), f'crops/{crop}/ready.png')


def draw_tool_icons() -> None:
    image, draw = canvas()
    for offset in range(3):
        draw.line((8 + offset, 25, 22 + offset, 7), fill=INK, width=2)
    draw.line((10, 25, 23, 8), fill='#9b6731', width=2)
    draw.rectangle((18, 6, 27, 10), fill=INK)
    draw.rectangle((19, 7, 26, 9), fill='#b8c5bd')
    save(image, 'tools/hoe.png')

    image, draw = canvas()
    draw.rectangle((7, 9, 24, 27), fill=INK)
    draw.rectangle((9, 11, 22, 25), fill='#d6ae61')
    draw.rectangle((11, 7, 20, 11), fill=INK)
    draw.rectangle((12, 8, 19, 10), fill='#f1d489')
    draw.rectangle((14, 13, 16, 22), fill=LEAF_DARK)
    draw.rectangle((10, 14, 14, 18), fill=LEAF)
    draw.rectangle((16, 12, 20, 16), fill=LEAF_LIGHT)
    save(image, 'tools/seeds.png')

    image, draw = canvas()
    draw.rectangle((7, 12, 23, 27), fill=INK)
    draw.rectangle((9, 14, 21, 25), fill='#4e9fc0')
    draw.rectangle((12, 8, 20, 13), fill=INK)
    draw.rectangle((14, 9, 18, 12), fill='#7bd1dc')
    draw.line((22, 15, 29, 11), fill=INK, width=3)
    draw.line((22, 16, 29, 12), fill='#7bd1dc', width=1)
    draw.rectangle((3, 15, 8, 23), outline=INK, width=2)
    draw.point((27, 18), fill=WATER)
    draw.point((29, 21), fill=WATER)
    save(image, 'tools/watering-can.png')


def write_manifest() -> None:
    manifest = {
        'version': 1,
        'logical_size': SIZE,
        'generator': 'scripts/generate-farm-loop-assets.py',
        'crops': list(CROP_PALETTES),
        'crop_stages': ['planted', 'watered', 'growing-1', 'growing-2', 'ready'],
        'tools': ['hoe', 'seeds', 'watering-can'],
        'fallback_reason': 'PixelLab MCP token was unavailable in the active process; deterministic PNG assets keep the runtime reproducible.',
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=True, indent=2) + '\n', encoding='utf-8')


def main() -> None:
    draw_ground_tiles()
    draw_crop_sprites()
    draw_tool_icons()
    write_manifest()
    print(f'wrote Farm Loop assets to {OUTPUT}')


if __name__ == '__main__':
    main()

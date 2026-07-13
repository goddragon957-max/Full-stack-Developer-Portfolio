from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public' / 'assets' / 'fishing'
SIZE = 32

INK = '#2f281c'
WATER_DARK = '#245d68'
WATER = '#398996'
WATER_LIGHT = '#75c2b7'

FISH = {
    'bluegill': {'body': '#4a9bb2', 'light': '#8bd0cf', 'accent': '#315c8d', 'shape': 'round'},
    'carp': {'body': '#d79a3d', 'light': '#f4d36f', 'accent': '#9b5b2d', 'shape': 'long'},
    'perch': {'body': '#8fb94d', 'light': '#d3da68', 'accent': '#476f3b', 'shape': 'striped'},
    'koi': {'body': '#f0e2bb', 'light': '#fff4d5', 'accent': '#e65f45', 'shape': 'koi'},
    'moonfin': {'body': '#746bb9', 'light': '#b9d5e7', 'accent': '#63d6c3', 'shape': 'moon'},
}

POND_CELLS = [
    {'x': 25, 'y': 14}, {'x': 26, 'y': 14}, {'x': 27, 'y': 14},
    {'x': 24, 'y': 15}, {'x': 25, 'y': 15}, {'x': 26, 'y': 15}, {'x': 27, 'y': 15}, {'x': 28, 'y': 15},
    {'x': 24, 'y': 16}, {'x': 25, 'y': 16}, {'x': 26, 'y': 16}, {'x': 27, 'y': 16}, {'x': 28, 'y': 16},
    {'x': 25, 'y': 17}, {'x': 26, 'y': 17}, {'x': 27, 'y': 17},
]

FISHING_SPOTS = [
    {'id': 'pond-west', 'stand': {'x': 23, 'y': 15}, 'bobber': {'x': 24, 'y': 15}, 'facing': 'right'},
    {'id': 'pond-south', 'stand': {'x': 26, 'y': 18}, 'bobber': {'x': 26, 'y': 17}, 'facing': 'up'},
]


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    return image, ImageDraw.Draw(image)


def save(image: Image.Image, relative: str) -> None:
    path = OUTPUT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def draw_fish(fish_id: str, palette: dict[str, str]) -> Image.Image:
    image, draw = canvas()
    shape = palette['shape']
    body_box = (7, 10, 24, 22) if shape == 'round' else (6, 11, 25, 21)
    draw.polygon([(6, 15), (2, 10), (2, 22)], fill=INK)
    draw.polygon([(7, 15), (3, 12), (3, 20)], fill=palette['accent'])
    draw.rounded_rectangle(body_box, radius=5 if shape == 'round' else 4, fill=INK)
    draw.rounded_rectangle((body_box[0] + 1, body_box[1] + 1, body_box[2] - 1, body_box[3] - 1), radius=4, fill=palette['body'])
    draw.polygon([(14, body_box[1] + 1), (18, 6), (20, body_box[1] + 2)], fill=INK)
    draw.polygon([(15, body_box[1] + 1), (18, 8), (19, body_box[1] + 2)], fill=palette['accent'])
    draw.rectangle((21, 13, 23, 15), fill=palette['light'])
    draw.point((22, 14), fill=INK)
    draw.rectangle((23, 17, 26, 18), fill=INK)

    if shape == 'striped':
        for x in (10, 14, 18):
            draw.rectangle((x, 12, x + 1, 20), fill=palette['accent'])
    elif shape == 'koi':
        draw.rectangle((10, 12, 14, 15), fill=palette['accent'])
        draw.rectangle((16, 17, 20, 20), fill=palette['accent'])
    elif shape == 'moon':
        draw.rectangle((9, 13, 19, 14), fill=palette['light'])
        draw.rectangle((12, 18, 21, 19), fill=palette['accent'])
        draw.point((16, 10), fill='#fff2a8')
    elif shape == 'long':
        draw.rectangle((9, 13, 17, 14), fill=palette['light'])
        draw.rectangle((11, 18, 19, 19), fill=palette['accent'])
    else:
        draw.rectangle((9, 13, 16, 14), fill=palette['light'])

    return image


def draw_tools_and_water() -> None:
    image, draw = canvas()
    draw.line((7, 26, 21, 6), fill=INK, width=3)
    draw.line((8, 25, 21, 7), fill='#9a6636', width=1)
    draw.line((21, 7, 28, 20), fill=INK, width=1)
    draw.rectangle((26, 19, 29, 25), fill=INK)
    draw.rectangle((27, 20, 28, 23), fill='#e65f45')
    draw.point((27, 24), fill='#f4e7c2')
    save(image, 'tools/fishing-rod.png')

    for frame in range(2):
        image, draw = canvas()
        y = 16 + frame
        draw.rectangle((5 + frame * 2, y, 26 - frame * 2, y + 1), fill=WATER_LIGHT)
        draw.rectangle((9, y + 4, 22, y + 5), fill=WATER_DARK)
        draw.point((7, y - 2), fill=WATER)
        draw.point((24, y + 7), fill=WATER_LIGHT)
        save(image, f'water/ripple-{frame}.png')

    image, draw = canvas()
    draw.rectangle((14, 6, 17, 16), fill=INK)
    draw.rectangle((15, 7, 16, 10), fill='#f5eee0')
    draw.rectangle((15, 11, 16, 15), fill='#e65f45')
    draw.rectangle((9, 18, 22, 19), fill=WATER_LIGHT)
    draw.rectangle((12, 21, 19, 22), fill=WATER_DARK)
    save(image, 'water/bobber.png')


def write_manifest() -> None:
    manifest = {
        'version': 1,
        'logical_size': SIZE,
        'generator': 'scripts/generate-fishing-assets.py',
        'fish': list(FISH),
        'water_frames': ['water/ripple-0.png', 'water/ripple-1.png'],
        'fishing_spots': FISHING_SPOTS,
        'pond_cells': POND_CELLS,
        'fallback_reason': 'PixelLab MCP token was unavailable; deterministic Pillow assets preserve palette and grid alignment.',
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=True, indent=2) + '\n', encoding='utf-8')


def main() -> None:
    for fish_id, palette in FISH.items():
        save(draw_fish(fish_id, palette), f'fish/{fish_id}.png')
    draw_tools_and_water()
    write_manifest()
    print(f'wrote Fishing Pond assets to {OUTPUT}')


if __name__ == '__main__':
    main()

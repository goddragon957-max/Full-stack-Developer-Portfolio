from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'assets' / 'village-life-v2'

INK = '#3b2a20'
INK_SOFT = '#65452f'
CREAM = '#f6e6b4'
HIGHLIGHT = '#fff3c8'
GREEN = '#4f7f3c'
GREEN_LIGHT = '#78aa4d'
GREEN_DARK = '#31502c'
GOLD = '#e4ad3f'
GOLD_LIGHT = '#ffd96a'
RED = '#bd4c3f'
RED_LIGHT = '#e97958'
BLUE = '#4f8291'
BLUE_LIGHT = '#80c4ca'
PURPLE = '#71588d'


def canvas(size: tuple[int, int]) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new('RGBA', size, (0, 0, 0, 0))
    return image, ImageDraw.Draw(image)


def save(image: Image.Image, relative: str) -> None:
    target = OUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target)


def draw_npc(role: str, frame: int) -> Image.Image:
    image, draw = canvas((48, 64))
    skin = '#d79a68'
    skin_light = '#efbd82'
    hair = '#5a3427' if role == 'farmer' else '#3d302a'
    shirt = '#dc6e4f' if role == 'farmer' else '#557f93'
    shirt_light = '#f08a61' if role == 'farmer' else '#70a1ad'
    pants = '#446244' if role == 'farmer' else '#66507b'
    arm_shift = 1 if frame else 0

    draw.rectangle((15, 15, 32, 30), fill=INK)
    draw.rectangle((17, 16, 30, 29), fill=skin)
    draw.rectangle((18, 17, 29, 22), fill=skin_light)
    draw.rectangle((17, 15, 30, 18), fill=hair)
    draw.rectangle((16, 18, 18, 24), fill=hair)
    draw.rectangle((29, 18, 31, 24), fill=hair)
    draw.rectangle((20, 22, 21, 23), fill=INK)
    draw.rectangle((27, 22, 28, 23), fill=INK)
    draw.rectangle((23, 26, 26, 27), fill='#9b5344')

    if role == 'farmer':
        draw.rectangle((12, 9, 35, 13), fill=INK)
        draw.rectangle((14, 7, 33, 11), fill=GOLD)
        draw.rectangle((17, 4, 30, 9), fill=GOLD_LIGHT)
        draw.rectangle((20, 5, 29, 6), fill=HIGHLIGHT)
        draw.rectangle((16, 10, 32, 12), fill='#b56b2f')
    else:
        draw.rectangle((13, 8, 34, 12), fill=INK)
        draw.rectangle((15, 6, 32, 10), fill=PURPLE)
        draw.rectangle((18, 4, 29, 7), fill='#8d71a6')
        draw.rectangle((31, 10, 35, 13), fill=BLUE_LIGHT)

    draw.rectangle((13, 30, 34, 49), fill=INK)
    draw.rectangle((15, 31, 32, 47), fill=shirt)
    draw.rectangle((17, 32, 30, 35), fill=shirt_light)
    if role == 'farmer':
        draw.rectangle((19, 37, 28, 48), fill='#5e8272')
        draw.rectangle((21, 37, 26, 46), fill='#83a893')
        draw.rectangle((23, 40, 24, 41), fill=GOLD_LIGHT)
    else:
        draw.rectangle((16, 37, 31, 41), fill=CREAM)
        draw.rectangle((20, 41, 27, 48), fill='#b97a4f')

    draw.rectangle((9 + arm_shift, 32, 14 + arm_shift, 45), fill=INK)
    draw.rectangle((10 + arm_shift, 33, 13 + arm_shift, 43), fill=shirt)
    draw.rectangle((10 + arm_shift, 43, 13 + arm_shift, 46), fill=skin_light)
    draw.rectangle((33 - arm_shift, 32, 38 - arm_shift, 45), fill=INK)
    draw.rectangle((34 - arm_shift, 33, 37 - arm_shift, 43), fill=shirt)
    draw.rectangle((34 - arm_shift, 43, 37 - arm_shift, 46), fill=skin_light)

    leg_shift = 1 if frame else 0
    draw.rectangle((15, 48, 24, 58 - leg_shift), fill=INK)
    draw.rectangle((17, 48, 22, 56 - leg_shift), fill=pants)
    draw.rectangle((24, 48, 33, 58), fill=INK)
    draw.rectangle((26, 48, 31, 56), fill=pants)
    draw.rectangle((14, 57 - leg_shift, 23, 60 - leg_shift), fill=INK_SOFT)
    draw.rectangle((25, 57, 34, 60), fill=INK_SOFT)
    return image


def draw_chicken(frame: int | str) -> Image.Image:
    image, draw = canvas((32, 32))
    if frame == 'sleeping':
        draw.rectangle((7, 17, 25, 24), fill=INK)
        draw.rectangle((9, 15, 24, 22), fill=CREAM)
        draw.rectangle((11, 14, 21, 17), fill=HIGHLIGHT)
        draw.rectangle((22, 17, 26, 21), fill=CREAM)
        draw.rectangle((24, 18, 25, 18), fill=INK)
        draw.rectangle((6, 20, 9, 22), fill=RED)
        draw.rectangle((12, 25, 22, 26), fill=INK_SOFT)
        return image

    hop = 1 if frame == 1 else 0
    draw.rectangle((8, 13 - hop, 24, 24 - hop), fill=INK)
    draw.rectangle((10, 12 - hop, 22, 22 - hop), fill=CREAM)
    draw.rectangle((11, 13 - hop, 19, 16 - hop), fill=HIGHLIGHT)
    draw.rectangle((18, 15 - hop, 24, 21 - hop), fill=CREAM)
    draw.rectangle((21, 14 - hop, 26, 18 - hop), fill=INK)
    draw.rectangle((22, 13 - hop, 25, 17 - hop), fill=CREAM)
    draw.point((24, 14 - hop), fill=INK)
    draw.rectangle((26, 15 - hop, 28, 16 - hop), fill=GOLD)
    draw.rectangle((22, 10 - hop, 24, 12 - hop), fill=RED)
    draw.rectangle((25, 11 - hop, 26, 13 - hop), fill=RED_LIGHT)
    draw.rectangle((6, 16 - hop, 10, 19 - hop), fill=CREAM)
    draw.rectangle((5, 17 - hop, 7, 20 - hop), fill=RED)
    draw.rectangle((12, 23 - hop, 13, 27), fill=GOLD)
    draw.rectangle((20, 23 - hop, 21, 27), fill=GOLD)
    draw.rectangle((10, 27, 14, 28), fill=INK_SOFT)
    draw.rectangle((19, 27, 23, 28), fill=INK_SOFT)
    return image


def draw_cow(frame: int | str) -> Image.Image:
    image, draw = canvas((32, 32))
    if frame == 'sleeping':
        draw.rectangle((4, 16, 27, 25), fill=INK)
        draw.rectangle((6, 15, 25, 23), fill='#f1dfbd')
        draw.rectangle((8, 17, 13, 22), fill='#796152')
        draw.rectangle((18, 15, 25, 19), fill='#f1dfbd')
        draw.rectangle((23, 17, 28, 22), fill=INK)
        draw.rectangle((24, 18, 27, 21), fill='#d9a686')
        draw.rectangle((24, 19, 25, 19), fill=INK)
        draw.rectangle((8, 24, 23, 26), fill=INK_SOFT)
        return image

    shift = 1 if frame == 1 else 0
    draw.rectangle((4, 11, 24, 24), fill=INK)
    draw.rectangle((6, 12, 22, 22), fill='#f1dfbd')
    draw.rectangle((8, 13, 13, 18), fill='#796152')
    draw.rectangle((17, 17, 22, 22), fill='#796152')
    draw.rectangle((22, 10 + shift, 29, 20 + shift), fill=INK)
    draw.rectangle((23, 11 + shift, 27, 18 + shift), fill='#f1dfbd')
    draw.rectangle((23, 16 + shift, 28, 20 + shift), fill='#d9a686')
    draw.point((26, 13 + shift), fill=INK)
    draw.point((24, 18 + shift), fill=INK_SOFT)
    draw.point((27, 18 + shift), fill=INK_SOFT)
    draw.rectangle((21, 8 + shift, 23, 11 + shift), fill=GOLD)
    draw.rectangle((27, 8 + shift, 29, 11 + shift), fill=GOLD)
    draw.rectangle((7, 22, 10, 28), fill=INK)
    draw.rectangle((8, 22, 9, 27), fill='#f1dfbd')
    draw.rectangle((18, 22, 21, 28), fill=INK)
    draw.rectangle((19, 22, 20, 27), fill='#f1dfbd')
    draw.rectangle((3, 12, 5, 20), fill=INK_SOFT)
    draw.rectangle((2, 18, 4, 22), fill=INK_SOFT)
    return image


def draw_product(product: str) -> Image.Image:
    image, draw = canvas((32, 32))
    if product in {'egg', 'golden-egg'}:
        outline = INK if product == 'egg' else '#7b4c20'
        body = '#f3e7c3' if product == 'egg' else GOLD
        light = HIGHLIGHT if product == 'egg' else GOLD_LIGHT
        draw.rectangle((11, 8, 21, 24), fill=outline)
        draw.rectangle((9, 13, 23, 22), fill=outline)
        draw.rectangle((12, 9, 20, 23), fill=body)
        draw.rectangle((10, 14, 22, 21), fill=body)
        draw.rectangle((12, 11, 15, 16), fill=light)
        if product == 'golden-egg':
            draw.point((18, 12), fill='#fff4a8')
            draw.point((20, 17), fill='#fff4a8')
    else:
        draw.rectangle((9, 8, 23, 26), fill=INK)
        draw.rectangle((11, 10, 21, 24), fill='#f4ead0')
        draw.rectangle((12, 6, 20, 11), fill=INK)
        draw.rectangle((14, 7, 18, 10), fill=BLUE_LIGHT)
        draw.rectangle((11, 15, 21, 20), fill=BLUE)
        draw.rectangle((13, 16, 19, 19), fill='#dff4e9')
        draw.rectangle((14, 17, 18, 18), fill=BLUE_LIGHT)
    return image


def draw_crop(crop: str, stage: str) -> Image.Image:
    image, draw = canvas((32, 32))
    stage_index = ['planted', 'watered', 'growing-1', 'growing-2', 'ready'].index(stage)
    soil_y = 25
    draw.rectangle((7, soil_y, 25, 27), fill='#6d4526')
    draw.rectangle((9, soil_y, 23, 25), fill='#9a6836')
    if stage == 'watered':
        draw.rectangle((8, 26, 24, 27), fill='#31566d')
    if stage_index == 0:
        draw.rectangle((15, 21, 16, 25), fill=GREEN_DARK)
        draw.rectangle((12, 20, 15, 22), fill=GREEN_LIGHT)
        draw.rectangle((17, 19, 20, 21), fill=GREEN)
        return image

    height = {1: 6, 2: 10, 3: 15, 4: 19}[stage_index]
    top = 25 - height
    draw.rectangle((15, top, 17, 25), fill=GREEN_DARK)
    draw.rectangle((12, top + 4, 15, top + 7), fill=GREEN_LIGHT)
    draw.rectangle((17, top + 2, 21, top + 5), fill=GREEN)
    if stage_index >= 2:
        draw.rectangle((10, top + 8, 15, top + 11), fill=GREEN)
        draw.rectangle((17, top + 9, 23, top + 12), fill=GREEN_LIGHT)

    if stage_index >= 3:
        if crop == 'tomato':
            fruits = [(12, top + 6), (19, top + 7), (15, top + 12)]
            for x, y in fruits:
                color = RED if stage == 'ready' else '#9e8640'
                draw.rectangle((x, y, x + 3, y + 3), fill=INK)
                draw.rectangle((x + 1, y, x + 2, y + 2), fill=color)
        elif crop == 'corn':
            draw.rectangle((12, top + 3, 15, top + 10), fill=GREEN_LIGHT)
            draw.rectangle((18, top + 5, 21, top + 12), fill=GREEN)
            if stage == 'ready':
                draw.rectangle((13, top + 5, 15, top + 9), fill=GOLD_LIGHT)
                draw.rectangle((18, top + 7, 20, top + 11), fill=GOLD)
        else:
            color = '#d79a48' if stage == 'ready' else '#7f8a43'
            draw.rectangle((10, 20, 22, 26), fill=INK)
            draw.rectangle((12, 19, 20, 25), fill=color)
            draw.rectangle((15, 18, 17, 20), fill=GREEN_DARK)
    return image


def main() -> None:
    for role in ('farmer', 'rancher'):
        for frame in range(2):
            save(draw_npc(role, frame), f'npcs/{role}-{frame}.png')

    for frame in (0, 1, 'sleeping'):
        save(draw_chicken(frame), f'animals/chicken-{frame}.png')
        save(draw_cow(frame), f'animals/cow-{frame}.png')

    for product in ('egg', 'milk', 'golden-egg'):
        save(draw_product(product), f'products/{product}.png')

    stages = ['planted', 'watered', 'growing-1', 'growing-2', 'ready']
    for crop in ('tomato', 'corn', 'pumpkin'):
        for stage in stages:
            save(draw_crop(crop, stage), f'crops/{crop}/{stage}.png')

    manifest = {
        'version': 1,
        'generator': 'scripts/generate-village-life-assets.py',
        'logical_size': 32,
        'npc_canvas': {'width': 48, 'height': 64},
        'npcs': [
            {'id': 'farmer-hana', 'frames': ['npcs/farmer-0.png', 'npcs/farmer-1.png']},
            {'id': 'rancher-jun', 'frames': ['npcs/rancher-0.png', 'npcs/rancher-1.png']},
        ],
        'animal_instances': [
            {'id': 'chicken-1', 'species': 'chicken'},
            {'id': 'chicken-2', 'species': 'chicken'},
            {'id': 'chicken-3', 'species': 'chicken'},
            {'id': 'cow-1', 'species': 'cow'},
            {'id': 'cow-2', 'species': 'cow'},
        ],
        'animal_frames': ['0', '1', 'sleeping'],
        'products': ['egg', 'milk', 'golden-egg'],
        'crops': ['tomato', 'corn', 'pumpkin'],
        'crop_stages': stages,
        'transparent_background': True,
        'lighting': 'upper-left',
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'wrote Village & Farm Life v2 assets to {OUT}')


if __name__ == '__main__':
    main()

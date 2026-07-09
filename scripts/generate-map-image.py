from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public' / 'assets'
SPRITES = ASSETS / 'game-sprites'
OUT = ASSETS / 'generated-sheets' / 'developer-farm-map.png'

TILE = 32
WORLD_W = 24
WORLD_H = 16
WORLD_PIXEL_W = WORLD_W * TILE
WORLD_PIXEL_H = WORLD_H * TILE

TILE_SPRITES = {
    'grass': SPRITES / 'sprite-50.png',
    'grass2': SPRITES / 'sprite-55.png',
    'flower': SPRITES / 'sprite-54.png',
    'path': SPRITES / 'sprite-48.png',
    'soil': SPRITES / 'sprite-47.png',
}

TREES = [
    {'src': SPRITES / 'sprite-56.png', 'x': 1, 'y': 8, 'size': 76},
    {'src': SPRITES / 'sprite-63.png', 'x': 20, 'y': 2, 'size': 82},
    {'src': SPRITES / 'sprite-56.png', 'x': 21, 'y': 9, 'size': 70},
]


def tile_type(x: int, y: int) -> str:
    if (x == 8 or x == 9) and 0 < y < 15:
        return 'path'
    if y == 7 and 1 < x < 23:
        return 'path'
    if 17 <= x <= 21 and 1 <= y <= 3:
        return 'grass2'
    if 10 <= x <= 15 and 9 <= y <= 12:
        return 'soil'
    if (x + y) % 7 == 0:
        return 'flower'
    if (x * 3 + y) % 11 == 0:
        return 'grass2'
    return 'grass'


def load_tile(path: Path) -> Image.Image:
    tile = Image.open(path).convert('RGBA')
    return tile.resize((TILE, TILE), Image.Resampling.NEAREST)


def paste_shadow(canvas: Image.Image, xy: tuple[int, int], size: tuple[int, int], alpha: int = 58) -> None:
    shadow = Image.new('RGBA', size, (48, 31, 18, alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(5))
    canvas.alpha_composite(shadow, xy)


def main() -> None:
    tiles = {name: load_tile(path) for name, path in TILE_SPRITES.items()}
    canvas = Image.new('RGBA', (WORLD_PIXEL_W, WORLD_PIXEL_H), (120, 200, 92, 255))

    for y in range(WORLD_H):
        for x in range(WORLD_W):
            tile = tiles[tile_type(x, y)]
            canvas.alpha_composite(tile, (x * TILE, y * TILE))

    # Lightly blend the image so it reads as one hand-made map instead of a grid of DOM boxes.
    overlay = Image.new('RGBA', canvas.size, (255, 232, 154, 18))
    canvas = Image.alpha_composite(canvas, overlay)

    # Add a few decorative tree sprites directly to the terrain image.
    for tree in TREES:
        sprite = Image.open(tree['src']).convert('RGBA')
        ratio = tree['size'] / sprite.width
        sprite = sprite.resize((tree['size'], max(1, round(sprite.height * ratio))), Image.Resampling.NEAREST)
        x = tree['x'] * TILE
        y = tree['y'] * TILE - 24
        paste_shadow(canvas, (x + 8, y + sprite.height - 18), (max(20, tree['size'] - 8), 16), 42)
        canvas.alpha_composite(sprite, (x, y))

    # Add subtle vignette inside the map art itself, not as an external red/brown frame.
    vignette = Image.new('L', canvas.size, 0)
    px = vignette.load()
    assert px is not None
    cx = WORLD_PIXEL_W / 2
    cy = WORLD_PIXEL_H / 2
    max_d = (cx * cx + cy * cy) ** 0.5
    for y in range(WORLD_PIXEL_H):
        for x in range(WORLD_PIXEL_W):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / max_d
            px[x, y] = max(0, min(42, int((d - 0.35) * 80)))
    shade = Image.new('RGBA', canvas.size, (31, 20, 11, 0))
    shade.putalpha(vignette)
    canvas = Image.alpha_composite(canvas, shade)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT)
    print(f'wrote {OUT} {canvas.size[0]}x{canvas.size[1]}')


if __name__ == '__main__':
    main()

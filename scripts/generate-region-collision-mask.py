#!/usr/bin/env python3
"""Derive a per-tile terrain collision mask from a region's baked map PNG.

The outdoor maps are 512x352 (16px tiles -> 32x22 grid). Buildings, fences and
animals are separate sprites with their own collision, so this mask only needs to
capture the *terrain*: trees/forest (blocked), water (blocked + fishable) and soil
fields (tillable). Everything else (grass, roads) is walkable.

Symbols: '#' blocked terrain, '~' water, 't' tillable soil, '.' walkable.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

TILE = 16
COLS, ROWS = 32, 22


def classify(tile: np.ndarray) -> str:
    # v1: only classify what is colour-separable and safe to block — water and
    # forest/trees. Soil vs shadowed grass is unreliable, so fields stay '.'
    # (walkable) here and keep their existing tillable logic in game code.
    r, g, b = (float(np.median(tile[:, :, c])) for c in range(3))
    gray = tile.mean(axis=2)
    v = gray.mean() / 255.0          # tile brightness 0..1
    texture = gray.std() / 255.0     # within-tile contrast (leaves+shadow = high)

    # Water: blue clearly dominant.
    if b > r + 18 and b > g + 8 and b > 90:
        return '~'
    # Forest / trees: dark canopy, or medium-dark with heavy leaf texture.
    green_dom = g >= b
    if v < 0.34 or (v < 0.46 and texture > 0.16 and green_dom):
        return '#'
    return '.'


def build(path: Path):
    img = Image.open(path).convert('RGB')
    if img.size != (COLS * TILE, ROWS * TILE):
        img = img.resize((COLS * TILE, ROWS * TILE), Image.NEAREST)
    arr = np.asarray(img)
    rows = []
    for ty in range(ROWS):
        line = []
        for tx in range(COLS):
            tile = arr[ty * TILE:(ty + 1) * TILE, tx * TILE:(tx + 1) * TILE]
            line.append(classify(tile))
        rows.append(''.join(line))
    return rows


OVERLAY = {'#': (220, 40, 40), '~': (40, 120, 230), 't': (200, 130, 40), '.': None}


def save_overlay(path: Path, rows, out: Path):
    base = Image.open(path).convert('RGB')
    if base.size != (COLS * TILE, ROWS * TILE):
        base = base.resize((COLS * TILE, ROWS * TILE), Image.NEAREST)
    # scale up 2x for readability and draw a translucent tint + grid.
    scale = 2
    big = base.resize((base.width * scale, base.height * scale), Image.NEAREST).convert('RGBA')
    tint = Image.new('RGBA', big.size, (0, 0, 0, 0))
    px = tint.load()
    t = TILE * scale
    for ty in range(ROWS):
        for tx in range(COLS):
            color = OVERLAY[rows[ty][tx]]
            if not color:
                continue
            for yy in range(ty * t, (ty + 1) * t):
                for xx in range(tx * t, (tx + 1) * t):
                    px[xx, yy] = (*color, 120)
    big = Image.alpha_composite(big, tint)
    # grid lines
    gpx = big.load()
    for ty in range(ROWS + 1):
        for xx in range(big.width):
            gpx[xx, min(ty * t, big.height - 1)] = (0, 0, 0, 255)
    for tx in range(COLS + 1):
        for yy in range(big.height):
            gpx[min(tx * t, big.width - 1), yy] = (0, 0, 0, 255)
    big.convert('RGB').save(out)


def load_hand_mask(p: Path):
    # ';' marks comments — '#' is a mask symbol (blocked) and may start a row.
    lines = [ln.rstrip('\n') for ln in p.read_text().splitlines() if ln and not ln.startswith(';')]
    assert len(lines) == ROWS, f'mask must have {ROWS} rows, got {len(lines)}'
    for i, ln in enumerate(lines):
        assert len(ln) == COLS, f'row {i} must be {COLS} cols, got {len(ln)}'
    return lines


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
        'public/assets/seasons-v1/maps/farm-village-spring.png')
    hand = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    rows = load_hand_mask(hand) if hand and hand.exists() else build(path)
    ruler = '    ' + ''.join(str(i % 10) for i in range(COLS))
    print(f'# {path}')
    print(ruler)
    for y, line in enumerate(rows):
        print(f'{y:>3} {line}')
    flat = ''.join(rows)
    for sym, name in [('#', 'blocked'), ('~', 'water'), ('t', 'tillable'), ('.', 'walk')]:
        print(f'# {name}: {flat.count(sym)}', end='   ')
    print()
    out = Path('scripts/_mask-debug.png')
    save_overlay(path, rows, out)
    print(f'# overlay -> {out}')


if __name__ == '__main__':
    main()

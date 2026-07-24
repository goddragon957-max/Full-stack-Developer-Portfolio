#!/usr/bin/env python3
"""Build the river-coast terrain-mask additions from declared forest rects.

The mask unions with the existing water rows + collision rects at runtime, so it
only needs to add the tree/forest cells those coarse rects miss. Declared as
rects (far less error-prone than typing 32-char rows), emitted as the 32x22
string mask, and rendered over the map for by-eye verification.
Gate arrivals kept open: {13,19} (from forest), {29,14} (from mine), down-gate x12-14.
"""
from pathlib import Path
from PIL import Image, ImageDraw

COLS, ROWS, T, S = 32, 22, 16, 2

# (x, y, w, h) forest/tree blocks to ADD. Union with existing rects + water rows.
FOREST = [
    (0, 15, 4, 7),     # left-bottom pine wall (x0-3, y15-21)
    (4, 20, 8, 2),     # bottom-left forest up to the down-gate (x4-11, y20-21)
    (15, 20, 13, 2),   # bottom-right forest after the gate (x15-27, y20-21)
    (27, 11, 5, 3),    # right forest upper (x27-31, y11-13)
    (27, 15, 5, 7),    # right forest lower, skips y14 arrival row (x27-31, y15-21)
    # scattered leafy trees standing on open grass (v2 polish, high-confidence only)
    (11, 3, 2, 2),     # big oak upper-center
    (15, 6, 2, 2),     # big oak center
    (16, 13, 2, 2),    # oak center-lower
    (24, 8, 2, 2),     # oak right
    (24, 15, 2, 2),    # oak right-lower
    (9, 16, 2, 2),     # pine left-bottom grass
]

def build_rows():
    grid = [['.'] * COLS for _ in range(ROWS)]
    for (x, y, w, h) in FOREST:
        for yy in range(y, min(ROWS, y + h)):
            for xx in range(x, min(COLS, x + w)):
                grid[yy][xx] = '#'
    return [''.join(r) for r in grid]

def render(rows, map_path, out):
    base = Image.open(map_path).convert('RGB').resize((COLS * T * S, ROWS * T * S), Image.NEAREST).convert('RGBA')
    tint = Image.new('RGBA', base.size, (0, 0, 0, 0)); px = tint.load(); t = T * S
    for y in range(ROWS):
        for x in range(COLS):
            if rows[y][x] == '#':
                for yy in range(y * t, (y + 1) * t):
                    for xx in range(x * t, (x + 1) * t):
                        px[xx, yy] = (220, 40, 40, 120)
    img = Image.alpha_composite(base, tint); d = ImageDraw.Draw(img)
    for r in range(ROWS + 1): d.line([(0, r * t), (img.width, r * t)], fill=(0, 0, 0))
    for c in range(COLS + 1): d.line([(c * t, 0), (c * t, img.height)], fill=(0, 0, 0))
    img.convert('RGB').save(out)

if __name__ == '__main__':
    rows = build_rows()
    render(rows, 'public/assets/seasons-v1/maps/river-coast-spring.png', 'scripts/_mask-coast.png')
    print('// river-coast mask rows:')
    for r in rows:
        print(f"    '{r}',")

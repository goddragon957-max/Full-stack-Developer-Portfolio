from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets" / "art-remaster-v1"
MAP_ROOT = ASSETS / "maps"
MAP_SOURCE_ROOT = ASSETS / "source" / "maps"
LEGACY_GPT_INTERIOR = ROOT / "public" / "assets" / "generated-sheets" / "farmhouse-interior-room.png"
TILE = 16
WIDTH = 32
HEIGHT = 22


def terrain(family: str, mask: int) -> Image.Image:
    return Image.open(ASSETS / "tiles" / "terrain" / family / f"{mask:02}.png").convert("RGBA")


def fill_base(family: str) -> Image.Image:
    base = terrain(family, 0)
    canvas = Image.new("RGBA", (WIDTH * TILE, HEIGHT * TILE))
    for y in range(HEIGHT):
        for x in range(WIDTH):
            variant = base
            if (x * 3 + y * 5) % 4 == 1:
                variant = ImageOps.mirror(base)
            elif (x * 7 + y * 2) % 5 == 2:
                variant = ImageOps.flip(base)
            canvas.alpha_composite(variant, (x * TILE, y * TILE))
    return canvas


def connectivity(cells: set[tuple[int, int]], x: int, y: int) -> int:
    return (
        (1 if (x, y - 1) in cells else 0)
        | (2 if (x + 1, y) in cells else 0)
        | (4 if (x, y + 1) in cells else 0)
        | (8 if (x - 1, y) in cells else 0)
    )


def paste_network(canvas: Image.Image, cells: set[tuple[int, int]], family: str, mine_tint: bool = False) -> None:
    for x, y in sorted(cells, key=lambda cell: (cell[1], cell[0])):
        tile = terrain(family, connectivity(cells, x, y))
        if mine_tint:
            tile = ImageEnhance.Color(tile).enhance(.35)
            tile = ImageEnhance.Brightness(tile).enhance(.72)
        canvas.alpha_composite(tile, (x * TILE, y * TILE))


def paste_water(canvas: Image.Image, cells: set[tuple[int, int]], family: str) -> None:
    full_water = terrain("coast", 15)
    for x, y in sorted(cells, key=lambda cell: (cell[1], cell[0])):
        canvas.alpha_composite(full_water, (x * TILE, y * TILE))


def expand_cells(cells: set[tuple[int, int]], radius: int = 1) -> set[tuple[int, int]]:
    return {
        (x + dx, y + dy)
        for x, y in cells
        for dx in range(-radius, radius + 1)
        for dy in range(-radius, radius + 1)
        if abs(dx) + abs(dy) <= radius and 0 <= x + dx < WIDTH and 0 <= y + dy < HEIGHT
    }


def paste_dirt_roads(canvas: Image.Image, centerline: set[tuple[int, int]], mine_tint: bool = False) -> None:
    tile = Image.open(ASSETS / "tiles" / "soil" / "untilled.png").convert("RGBA").resize((TILE, TILE), Image.Resampling.NEAREST)
    if mine_tint:
        tile = ImageEnhance.Color(tile).enhance(.35)
        tile = ImageEnhance.Brightness(tile).enhance(.72)
    for x, y in sorted(expand_cells(centerline), key=lambda cell: (cell[1], cell[0])):
        canvas.alpha_composite(tile, (x * TILE, y * TILE))


def paste_prop(canvas: Image.Image, relative_path: str, x: float, y: float, size: tuple[int, int] | None = None) -> None:
    prop = Image.open(ASSETS / relative_path).convert("RGBA")
    if size:
        prop = prop.resize(size, Image.Resampling.NEAREST)
    canvas.alpha_composite(prop, (round(x * TILE), round(y * TILE)))


def line_cells(start: tuple[int, int], end: tuple[int, int]) -> set[tuple[int, int]]:
    x1, y1 = start
    x2, y2 = end
    cells: set[tuple[int, int]] = set()
    x, y = x1, y1
    cells.add((x, y))
    while x != x2:
        x += 1 if x2 > x else -1
        cells.add((x, y))
    while y != y2:
        y += 1 if y2 > y else -1
        cells.add((x, y))
    return cells


def farm_village() -> Image.Image:
    canvas = fill_base("grass-path")
    roads = set()
    for segment in [((0, 9), (31, 9)), ((8, 0), (8, 21)), ((8, 13), (18, 13)), ((5, 9), (5, 18)), ((5, 18), (8, 18)), ((8, 19), (14, 19)), ((18, 9), (18, 13))]:
        roads |= line_cells(*segment)
    paste_dirt_roads(canvas, roads)
    pond = {(x, y) for y in range(14, 18) for x in range(24, 29) if not ((y in {14, 17}) and x in {24, 28})}
    paste_water(canvas, pond, "stream")

    for x, y, apple in [(1, 4, False), (27, 1, True), (1, 16, True), (27, 17, False), (21, 1, False)]:
        paste_prop(canvas, f"props/nature/{'apple-tree' if apple else 'tree'}.png", x, y, (48, 48))
    paste_prop(canvas, "props/fence-horizontal.png", 10, 16.6, (48, 24))
    paste_prop(canvas, "props/fence-horizontal.png", 12, 16.6, (48, 24))
    paste_prop(canvas, "props/fence-horizontal.png", 10, 20.2, (48, 24))
    paste_prop(canvas, "props/fence-horizontal.png", 12, 20.2, (48, 24))
    paste_prop(canvas, "props/fence-vertical.png", 9.6, 17, (24, 48))
    paste_prop(canvas, "props/fence-vertical.png", 13.8, 17, (24, 48))
    paste_prop(canvas, "props/ranch-gate.png", 11.3, 20, (48, 32))
    paste_prop(canvas, "props/wildflowers.png", 22, 5, (32, 24))
    return canvas


def whisper_forest() -> Image.Image:
    canvas = fill_base("stream")
    roads = set()
    for segment in [((0, 11), (31, 11)), ((16, 0), (16, 11))]:
        roads |= line_cells(*segment)
    paste_dirt_roads(canvas, roads)
    water = {(x, y) for x in range(20, 23) for y in range(HEIGHT)}
    paste_water(canvas, water, "stream")
    paste_prop(canvas, "props/bridge.png", 19.2, 9.8, (64, 32))
    paste_prop(canvas, "props/mushroom-ring.png", 8, 4, (48, 32))
    paste_prop(canvas, "props/wildflowers.png", 24, 14, (32, 24))
    tree_positions = [(0, 1), (4, 1), (8, 2), (25, 1), (28, 3), (1, 15), (5, 17), (9, 18), (20, 17), (25, 17), (28, 18), (3, 6), (27, 7)]
    for index, (x, y) in enumerate(tree_positions):
        paste_prop(canvas, f"props/nature/{'apple-tree' if index in {4, 9} else 'tree'}.png", x, y, (48, 48))
    return canvas


def river_coast() -> Image.Image:
    canvas = fill_base("grass-path")
    sand = terrain("coast", 0)
    for y in range(HEIGHT):
        for x in range(23, WIDTH):
            canvas.alpha_composite(sand if (x + y) % 2 == 0 else ImageOps.mirror(sand), (x * TILE, y * TILE))
    river = {(x, y) for x in range(19, 23) for y in range(HEIGHT)}
    sea = {(x, y) for x in range(24, WIDTH) for y in range(8, HEIGHT)}
    paste_water(canvas, river, "stream")
    paste_water(canvas, sea, "coast")
    roads = set()
    for segment in [((0, 11), (16, 11)), ((16, 11), (16, 21)), ((16, 11), (20, 5)), ((20, 5), (31, 5))]:
        roads |= line_cells(*segment)
    paste_dirt_roads(canvas, roads)
    paste_prop(canvas, "props/bridge.png", 18.8, 3.7, (64, 32))
    paste_prop(canvas, "props/bridge.png", 18.8, 10.1, (64, 32))
    paste_prop(canvas, "props/dock.png", 24.5, 6, (48, 64))
    for x, y in [(2, 2), (6, 4), (11, 1), (2, 16), (7, 17), (11, 17)]:
        paste_prop(canvas, "props/nature/tree.png", x, y, (48, 48))
    paste_prop(canvas, "props/rock-cluster.png", 27, 14, (32, 24))
    return canvas


def mine_foothill() -> Image.Image:
    canvas = fill_base("cliff")
    roads = set()
    for segment in [((0, 5), (7, 5)), ((7, 5), (16, 12)), ((16, 12), (16, 21)), ((16, 12), (29, 5)), ((16, 12), (8, 8))]:
        roads |= line_cells(*segment)
    paste_dirt_roads(canvas, roads, mine_tint=True)
    paste_prop(canvas, "props/mine-entrance.png", 10.5, 0.7, (176, 96))
    paste_prop(canvas, "props/crystal-altar.png", 24, 3.5, (64, 64))
    paste_prop(canvas, "props/rock-cluster.png", 3, 9, (48, 36))
    paste_prop(canvas, "props/rock-cluster.png", 24, 10, (48, 36))
    paste_prop(canvas, "props/rock-cluster.png", 10, 17, (40, 30))
    paste_prop(canvas, "props/rock-cluster.png", 20, 17, (40, 30))
    paste_prop(canvas, "props/lantern-post.png", 8, 3, (24, 32))
    return canvas


def fit_painted_map(source: Image.Image) -> Image.Image:
    target_ratio = (WIDTH * TILE) / (HEIGHT * TILE)
    source_ratio = source.width / source.height
    if source_ratio > target_ratio:
        crop_width = round(source.height * target_ratio)
        left = (source.width - crop_width) // 2
        source = source.crop((left, 0, left + crop_width, source.height))
    elif source_ratio < target_ratio:
        crop_height = round(source.width / target_ratio)
        top = (source.height - crop_height) // 2
        source = source.crop((0, top, source.width, top + crop_height))
    return source.resize((WIDTH * TILE, HEIGHT * TILE), Image.Resampling.NEAREST)


def main() -> None:
    MAP_ROOT.mkdir(parents=True, exist_ok=True)
    builders = {
        "farm-village": farm_village,
        "whisper-forest": whisper_forest,
        "river-coast": river_coast,
        "mine-foothill": mine_foothill,
    }
    records = []
    for region, builder in builders.items():
        blueprint = builder().convert("RGB")
        blueprint_path = MAP_SOURCE_ROOT / f"{region}-blueprint.png"
        blueprint_path.parent.mkdir(parents=True, exist_ok=True)
        blueprint.save(blueprint_path, optimize=True)
        painted_source = MAP_SOURCE_ROOT / f"{region}-painted.png"
        output = MAP_ROOT / f"{region}.png"
        final_map = fit_painted_map(Image.open(painted_source).convert("RGB")) if painted_source.exists() else blueprint
        final_map.save(output, optimize=True)
        records.append({
            "region": region,
            "path": f"maps/{region}.png",
            "width": WIDTH * TILE,
            "height": HEIGHT * TILE,
            "source_policy": "GPT Image repaint referenced from a GPT tile-and-prop blueprint; code only crops and nearest-neighbor normalizes",
            "painted_source": f"source/maps/{region}-painted.png" if painted_source.exists() else None,
            "painted_source_sha256": hashlib.sha256(painted_source.read_bytes()).hexdigest() if painted_source.exists() else None,
            "blueprint": f"source/maps/{region}-blueprint.png",
            "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        })
    manifest_path = ASSETS / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["maps"] = records
    if LEGACY_GPT_INTERIOR.exists():
        interior_source = MAP_SOURCE_ROOT / "farmhouse-interior-room.png"
        interior_output = MAP_ROOT / "farmhouse-interior.png"
        interior_source.write_bytes(LEGACY_GPT_INTERIOR.read_bytes())
        interior_output.write_bytes(LEGACY_GPT_INTERIOR.read_bytes())
        with Image.open(interior_output) as interior_image:
            interior_size = {"width": interior_image.width, "height": interior_image.height}
        manifest["interiors"] = [{
            "id": "farmhouse-interior",
            "path": "maps/farmhouse-interior.png",
            "source": "source/maps/farmhouse-interior-room.png",
            "source_policy": "Existing OpenAI-generated pixel room reused without code-drawn replacement",
            **interior_size,
            "sha256": hashlib.sha256(interior_output.read_bytes()).hexdigest(),
        }]
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Assembled {len(records)} GPT Image maps at {WIDTH * TILE}x{HEIGHT * TILE}")


if __name__ == "__main__":
    main()

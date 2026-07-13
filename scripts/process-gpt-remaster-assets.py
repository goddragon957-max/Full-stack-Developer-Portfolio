from __future__ import annotations

import hashlib
import json
from collections import deque
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public" / "assets" / "art-remaster-v1"
SOURCE_ROOT = ASSET_ROOT / "source"
DIRECTIONS = ("down", "left", "right", "up")
WALK_FRAMES = ("0", "1", "2")


@dataclass(frozen=True)
class Sheet:
    source: str
    rows: int
    columns: int
    prompt_summary: str
    center_half_width: bool = False
    dynamic_columns: bool = False


SHEETS = {
    "player": Sheet("player-sheet.png", 4, 3, "Straw-hat farmer four-direction three-frame walk cycle", True),
    "lumi": Sheet("lumi-sheet.png", 4, 3, "Lumi four-direction three-frame walk cycle", True),
    "hana": Sheet("hana-sheet.png", 4, 3, "Hana four-direction three-frame walk cycle", True),
    "jun": Sheet("jun-sheet.png", 4, 3, "Jun four-direction three-frame walk cycle", True),
    "sera": Sheet("sera-sheet.png", 4, 3, "Sera four-direction three-frame walk cycle", True),
    "doyun": Sheet("doyun-sheet.png", 4, 3, "Doyun four-direction three-frame walk cycle", True),
    "player-actions": Sheet("player-actions-sheet.png", 5, 3, "Player hoe, watering, mining, fishing cast and fishing reel actions", True),
    "npc-portraits": Sheet("npc-portraits-sheet.png", 3, 5, "Five NPC dialogue portraits with neutral, happy and concerned expressions", dynamic_columns=True),
    "livestock": Sheet("livestock-sheet.png", 2, 6, "Chicken and cow state animation pack"),
    "crops": Sheet("crops-sheet.png", 5, 6, "Six crops across five growth stages"),
    "items": Sheet("items-sheet.png", 5, 6, "Harvest, ranch, forage, ore and fish icon pack"),
    "gameplay": Sheet("gameplay-sheet.png", 3, 6, "Tools, soil states and ambient effect pack"),
    "world-props": Sheet("world-props-sheet.png", 3, 5, "Market, village, ranch, coast, mine and landmark prop pack", dynamic_columns=True),
}

TERRAIN_SOURCES = {
    "grass-path": "terrain-grass-path.png",
    "stream": "terrain-stream.png",
    "coast": "terrain-coast.png",
    "cliff": "terrain-cliff.png",
}


def remove_chroma(source: Image.Image) -> Image.Image:
    rgb = np.asarray(source.convert("RGB"), dtype=np.uint8)
    border = np.concatenate((rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]), axis=0)
    key = np.median(border, axis=0).astype(np.int16)
    distance = np.linalg.norm(rgb.astype(np.int16) - key, axis=2)
    key_like = distance < 150
    background = np.zeros(key_like.shape, dtype=bool)
    queue: deque[tuple[int, int]] = deque()
    height, width = key_like.shape
    for x in range(width):
        if key_like[0, x]:
            queue.append((0, x))
        if key_like[height - 1, x]:
            queue.append((height - 1, x))
    for y in range(height):
        if key_like[y, 0]:
            queue.append((y, 0))
        if key_like[y, width - 1]:
            queue.append((y, width - 1))
    while queue:
        y, x = queue.popleft()
        if background[y, x] or not key_like[y, x]:
            continue
        background[y, x] = True
        if y > 0:
            queue.append((y - 1, x))
        if y + 1 < height:
            queue.append((y + 1, x))
        if x > 0:
            queue.append((y, x - 1))
        if x + 1 < width:
            queue.append((y, x + 1))

    # Contract one high-resolution source pixel to discard the remaining key blend.
    contracted = background.copy()
    contracted[1:] |= background[:-1]
    contracted[:-1] |= background[1:]
    contracted[:, 1:] |= background[:, :-1]
    contracted[:, :-1] |= background[:, 1:]
    cleaned = rgb.copy()
    cleaned[contracted] = 0
    alpha = np.where(contracted, 0, 255).astype(np.uint8)
    rgba = np.dstack((cleaned, alpha))
    return Image.fromarray(rgba, "RGBA")


def find_projection_bands(counts: np.ndarray, expected: int) -> list[tuple[int, int]]:
    active = counts > 1
    raw: list[tuple[int, int]] = []
    start: int | None = None
    for index, value in enumerate(active):
        if value and start is None:
            start = index
        elif not value and start is not None:
            if index - start >= 3:
                raw.append((start, index))
            start = None
    if start is not None:
        raw.append((start, len(active)))

    merged: list[tuple[int, int]] = []
    for band in raw:
        if merged and band[0] - merged[-1][1] <= 14:
            merged[-1] = (merged[-1][0], band[1])
        else:
            merged.append(band)

    while len(merged) > expected:
        gaps = [merged[index + 1][0] - merged[index][1] for index in range(len(merged) - 1)]
        index = gaps.index(min(gaps))
        merged[index:index + 2] = [(merged[index][0], merged[index + 1][1])]
    if len(merged) != expected:
        raise ValueError(f"Expected {expected} generated grid bands, found {len(merged)}")
    return merged


def band_cells(bands: list[tuple[int, int]], length: int) -> list[tuple[int, int]]:
    boundaries = [max(0, bands[0][0] - 12)]
    boundaries.extend((bands[index][1] + bands[index + 1][0]) // 2 for index in range(len(bands) - 1))
    boundaries.append(min(length, bands[-1][1] + 12))
    return [(boundaries[index], boundaries[index + 1]) for index in range(len(bands))]


def detect_grid(image: Image.Image, sheet: Sheet) -> tuple[list[tuple[int, int]], list[tuple[int, int]]]:
    mask = np.asarray(image.getchannel("A")) > 150
    row_bands = find_projection_bands(mask.sum(axis=1), sheet.rows)
    if sheet.center_half_width or sheet.dynamic_columns:
        column_bands = find_projection_bands(mask.sum(axis=0), sheet.columns)
        columns = band_cells(column_bands, image.width)
    else:
        boundaries = [round(index * image.width / sheet.columns) for index in range(sheet.columns + 1)]
        columns = [(boundaries[index], boundaries[index + 1]) for index in range(sheet.columns)]
    return band_cells(row_bands, image.height), columns


def sheet_cell(image: Image.Image, grid: tuple[list[tuple[int, int]], list[tuple[int, int]]], row: int, column: int) -> Image.Image:
    rows, columns = grid
    top, bottom = rows[row]
    left, right = columns[column]
    return image.crop((left, top, right, bottom))


def normalize_sprite(cell: Image.Image, canvas: tuple[int, int], content_box: tuple[int, int]) -> Image.Image:
    alpha = cell.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > 28 else 0).getbbox()
    if bbox is None:
        raise ValueError("Generated sheet cell did not contain a visible sprite")

    left, top, right, bottom = bbox
    padding = max(2, round(max(right - left, bottom - top) * 0.018))
    crop = cell.crop((max(0, left - padding), max(0, top - padding), min(cell.width, right + padding), min(cell.height, bottom + padding)))
    max_width, max_height = content_box
    scale = min(max_width / crop.width, max_height / crop.height)
    size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    crop = crop.resize(size, Image.Resampling.NEAREST)
    crop = crop.quantize(colors=96, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).convert("RGBA")
    crop.putalpha(crop.getchannel("A").point(lambda value: 0 if value < 152 else 255))
    pixels = np.asarray(crop).copy()
    alpha = pixels[..., 3]
    magenta = (
        (pixels[..., 0] > 120)
        & (pixels[..., 2] > 120)
        & (pixels[..., 1] <= 65)
        & (np.abs(pixels[..., 0].astype(np.int16) - pixels[..., 2].astype(np.int16)) < 90)
        & (alpha > 0)
    )
    for y, x in np.argwhere(magenta):
        y0, y1 = max(0, y - 2), min(pixels.shape[0], y + 3)
        x0, x1 = max(0, x - 2), min(pixels.shape[1], x + 3)
        neighbors = pixels[y0:y1, x0:x1]
        visible = neighbors[..., 3] > 0
        clean = visible & ~magenta[y0:y1, x0:x1]
        if clean.any():
            replacement = neighbors[clean][0]
            pixels[y, x, :3] = replacement[:3]
        else:
            pixels[y, x, 3] = 0
    crop = Image.fromarray(pixels, "RGBA")

    target = Image.new("RGBA", canvas, (0, 0, 0, 0))
    x = (canvas[0] - crop.width) // 2
    y = canvas[1] - crop.height
    target.alpha_composite(crop, (x, y))
    return target


def save_asset(image: Image.Image, relative_path: str, source: str, cell: tuple[int, int], assets: list[dict]) -> None:
    output = ASSET_ROOT / relative_path
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, optimize=True)
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    assets.append({
        "path": relative_path.replace("\\", "/"),
        "source": f"source/{source}",
        "cell": {"row": cell[0], "column": cell[1]},
        "canvas": {"width": image.width, "height": image.height},
        "alpha": True,
        "transparent_corners": all(image.getpixel(point)[3] == 0 for point in ((0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1))),
        "sha256": digest,
    })


def process_character(name: str, output_root: str, assets: list[dict]) -> None:
    sheet = SHEETS[name]
    image = remove_chroma(Image.open(SOURCE_ROOT / sheet.source))
    grid = detect_grid(image, sheet)
    for row, direction in enumerate(DIRECTIONS):
        for column, frame in enumerate(WALK_FRAMES):
            sprite = normalize_sprite(sheet_cell(image, grid, row, column), (48, 64), (42, 60))
            save_asset(sprite, f"{output_root}/{direction}-{frame}.png", sheet.source, (row, column), assets)


def process_grid_pack(name: str, mapping: list[list[str | None]], canvas: tuple[int, int], content_box: tuple[int, int], assets: list[dict]) -> None:
    sheet = SHEETS[name]
    image = remove_chroma(Image.open(SOURCE_ROOT / sheet.source))
    grid = detect_grid(image, sheet)
    for row, row_mapping in enumerate(mapping):
        for column, output_path in enumerate(row_mapping):
            if output_path is None:
                continue
            sprite = normalize_sprite(sheet_cell(image, grid, row, column), canvas, content_box)
            save_asset(sprite, output_path, sheet.source, (row, column), assets)


def process_style_props(assets: list[dict]) -> None:
    source_name = "style-anchor-chroma.png"
    image = remove_chroma(Image.open(SOURCE_ROOT / source_name))
    specs = [
        ("props/buildings/farmhouse.png", (515, 315, 785, 590), (128, 128), (124, 116)),
        ("props/buildings/shop.png", (830, 315, 1135, 590), (160, 128), (156, 116)),
        ("props/buildings/barn.png", (1140, 320, 1448, 590), (128, 128), (124, 116)),
        ("props/nature/tree.png", (80, 585, 335, 845), (96, 96), (92, 92)),
        ("props/nature/apple-tree.png", (395, 585, 650, 845), (96, 96), (92, 92)),
        ("props/travel-sign.png", (690, 610, 900, 850), (48, 64), (44, 60)),
        ("props/bridge.png", (970, 620, 1310, 850), (128, 64), (124, 60)),
        ("props/crystal-cluster.png", (100, 820, 390, 1086), (64, 64), (60, 60)),
    ]
    for index, (path, box, canvas, content_box) in enumerate(specs):
        sprite = normalize_sprite(image.crop(box), canvas, content_box)
        save_asset(sprite, path, source_name, (0, index), assets)


def process_terrain_tiles(assets: list[dict]) -> None:
    for family, source_name in TERRAIN_SOURCES.items():
        source = Image.open(SOURCE_ROOT / source_name).convert("RGB")
        side = min(source.size)
        left = (source.width - side) // 2
        top = (source.height - side) // 2
        source = source.crop((left, top, left + side, top + side))
        boundaries = [round(index * side / 4) for index in range(5)]
        for tile_id in range(16):
            row, column = divmod(tile_id, 4)
            inset = max(2, round(side / 320))
            tile = source.crop((boundaries[column] + inset, boundaries[row] + inset, boundaries[column + 1] - inset, boundaries[row + 1] - inset))
            tile = tile.resize((16, 16), Image.Resampling.NEAREST)
            tile = tile.quantize(colors=32, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).convert("RGB")
            relative_path = f"tiles/terrain/{family}/{tile_id:02}.png"
            output = ASSET_ROOT / relative_path
            output.parent.mkdir(parents=True, exist_ok=True)
            tile.save(output, optimize=True)
            assets.append({
                "path": relative_path,
                "source": f"source/{source_name}",
                "cell": {"row": row, "column": column, "connectivity_mask": tile_id},
                "canvas": {"width": 16, "height": 16},
                "alpha": False,
                "transparent_corners": False,
                "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
            })


def process_world_props(assets: list[dict]) -> None:
    sheet = SHEETS["world-props"]
    image = remove_chroma(Image.open(SOURCE_ROOT / sheet.source))
    mask = np.asarray(image.getchannel("A")) > 150
    rows = band_cells(find_projection_bands(mask.sum(axis=1), sheet.rows), image.height)
    specs = [
        [("props/market-stall.png", (128, 96), (124, 92)), ("props/quest-board.png", (64, 64), (60, 60)), ("props/mailbox.png", (32, 48), (30, 46)), ("props/well.png", (96, 96), (92, 92)), ("props/ranch-gate.png", (96, 64), (92, 60))],
        [("props/fence-horizontal.png", (96, 48), (92, 44)), ("props/fence-vertical.png", (48, 96), (44, 92)), ("props/dock.png", (96, 96), (92, 92)), ("props/mine-entrance.png", (128, 96), (124, 92)), ("props/mushroom-ring.png", (96, 64), (92, 60))],
        [("props/crystal-altar.png", (96, 96), (92, 92)), ("props/lantern-post.png", (48, 64), (44, 60)), ("props/wildflowers.png", (64, 48), (60, 44)), ("props/rock-cluster.png", (64, 48), (60, 44)), ("items/tools/hoe.png", (32, 32), (30, 30))],
    ]
    for row, row_specs in enumerate(specs):
        top, bottom = rows[row]
        row_mask = mask[top:bottom]
        columns = band_cells(find_projection_bands(row_mask.sum(axis=0), sheet.columns), image.width)
        for column, (path, canvas, content_box) in enumerate(row_specs):
            left, right = columns[column]
            sprite = normalize_sprite(image.crop((left, top, right, bottom)), canvas, content_box)
            save_asset(sprite, path, sheet.source, (row, column), assets)


def process_hoe_icon(assets: list[dict]) -> None:
    source_name = "hoe-icon.png"
    image = remove_chroma(Image.open(SOURCE_ROOT / source_name))
    sprite = normalize_sprite(image, (32, 32), (30, 30))
    save_asset(sprite, "items/tools/hoe.png", source_name, (0, 0), assets)


def main() -> None:
    assets: list[dict] = []
    process_style_props(assets)
    process_terrain_tiles(assets)
    process_character("player", "characters/player", assets)
    for npc in ("lumi", "hana", "jun", "sera", "doyun"):
        process_character(npc, f"npcs/{npc}", assets)

    action_names = ("hoe", "water", "pickaxe", "fish-cast", "fish-reel")
    process_grid_pack("player-actions", [
        [f"characters/player/actions/{action}-{frame}.png" for frame in WALK_FRAMES]
        for action in action_names
    ], (64, 64), (62, 60), assets)

    npc_names = ("lumi", "hana", "jun", "sera", "doyun")
    portrait_expressions = ("neutral", "happy", "concerned")
    process_grid_pack("npc-portraits", [
        [f"npcs/{npc}/portrait-{expression}.png" for npc in npc_names]
        for expression in portrait_expressions
    ], (96, 96), (92, 92), assets)

    animal_states = ("idle", "walk-0", "walk-1", "happy", "sleeping", "product-ready")
    process_grid_pack("livestock", [
        [f"animals/chicken/{state}.png" for state in animal_states],
        [f"animals/cow/{state}.png" for state in animal_states],
    ], (48, 48), (46, 44), assets)

    crop_names = ("frontend", "backend", "bim", "tomato", "corn", "pumpkin")
    crop_stages = ("planted", "watered", "growing-1", "growing-2", "ready")
    process_grid_pack("crops", [
        [f"crops/{crop}/{stage}.png" for crop in crop_names]
        for stage in crop_stages
    ], (32, 32), (30, 30), assets)

    process_grid_pack("items", [
        [f"items/crops/{crop}.png" for crop in crop_names],
        ["items/products/egg.png", "items/products/milk.png", "items/products/golden-egg.png", "items/forage/mushroom.png", "items/forage/herb.png", "items/forage/wild-berry.png"],
        ["items/forage/fern.png", "items/forage/moon-bloom.png", "items/ore/stone.png", "items/ore/copper-ore.png", "items/ore/iron-ore.png", "items/ore/star-crystal.png"],
        ["items/fish/bluegill.png", "items/fish/carp.png", "items/fish/perch.png", "items/fish/koi.png", "items/fish/moonfin.png", "items/fish/river-trout.png"],
        ["items/fish/silver-dace.png", "items/fish/night-eel.png", "items/fish/shore-sardine.png", "items/fish/coral-bream.png", "items/fish/tide-ray.png", None],
    ], (32, 32), (30, 30), assets)

    process_grid_pack("gameplay", [
        [None, "items/tools/seeds.png", "items/tools/watering-can.png", "items/tools/fishing-rod.png", "items/tools/pickaxe.png", "items/tools/bucket.png"],
        ["tiles/soil/untilled.png", "tiles/soil/tilled.png", "tiles/soil/watered.png", "effects/bobber.png", "effects/ripple-0.png", "effects/ripple-1.png"],
        ["effects/heart.png", "effects/note.png", "effects/harvest-sparkle.png", "effects/crystal-sparkle.png", "effects/smoke.png", "effects/window-light.png"],
    ], (32, 32), (30, 30), assets)
    process_world_props(assets)
    process_hoe_icon(assets)

    source_records = []
    style_source = SOURCE_ROOT / "style-anchor-chroma.png"
    source_records.append({
        "id": "style-anchor",
        "path": "source/style-anchor-chroma.png",
        "generator": "OpenAI GPT Image built-in tool",
        "prompt_summary": "Common visual identity board for characters, livestock, buildings, props and items",
        "grid": None,
        "sha256": hashlib.sha256(style_source.read_bytes()).hexdigest(),
    })
    for name, sheet in SHEETS.items():
        source_path = SOURCE_ROOT / sheet.source
        source_records.append({
            "id": name,
            "path": f"source/{sheet.source}",
            "generator": "OpenAI GPT Image built-in tool",
            "prompt_summary": sheet.prompt_summary,
            "grid": {"rows": sheet.rows, "columns": sheet.columns},
            "sha256": hashlib.sha256(source_path.read_bytes()).hexdigest(),
        })
    for family, source_name in TERRAIN_SOURCES.items():
        source_path = SOURCE_ROOT / source_name
        source_records.append({
            "id": f"terrain-{family}",
            "path": f"source/{source_name}",
            "generator": "OpenAI GPT Image built-in tool",
            "prompt_summary": f"Sixteen-mask {family} Wang terrain family",
            "grid": {"rows": 4, "columns": 4},
            "sha256": hashlib.sha256(source_path.read_bytes()).hexdigest(),
        })
    hoe_source = SOURCE_ROOT / "hoe-icon.png"
    source_records.append({
        "id": "hoe-icon",
        "path": "source/hoe-icon.png",
        "generator": "OpenAI GPT Image built-in tool",
        "prompt_summary": "Chunky right-angle farming hoe for 32px toolbelt readability",
        "grid": None,
        "sha256": hashlib.sha256(hoe_source.read_bytes()).hexdigest(),
    })

    expected_audio = ("village-day", "forest-day", "coast-day", "mine-day", "night")
    audio = [{
        "id": track,
        "path": f"/assets/audio/{track}.mp3",
        "present": (ROOT / "public" / "assets" / "audio" / f"{track}.mp3").exists(),
    } for track in expected_audio]

    manifest = {
        "version": 1,
        "visual_source": "gpt-image",
        "artwork_policy": "GPT Image originals; code is limited to chroma cleanup, cropping, nearest-neighbor normalization, palette reduction and manifest creation.",
        "logical_tile_size": 16,
        "runtime_map_size": {"width": 512, "height": 352},
        "sources": source_records,
        "assets": assets,
        "audio": audio,
        "validation": {
            "asset_count": len(assets),
            "all_sprite_alpha": all(asset["alpha"] for asset in assets if not asset["path"].startswith("tiles/terrain/")),
            "all_sprite_transparent_corners": all(asset["transparent_corners"] for asset in assets if not asset["path"].startswith("tiles/terrain/")),
        },
    }
    (ASSET_ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Processed {len(assets)} GPT Image sprites into {ASSET_ROOT}")


if __name__ == "__main__":
    main()

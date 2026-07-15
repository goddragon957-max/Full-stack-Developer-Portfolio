from __future__ import annotations

import hashlib
import json
import os
import shutil
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public" / "assets" / "seasons-v1"
SOURCE_ROOT = ASSET_ROOT / "source"
GENERATED_ROOT = Path(os.environ.get(
    "MOSSBELL_GENERATED_ROOT",
    r"C:\Users\eum0742\.codex\generated_images\019f4542-fb15-73e2-b95d-93f25d8065bb",
))
MAP_SIZE = (512, 352)
RANCH_CLEANUP_BOXES = ((145, 228, 260, 332),)
RANCH_GROUND_SOURCE_BOX = (168, 0, 280, 104)
RANCH_GROUND_POSITION = (148, 228)
RANCH_INTERIOR_DIRT_BOX = (177, 256, 224, 282)
RANCH_ROAD_SOURCE_BOX = (136, 228, 139, 332)
RANCH_ROAD_POSITION = (145, 228)

MAP_SOURCES = {
    ("farm-village", "spring"): "exec-280e8516-afd3-4039-a6d5-5e6e2fa86f0a.png",
    ("farm-village", "summer"): "exec-b1929e25-ba9b-4790-af85-9bdde41ccad1.png",
    ("farm-village", "autumn"): "exec-63d26879-bb2f-4dd3-8a9d-696457520d74.png",
    ("farm-village", "winter"): "exec-1dcaa3e8-90bb-40db-bcc8-578958c55112.png",
    ("whisper-forest", "spring"): "exec-fa0e5049-c2d6-4f30-b019-9466374a61ff.png",
    ("whisper-forest", "summer"): "exec-3bc0e37d-86b4-42d4-88bc-a04245f8b6c5.png",
    ("whisper-forest", "autumn"): "exec-b3564f28-b4f0-44b7-86c9-aee540e2bf3f.png",
    ("whisper-forest", "winter"): "exec-02be49c8-6e9e-4325-ab17-14d41c3b88ad.png",
    ("river-coast", "spring"): "exec-34658243-5060-4d60-bd61-bb62d7014b65.png",
    ("river-coast", "summer"): "exec-316b76ad-52e8-48d7-bdb5-7b43670b83ba.png",
    ("river-coast", "autumn"): "exec-e6864114-ede0-484c-b741-22fd13e987c8.png",
    ("river-coast", "winter"): "exec-6f2121a1-5eef-42aa-b9ec-256c58b6220b.png",
    ("mine-foothill", "spring"): "exec-c1787d90-ea0f-47a5-9a0c-0de74da17755.png",
    ("mine-foothill", "summer"): "exec-e2c53e38-ce43-49c0-a408-557e937f01b6.png",
    ("mine-foothill", "autumn"): "exec-e7010014-f41f-42f2-a935-d215cc90e22c.png",
    ("mine-foothill", "winter"): "exec-fbad0734-920c-42dc-ac74-de590069f973.png",
}

SHEET_SOURCES = {
    "season-weather-fish-festival-sheet.png": "exec-29143b92-e508-426e-9521-221a534b899e.png",
    "weather-particle-sheet.png": "exec-1a1b6505-5618-4697-a591-b62d1cda41d8.png",
}

SPRITE_LAYOUT = [
    [("icons/spring.png", (32, 32), (30, 30)), ("icons/summer.png", (32, 32), (30, 30)), ("icons/autumn.png", (32, 32), (30, 30)), ("icons/winter.png", (32, 32), (30, 30))],
    [("icons/weather-sunny.png", (32, 32), (28, 28)), ("icons/weather-rain.png", (32, 32), (30, 28)), ("icons/weather-windy.png", (32, 32), (30, 28)), ("icons/weather-snow.png", (32, 32), (30, 28))],
    [("fish/blossom-dace.png", (64, 48), (60, 40)), ("fish/sunscale-bass.png", (64, 48), (60, 40)), ("fish/ember-carp.png", (64, 48), (60, 40)), ("fish/frostfin.png", (64, 48), (60, 40))],
    [("festivals/harvest-display.png", (96, 64), (92, 60)), ("festivals/starlight-lantern.png", (64, 80), (58, 76)), ("festivals/harvest-ribbon.png", (48, 64), (44, 60)), ("festivals/starlight-charm.png", (48, 64), (44, 60))],
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure_source(relative_path: Path, generated_name: str) -> Path:
    destination = SOURCE_ROOT / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not destination.exists():
        generated = GENERATED_ROOT / generated_name
        if not generated.exists():
            raise FileNotFoundError(f"Missing GPT Image source: {generated}")
        shutil.copy2(generated, destination)
    return destination


def fit_map(source: Image.Image) -> Image.Image:
    source = source.convert("RGB")
    target_ratio = MAP_SIZE[0] / MAP_SIZE[1]
    source_ratio = source.width / source.height
    if source_ratio > target_ratio:
        crop_width = round(source.height * target_ratio)
        left = (source.width - crop_width) // 2
        source = source.crop((left, 0, left + crop_width, source.height))
    elif source_ratio < target_ratio:
        crop_height = round(source.width / target_ratio)
        top = (source.height - crop_height) // 2
        source = source.crop((0, top, source.width, top + crop_height))
    return source.resize(MAP_SIZE, Image.Resampling.NEAREST)


def remove_baked_ranch_enclosure(source: Image.Image) -> Image.Image:
    output = source.convert("RGB")
    interior_dirt = output.crop(RANCH_INTERIOR_DIRT_BOX)
    ground = output.crop(RANCH_GROUND_SOURCE_BOX)

    # The source patch contains one decorative rock. Replace it with nearby
    # source-map ground before assembling the clean ranch lawn.
    ground.paste(ground.crop((16, 48, 36, 72)), (48, 48))
    output.paste(ground, RANCH_GROUND_POSITION)
    output.paste(output.crop(RANCH_ROAD_SOURCE_BOX), RANCH_ROAD_POSITION)
    output.paste(interior_dirt, RANCH_INTERIOR_DIRT_BOX[:2])
    return output


def color_distance_squared(first: tuple[int, int, int], second: tuple[int, int, int]) -> int:
    return sum((first[index] - second[index]) ** 2 for index in range(3))


def remove_chroma(source: Image.Image, remove_enclosed_key: bool = False) -> Image.Image:
    rgb = source.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    key = pixels[0, 0]
    threshold = 118 ** 2
    background: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
    while queue:
        x, y = queue.popleft()
        if (x, y) in background or color_distance_squared(pixels[x, y], key) >= threshold:
            continue
        background.add((x, y))
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    if remove_enclosed_key:
        enclosed_key_threshold = 48 ** 2
        for y in range(height):
            for x in range(width):
                if color_distance_squared(pixels[x, y], key) < enclosed_key_threshold:
                    background.add((x, y))

    contracted = set(background)
    for x, y in background:
        if x > 0:
            contracted.add((x - 1, y))
        if x + 1 < width:
            contracted.add((x + 1, y))
        if y > 0:
            contracted.add((x, y - 1))
        if y + 1 < height:
            contracted.add((x, y + 1))

    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    output_pixels = output.load()
    for y in range(height):
        for x in range(width):
            if (x, y) not in contracted:
                red, green, blue = pixels[x, y]
                output_pixels[x, y] = (red, green, blue, 255)
    return output


def find_projection_bands(counts: list[int], expected: int) -> list[tuple[int, int]]:
    raw: list[tuple[int, int]] = []
    start: int | None = None
    for index, count in enumerate(counts):
        if count > 1 and start is None:
            start = index
        elif count <= 1 and start is not None:
            if index - start >= 3:
                raw.append((start, index))
            start = None
    if start is not None:
        raw.append((start, len(counts)))
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
        raise ValueError(f"Expected {expected} GPT grid rows, found {len(merged)}")
    return merged


def detect_row_cells(sheet: Image.Image) -> list[tuple[int, int]]:
    alpha = sheet.getchannel("A")
    pixels = alpha.load()
    counts = [sum(1 for x in range(sheet.width) if pixels[x, y] > 0) for y in range(sheet.height)]
    bands = find_projection_bands(counts, 4)
    boundaries = [max(0, bands[0][0] - 12)]
    boundaries.extend((bands[index][1] + bands[index + 1][0]) // 2 for index in range(3))
    boundaries.append(min(sheet.height, bands[-1][1] + 12))
    return [(boundaries[index], boundaries[index + 1]) for index in range(4)]


def get_cell(sheet: Image.Image, rows: list[tuple[int, int]], row: int, column: int) -> Image.Image:
    left = round(column * sheet.width / 4)
    right = round((column + 1) * sheet.width / 4)
    top, bottom = rows[row]
    return sheet.crop((left, top, right, bottom))


def remove_tiny_components(cell: Image.Image) -> Image.Image:
    alpha = cell.getchannel("A")
    width, height = cell.size
    alpha_pixels = alpha.load()
    visited: set[tuple[int, int]] = set()
    components: list[list[tuple[int, int]]] = []
    for y in range(height):
        for x in range(width):
            if alpha_pixels[x, y] == 0 or (x, y) in visited:
                continue
            component: list[tuple[int, int]] = []
            queue: deque[tuple[int, int]] = deque([(x, y)])
            while queue:
                current_x, current_y = queue.popleft()
                if (current_x, current_y) in visited or alpha_pixels[current_x, current_y] == 0:
                    continue
                visited.add((current_x, current_y))
                component.append((current_x, current_y))
                if current_x > 0:
                    queue.append((current_x - 1, current_y))
                if current_x + 1 < width:
                    queue.append((current_x + 1, current_y))
                if current_y > 0:
                    queue.append((current_x, current_y - 1))
                if current_y + 1 < height:
                    queue.append((current_x, current_y + 1))
            components.append(component)
    if not components:
        return cell
    minimum_area = max(12, round(max(len(component) for component in components) * 0.003))
    output = cell.copy()
    output_pixels = output.load()
    for component in components:
        if len(component) >= minimum_area:
            continue
        for x, y in component:
            output_pixels[x, y] = (0, 0, 0, 0)
    return output


def normalize_sprite(cell: Image.Image, canvas: tuple[int, int], content_box: tuple[int, int]) -> Image.Image:
    cell = remove_tiny_components(cell)
    bbox = cell.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("GPT sprite cell is empty")
    crop = cell.crop(bbox)
    scale = min(content_box[0] / crop.width, content_box[1] / crop.height)
    size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    crop = crop.resize(size, Image.Resampling.NEAREST)
    crop.putalpha(crop.getchannel("A").point(lambda alpha: 255 if alpha >= 128 else 0))
    clean = Image.new("RGBA", crop.size, (0, 0, 0, 0))
    clean_pixels = clean.load()
    crop_pixels = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            if crop_pixels[x, y][3] == 255:
                clean_pixels[x, y] = crop_pixels[x, y]
    output = Image.new("RGBA", canvas, (0, 0, 0, 0))
    output.alpha_composite(clean, ((canvas[0] - clean.width) // 2, canvas[1] - clean.height))
    return output


def save_asset(image: Image.Image, relative_path: str, source: str, cell: tuple[int, int] | None, assets: list[dict]) -> None:
    output = ASSET_ROOT / relative_path
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, optimize=True)
    assets.append({
        "path": relative_path,
        "source": f"source/{source}",
        "cell": {"row": cell[0], "column": cell[1]} if cell else None,
        "width": image.width,
        "height": image.height,
        "alpha": image.mode == "RGBA",
        "sha256": sha256(output),
    })


def process_maps(sources: list[dict]) -> list[dict]:
    maps: list[dict] = []
    for (region, season), generated_name in MAP_SOURCES.items():
        relative_source = Path("maps") / f"{region}-{season}-gpt.png"
        source = ensure_source(relative_source, generated_name)
        output = ASSET_ROOT / "maps" / f"{region}-{season}.png"
        output.parent.mkdir(parents=True, exist_ok=True)
        normalized = fit_map(Image.open(source))
        if region == "farm-village":
            normalized = remove_baked_ranch_enclosure(normalized)
        normalized.save(output, optimize=True)
        sources.append({"path": f"source/{relative_source.as_posix()}", "sha256": sha256(source)})
        maps.append({
            "region": region,
            "season": season,
            "path": f"maps/{region}-{season}.png",
            "source": f"source/{relative_source.as_posix()}",
            "width": MAP_SIZE[0],
            "height": MAP_SIZE[1],
            "source_policy": (
                "GPT Image edit of the existing runtime map; code center-crops, nearest-neighbor normalizes, "
                "and replaces the baked ranch enclosure with season-matched source-map ground pixels so editable "
                "PixelLab fence sprites can render at runtime"
                if region == "farm-village"
                else "GPT Image edit of the existing runtime map; code only center-crops and nearest-neighbor normalizes"
            ),
            "sha256": sha256(output),
        })
    return maps


def process_sprite_sheet(sources: list[dict], assets: list[dict]) -> None:
    source_name = "season-weather-fish-festival-sheet.png"
    source = ensure_source(Path(source_name), SHEET_SOURCES[source_name])
    sources.append({"path": f"source/{source_name}", "sha256": sha256(source)})
    sheet = remove_chroma(Image.open(source))
    rows = detect_row_cells(sheet)
    for row, row_layout in enumerate(SPRITE_LAYOUT):
        for column, (relative_path, canvas, content_box) in enumerate(row_layout):
            sprite = normalize_sprite(get_cell(sheet, rows, row, column), canvas, content_box)
            save_asset(sprite, relative_path, source_name, (row, column), assets)


def process_particle_atlas(sources: list[dict], assets: list[dict]) -> None:
    source_name = "weather-particle-sheet.png"
    source = ensure_source(Path(source_name), SHEET_SOURCES[source_name])
    sources.append({"path": f"source/{source_name}", "sha256": sha256(source)})
    sheet = remove_chroma(Image.open(source))
    rows = detect_row_cells(sheet)
    atlas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    for row in range(4):
        for column in range(4):
            particle = normalize_sprite(get_cell(sheet, rows, row, column), (32, 32), (24, 24))
            atlas.alpha_composite(particle, (column * 32, row * 32))
    save_asset(atlas, "effects/weather-atlas.png", source_name, None, assets)


def validate_alpha(assets: list[dict]) -> None:
    for entry in assets:
        path = ASSET_ROOT / entry["path"]
        with Image.open(path) as source:
            if source.mode != "RGBA":
                continue
            rgba = source.convert("RGBA")
            alpha_values = {pixel[3] for pixel in rgba.get_flattened_data()}
            if alpha_values != {0, 255}:
                raise ValueError(f"{entry['path']} must have binary transparency")
            corners = ((0, 0), (rgba.width - 1, 0), (0, rgba.height - 1), (rgba.width - 1, rgba.height - 1))
            if any(rgba.getpixel(point)[3] != 0 for point in corners):
                raise ValueError(f"{entry['path']} must have transparent corners")
            if any(alpha == 0 and (red or green or blue) for red, green, blue, alpha in rgba.get_flattened_data()):
                raise ValueError(f"{entry['path']} has color under transparent pixels")


def main() -> None:
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    sources: list[dict] = []
    assets: list[dict] = []
    maps = process_maps(sources)
    process_sprite_sheet(sources, assets)
    process_particle_atlas(sources, assets)
    validate_alpha(assets)
    manifest = {
        "version": 1,
        "theme": "Mossbell Farm seasons, weather, and festivals",
        "generation": {
            "model": "gpt-image",
            "policy": "All visual pixels originate in GPT Image outputs; scripts only copy, crop, chroma-key, resize, assemble, and validate.",
        },
        "runtime_map_size": {"width": MAP_SIZE[0], "height": MAP_SIZE[1]},
        "sources": sources,
        "maps": maps,
        "assets": assets,
        "validation": {
            "binary_alpha": True,
            "transparent_corners": True,
            "color_under_zero_alpha": False,
            "map_geometry_policy": "same four regions and runtime collision coordinates",
            "ranch_enclosure": "baked enclosure removed in all seasons; editable 32px PixelLab fence sprites render at runtime",
        },
    }
    manifest_path = ASSET_ROOT / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {manifest_path}: {len(sources)} sources, {len(maps)} maps, {len(assets)} assets")


if __name__ == "__main__":
    main()

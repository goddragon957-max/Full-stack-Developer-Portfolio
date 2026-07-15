from __future__ import annotations

import importlib.util
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
PROCESSOR_PATH = ROOT / "scripts" / "process-gpt-seasons-assets.py"
SPEC = importlib.util.spec_from_file_location("process_gpt_seasons_assets", PROCESSOR_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError(f"Unable to load {PROCESSOR_PATH}")
PROCESSOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PROCESSOR)


def assert_same_pixels(actual: Image.Image, expected: Image.Image, message: str) -> None:
    if ImageChops.difference(actual.convert("RGB"), expected.convert("RGB")).getbbox() is not None:
        raise AssertionError(message)


if not hasattr(PROCESSOR, "remove_baked_ranch_enclosure"):
    raise AssertionError("Season processor must remove the baked ranch enclosure before runtime fence rendering")
if hasattr(PROCESSOR, "install_rectangular_ranch_gate"):
    raise AssertionError("Season processor must not reinstall a fixed ranch gate")

for season in ("spring", "summer", "autumn", "winter"):
    source_path = PROCESSOR.SOURCE_ROOT / "maps" / f"farm-village-{season}-gpt.png"
    output_path = PROCESSOR.ASSET_ROOT / "maps" / f"farm-village-{season}.png"
    normalized = PROCESSOR.fit_map(Image.open(source_path))
    expected = PROCESSOR.remove_baked_ranch_enclosure(normalized.copy())
    output = Image.open(output_path)
    assert_same_pixels(output, expected, f"{season} ranch map must use the clean-ground transform")

    changed_pixels = 0
    for box in PROCESSOR.RANCH_CLEANUP_BOXES:
        original = normalized.crop(box)
        cleaned = output.crop(box)
        difference = ImageChops.difference(original.convert("RGB"), cleaned.convert("RGB"))
        changed_pixels += sum(1 for pixel in difference.get_flattened_data() if pixel != (0, 0, 0))
    if changed_pixels < 1200:
        raise AssertionError(f"{season} baked enclosure cleanup changed too few pixels: {changed_pixels}")

for asset_name in ("fence-horizontal.png", "fence-vertical.png", "ranch-gate.png"):
    path = ROOT / "public" / "assets" / "pixellab" / "ranch-fences-v1" / asset_name
    image = Image.open(path).convert("RGBA")
    if image.size != (32, 32):
        raise AssertionError(f"{asset_name} must be a compact one-tile 32x32 sprite")
    if image.getbbox() is None:
        raise AssertionError(f"{asset_name} must contain visible GPT pixel art")
    if any(image.getpixel(corner)[3] != 0 for corner in ((0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1))):
        raise AssertionError(f"{asset_name} must have transparent corners")

print("ranch enclosure test passed: four seasonal maps expose clean ground for editable GPT fence sprites")

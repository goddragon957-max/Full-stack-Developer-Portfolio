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


if not hasattr(PROCESSOR, "close_ranch_enclosure"):
    raise AssertionError("Season processor must close the detached ranch gate")

for season in ("spring", "summer", "autumn", "winter"):
    source_path = PROCESSOR.SOURCE_ROOT / "maps" / f"farm-village-{season}-gpt.png"
    output_path = PROCESSOR.ASSET_ROOT / "maps" / f"farm-village-{season}.png"
    normalized = PROCESSOR.fit_map(Image.open(source_path))
    expected = PROCESSOR.close_ranch_enclosure(normalized.copy())
    output = Image.open(output_path)
    assert_same_pixels(output, expected, f"{season} ranch map must use the connected enclosure transform")

    for side, box in zip(("left", "right"), PROCESSOR.RANCH_SIDE_EXTENSION_BOXES, strict=True):
        left, top, right, bottom = box
        offset = PROCESSOR.RANCH_SIDE_EXTENSION_OFFSET_Y
        original_side = normalized.crop(box)
        extended_side = output.crop((left, top + offset, right, bottom + offset))
        assert_same_pixels(extended_side, original_side, f"{season} ranch {side} side must extend to the front fence")

print("ranch enclosure test passed: four seasonal maps use one connected rectangular pen")

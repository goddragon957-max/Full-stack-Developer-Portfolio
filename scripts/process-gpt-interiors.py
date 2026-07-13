from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "assets" / "art-remaster-v1" / "source" / "interiors"
RUNTIME_DIR = ROOT / "public" / "assets" / "art-remaster-v1" / "maps"
MANIFEST_PATH = ROOT / "public" / "assets" / "art-remaster-v1" / "interiors" / "manifest.json"
SOURCE_SIZE = (1536, 1024)
RUNTIME_SIZE = (384, 256)

INTERIORS = [
    {
        "id": "farmhouse-interior",
        "file": "farmhouse-interior.png",
        "prompt_summary": "Player farmhouse with bed, chest, hearth, kitchen, dining table, rug, and bottom exit.",
    },
    {
        "id": "shop-interior",
        "file": "shop-interior.png",
        "prompt_summary": "Cozy seed shop with wall shelves, counter, clear central aisle, and bottom exit.",
    },
    {
        "id": "barn-interior",
        "file": "barn-interior.png",
        "prompt_summary": "Working barn with two stalls, feed storage, clear center aisle, and bottom double door.",
    },
    {
        "id": "hana-cottage-interior",
        "file": "hana-cottage-interior.png",
        "prompt_summary": "Farmer cottage with bed, gardening desk, planters, stove, and clear center route.",
    },
    {
        "id": "jun-cottage-interior",
        "file": "jun-cottage-interior.png",
        "prompt_summary": "Rancher cottage with bed, fireplace, ranch tools, milk cans, and clear center route.",
    },
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    records = []

    for interior in INTERIORS:
        source_path = SOURCE_DIR / interior["file"]
        runtime_path = RUNTIME_DIR / interior["file"]
        with Image.open(source_path) as image:
            if image.size != SOURCE_SIZE:
                raise ValueError(f"{source_path.name} must be {SOURCE_SIZE}, got {image.size}")
            runtime = image.convert("RGB").resize(RUNTIME_SIZE, Image.Resampling.NEAREST)
            runtime.save(runtime_path, format="PNG", optimize=True)

        records.append(
            {
                **interior,
                "generator": "OpenAI GPT Image built-in tool",
                "source": f"source/interiors/{interior['file']}",
                "runtime": f"maps/{interior['file']}",
                "source_size": {"width": SOURCE_SIZE[0], "height": SOURCE_SIZE[1]},
                "runtime_size": {"width": RUNTIME_SIZE[0], "height": RUNTIME_SIZE[1]},
                "resize": "nearest-neighbor",
                "source_sha256": sha256(source_path),
                "runtime_sha256": sha256(runtime_path),
            }
        )

    MANIFEST_PATH.write_text(
        json.dumps(
            {
                "version": 1,
                "visual_source": "gpt-image",
                "reference_assets": [
                    "maps/farmhouse-interior.png",
                    "style/style-anchor.png",
                ],
                "interiors": records,
            },
            ensure_ascii=True,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"processed {len(records)} GPT interiors at {RUNTIME_SIZE[0]}x{RUNTIME_SIZE[1]}")


if __name__ == "__main__":
    main()

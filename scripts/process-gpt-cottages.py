from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "assets" / "art-remaster-v1" / "source" / "buildings"
RUNTIME_DIR = ROOT / "public" / "assets" / "art-remaster-v1" / "props" / "buildings"
MANIFEST_PATH = ROOT / "public" / "assets" / "art-remaster-v1" / "buildings" / "cottages-manifest.json"
CANVAS_SIZE = (128, 128)
CONTENT_LIMIT = (120, 120)

COTTAGES = [
    {
        "id": "hana-cottage",
        "source": "hana-cottage-chroma.png",
        "alpha_source": "hana-cottage-alpha.png",
        "runtime": "hana-cottage.png",
        "prompt_summary": "Green-roof farmer cottage with planters, garden tools, and a centered door.",
    },
    {
        "id": "jun-cottage",
        "source": "jun-cottage-chroma.png",
        "alpha_source": "jun-cottage-alpha.png",
        "runtime": "jun-cottage.png",
        "prompt_summary": "Red-roof rancher cottage with horseshoe, milk can, and a centered door.",
    },
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalize(source_path: Path, runtime_path: Path) -> None:
    with Image.open(source_path) as source:
        rgba = source.convert("RGBA")
    alpha = rgba.getchannel("A").point(lambda value: 255 if value >= 128 else 0)
    rgba.putalpha(alpha)
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError(f"{source_path.name} has no opaque pixels")
    crop = rgba.crop(bbox)
    scale = min(CONTENT_LIMIT[0] / crop.width, CONTENT_LIMIT[1] / crop.height)
    size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    crop = crop.resize(size, Image.Resampling.NEAREST)

    pixels = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            red, green, blue, opacity = pixels[x, y]
            if opacity == 0:
                pixels[x, y] = (0, 0, 0, 0)

    canvas = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    offset = ((CANVAS_SIZE[0] - crop.width) // 2, CANVAS_SIZE[1] - crop.height - 2)
    canvas.alpha_composite(crop, offset)
    canvas.save(runtime_path, format="PNG", optimize=True)


def main() -> None:
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    records = []
    for cottage in COTTAGES:
        chroma_path = SOURCE_DIR / cottage["source"]
        alpha_path = SOURCE_DIR / cottage["alpha_source"]
        runtime_path = RUNTIME_DIR / cottage["runtime"]
        normalize(alpha_path, runtime_path)
        records.append(
            {
                **cottage,
                "generator": "OpenAI GPT Image built-in tool",
                "chroma_key": "#ff00ff",
                "canvas": {"width": CANVAS_SIZE[0], "height": CANVAS_SIZE[1]},
                "alpha": True,
                "binary_alpha": True,
                "source_sha256": sha256(chroma_path),
                "runtime_sha256": sha256(runtime_path),
            }
        )

    MANIFEST_PATH.write_text(
        json.dumps({"version": 1, "visual_source": "gpt-image", "cottages": records}, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"processed {len(records)} GPT cottage sprites at {CANVAS_SIZE[0]}x{CANVAS_SIZE[1]}")


if __name__ == "__main__":
    main()

from __future__ import annotations

import hashlib
import json
from collections import deque
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
STORY_ROOT = ROOT / "public" / "assets" / "story-v1"
SOURCE_ROOT = STORY_ROOT / "source"
RUNTIME_ROOT = STORY_ROOT / "runtime"
MANIFEST_PATH = STORY_ROOT / "manifest.json"


@dataclass(frozen=True)
class AssetSpec:
    source: str
    runtime: str
    size: int
    role: str


ASSETS = (
    AssetSpec("old-bell-gpt.png", "old-bell.png", 96, "world landmark and finale altar"),
    AssetSpec("faded-letter-gpt.png", "faded-letter.png", 48, "prologue letter"),
    AssetSpec("seal-sprout-gpt.png", "seal-sprout.png", 48, "spring story seal"),
    AssetSpec("seal-tide-gpt.png", "seal-tide.png", 48, "summer story seal"),
    AssetSpec("seal-harvest-gpt.png", "seal-harvest.png", 48, "autumn story seal"),
    AssetSpec("seal-starlight-gpt.png", "seal-starlight.png", 48, "winter story seal"),
    AssetSpec("bell-keepsake-gpt.png", "bell-keepsake.png", 48, "ending keepsake reward"),
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def is_chroma(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, _ = pixel
    return (
        red >= 120
        and blue >= 120
        and green <= 135
        and min(red, blue) - green >= 45
        and abs(red - blue) <= 105
    )


def is_chroma_core(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, _ = pixel
    return red >= 220 and blue >= 220 and green <= 55 and abs(red - blue) <= 45


def remove_chroma(source: Image.Image) -> Image.Image:
    """Remove only connected chroma components, preserving isolated purple artwork."""
    rgba = source.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    visited: set[tuple[int, int]] = set()
    transparent: set[tuple[int, int]] = set()

    for start_y in range(height):
        for start_x in range(width):
            start = (start_x, start_y)
            if start in visited or not is_chroma(pixels[start_x, start_y]):
                continue

            queue = deque([start])
            component: list[tuple[int, int]] = []
            touches_edge = False
            has_core = False
            visited.add(start)

            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                touches_edge = touches_edge or x in (0, width - 1) or y in (0, height - 1)
                has_core = has_core or is_chroma_core(pixels[x, y])

                for next_x, next_y in (
                    (x - 1, y),
                    (x + 1, y),
                    (x, y - 1),
                    (x, y + 1),
                ):
                    neighbor = (next_x, next_y)
                    if not (0 <= next_x < width and 0 <= next_y < height):
                        continue
                    if neighbor in visited or not is_chroma(pixels[next_x, next_y]):
                        continue
                    visited.add(neighbor)
                    queue.append(neighbor)

            if touches_edge or has_core:
                transparent.update(component)

    if not transparent:
        raise ValueError("No #FF00FF chroma background was detected")

    output = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    output_pixels = output.load()
    for y in range(height):
        for x in range(width):
            if (x, y) not in transparent:
                red, green, blue, alpha = pixels[x, y]
                output_pixels[x, y] = (red, green, blue, 255 if alpha else 0)
    return output


def fit_runtime(source: Image.Image, target_size: int) -> Image.Image:
    alpha = source.getchannel("A")
    bounds = alpha.getbbox()
    if bounds is None:
        raise ValueError("Processed sprite has no opaque pixels")

    cropped = source.crop(bounds)
    available = target_size - 8
    scale = min(available / cropped.width, available / cropped.height)
    width = max(1, round(cropped.width * scale))
    height = max(1, round(cropped.height * scale))
    resized = cropped.resize((width, height), Image.Resampling.NEAREST)

    output = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    output.alpha_composite(resized, ((target_size - width) // 2, (target_size - height) // 2))
    return output


def validate_runtime(path: Path, expected_size: int) -> None:
    with Image.open(path) as source:
        rgba = source.convert("RGBA")
        if rgba.size != (expected_size, expected_size):
            raise ValueError(f"{path.name}: expected {expected_size}x{expected_size}")
        alpha_values = {pixel[3] for pixel in rgba.get_flattened_data()}
        if alpha_values != {0, 255}:
            raise ValueError(f"{path.name}: expected binary transparency")
        corners = ((0, 0), (expected_size - 1, 0), (0, expected_size - 1), (expected_size - 1, expected_size - 1))
        if any(rgba.getpixel(point)[3] for point in corners):
            raise ValueError(f"{path.name}: expected transparent corners")
        if any(alpha == 0 and (red or green or blue) for red, green, blue, alpha in rgba.get_flattened_data()):
            raise ValueError(f"{path.name}: transparent pixels retain color data")


def process_assets() -> None:
    RUNTIME_ROOT.mkdir(parents=True, exist_ok=True)
    sources: list[dict[str, object]] = []
    assets: list[dict[str, object]] = []

    for spec in ASSETS:
        source_path = SOURCE_ROOT / spec.source
        runtime_path = RUNTIME_ROOT / spec.runtime
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        with Image.open(source_path) as source:
            runtime = fit_runtime(remove_chroma(source), spec.size)
        runtime.save(runtime_path, optimize=True)
        validate_runtime(runtime_path, spec.size)

        sources.append(
            {
                "path": f"source/{spec.source}",
                "sha256": sha256(source_path),
                "generator": "gpt-image",
                "background": "#FF00FF chroma key",
            }
        )
        assets.append(
            {
                "path": f"runtime/{spec.runtime}",
                "source": f"source/{spec.source}",
                "sha256": sha256(runtime_path),
                "width": spec.size,
                "height": spec.size,
                "role": spec.role,
            }
        )
        print(f"processed {spec.source} -> {spec.runtime} ({spec.size}x{spec.size})")

    manifest = {
        "version": 1,
        "name": "Mossbell Story v1",
        "generation": {
            "model": "gpt-image",
            "method": "one isolated pixel-art object per chroma-key source",
            "runtimeProcessing": [
                "connected-component chroma removal",
                "alpha bounds crop",
                "nearest-neighbor resize",
                "binary-alpha validation",
            ],
            "artDrawingByScript": False,
        },
        "sources": sources,
        "assets": assets,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {MANIFEST_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    process_assets()

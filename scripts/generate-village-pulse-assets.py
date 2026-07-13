from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public' / 'assets' / 'generated-sprites' / 'character-walk'
OUTPUT = ROOT / 'public' / 'assets' / 'village-pulse'
NPC_OUTPUT = OUTPUT / 'npc' / 'village-keeper'
DIRECTIONS = ('down', 'left', 'right', 'up')
FRAME_COUNT = 4


def recolor_frame(source: Image.Image) -> Image.Image:
    image = source.convert('RGBA')
    width, height = image.size
    pixels = image.load()

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue

            # Shift the generated farmer's blue jacket into a forest-green NPC coat.
            if y > height * 0.28 and blue > red * 1.14 and blue > green * 1.04:
                value = max(red, green, blue)
                if value < 75:
                    pixels[x, y] = (27, 57, 45, alpha)
                elif value < 145:
                    pixels[x, y] = (52, 105, 70, alpha)
                else:
                    pixels[x, y] = (96, 158, 95, alpha)
                continue

            # Give the shirt/apron a warm gold accent without touching face highlights.
            spread = max(red, green, blue) - min(red, green, blue)
            if y > height * 0.43 and spread < 34 and max(red, green, blue) > 105:
                value = max(red, green, blue)
                pixels[x, y] = (
                    min(255, int(value * 1.05)),
                    min(232, int(value * 0.82)),
                    min(145, int(value * 0.46)),
                    alpha,
                )

    return image


def generate_frames() -> list[str]:
    NPC_OUTPUT.mkdir(parents=True, exist_ok=True)
    frames: list[str] = []

    for direction in DIRECTIONS:
        for index in range(FRAME_COUNT):
            name = f'{direction}-{index}.png'
            source_path = SOURCE / name
            output_path = NPC_OUTPUT / name
            recolor_frame(Image.open(source_path)).save(output_path, optimize=True)
            frames.append(f'npc/village-keeper/{name}')

    return frames


def write_manifest(frames: list[str]) -> None:
    manifest = {
        'version': 1,
        'generator': 'scripts/generate-village-pulse-assets.py',
        'source': 'public/assets/generated-sprites/character-walk',
        'npc': {
            'id': 'village-keeper',
            'name': 'Lumi',
            'canvas': {'width': 118, 'height': 181},
            'frames': frames,
        },
        'fallback_reason': 'PixelLab MCP token was unavailable; palette-derived frames preserve the generated character proportions.',
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / 'manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=True, indent=2) + '\n',
        encoding='utf-8',
    )


def main() -> None:
    frames = generate_frames()
    write_manifest(frames)
    print(f'wrote {len(frames)} Village Pulse NPC frames to {NPC_OUTPUT}')


if __name__ == '__main__':
    main()

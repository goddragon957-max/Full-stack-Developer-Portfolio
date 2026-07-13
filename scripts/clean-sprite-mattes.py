from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public' / 'assets'
MANIFEST = ASSETS / 'sprite-matte-cleanup.json'
REMASTER_MANIFEST = ASSETS / 'art-remaster-v1' / 'manifest.json'

STATIC_TARGETS = [
    ASSETS / 'game-sprites' / f'sprite-{number}.png'
    for number in ('18', '19', '20', '24', '25', '51', '56', '63')
] + [
    ASSETS / 'generated-sprites' / 'interior' / 'sprite-75.png',
]
WALK_TARGETS = sorted((ASSETS / 'generated-sprites' / 'character-walk').glob('*.png'))
TARGETS = STATIC_TARGETS + WALK_TARGETS


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def contract_outer_alpha(source: Image.Image) -> tuple[Image.Image, int, int]:
    source = source.convert('RGBA')
    output = source.copy()
    source_pixels = source.load()
    output_pixels = output.load()
    width, height = source.size
    opaque_before = 0
    edge_pixels: list[tuple[int, int]] = []

    for y in range(height):
        for x in range(width):
            if source_pixels[x, y][3] == 0:
                continue
            opaque_before += 1
            touches_transparency = any(
                not (0 <= neighbor_x < width and 0 <= neighbor_y < height)
                or source_pixels[neighbor_x, neighbor_y][3] == 0
                for neighbor_y in range(y - 1, y + 2)
                for neighbor_x in range(x - 1, x + 2)
                if (neighbor_x, neighbor_y) != (x, y)
            )
            if touches_transparency:
                edge_pixels.append((x, y))

    if opaque_before == 0:
        raise ValueError('Sprite has no opaque pixels')
    if len(edge_pixels) / opaque_before > 0.28:
        raise ValueError('Outer alpha contraction would remove too much of the sprite')

    for x, y in edge_pixels:
        red, green, blue, _ = source_pixels[x, y]
        output_pixels[x, y] = (red, green, blue, 0)

    return output, len(edge_pixels), opaque_before


def load_manifest() -> dict:
    if not MANIFEST.exists():
        return {
            'version': 1,
            'operation': 'one-pixel outer alpha contraction',
            'targets': {},
        }
    return json.loads(MANIFEST.read_text(encoding='utf-8'))


def relative_asset_path(path: Path) -> str:
    return path.relative_to(ASSETS).as_posix()


def clean_targets() -> None:
    manifest = load_manifest()
    entries = manifest.setdefault('targets', {})

    for path in TARGETS:
        if not path.exists():
            raise FileNotFoundError(path)
        relative_path = relative_asset_path(path)
        current_hash = sha256(path)
        if entries.get(relative_path, {}).get('sha256') == current_hash:
            print(f'skipped {relative_path} (already clean)')
            continue

        with Image.open(path) as source:
            original_size = source.size
            cleaned, removed_pixels, opaque_before = contract_outer_alpha(source)

        temporary_path = path.with_name(f'{path.stem}.matte-clean.tmp.png')
        cleaned.save(temporary_path, optimize=True)
        temporary_path.replace(path)
        entries[relative_path] = {
            'sha256': sha256(path),
            'size': list(original_size),
            'removedPixels': removed_pixels,
            'opaquePixelsBefore': opaque_before,
        }
        print(f'cleaned {relative_path}: removed {removed_pixels} outer pixels')

    MANIFEST.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print(f'wrote {MANIFEST}')


def check_targets() -> None:
    manifest = load_manifest()
    entries = manifest.get('targets', {})
    errors: list[str] = []

    for path in TARGETS:
        relative_path = relative_asset_path(path)
        entry = entries.get(relative_path)
        if entry is None:
            errors.append(f'{relative_path}: missing manifest entry')
            continue
        if not path.exists():
            errors.append(f'{relative_path}: missing file')
            continue
        if sha256(path) != entry.get('sha256'):
            errors.append(f'{relative_path}: hash changed; rerun the matte cleaner')

    if errors:
        raise SystemExit('\n'.join(errors))

    remaster_errors: list[str] = []
    remaster_assets: list[dict] = []
    if not REMASTER_MANIFEST.exists():
        remaster_errors.append('art-remaster-v1/manifest.json: missing file')
    else:
        remaster_assets = json.loads(REMASTER_MANIFEST.read_text(encoding='utf-8')).get('assets', [])
        for entry in remaster_assets:
            relative_path = entry.get('path', '')
            if relative_path.startswith('tiles/terrain/'):
                continue
            path = ASSETS / 'art-remaster-v1' / relative_path
            if not path.exists():
                remaster_errors.append(f'art-remaster-v1/{relative_path}: missing file')
                continue
            with Image.open(path) as source:
                rgba = source.convert('RGBA')
                pixels = list(rgba.get_flattened_data())
                alpha_values = {pixel[3] for pixel in pixels}
                if 0 not in alpha_values or 255 not in alpha_values:
                    remaster_errors.append(f'art-remaster-v1/{relative_path}: missing binary transparency')
                if any(alpha not in (0, 255) for alpha in alpha_values):
                    remaster_errors.append(f'art-remaster-v1/{relative_path}: semi-transparent matte pixels found')
                if any(alpha == 0 and (red or green or blue) for red, green, blue, alpha in pixels):
                    remaster_errors.append(f'art-remaster-v1/{relative_path}: color data remains under transparent pixels')
                corners = ((0, 0), (rgba.width - 1, 0), (0, rgba.height - 1), (rgba.width - 1, rgba.height - 1))
                if any(rgba.getpixel(point)[3] != 0 for point in corners):
                    remaster_errors.append(f'art-remaster-v1/{relative_path}: opaque sprite corner found')

    if remaster_errors:
        raise SystemExit('\n'.join(remaster_errors))
    print(f'sprite matte check passed: {len(TARGETS)} legacy sprites and {len(remaster_assets)} GPT remaster assets')


def main() -> None:
    parser = argparse.ArgumentParser(description='Remove one white-matte contour from exterior runtime sprites.')
    parser.add_argument('--check', action='store_true', help='Verify cleaned sprite hashes without editing files.')
    args = parser.parse_args()
    if args.check:
        check_targets()
    else:
        clean_targets()


if __name__ == '__main__':
    main()

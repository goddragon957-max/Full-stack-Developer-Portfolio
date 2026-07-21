from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public" / "assets" / "sea-route-v1"
SOURCE_ROOT = ASSET_ROOT / "source"
MAP_ROOT = ASSET_ROOT / "maps"
SPRITE_ROOT = ASSET_ROOT / "sprites"


def process_map() -> None:
    source = Image.open(SOURCE_ROOT / "mossbell-sea-gpt.png").convert("RGB")
    target_ratio = 512 / 352
    crop_height = round(source.width / target_ratio)
    top = max(0, (source.height - crop_height) // 2)
    cropped = source.crop((0, top, source.width, top + crop_height))
    cropped.resize((512, 352), Image.Resampling.NEAREST).save(
        MAP_ROOT / "mossbell-sea.png",
        optimize=True,
    )


def remove_chroma(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, alpha = pixels[x, y]
            magenta_distance = abs(red - blue)
            if alpha and red > 185 and blue > 155 and green < 115 and magenta_distance < 95:
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


def process_boats() -> None:
    source = Image.open(SOURCE_ROOT / "mossbell-boat-sheet-gpt.png").convert("RGBA")
    half_width = source.width // 2
    half_height = source.height // 2
    quadrants = {
        "up": (0, 0, half_width, half_height),
        "down": (half_width, 0, source.width, half_height),
        "left": (0, half_height, half_width, source.height),
        "right": (half_width, half_height, source.width, source.height),
    }

    for direction, box in quadrants.items():
        sprite = remove_chroma(source.crop(box))
        alpha_box = sprite.getchannel("A").getbbox()
        if not alpha_box:
            raise RuntimeError(f"No boat pixels found for {direction}")
        sprite = sprite.crop(alpha_box)
        sprite.thumbnail((72, 72), Image.Resampling.NEAREST)
        canvas = Image.new("RGBA", (80, 80), (0, 0, 0, 0))
        canvas.alpha_composite(sprite, ((80 - sprite.width) // 2, (80 - sprite.height) // 2))
        canvas = ImageOps.crop(canvas, border=0)
        canvas.save(SPRITE_ROOT / f"boat-{direction}.png", optimize=True)


if __name__ == "__main__":
    MAP_ROOT.mkdir(parents=True, exist_ok=True)
    SPRITE_ROOT.mkdir(parents=True, exist_ok=True)
    process_map()
    process_boats()
    print("Processed GPT sea map and four directional boat sprites.")

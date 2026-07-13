from __future__ import annotations

import json
import random
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "assets" / "open-world-v1"
SPRITES = ROOT / "public" / "assets" / "game-sprites"
MAP_SIZE = (512, 352)
TILE = 16

INK = (67, 48, 38, 255)
DEEP_INK = (45, 39, 35, 255)
GRASS = (112, 177, 52, 255)
GRASS_DARK = (69, 132, 49, 255)
GRASS_LIGHT = (148, 198, 65, 255)
DIRT = (174, 126, 66, 255)
DIRT_DARK = (125, 86, 52, 255)
WATER = (55, 139, 157, 255)
WATER_DARK = (37, 103, 129, 255)
WATER_LIGHT = (102, 192, 185, 255)
SAND = (224, 190, 114, 255)
SAND_LIGHT = (244, 216, 143, 255)
ROCK = (112, 111, 103, 255)
ROCK_DARK = (72, 73, 69, 255)
ROCK_LIGHT = (155, 151, 130, 255)


def save(image: Image.Image, relative: str) -> None:
    path = OUTPUT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def pixel_texture(image: Image.Image, base: tuple[int, int, int, int], seed: int) -> None:
    image.paste(base, (0, 0, *image.size))
    draw = ImageDraw.Draw(image)
    rng = random.Random(seed)
    palette = [
        tuple(max(0, min(255, channel + delta)) for channel in base[:3]) + (255,)
        for delta in (-14, -7, 8, 14)
    ]
    for _ in range(1300):
        x = rng.randrange(0, image.width // 2) * 2
        y = rng.randrange(0, image.height // 2) * 2
        color = rng.choice(palette)
        draw.point((x, y), fill=color)
        if rng.random() > 0.55:
            draw.point((x + 1, y), fill=color)


def draw_path(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], width: int = 38) -> None:
    scaled = [(x * TILE + TILE // 2, y * TILE + TILE // 2) for x, y in points]
    draw.line(scaled, fill=DIRT_DARK, width=width + 4, joint="curve")
    draw.line(scaled, fill=DIRT, width=width, joint="curve")
    for x, y in scaled[::2]:
        draw.rectangle((x - 5, y - 2, x - 2, y + 1), fill=(198, 150, 78, 255))


def draw_tree(draw: ImageDraw.ImageDraw, tx: int, ty: int, bright: bool = False) -> None:
    x, y = tx * TILE, ty * TILE
    trunk = (112, 70, 42, 255)
    leaf = (65, 139, 47, 255) if not bright else (83, 158, 49, 255)
    light = (112, 181, 55, 255) if not bright else (137, 197, 60, 255)
    draw.rectangle((x + 6, y + 17, x + 11, y + 31), fill=INK)
    draw.rectangle((x + 7, y + 17, x + 10, y + 30), fill=trunk)
    draw.rectangle((x + 1, y + 5, x + 17, y + 20), fill=INK)
    draw.rectangle((x + 4, y + 1, x + 14, y + 23), fill=INK)
    draw.rectangle((x + 2, y + 7, x + 16, y + 18), fill=leaf)
    draw.rectangle((x + 5, y + 3, x + 13, y + 21), fill=leaf)
    draw.rectangle((x + 5, y + 5, x + 11, y + 9), fill=light)


def paste_tree(image: Image.Image, tx: int, ty: int, size: int, apple: bool = False) -> None:
    source = Image.open(SPRITES / ("sprite-63.png" if apple else "sprite-56.png")).convert("RGBA")
    ratio = size / source.width
    source = source.resize((size, max(1, round(source.height * ratio))), Image.Resampling.NEAREST)
    image.alpha_composite(source, (tx * TILE - size // 2, ty * TILE - source.height + TILE))


def draw_bush(draw: ImageDraw.ImageDraw, tx: int, ty: int, berry: bool = False) -> None:
    x, y = tx * TILE, ty * TILE
    draw.ellipse((x + 1, y + 5, x + 19, y + 19), fill=INK)
    draw.rectangle((x + 3, y + 9, x + 17, y + 18), fill=(64, 137, 48, 255))
    draw.rectangle((x + 6, y + 6, x + 14, y + 15), fill=(91, 165, 54, 255))
    draw.rectangle((x + 6, y + 8, x + 10, y + 11), fill=(138, 194, 64, 255))
    if berry:
        draw.rectangle((x + 7, y + 13, x + 9, y + 15), fill=(205, 54, 60, 255))
        draw.rectangle((x + 13, y + 11, x + 15, y + 13), fill=(205, 54, 60, 255))


def draw_rock(draw: ImageDraw.ImageDraw, tx: int, ty: int, large: bool = False) -> None:
    x, y = tx * TILE, ty * TILE
    width = 18 if large else 12
    height = 13 if large else 8
    draw.polygon([(x + 1, y + height), (x + 4, y + 3), (x + width - 5, y + 1), (x + width, y + height - 2), (x + width - 4, y + height + 2), (x + 4, y + height + 2)], fill=INK)
    draw.polygon([(x + 4, y + height - 1), (x + 6, y + 4), (x + width - 6, y + 3), (x + width - 3, y + height - 3), (x + width - 6, y + height), (x + 6, y + height)], fill=ROCK)
    draw.line((x + 6, y + 5, x + width - 7, y + 4), fill=ROCK_LIGHT, width=2)


def draw_ground_details(draw: ImageDraw.ImageDraw, seed: int, count: int, bounds: tuple[int, int, int, int]) -> None:
    rng = random.Random(seed)
    for _ in range(count):
        x = rng.randrange(bounds[0], bounds[2])
        y = rng.randrange(bounds[1], bounds[3])
        color = rng.choice(((66, 139, 48, 255), (93, 159, 50, 255), (174, 199, 64, 255)))
        draw.line((x, y + 3, x + 1, y), fill=color, width=1)
        draw.line((x + 2, y + 3, x + 3, y + 1), fill=color, width=1)


def draw_water(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], seed: int) -> None:
    draw.rectangle(box, fill=WATER_DARK)
    inner = (box[0] + 3, box[1] + 3, box[2] - 3, box[3] - 3)
    draw.rectangle(inner, fill=WATER)
    rng = random.Random(seed)
    for _ in range(40):
        x = rng.randrange(inner[0] + 4, max(inner[0] + 5, inner[2] - 12))
        y = rng.randrange(inner[1] + 4, max(inner[1] + 5, inner[3] - 3))
        length = rng.choice((6, 10, 14))
        draw.line((x, y, min(inner[2] - 2, x + length), y), fill=WATER_LIGHT, width=2)


def generate_forest_map() -> None:
    image = Image.new("RGBA", MAP_SIZE)
    pixel_texture(image, GRASS, 141)
    draw = ImageDraw.Draw(image)
    draw_path(draw, [(0, 11), (7, 11), (12, 10), (16, 10), (16, 4), (16, 0)])
    draw_path(draw, [(16, 10), (25, 11), (31, 11)], width=28)
    draw_water(draw, (20 * TILE, 0, 23 * TILE - 1, 352), 31)
    draw.rectangle((20 * TILE - 3, 9 * TILE, 23 * TILE + 2, 13 * TILE), fill=INK)
    draw.rectangle((20 * TILE, 9 * TILE + 3, 23 * TILE - 1, 13 * TILE - 3), fill=(171, 111, 55, 255))
    for yy in range(9 * TILE + 6, 13 * TILE - 4, 8):
        draw.line((20 * TILE, yy, 23 * TILE - 1, yy), fill=(108, 67, 42, 255), width=2)
    draw_ground_details(draw, 144, 220, (12, 20, 500, 340))
    tree_positions = [(1, 2), (3, 2), (5, 2), (7, 2), (10, 2), (12, 2), (25, 2), (27, 2), (29, 2), (31, 2),
                      (1, 6), (1, 16), (3, 20), (6, 20), (9, 20), (12, 20), (20, 20), (24, 20), (27, 20), (30, 20),
                      (5, 5), (8, 6), (26, 5), (29, 7), (5, 17), (8, 18), (28, 17), (30, 14)]
    for index, (x, y) in enumerate(tree_positions):
        paste_tree(image, x, y, 30 + (index % 3) * 5, apple=index in (11, 23))
    for index, (x, y) in enumerate([(3, 8), (7, 14), (12, 4), (17, 18), (25, 14), (29, 10), (24, 7)]):
        draw_bush(draw, x, y, berry=index % 3 == 0)
    for x, y in [(10, 15), (13, 6), (18, 5), (24, 18), (27, 3)]:
        draw_rock(draw, x, y)
    save(image, "maps/whisper-forest.png")


def generate_coast_map() -> None:
    image = Image.new("RGBA", MAP_SIZE)
    pixel_texture(image, (119, 175, 61, 255), 242)
    draw = ImageDraw.Draw(image)
    draw_path(draw, [(16, 21), (16, 15), (14, 11), (16, 5), (31, 5)], width=34)
    draw_water(draw, (19 * TILE, 0, 23 * TILE - 1, 352), 72)
    draw.rectangle((19 * TILE - 3, 10 * TILE, 23 * TILE + 2, 13 * TILE), fill=INK)
    draw.rectangle((19 * TILE, 10 * TILE + 3, 23 * TILE - 1, 13 * TILE - 3), fill=(177, 119, 61, 255))
    for yy in range(10 * TILE + 6, 13 * TILE - 4, 8):
        draw.line((19 * TILE, yy, 23 * TILE - 1, yy), fill=(111, 70, 45, 255), width=2)
    draw.rectangle((19 * TILE - 3, 4 * TILE, 23 * TILE + 2, 7 * TILE), fill=INK)
    draw.rectangle((19 * TILE, 4 * TILE + 3, 23 * TILE - 1, 7 * TILE - 3), fill=(177, 119, 61, 255))
    for yy in range(4 * TILE + 6, 7 * TILE - 4, 8):
        draw.line((19 * TILE, yy, 23 * TILE - 1, yy), fill=(111, 70, 45, 255), width=2)
    draw.rectangle((23 * TILE, 7 * TILE, 512, 352), fill=SAND)
    draw.rectangle((24 * TILE, 8 * TILE, 512, 352), fill=WATER_DARK)
    draw.rectangle((24 * TILE + 4, 8 * TILE + 4, 512, 352), fill=WATER)
    for x in range(24 * TILE + 10, 500, 34):
        for y in range(8 * TILE + 12, 344, 38):
            draw.line((x, y, min(508, x + 14), y), fill=WATER_LIGHT, width=2)
    draw.rectangle((24 * TILE, 6 * TILE, 27 * TILE, 9 * TILE), fill=INK)
    draw.rectangle((24 * TILE + 3, 6 * TILE, 27 * TILE - 3, 9 * TILE), fill=(154, 98, 56, 255))
    for x in range(24 * TILE + 5, 27 * TILE - 2, 8):
        draw.line((x, 6 * TILE, x, 9 * TILE), fill=(101, 64, 43, 255), width=2)
    draw_ground_details(draw, 245, 150, (12, 20, 300, 336))
    for index, (x, y) in enumerate([(3, 4), (7, 5), (2, 17), (6, 18), (11, 18), (13, 3), (15, 7)]):
        paste_tree(image, x, y, 31 + (index % 3) * 4, apple=index == 2)
    for index, (x, y) in enumerate([(3, 11), (9, 8), (13, 15), (16, 4)]):
        draw_bush(draw, x, y, berry=index == 1)
    for x, y in [(22, 3), (28, 5), (25, 18), (29, 15), (6, 14)]:
        draw_rock(draw, x, y, large=x > 20)
    for x, y in [(25, 11), (28, 9), (27, 19)]:
        draw.arc((x * TILE, y * TILE, x * TILE + 14, y * TILE + 7), 180, 355, fill=(240, 225, 174, 255), width=2)
    save(image, "maps/river-coast.png")


def draw_cliff(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    draw.rectangle(box, fill=ROCK_DARK)
    draw.rectangle((box[0] + 4, box[1] + 4, box[2] - 4, box[3] - 4), fill=ROCK)
    for x in range(box[0] + 8, box[2] - 4, 19):
        draw.line((x, box[1] + 5, x - 6, box[3] - 7), fill=ROCK_LIGHT, width=2)


def generate_mine_map() -> None:
    image = Image.new("RGBA", MAP_SIZE)
    pixel_texture(image, (151, 120, 76, 255), 343)
    draw = ImageDraw.Draw(image)
    draw_path(draw, [(0, 5), (7, 5), (12, 9), (17, 12), (16, 21)], width=32)
    draw_path(draw, [(17, 12), (25, 8), (29, 6)], width=26)
    draw_cliff(draw, (0, 0, 512, 2 * TILE))
    draw_cliff(draw, (11 * TILE, 2 * TILE, 21 * TILE, 7 * TILE))
    draw_cliff(draw, (4 * TILE, 10 * TILE, 9 * TILE, 14 * TILE))
    draw_cliff(draw, (24 * TILE, 10 * TILE, 29 * TILE, 15 * TILE))
    draw.rectangle((13 * TILE, 2 * TILE, 19 * TILE, 7 * TILE), fill=DEEP_INK)
    draw.rectangle((14 * TILE, 3 * TILE, 18 * TILE, 7 * TILE), fill=(34, 35, 36, 255))
    draw.polygon([(14 * TILE, 3 * TILE), (16 * TILE, 2 * TILE), (18 * TILE, 3 * TILE)], fill=ROCK_DARK)
    draw_ground_details(draw, 346, 180, (12, 34, 500, 338))
    for index, (x, y) in enumerate([(3, 2), (27, 2), (2, 14), (29, 17), (11, 18), (22, 18), (8, 8), (21, 8), (15, 15), (27, 8)]):
        draw_rock(draw, x, y, large=index % 2 == 0)
    for x, y, color in [(10, 9, (204, 112, 55, 255)), (22, 8, (112, 151, 160, 255)), (27, 7, (99, 224, 213, 255))]:
        draw.rectangle((x * TILE + 5, y * TILE + 3, x * TILE + 10, y * TILE + 9), fill=color)
        draw.point((x * TILE + 7, y * TILE + 4), fill=(240, 244, 215, 255))
    save(image, "maps/mine-foothill.png")


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    return image, ImageDraw.Draw(image)


def generate_item(name: str) -> None:
    image, draw = canvas()
    if name == "mushroom":
        draw.rectangle((13, 16, 19, 26), fill=INK); draw.rectangle((15, 16, 18, 25), fill=(237, 213, 159, 255))
        draw.rectangle((7, 9, 25, 18), fill=INK); draw.rectangle((9, 7, 23, 16), fill=(192, 69, 55, 255)); draw.rectangle((12, 9, 15, 12), fill=(255, 222, 153, 255))
    elif name == "herb":
        draw.line((16, 27, 16, 10), fill=INK, width=4); draw.line((16, 26, 16, 10), fill=(63, 135, 55, 255), width=2)
        for box in [(6, 11, 16, 18), (16, 7, 25, 14), (7, 19, 16, 25), (16, 16, 26, 23)]:
            draw.ellipse(box, fill=(83, 169, 65, 255), outline=INK)
    elif name == "wild-berry":
        for cx, cy in [(11, 13), (18, 11), (22, 17), (14, 20)]: draw.ellipse((cx - 5, cy - 5, cx + 4, cy + 4), fill=(188, 50, 61, 255), outline=INK)
        draw.line((16, 8, 16, 4), fill=(70, 127, 48, 255), width=3)
    elif name == "fern":
        draw.line((10, 27, 21, 6), fill=INK, width=4); draw.line((11, 26, 21, 7), fill=(75, 153, 62, 255), width=2)
        for step in range(5):
            y = 10 + step * 3; x = 19 - step
            draw.line((x, y, x - 9, y - 3), fill=(97, 177, 70, 255), width=3)
            draw.line((x, y + 2, x + 7, y + 5), fill=(97, 177, 70, 255), width=3)
    elif name == "moon-bloom":
        draw.line((16, 27, 16, 14), fill=(67, 137, 62, 255), width=3)
        for box in [(12, 5, 19, 16), (6, 10, 16, 18), (16, 10, 26, 18), (11, 13, 21, 22)]: draw.ellipse(box, fill=(238, 232, 255, 255), outline=(95, 75, 127, 255))
        draw.rectangle((14, 13, 18, 17), fill=(255, 225, 95, 255))
    elif name in {"stone", "copper-ore", "iron-ore"}:
        ore = {"stone": ROCK_LIGHT, "copper-ore": (208, 115, 55, 255), "iron-ore": (107, 147, 157, 255)}[name]
        draw.polygon([(5, 22), (8, 10), (15, 5), (25, 9), (28, 21), (21, 27), (10, 27)], fill=INK)
        draw.polygon([(8, 21), (10, 11), (16, 8), (23, 11), (25, 20), (20, 24), (11, 24)], fill=ROCK)
        draw.rectangle((12, 12, 17, 16), fill=ore); draw.rectangle((19, 17, 23, 21), fill=ore)
    elif name == "star-crystal":
        draw.polygon([(16, 3), (22, 13), (19, 27), (12, 27), (9, 13)], fill=INK)
        draw.polygon([(16, 6), (20, 14), (18, 24), (13, 24), (11, 14)], fill=(103, 224, 216, 255))
        draw.line((15, 9, 14, 20), fill=(220, 255, 238, 255), width=2)
    save(image, f"items/{name}.png")


def generate_fish(name: str, body: tuple[int, int, int, int], accent: tuple[int, int, int, int]) -> None:
    image, draw = canvas()
    draw.polygon([(5, 16), (1, 10), (1, 22)], fill=INK)
    draw.polygon([(6, 16), (2, 12), (2, 20)], fill=accent)
    draw.ellipse((5, 8, 27, 24), fill=INK)
    draw.ellipse((7, 10, 26, 22), fill=body)
    draw.polygon([(15, 9), (19, 4), (22, 10)], fill=accent)
    draw.rectangle((22, 13, 24, 15), fill=(255, 245, 199, 255))
    draw.point((23, 13), fill=DEEP_INK)
    draw.line((10, 13, 18, 13), fill=accent, width=2)
    save(image, f"fish/{name}.png")


def generate_npc(prefix: str, coat: tuple[int, int, int, int], hat: tuple[int, int, int, int]) -> None:
    for frame in range(2):
        image = Image.new("RGBA", (48, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        offset = frame
        draw.rectangle((12, 15 + offset, 36, 21 + offset), fill=INK)
        draw.rectangle((15, 11 + offset, 33, 19 + offset), fill=hat)
        draw.rectangle((16, 20 + offset, 32, 35 + offset), fill=INK)
        draw.rectangle((18, 21 + offset, 30, 33 + offset), fill=(230, 174, 119, 255))
        draw.point((21, 27 + offset), fill=DEEP_INK); draw.point((27, 27 + offset), fill=DEEP_INK)
        draw.rectangle((14, 34 + offset, 34, 53 + offset), fill=INK)
        draw.rectangle((16, 35 + offset, 32, 51 + offset), fill=coat)
        draw.rectangle((17, 51 + offset, 23, 59 + offset), fill=INK); draw.rectangle((25, 51 + offset, 31, 59 + offset), fill=INK)
        save(image, f"npcs/{prefix}-{frame}.png")


def generate_props() -> None:
    image, draw = canvas()
    draw.rectangle((14, 11, 18, 30), fill=INK); draw.rectangle((15, 12, 17, 29), fill=(120, 73, 43, 255))
    draw.rectangle((4, 5, 28, 17), fill=INK); draw.rectangle((6, 7, 26, 15), fill=(176, 114, 55, 255))
    draw.polygon([(24, 7), (30, 11), (24, 15)], fill=INK); draw.polygon([(24, 9), (28, 11), (24, 13)], fill=(224, 168, 76, 255))
    save(image, "props/travel-post.png")

    image, draw = canvas()
    draw.line((8, 26, 23, 7), fill=INK, width=5); draw.line((9, 25, 22, 8), fill=(137, 84, 45, 255), width=3)
    draw.line((17, 6, 28, 12), fill=INK, width=5); draw.line((18, 7, 27, 11), fill=(143, 155, 153, 255), width=3)
    save(image, "tools/pickaxe.png")


def main() -> None:
    generate_forest_map()
    generate_coast_map()
    generate_mine_map()
    for item in ["mushroom", "herb", "wild-berry", "fern", "moon-bloom", "stone", "copper-ore", "iron-ore", "star-crystal"]:
        generate_item(item)
    fish = {
        "river-trout": ((98, 161, 139, 255), (225, 126, 75, 255)),
        "silver-dace": ((177, 202, 195, 255), (93, 145, 157, 255)),
        "night-eel": ((76, 69, 119, 255), (142, 216, 203, 255)),
        "shore-sardine": ((111, 164, 185, 255), (230, 210, 116, 255)),
        "coral-bream": ((222, 113, 103, 255), (255, 197, 126, 255)),
        "tide-ray": ((74, 120, 144, 255), (174, 228, 214, 255)),
    }
    for name, (body, accent) in fish.items():
        generate_fish(name, body, accent)
    generate_npc("forest-guide", (72, 143, 65, 255), (196, 152, 71, 255))
    generate_npc("mine-keeper", (91, 108, 124, 255), (198, 113, 63, 255))
    generate_props()
    manifest = {
        "version": 1,
        "generator": "scripts/generate-open-world-assets.py",
        "map_size": {"width": 512, "height": 352},
        "logical_tile_size": 16,
        "regions": ["whisper-forest", "river-coast", "mine-foothill"],
        "npcs": ["forest-guide", "mine-keeper"],
        "forage_items": ["mushroom", "herb", "wild-berry", "fern", "moon-bloom"],
        "mine_items": ["stone", "copper-ore", "iron-ore", "star-crystal"],
        "fish": list(fish),
        "transparent_sprites": True,
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"generated Pixel Farm Mini Open World v1 assets in {OUTPUT}")


if __name__ == "__main__":
    main()

"""Rebuild with: python scripts/generate-lavasa-mask.py scripts/fixtures/lavasa-welcome-source.png"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


def squared_distance(values):
    """Felzenszwalb's lower envelope of parabolas, in one dimension."""
    length = len(values)
    sites = np.empty(length, dtype=np.intp)
    boundaries = np.empty(length + 1)
    result = np.empty(length)
    count = 0
    sites[0] = 0
    boundaries[0], boundaries[1] = -np.inf, np.inf
    for position in range(1, length):
        previous = sites[count]
        crossing = ((values[position] + position * position)
                    - (values[previous] + previous * previous)) / (2 * (position - previous))
        while crossing <= boundaries[count]:
            count -= 1
            previous = sites[count]
            crossing = ((values[position] + position * position)
                        - (values[previous] + previous * previous)) / (2 * (position - previous))
        count += 1
        sites[count] = position
        boundaries[count], boundaries[count + 1] = crossing, np.inf
    count = 0
    for position in range(length):
        while boundaries[count + 1] < position:
            count += 1
        result[position] = (position - sites[count]) ** 2 + values[sites[count]]
    return result


def distance_to(seeds):
    # A finite sentinel also handles rows without seed pixels.
    height, width = seeds.shape
    result = np.where(seeds, 0.0, float(width * width + height * height + 1))
    for row in range(height):
        result[row] = squared_distance(result[row])
    for column in range(width):
        result[:, column] = squared_distance(result[:, column])
    return np.sqrt(result)


def generate(source, destination):
    seeds = np.zeros((5, 7), dtype=bool)
    seeds[1, 1] = seeds[4, 6] = True
    y, x = np.indices(seeds.shape)
    expected = np.minimum(np.hypot(x - 1, y - 1), np.hypot(x - 6, y - 4))
    assert np.allclose(distance_to(seeds), expected), "Distance transform must match known Euclidean distances"

    image = Image.open(source).convert("RGBA")
    assert image.size == (1024, 576), "Use the SVG's native 1024 by 576 mask size"
    alpha = np.asarray(image.getchannel("A"), dtype=float) / 255
    if np.min(alpha) == np.max(alpha):
        alpha = np.asarray(image.convert("L"), dtype=float) / 255
    assert np.min(alpha) == 0 and np.max(alpha) == 1, "Supply white glyphs on black or transparency"
    ink = alpha >= .5
    assert np.any(ink) and np.any(~ink), "The source must contain glyphs and background"

    signed = distance_to(ink) - distance_to(~ink) + np.where(ink, .5, -.5)
    edges = (alpha > 0) & (alpha < 1)
    signed[edges] = .5 - alpha[edges]
    assert np.min(signed) >= -64 and np.max(signed) < 448, "Distance range exceeds the RG encoding"

    encoded = (signed + 64) / 2
    red = np.floor(encoded)
    green = np.rint((encoded - red) * 255)
    texture = np.stack((red, green, np.zeros_like(red)), axis=-1).astype(np.uint8)
    decoded = texture[:, :, 0].astype(float) * 2 + texture[:, :, 1].astype(float) * 2 / 255 - 64
    error = float(np.max(np.abs(decoded - signed)))
    assert error < .01, "Encoded distance lost subpixel precision"
    initial = np.clip(.5 - decoded, 0, 1)
    assert np.max(np.abs(initial - alpha)) < .01, "The distance field must preserve initial lettering coverage"
    previous = initial
    for radius in (50, 100, 150, 200, 250, 300):
        grown = np.clip(.5 + radius - decoded, 0, 1)
        assert np.all(grown >= previous), "Growing the mask must never hide existing coverage"
        previous = grown
    assert np.min(previous) == 1, "The existing 600-pixel stroke must reveal the complete landscape"
    assert np.max(decoded) <= 152.5, "The mask must fully cover before the timeline's 0.57 filter handoff"

    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(texture).save(destination, optimize=True)
    print(f"Saved {destination} ({destination.stat().st_size:,} bytes); "
          f"distance {np.min(signed):.3f} to {np.max(signed):.3f}px; max error {error:.6f}px")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="1024x576 white lettering on black or transparency")
    parser.add_argument("output", type=Path, nargs="?",
                        default=Path(__file__).resolve().parents[1] / "public/media/journey/lavasa-welcome-distance.png")
    arguments = parser.parse_args()
    generate(arguments.source, arguments.output)

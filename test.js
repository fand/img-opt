import fs from "node:fs";
import { execSync } from "node:child_process";
import { suite, test, before } from "node:test";
import assert from "node:assert";

import { PNG } from "pngjs";
import JPEG from "jpeg-js";
import pixelmatch from "pixelmatch";

function readImg(path, mode) {
  if (mode === "png") {
    return PNG.sync.read(fs.readFileSync(path));
  } else {
    return JPEG.decode(fs.readFileSync(path));
  }
}

async function testImg(filename, options) {
  const expected = `examples/${filename}`;
  const actual = `test_output/${filename}`;
  const mode = filename.match(/\.png/) ? "png" : "jpg";

  execSync(`node main.js examples/input.jpg ${actual} ${options}`);

  const img1 = readImg(expected, mode);
  const img2 = readImg(actual, mode);

  assert.strictEqual(img1.width, img2.width, "Width mismatch");
  assert.strictEqual(img1.height, img2.height, "Height mismatch");

  const diff = new PNG({ width: img1.width, height: img1.height });
  const numDiffs = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    img1.width,
    img1.height,
    { threshold: 0.1 }
  );

  const diffRatio = numDiffs / (img1.width * img1.height);
  if (diffRatio >= 0.01) {
    fs.writeFileSync(`test_output/${filename}.diff.png`, PNG.sync.write(diff));
  }
  assert(diffRatio < 0.01, `Diff exists: ${numDiffs} pixels.`);
}

suite("img-opt", async () => {
  before(() => {
    fs.mkdirSync("test_output", { recursive: true });
  });

  test("jpg", async () => {
    await testImg("output-75.jpg", "--quality 75");
    await testImg("output-50.jpg", "--quality 50");
    await testImg("output-10.jpg", "--quality 10");

    await testImg("output-50-500w.jpg", "--quality 50 --width 500");
    await testImg("output-50-500h.jpg", "--quality 50 --height 500");
    await testImg(
      "output-50-500wh.jpg",
      "--quality 50 --width 500 --height 500"
    );
  });

  test("png", async () => {
    await testImg("output-1-500w.png", "--quality 1 --width 500");
    await testImg("output-9-500w.png", "--quality 9 --width 500");
  });
});

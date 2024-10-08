#!/usr/bin/env node

const sharp = require("sharp");
const { Command } = require("commander");
const program = new Command();

// CLI options
program
  .argument("<input>", "input image path")
  .argument("<output>", "output image path")
  .option("-o, --output <path>", "output image path")
  .option(
    "-q, --quality <number>",
    "quality (0-100 for JPEG/WebP, 0-9 for PNG)",
    (v) => parseInt(v)
  )
  .option("--width <number>", "resize width", parseInt)
  .option("--height <number>", "resize height", parseInt);

program.addHelpText(
  "after",
  `
Examples:
  $ img-opt input.jpg output.jpg --quality 75 --width 1000
  $ img-opt input.png output.png --width 640 --height 360 --quality 9
  `
);

program.parse(process.argv);
const options = program.opts();

// Check input / output.
const inputFile = program.args[0];
const outputFile = program.args[1];
if (!inputFile || !outputFile) {
  console.error("Error: input and output file paths are required.");
  process.exit(1);
}

// Check format.
if (options.foramt) {
  options.format = options.format.toLowerCase();
} else {
  const m = outputFile.match(/\.(jpg|jpeg|png|webp)/);
  if (m) {
    options.format = m[1].toLowerCase();
  }
}
if (!options.format) {
  console.error("Error: Format not specified. Use jpeg, png, or webp.");
  process.exit(1);
}

if (options.format === "png") {
  if (options.quality == null) {
    options.quality = 9;
  } else {
    options.quality = Math.min(Math.max(options.quality, 0), 9);
  }
} else {
  if (options.quality == null) {
    options.quality = 75;
  } else {
    options.quality = Math.min(Math.max(options.quality, 0), 100);
  }
}

console.log("Options:", options);

let sharpInstance = sharp(inputFile).resize({
  width: options.width || null,
  height: options.height || null,
  fit: "inside", // =contain
});

switch (options.format) {
  case "jpg":
  case "jpeg":
    sharpInstance = sharpInstance.jpeg({
      mozjpeg: true,
      quality: options.quality,
    });
    break;
  case "png":
    sharpInstance = sharpInstance.png({
      compressionLevel: options.quality,
    });
    break;
  case "webp":
    sharpInstance = sharpInstance.webp({
      quality: options.quality,
    });
    break;
  default:
    console.error("Error: Unsupported format. Use jpeg, png, or webp.");
    process.exit(1);
}

sharpInstance
  .toFile(outputFile)
  .then((info) => {
    console.log("Image resized:", info);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });

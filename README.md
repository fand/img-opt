# img-opt

Optimize images on CLI.

## Install

```
npm i -g @fand/img-opt
```

## Usage

```
$ img-opt --help
Usage: img-opt [options] <input> <output>

Arguments:
  input                   input image path
  output                  output image path

Options:
  -o, --output <path>     output image path
  -q, --quality <number>  quality (0-100 for JPEG/WebP, 0-9 for PNG)
  --width <number>        resize width
  --height <number>       resize height
  -h, --help              display help for command

Examples:
  $ img-opt input.jpg output.jpg --quality 75 --width 1000
  $ img-opt input.png output.png --width 640 --height 360 --quality 9
```

## Author

AMAGI (GitHub: [@fand](https://github.com/fand))


## LICENSE

MIT

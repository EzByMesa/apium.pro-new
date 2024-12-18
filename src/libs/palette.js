import {prepared_palette} from "@/libs/color.js";

const buildRgb = (imageData) => {
    const rgbValues = [];
    // note that we are loopin every 4!
    // for every Red, Green, Blue and Alpha
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
        };

        rgbValues.push(rgb);
    }

    return rgbValues;
};

// returns what color channel has the biggest difference
const findBiggestColorRange = (rgbValues) => {
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;

    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;

    rgbValues.forEach((pixel) => {
        rMin = Math.min(rMin, pixel.r);
        gMin = Math.min(gMin, pixel.g);
        bMin = Math.min(bMin, pixel.b);

        rMax = Math.max(rMax, pixel.r);
        gMax = Math.max(gMax, pixel.g);
        bMax = Math.max(bMax, pixel.b);
    });

    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;

    // determine which color has the biggest difference
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
        return "r";
    } else if (biggestRange === gRange) {
        return "g";
    } else {
        return "b";
    }
};

const quantization = (rgbValues, depth) => {
    const MAX_DEPTH = 8;

    // Base case
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
        const color = rgbValues.reduce(
            (prev, curr) => {
                prev.r += curr.r;
                prev.g += curr.g;
                prev.b += curr.b;

                return prev;
            },
            {
                r: 0,
                g: 0,
                b: 0,
            }
        );

        color.r = Math.round(color.r / rgbValues.length);
        color.g = Math.round(color.g / rgbValues.length);
        color.b = Math.round(color.b / rgbValues.length);

        return [color];
    }

    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => {
        return p1[componentToSortBy] - p2[componentToSortBy];
    })

    const mid = rgbValues.length / 2;
    return [
        ...quantization(rgbValues.slice(0, mid), depth + 1),
        ...quantization(rgbValues.slice(mid + 1), depth + 1),
    ]
}

export function cover_palette(src) {
    return new Promise((resolve, reject) => {
        let imgEl = new Image()
        imgEl.src = src
        imgEl.onload = () => {
            let blockSize = 5,
                defaultRGB = { r:0, g:0, b:0 },
                canvas = document.createElement('canvas'),
                context = canvas.getContext && canvas.getContext('2d'),
                data, width, height,
                i = -4,
                length,
                rgb = {r:0,g:0,b:0},
                count = 0

            if (!context) {
                return defaultRGB
            }

            height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height
            width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width

            context.drawImage(imgEl, 0, 0)

            try {
                data = context.getImageData(0, 0, width, height)
            } catch(e) {
                reject(null)
            }

            const rgbArray = buildRgb(data.data);
            const quantColors = quantization(rgbArray, 0);

            let colors = []

            for (let color of quantColors) {
                colors.push("#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b))
            }

            resolve(prepared_palette(colors))
        }
    })
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}




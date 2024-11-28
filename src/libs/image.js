export default function getIMG(file) {
    return new Promise((resolve) => {
        return GetImage(file, function(size){
            resolve(size)
        });
    });
}


function GetImage(file, callback) {
    let image = new Image()
    let objectUrl = URL.createObjectURL(file);
    image.onload = function() {
        URL.revokeObjectURL(this.src)
        return callback(image)
    }
    image.src = objectUrl
}


export function ImageFromBase64(string) {
    return new Promise((resolve) => {
        let image = new Image()
        image.onload = function() {
            resolve(image)
        }
        image.src = 'data:image/png;base64,' + string
    })
}

export function Base64FromImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    img.crossOrigin = 'anonymous';
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
}

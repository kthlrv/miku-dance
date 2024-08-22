// actionFunctions.js

export function showImage(src, startTime, endTime, position, animationClass) {
    const img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.bottom = position.bottom;
    img.style.right = position.right;
    img.classList.add(animationClass);
    document.body.appendChild(img);

    setTimeout(() => {
        img.remove();
    }, (endTime - startTime) * 1000);

    ongoingImages.push({ src, startTime, endTime, position, animationClass });
}

export function changeBackground(type, value, startTime, endTime, retain) {
    if (type === 'color') {
        body.style.backgroundColor = value;
    } else if (type === 'image') {
        body.style.backgroundImage = `url(${value})`;
    }

    if (!retain) {
        setTimeout(() => {
            body.style.backgroundColor = originalColor;
            body.style.backgroundImage = 'none';
        }, (endTime - startTime) * 1000);
    }

    ongoingBackgrounds.push({ type, value, startTime, endTime });
}

export function growMiku(size, interval) {
    clearInterval(intervalId);
    let currentWidth = parseInt(miku.style.width, 10) || 130;
    let currentHeight = parseInt(miku.style.height, 10) || 100;

    previousWidth = currentWidth;
    previousHeight = currentHeight;

    intervalId = setInterval(() => {
        currentWidth += size;
        currentHeight += size;
        miku.style.width = `${currentWidth}px`;
        miku.style.height = `${currentHeight}px`;
    }, interval);
}

export function shrinkMiku(size, interval) {
    clearInterval(intervalId);
    let width = parseInt(miku.style.width, 10);
    let height = parseInt(miku.style.height, 10);

    intervalId = setInterval(() => {
        if (width <= previousWidth && height <= previousHeight) {
            clearInterval(intervalId);
            return;
        }
        width = Math.max(previousWidth, width - size);
        height = Math.max(previousHeight, height - size);
        miku.style.width = `${width}px`;
        miku.style.height = `${height}px`;
    }, interval);
}

export function returnMiku(size) {
    let width = parseInt(miku.style.width, 10);
    let height = parseInt(miku.style.height, 10);

    const shrinkInterval = setInterval(() => {
        if (width <= 130 && height <= 100) {
            clearInterval(shrinkInterval);
            return;
        }
        width = Math.max(130, width - size);
        height = Math.max(100, height - size);
        miku.style.width = `${width}px`;
        miku.style.height = `${height}px`;
    }, 1000);
}
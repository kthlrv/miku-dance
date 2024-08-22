// domUtils.js

export function showText(text, startTime, endTime, position = {}, fontSize) {
    if (ongoingTexts[text]) return;

    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.classList.add('text-element');
    Object.assign(textElement.style, position, {
        fontSize: `${fontSize}px`,
        transform: position.top && position.left ? 'translate(-50%, -50%)' : ''
    });

    ongoingTexts[text] = { element: textElement, startTime, endTime };
    document.body.appendChild(textElement);
}

export function updateTextVisibility(currentTime) {
    Object.entries(ongoingTexts).forEach(([text, { element, startTime, endTime }]) => {
        if (currentTime >= startTime && (!endTime || currentTime < endTime)) {
            if (!document.body.contains(element)) {
                document.body.appendChild(element);
            }
        } else {
            if (document.body.contains(element)) {
                document.body.removeChild(element);
            }
            delete ongoingTexts[text];
        }
    });
}

export function updateProgressBar() {
    const currentTime = audio.currentTime;
    const duration = audio.duration || 0;

    if (duration > 0) {
        progress.style.width = `${(currentTime / duration) * 100}%`;
        durationText.textContent = `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;
    }
}

export function updateBackgrounds(currentTime) {
    body.style.backgroundColor = originalColor;
    body.style.backgroundImage = 'none';

    ongoingBackgrounds = ongoingBackgrounds.filter(bg => {
        const { type, value, startTime, endTime } = bg;
        if (currentTime >= startTime && currentTime < endTime) {
            if (type === 'color') {
                body.style.backgroundColor = value;
            } else if (type === 'image') {
                body.style.backgroundImage = `url(${value})`;
            }
            return true;
        }
        return currentTime < endTime;
    });
}
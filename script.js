import actions from './actions.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const miku = document.getElementById('miku');
    const audio = document.getElementById('audio');
    const progress = document.getElementById('progress');
    const durationText = document.getElementById('duration-text');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const startButton = document.getElementById('start-button');
    const body = document.body;
    
    // Original state
    const originalColor = getComputedStyle(body).backgroundColor;

    // State Management
    let intervalId;
    let previousWidth, previousHeight;
    let ongoingBackgrounds = [];
    let ongoingTexts = {};
    let ongoingImages = [];

    // Utility Functions
    function showImage(src, startTime, endTime, position, animationClass) {
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

    function changeBackground(type, value, startTime, endTime, retain) {
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

    function updateBackgrounds(currentTime) {
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

    function showText(text, startTime, endTime, position = {}, fontSize) {
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

    function updateTextVisibility(currentTime) {
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

    function updateProgressBar() {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 0;

        if (duration > 0) {
            progress.style.width = `${(currentTime / duration) * 100}%`;
            durationText.textContent = `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;
        }
    }

    function growMiku(size, interval) {
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

    function shrinkMiku(size, interval) {
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

    function returnMiku(size) {
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

    // Event Listeners
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        audio.play().then(() => {
            progressBarContainer.classList.remove('hidden');
            progressBarContainer.style.opacity = '1';
        });
    });

    audio.addEventListener('ended', () => {
        shrinkMiku();
        progressBarContainer.classList.remove('visible');
        progressBarContainer.classList.add('hidden');

        setTimeout(() => {
            const link = document.createElement('a');
            link.textContent = 'Click Me!';
            link.href = 'https://www.youtube.com/watch?v=hB8S6oKjiw8';
            link.target = '_blank';
            link.classList.add('click-me-link');
            miku.replaceWith(link);
        }, 5000);
    });

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        updateProgressBar();
        updateActions(currentTime);
        updateTextVisibility(currentTime);
        updateBackgrounds(currentTime);
    });

    // Actions handler
    function updateActions(currentTime) {
        actions.forEach(action => {
            if (currentTime >= action.startTime && !action.done) {
                action.action();
                action.done = true;
            } else if (currentTime < action.startTime) {
                action.done = false;
            }
        });
    }
});
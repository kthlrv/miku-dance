document.addEventListener('DOMContentLoaded', () => {
    const miku = document.getElementById('miku');
    const audio = document.getElementById('audio');
    const progress = document.getElementById('progress');
    const durationText = document.getElementById('duration-text');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const startButton = document.getElementById('start-button');
    const body = document.body;
    const originalColor = getComputedStyle(body).backgroundColor;

    let intervalId;
    let previousWidth, previousHeight;
    let statusBG;

    const actions = [
        { startTime: 1, action: () => changeBackground('image', 'url(img/1.jpg)', 1, 1.5, faltruese), done : false },
        { startTime: 1.5, action: () => changeBackground('image', 'url(img/2.jpg)', 1.5, 2, false), done : false },
        { startTime: 2, action: () => changeBackground('image', 'url(img/3.jpg)', 2, 2.5, true), done : false },
        { startTime: 2.5, action: () => changeBackground('image', 'url(img/4.jpg)', 2.5, 3, false), done : false },

        { startTime: 3, action: () => changeBackground('color', 'orange', 3, 3.5, false), done : false },
        { startTime: 3.5, action: () => changeBackground('color', 'red', 3.5, 4, false), done : false },
        { startTime: 4, action: () => changeBackground('color', 'blue', 4, 4.5, false), done : false },
        { startTime: 4.5, action: () => changeBackground('color', 'red', 4.5, 5, false), done : false },
    ];

    let ongoingBackgrounds = [];
    let ongoingTexts = {};
    let ongoingImages = [];

    function hideElement(element) {
        element.classList.add('hidden');
        element.style.visibility = 'hidden';
    }

    function showElement(element) {
        element.classList.remove('hidden');
        element.style.visibility = 'visible';
    }


    // If you want the background to change to a color or image and stay that way, set keepBackground to true.
    // If you want the background to change temporarily and then revert back, set keepBackground to false.
    function changeBackground(type, value, startTime, endTime, keepBackground) {
        if (type === 'color') {
            body.style.backgroundColor = value;
        } else if (type === 'image') {
            body.style.backgroundImage = `${value}`;
        }
    
        statusBG = keepBackground;
    
        if (!keepBackground) { // REVERT BACK
            const duration = (endTime - startTime) * 1000;
            setTimeout(() => {
                if (type === 'color') {
                    body.style.backgroundColor = originalColor;
                } else if (type === 'image') {
                    body.style.backgroundImage = 'none';
                }
            }, duration);
        }
        // ongoingBackgrounds = ongoingBackgrounds.filter(({ type }) => type !== type);
    }
    
    function updateBackgroundVisibility(currentTime) {
        if (!statusBG) { // Only revert if keepBackground is false
            body.style.backgroundColor = originalColor;
            body.style.backgroundImage = 'none';
        }
    
        ongoingBackgrounds.forEach(({ type, value, startTime, endTime }) => {
            if (currentTime >= startTime && currentTime < endTime) {
                if (type === 'color') {
                    body.style.backgroundColor = value;
                } else if (type === 'image') {
                    body.style.backgroundImage = `${value}`;
                }
            }
        });
    
        ongoingBackgrounds = ongoingBackgrounds.filter(({ endTime }) => currentTime < endTime);
    }

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

        ongoingImages.push({ src, startTime, endTime, position, animationClass, element: img });
    }
    
    function updateImageVisibility(currentTime) {
        ongoingImages = ongoingImages.filter(({ element, startTime, endTime }) => {
            if (currentTime >= startTime && (!endTime || currentTime < endTime)) {
                if (!document.body.contains(element)) {
                    document.body.appendChild(element);
                }
                return true;
            } else {
                if (document.body.contains(element)) {
                    document.body.removeChild(element);
                }
                return false;
            }
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

    function growMiku(size, interval) {
        clearInterval(intervalId);
        let currentWidth = parseInt(miku.style.width) || 130;
        let currentHeight = parseInt(miku.style.height) || 100;

        previousWidth = currentWidth;
        previousHeight = currentHeight;

        intervalId = setInterval(() => {
            miku.style.width = `${(currentWidth += size)}px`;
            miku.style.height = `${(currentHeight += size)}px`;
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
            miku.style.width = `${Math.max(previousWidth, width -= size)}px`;
            miku.style.height = `${Math.max(previousHeight, height -= size)}px`;
        }, interval);
    }
    
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        audio.play().then(() => {
            progressBarContainer.classList.remove('hidden');
            progressBarContainer.style.opacity = '1';
        });
    });

    audio.addEventListener('ended', () => {
        shrinkMiku(20, 30);
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

    function updateProgressBar() {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 0;
    
        if (duration > 0) {
            progress.style.width = `${(currentTime / duration) * 100}%`;
            durationText.textContent = `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;
        }
    }

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        updateProgressBar();
        updateActions(currentTime); 
        updateTextVisibility(currentTime); 
        updateImageVisibility(currentTime);
        // updateBackgroundVisibility(currentTime);
    });

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
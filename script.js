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

    const actions = [
        { startTime: 0, action: () => hideElement(miku), done: false },
        { startTime: 1, action: () => changeBackground('image', 'url(img/static.gif)', 1, 15, false), done: false },
        { startTime: 16, action: () => { showElement(miku); growMiku(3, 1000); }, done: false },

        { startTime: 30, action: () => showText('Spot', 30, 30.5, { bottom: '10%', right: '50%' }, 50), done: false },
        { startTime: 30.5, action: () => showText('light', 30.5, 31, { bottom: '10%', right: '50%' }, 50), done: false },

        { startTime: 31, action: () => showImage('img/miku-dance.gif', 31, 60, {  bottom: '10%', right: '50%' }, 'right-pan'), done: false },

        { startTime: 42, action: () => showText('Say', 42, 42.5, { bottom: '10%', right: '50%' }, 50), done: false },
        { startTime: 42.5, action: () => showText('"I', 42.5, 43, { bottom: '10%', right: '50%' }, 50), done: false },
        { startTime: 43, action: () => showText('want', 43, 43.5, { bottom: '10%', right: '50%' }, 50), done: false },
        { startTime: 43.5, action: () => showText('you', 43.5, 44, { bottom: '10%', right: '50%' }, 50), done: false },
        { startTime: 44, action: () => showText('too!"', 44, 44.5, { bottom: '10%', right: '50%' }, 50), done: false },
        { startTime: 44.5, action: () => showText('<3', 44.5, 45.5, { bottom: '50%', right: '50%' }, 50), done: false },

        { startTime: 44, action: () => hideElement(miku), done: false },
        { startTime: 45.5, action: () => showElement(miku), done: false },

        { startTime: 46, action: () => changeBackground('image', 'url(img/1.jpg)', 46, 46.5, false), done: false },
        { startTime: 46.5, action: () => changeBackground('image', 'url(img/2.jpg)', 46.5, 47, false), done: false },
        { startTime: 47, action: () => changeBackground('image', 'url(img/3.jpg)', 47, 47.5, false), done: false },

        { startTime: 49, action: () => changeBackground('image', 'url(img/4.jpg)', 49, 49.5, false), done: false },
        { startTime: 49.5, action: () => changeBackground('image', 'url(img/5.jpg)', 49.5, 50.5, false), done: false },
        { startTime: 50, action: () => changeBackground('image', 'url(img/6.jpg)', 50.5, 51, false), done: false },
        { startTime: 50.5, action: () => changeBackground('image', 'url(img/7.jpg)', 51, 51.5, false), done: false },
        { startTime: 51, action: () => changeBackground('image', 'url(img/8.jpg)', 51.5, 52, false), done: false },

        { startTime: 53, action: () => growMiku(20, 30), done: false },
        { startTime: 55, action: () => shrinkMiku(20, 30), done: false },
    ];

    function hideElement(element) {
        element.classList.add('hidden');
        element.style.visibility = 'hidden';
    }

    function showElement(element) {
        element.classList.remove('hidden');
        element.style.visibility = 'visible';
    }

    let ongoingBackgrounds = [];
    let ongoingTexts = {};
    let ongoingImages = [];

    function changeBackground(type, value, startTime, endTime, keepBackground) {
        if (type === 'color') {
            body.style.backgroundColor = value;
        } else if (type === 'image') {
            body.style.backgroundImage = value;
        }
    
        if (!keepBackground) {
            const duration = (endTime - startTime) * 1000;
            setTimeout(() => {
                if (type === 'color') {
                    body.style.backgroundColor = originalColor;
                } else if (type === 'image') {
                    body.style.backgroundImage = 'none';
                }
            }, duration);
        }
    
        ongoingBackgrounds.push({ type, value, startTime, endTime });
    }
    
    function updateBackgroundVisibility(currentTime) {
        body.style.backgroundColor = originalColor;
        body.style.backgroundImage = 'none';
    
        ongoingBackgrounds = ongoingBackgrounds.filter(({ type, value, startTime, endTime }) => {
            if (currentTime >= startTime && currentTime < endTime) {
                if (type === 'color') {
                    body.style.backgroundColor = value;
                } else if (type === 'image') {
                    body.style.backgroundImage = value;
                }
                return true;
            }
            return false;
        });
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
        updateBackgroundVisibility(currentTime);
        updateImageVisibility(currentTime);
        re
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
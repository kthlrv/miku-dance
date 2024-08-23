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
        { startTime: 16, action: () => { showElement(miku); growMiku(3, 1000); }, done: false },

        { startTime: 16.5, action: () => { showText('You\'re king of the castle', 16.5, 19.5, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 20.5, action: () => { showText('Whenever you\'re here,', 20.5, 22, { top: '75%', left: '50%' }, 40); }, done: false },
        { startTime: 22, action: () => { showText('you know it feels right.', 22, 24.5, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 24.5, action: () => { showText('Don\'t need to worry,', 24.5, 28.5, { top: '75%', left: '50%' }, 40); }, done: false },
        { startTime: 28.5, action: () => { showText('don\'t need the moon,', 28.5, 29.5, { top: '75%', left: '50%' }, 40); }, done: false },
        { startTime: 29.5, action: () => { showText('I\'ve got you\'re spotlight.', 29.5, 31, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 31, action: () => { showText('I want you to,', 31, 33, { top: '75%', left: '50%' }, 40); }, done: false },
        { startTime: 33, action: () => { showText('do want you want to.', 33, 35, { top: '75%', left: '50%' }, 40); }, done: false },


        { startTime: 35, action: () => { showText('I want you to,', 35, 36.5, { top: '75%', left: '50%' }, 40); }, done: false },
        { startTime: 36.5, action: () => { showText('stay tonight.', 36.5, 39, { top: '75%', left: '50%' }, 40); }, done: false },


        { startTime: 39, action: () => { showText('I want you to,', 39, 42, { top: '75%', left: '50%' }, 40); }, done: false },
        { startTime: 42, action: () => { showText('say "I want you too!"', 42, 44, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 44, action: () => { hideElement(miku); } , done: false },
        { startTime: 44, action: () => { showText(':(', 44, 45.5, { top: '50%', left: '50%' }, 50); }, done: false },
        { startTime: 45.5, action: () => { showElement(miku); growMiku(6, 1000) } , done: false },

        { startTime: 45.5, action: () => { showText('He never wants to strip down to his feelings.', 45.5, 49, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 49, action: () => { showText('He never wants to kiss and close his eyes.', 49, 52.5, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 52.5, action: () => { showText('He never wants to cry.', 52.5, 58, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 58, action: () => { showText('Cry...', 58, 60, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 60, action: () => { showText('I never really know when he\'ll be leaving,', 60, 64, { top: '75%', left: '50%' }, 40); }, done: false },
        { startTime: 64, action: () => { showText('and even with "Hello" I hear "Goodbye."', 60, 68, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 68, action: () => { showText('He always makes me cry.', 68, 73, { top: '75%', left: '50%' }, 40); }, done: false },

        { startTime: 73, action: () => { showText('Cry...', 73, 77, { top: '75%', left: '50%' }, 40); }, done: false },
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
    }
    
    function updateBackgroundVisibility(currentTime) {
        body.style.backgroundColor = originalColor;
        body.style.backgroundImage = 'none';
    
        ongoingBackgrounds.forEach(({ type, value, startTime, endTime }) => {
            if (currentTime >= startTime && currentTime < endTime) {
                if (type === 'color') {
                    body.style.backgroundColor = value;
                } else if (type === 'image') {
                    body.style.backgroundImage = `url('${value}')`;
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
            link.href = 'https://youtu.be/OQEjrrXWsVg?si=WHkDvOHlM0gAl5mJ';
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
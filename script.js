document.addEventListener('DOMContentLoaded', () => {
    const miku = document.getElementById('miku');
    const audio = document.getElementById('audio');
    const progress = document.getElementById('progress');
    const durationText = document.getElementById('duration-text');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const startButton = document.getElementById('start-button');
    const body = document.body;
    const originalColor = getComputedStyle(body).backgroundColor;

    const actions = [
        { startTime: 0, action: () => { miku.classList.add('hidden'); miku.style.visibility = 'hidden' }, done: false },
        { startTime: 1, action: () => changeBackground('image', 'url(img/static.gif)', 1, 15, true), done: false },
        { startTime: 16, action: () => { miku.classList.remove('hidden'); miku.style.visibility = 'visible'; growMiku(); }, done: false },

        { startTime: 30, action: () => showText('Spot', 30, 31, { bottom: '10%', left: '40.4%' }, 30), done: false },
        { startTime: 30.5, action: () => showText('light', 30.5, 31, { bottom: '10%', right: '40.4%' },30), done: false },

        { startTime: 41, action: () => showText('Saying', 41, 43, { bottom: '10%', left: '40.4%' }, 30), done: false },
        { startTime: 41.5, action: () => showText('"I', 41.5, 43, { bottom: '10%', right: '40.4%' }, 30), done: false },
        { startTime: 42, action: () => showText('want', 42, 43, { bottom: '10%', right: '40.4%' }, 30), done: false },
        { startTime: 42.5, action: () => showText('you', 42.5, 43, { bottom: '10%', right: '40.4%' }, 30), done: false },
        { startTime: 43, action: () => showText('too!"', 43, 44, { bottom: '10%', right: '40.4%' },30), done: false },
        { startTime: 44, action: () => showText('<3', 44, 45, { bottom: '50%', right: '50%' }, 50), done: false },

        { startTime: 44, action: () => { miku.style.visibility = 'hidden'; miku.classList.add('hidden'); }, done: false },
        { startTime: 45.5, action: () => { miku.classList.remove('hidden'); miku.style.visibility = 'visible'; }, done: false },

        { startTime: 46, action: () => changeBackground('image', 'url(img/1.jpg)', 46, 46.5, true), done: false },
        { startTime: 46.5, action: () => changeBackground('image', 'url(img/2.jpg)', 46.5, 47, true), done: false },
        { startTime: 47, action: () => changeBackground('image', 'url(img/3.jpg)', 47, 47.5, true), done: false },
    ];

    const ongoingBackgrounds = [];
    const ongoingTexts = {};

    function changeBackground(type, value, startTime, endTime, retain) {
        if (type === 'color') {
            body.style.backgroundColor = value;
        } else if (type === 'image') {
            body.style.backgroundImage = value;
        }

        if (retain) {
            ongoingBackgrounds.push({ type, value, startTime, endTime });
        } else {
            setTimeout(() => {
                if (type === 'color') {
                    body.style.backgroundColor = originalColor;
                } else if (type === 'image') {
                    body.style.backgroundImage = 'none';
                }
            }, (endTime - startTime) * 1000);
        }
    }

    function updateBackgrounds(currentTime) {
        console.log('Updating backgrounds at:', currentTime);
        body.style.backgroundColor = originalColor;
        body.style.backgroundImage = 'none';

        ongoingBackgrounds.forEach((bg) => {
            const { type, value, startTime, endTime } = bg;
            if (currentTime >= startTime && currentTime < endTime) {
                console.log(`Applying background ${type} ${value} from ${startTime} to ${endTime}`);
                if (type === 'color') {
                    body.style.backgroundColor = value;
                } else if (type === 'image') {
                    body.style.backgroundImage = value;
                }
            }
        });

        for (let i = ongoingBackgrounds.length - 1; i >= 0; i--) {
            const { endTime } = ongoingBackgrounds[i];
            if (currentTime >= endTime) {
                console.log(`Removing expired background from ${endTime}`);
                ongoingBackgrounds.splice(i, 1);
            }
        }

        if (ongoingBackgrounds.length > 0) {
            const lastBackground = ongoingBackgrounds[ongoingBackgrounds.length - 1];
            const { type, value } = lastBackground;
            if (type === 'color') {
                body.style.backgroundColor = value;
            } else if (type === 'image') {
                body.style.backgroundImage = value;
            }
        }
    }

    function showText(text, startTime, endTime, position = {}, fontSize) {
        if (ongoingTexts[text]) return; // Prevent creating duplicate text elements
    
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.classList.add('text-element');
        Object.assign(textElement.style, position, {
            fontSize: `${fontSize}px`,
        });
    
        if (position.top && position.left) {
            textElement.style.transform = 'translate(-50%, -50%)';
        }
    
        ongoingTexts[text] = { element: textElement, startTime, endTime }; // Store the endTime
        document.body.appendChild(textElement);
    }
    
    function updateTextVisibility(currentTime) {
        console.log('Updating text visibility at:', currentTime);
        Object.entries(ongoingTexts).forEach(([text, { element, startTime, endTime }]) => {
            if (currentTime >= startTime && (!endTime || currentTime < endTime)) {
                // Show the text if within the specified time range
                if (!document.body.contains(element)) {
                    console.log(`Showing text: ${text}`);
                    document.body.appendChild(element);
                }
            } else {
                // Hide the text if it's not within the time range or after endTime
                if (document.body.contains(element)) {
                    console.log(`Hiding text: ${text}`);
                    document.body.removeChild(element);
                }
                delete ongoingTexts[text]; // Remove from ongoingTexts after hiding
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

    function growMiku() {
        let width = 130;
        let height = 100;

        const growInterval = setInterval(() => {
            if (width >= 230) {
                clearInterval(growInterval);
                return;
            }
            width += 5;
            height += 5;
            miku.style.width = `${width}px`;
            miku.style.height = `${height}px`;
        }, 1000);
    }

    function shrinkMiku() {
        let width = parseInt(miku.style.width, 10);
        let height = parseInt(miku.style.height, 10);

        const shrinkInterval = setInterval(() => {
            if (width <= 130 && height <= 100) {
                clearInterval(shrinkInterval);
                return;
            }
            width -= 5;
            height -= 5;
            miku.style.width = `${width}px`;
            miku.style.height = `${height}px`;
        }, 1000);
    }

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        audio.play().then(() => {
            progressBarContainer.classList.remove('hidden');
            progressBarContainer.style.opacity = '1';
        }).catch(error => {
            console.log('Audio playback failed:', error);
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

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        updateProgressBar();
        updateActions(currentTime);
        updateTextVisibility(currentTime);
        updateBackgrounds(currentTime);
    });
});
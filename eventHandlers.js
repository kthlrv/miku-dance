// eventHandlers.js

export function setupEventListeners({
    miku,
    audio,
    progress,
    durationText,
    progressBarContainer,
    startButton,
    body,
    originalColor,
    intervalId,
    previousWidth,
    previousHeight,
    ongoingBackgrounds,
    ongoingTexts,
    ongoingImages
}) {
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
        updateProgressBar({ progress, durationText, audio });
        updateActions(currentTime, actions, { miku, ongoingBackgrounds, ongoingTexts, ongoingImages });
        updateTextVisibility(currentTime, ongoingTexts);
        updateBackgrounds(currentTime, ongoingBackgrounds, body, originalColor);
    });
}
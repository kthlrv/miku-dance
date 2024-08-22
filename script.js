document.addEventListener('DOMContentLoaded', () => {
    const miku = document.getElementById('miku');
    const audio = document.getElementById('audio');
    const progress = document.getElementById('progress');
    const durationText = document.getElementById('duration-text');

    function updateProgressBar() {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 0;

        if (duration > 0) {
            const progressPercentage = (currentTime / duration) * 100;
            progress.style.width = `${progressPercentage}%`;

            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
            const totalMinutes = Math.floor(duration / 60);
            const totalSeconds = Math.floor(duration % 60).toString().padStart(2, '0');
            durationText.textContent = `${minutes}:${seconds} / ${totalMinutes}:${totalSeconds}`;
        }
    }

    miku.classList.add('hidden');

    function growMiku() {
        const duration = audio.duration;
        const interval = 100;
        let currentTime = 0;

        const growInterval = setInterval(() => {
            currentTime = audio.currentTime;
            if (currentTime >= duration) {
                clearInterval(growInterval);
                return;
            }

            const newWidth = 230 + (currentTime / duration) * 1030;
            const newHeight = 200 + (currentTime / duration) * 1000;

            miku.style.width = `${newWidth}px`;
            miku.style.height = `${newHeight}px`;

            updateProgressBar();
        }, interval);
    }

    audio.addEventListener('play', () => {
        setTimeout(() => {
            miku.classList.remove('hidden');
            growMiku();
        }, 16000);
    });

    audio.addEventListener('ended', () => {
        miku.src = 'miku.gif';
        miku.style.width = '230px';
        miku.style.height = '200px';

        setTimeout(() => {
            const button = document.createElement('button');
            button.textContent = 'Click Me!';
            button.onclick = () => alert('Button clicked!');
            miku.replaceWith(button);
        }, 5000);
    });

    audio.addEventListener('timeupdate', updateProgressBar);

    // Ensure audio tries to play once the page loads, but consider user interaction.
    window.onload = () => {
        audio.play().catch(error => {
            console.log('Autoplay was prevented:', error);
        });
    };
});
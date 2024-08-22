document.addEventListener('DOMContentLoaded', () => {
    const miku = document.getElementById('miku');
    const audio = document.getElementById('audio');
    const progress = document.getElementById('progress');
    const durationText = document.getElementById('duration-text');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const startButton = document.getElementById('start-button');

    // Array of actions with specific times
    const actions = [
        { time: 4, action: () => body.style.backgroundColor = 'blue', done: false },
        { time: 10, action: () => body.style.backgroundColor = 'red', done: false },
        { time: 20, action: () => body.style.backgroundColor = 'green', done: false },
        // Add more actions as needed
    ];

    // Function to update the progress bar and duration text
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

    // Function to make Miku grow gradually over time without a size limit
    function growMiku() {
        let width = 130; // Initial width
        let height = 100; // Initial height

        setInterval(() => {
            width += 1; // Increment width
            height += 1; // Increment height
            miku.style.width = `${width}px`;
            miku.style.height = `${height}px`;
        }, 1000); // Adjust the interval as needed (1000ms = 1 second)
    }

    // Handle start button click
    startButton.addEventListener('click', () => {
        // Hide the start button
        startButton.style.display = 'none';

        // Start the audio
        audio.play().then(() => {
            // Show and fade in the progress bar container
            progressBarContainer.classList.remove('hidden');
            setTimeout(() => {
                progressBarContainer.style.opacity = '1';
            }, 0);

            // After 16 seconds, show Miku
            setTimeout(() => {
                miku.classList.remove('hidden');
            }, 16000); // 16 seconds delay
        }).catch(error => {
            console.log('Audio playback failed:', error);
        });
    });

    // When audio ends, switch to chibi Miku and replace with a button
    audio.addEventListener('ended', () => {
        miku.src = 'miku.gif';
        miku.style.width = '130px';
        miku.style.height = '100px';

        setTimeout(() => {
            const button = document.createElement('button');
            button.textContent = 'Click Me!';
            button.onclick = () => alert('Button clicked!');
            miku.replaceWith(button);
        }, 5000); // 5 seconds delay
    });

    // Update progress bar as the audio plays
    audio.addEventListener('timeupdate', () => {
        updateProgressBar();

        // Check for specific times and perform actions
        actions.forEach(actionObj => {
            console.log(`Checking action for time: ${actionObj.time}, current time: ${Math.floor(audio.currentTime)}`);
            if (!actionObj.done && Math.floor(audio.currentTime) === actionObj.time) {
                console.log(`Performing action at time: ${actionObj.time}`);
                actionObj.action();
                actionObj.done = true; // Mark the action as done
            }
        });
    });
});
import { changeBackground, showText } from './main.js';

const actions = [
    // Hide Miku at the start
    { startTime: 0, action: () => { miku.classList.add('hidden'); miku.style.visibility = 'hidden'; }, done: false },

    // Change background image at specified times
    { startTime: 1, action: () => changeBackground('image', 'url(img/static.gif)', 1, 15, false), done: false },

    // Show Miku and start growing animation
    { startTime: 16, action: () => { miku.classList.remove('hidden'); miku.style.visibility = 'visible'; growMiku(3, 1000); }, done: false },

    // Show text elements
    { startTime: 30, action: () => showText('Spot', 30, 30.5, { bottom: '10%', right: '50%' }, 50), done: false },
    { startTime: 30.5, action: () => showText('light', 30.5, 31, { bottom: '10%', right: '50%' }, 50), done: false },

    // Sequential text display with clear intervals
    { startTime: 42, action: () => showText('Say', 42, 42.5, { bottom: '10%', right: '50%' }, 50), done: false },
    { startTime: 42.5, action: () => showText('"I', 42.5, 43, { bottom: '10%', right: '50%' }, 50), done: false },
    { startTime: 43, action: () => showText('want', 43, 43.5, { bottom: '10%', right: '50%' }, 50), done: false },
    { startTime: 43.5, action: () => showText('you', 43.5, 44, { bottom: '10%', right: '50%' }, 50), done: false },
    { startTime: 44, action: () => showText('too!"', 44, 44.5, { bottom: '10%', right: '50%' }, 50), done: false },
    { startTime: 44.5, action: () => showText('<3', 44.5, 45.5, { bottom: '50%', right: '50%' }, 50), done: false },

    // Hide Miku and show it again at different times
    { startTime: 45.5, action: () => { miku.classList.remove('hidden'); miku.style.visibility = 'visible'; }, done: false },

    // Change background images in sequence
    { startTime: 46, action: () => changeBackground('image', 'url(img/1.jpg)', 46, 46.5, true), done: false },
    { startTime: 46.5, action: () => changeBackground('image', 'url(img/2.jpg)', 46.5, 47, true), done: false },
    { startTime: 47, action: () => changeBackground('image', 'url(img/3.jpg)', 47, 47.5, true), done: false },

    { startTime: 49, action: () => changeBackground('image', 'url(img/4.jpg)', 49, 49.5, true), done: false },
    { startTime: 49.5, action: () => changeBackground('image', 'url(img/5.jpg)', 49.5, 50.5, true), done: false },
    { startTime: 50, action: () => changeBackground('image', 'url(img/6.jpg)', 50.5, 51, true), done: false },
    { startTime: 50.5, action: () => changeBackground('image', 'url(img/7.jpg)', 51, 51.5, true), done: false },
    { startTime: 51, action: () => changeBackground('image', 'url(img/8.jpg)', 51.5, 52, true), done: false },

    // Grow and shrink Miku
    { startTime: 53, action: () => growMiku(20, 30), done: false },
    { startTime: 56, action: () => shrinkMiku(20, 30), done: false },
];

export default actions;
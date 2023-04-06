(() => {
    // Dark mode
    const darkmode = document.getElementById('darkMode');

    darkmode.addEventListener('click', () => {
        if (!document.body.hasAttribute('data-theme', 'dark')) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme', 'dark');
        }
    });
    
    
    // title animation
    const title = baffle(document.querySelector('.gt_title'))
    title.set({
        characters: '▒▒░ <▒▒░▓ █▒▓░▓ ██▓ ░█░▒▒ █>▒▒ ░░▒ ▓▓█< ▒▒░▓',
        speed: 38,
    });
    title.start();
    title.reveal(2000);
    title.stop()
})()
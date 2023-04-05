(() => {
    // Dark mode
    const darkmode = document.getElementById('darkMode');

    let clickable = true
    darkmode.addEventListener('click', () => {
        if (clickable) {
            document.body.setAttribute('data-theme', 'dark');
            clickable = false
        } else {
            document.body.removeAttribute('data-theme', 'dark');
            clickable = true
        }
        if(document.querySelector('body').data-theme === 'dark'){
            document.body.classList.add("dark");
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
(() => {
    const title = baffle(document.querySelector('.gt_title'))
    title.set({
        characters: '▒▒░ <▒▒░▓ █▒▓░▓ ██▓ ░█░▒▒ █>▒▒ ░░▒ ▓▓█< ▒▒░▓',
        speed: 38,
    });
    title.start();
    title.reveal(2000);
    title.stop()
})()
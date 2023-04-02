(() => {
    const title = baffle(document.querySelector('.gt_title'))
    title.set({
        characters: '▒▒░ <▒▒░▓ █▒▓░▓ ██▓ ░█░▒▒ █>▒▒ ░░▒ ▓▓█< ▒▒░▓',
        speed: 50,
    });
    title.start();
    title.reveal(4000);
    title.stop()
})()
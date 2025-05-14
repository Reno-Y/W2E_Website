document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('background-video');
    const playButton = document.getElementById('play-button');
    const content = document.getElementById('content');
    const logo = document.getElementById('logo');


    logo.addEventListener('click', function()
    {

        logo.classList.add('logo-growing');
        video.play()

    });

    playButton.addEventListener('click', function()
    {

        video.play();
        videoContainer.classList.add('background');
        setTimeout(function() {
            content.classList.add('visible');
        }, 500);
        playButton.style.display = 'none';

    });
});
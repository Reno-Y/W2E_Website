document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('background-video');
    const playButton = document.getElementById('play-button');
    const content = document.getElementById('content');

    playButton.addEventListener('click', function() {
        // Lancer la vidéo
        video.play();

        // Passer la vidéo en arrière-plan
        videoContainer.classList.add('background');

        // Afficher le contenu principal
        setTimeout(function() {
            content.classList.add('visible');
        }, 500);

        // Masquer le bouton
        playButton.style.display = 'none';
    });
});



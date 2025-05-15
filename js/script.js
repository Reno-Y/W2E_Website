document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const content = document.getElementById('content');
    const logo = document.getElementById('logo');
    const header = document.querySelector('header');
    const menuIcon = document.getElementById('menu-icon');
    const menuIconBlue = document.getElementById('menu-icon-blue');

    video.pause();
    video.loop = true;

    // Gestion de l'affichage du menu au survol
    if (menuIcon && menuIconBlue) {
        // Afficher le menu et l'icône bleue au survol de l'icône blanche
        menuIcon.addEventListener('mouseenter', function() {
            header.classList.add('visible');
            menuIcon.style.display = 'none';
            menuIconBlue.style.display = 'block';
        });

        // Lorsqu'on quitte l'icône bleue
        menuIconBlue.addEventListener('mouseleave', function() {
            // Ne masquer le header que si on n'est pas en train de le survoler lui-même
            setTimeout(() => {
                if (!header.matches(':hover')) {
                    header.classList.remove('visible');
                    menuIcon.style.display = 'block';
                    menuIconBlue.style.display = 'none';
                }
            }, 200);
        });

        // Gérer le cas où le curseur passe du menu-icon au header
        header.addEventListener('mouseleave', function() {
            header.classList.remove('visible');
            menuIcon.style.display = 'block';
            menuIconBlue.style.display = 'none';
        });

        header.addEventListener('mouseenter', function() {
            header.classList.add('visible');
            menuIcon.style.display = 'none';
            menuIconBlue.style.display = 'block';
        });
    }

    if (logo) {
        logo.addEventListener('click', function() {
            video.muted = false;
            video.play();
            logo.classList.add('logo-growing');

            setTimeout(function() {
                logo.style.display = 'none';
                content.classList.add('visible');
                document.body.classList.add('scrollable');
            }, 950);
            menuIcon.style.display = 'block';
        });
    } else {
        console.error('Logo element not found!');
    }
});
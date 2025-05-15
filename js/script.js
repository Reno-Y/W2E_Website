document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const content = document.getElementById('content');
    const logo = document.getElementById('logo');
    const header = document.querySelector('header');
    const menuIcon = document.getElementById('menu-icon');
    const menuIconBlue = document.getElementById('menu-icon-blue');
    const footer = document.querySelector('footer');


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
                menuIcon.style.display = 'block';
            }, 950);

        });
    } else {
        console.error('Logo element not found!');
    }


    // Fonction qui vérifie si on est en bas de page
    function checkScroll() {
        // On calcule la position actuelle du scroll
        let scrollPosition = window.innerHeight + window.scrollY;
        // On calcule la hauteur totale de la page
        let bodyHeight = document.body.offsetHeight;

        // Si on est proche du bas (dans les 50 pixels du bas)
        if (bodyHeight - scrollPosition < 50) {
            footer.style.display = 'block';
        } else {
            footer.style.display = 'none';
        }
    }

    // Masquer le footer initialement
    footer.style.display = 'none';

    // Écouter l'événement de défilement
    window.addEventListener('scroll', checkScroll);

    // Aussi vérifier lors du redimensionnement de la fenêtre
    window.addEventListener('resize', checkScroll);
});
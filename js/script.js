document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const video = document.getElementById('background-video');
    const content = document.getElementById('content');
    const logo = document.getElementById('logo');
    const logo_right = document.getElementById('logo-right');

    // Sélection des icônes de menu (avec fallback pour différents ID)
    const menuIcon = document.getElementById('menu-icon')
    const menuIconBlue = document.getElementById('menu-icon-blue')

    // Vérifier si nous sommes sur la page d'accueil ou une autre page
    const isHomePage = !!logo;


    // Si nous ne sommes pas sur la page d'accueil, rendre le body scrollable et le footer visible immédiatement
    if (!isHomePage) {
        document.body.classList.add('scrollable');
        if (footer) footer.classList.add('visible');
        if (menuIcon) menuIcon.style.display = 'block';
    }

    // Gestion du menu pour toutes les pages
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

    // Animation spécifique à la page d'accueil
    if (isHomePage && video) {
        video.pause();
        video.loop = true;
        logo_right.style.display = 'none'; // Cacher le logo droit au début


        logo.addEventListener('click', function() {
            video.muted = false;
            video.play();
            logo.classList.add('logo-growing');

            setTimeout(function() {
                logo.style.display = 'none';
                content.classList.add('visible');
                document.body.classList.add('scrollable');
                menuIcon.style.display = 'block';
                footer.classList.add('visible');
                logo_right.style.display = 'block'; // Afficher le logo droit
            }, 950);
        });
    }

    // Création de l'overlay pour les images agrandies
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Ajout du bouton de fermeture
    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;'; // Symbole X
    overlay.appendChild(closeBtn);

    // Image dans l'overlay
    const overlayImg = document.createElement('img');
    overlay.appendChild(overlayImg);

    // Ajouter des événements click à toutes les images de la galerie
    const galleryImages = document.querySelectorAll('.item img');

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            overlayImg.src = this.src;
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Empêcher le défilement
        });
    });

    // Fermer l'overlay en cliquant sur le bouton X ou sur l'overlay
    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    // Fermer avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            closeOverlay();
        }
    });

    function closeOverlay() {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Réactiver le défilement
    }
});
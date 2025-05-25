document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const video = document.getElementById('background-video');
    const content = document.getElementById('content');
    const logo = document.getElementById('logo');


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
    // Si nous sommes sur la page d'accueil
    else {
        // Vérifier si c'est la première visite ou si l'utilisateur revient
        const hasSeenAnimation = sessionStorage.getItem('animationPlayed') === 'true';

        // Configuration de base pour la page d'accueil
        if (video) {
            video.pause();
            video.loop = true;
        }

        // Définir l'état initial des éléments
        if (content) content.style.display = 'none';
        if (footer) footer.classList.remove('visible');

        // Si l'utilisateur a déjà vu l'animation pendant cette session
        if (hasSeenAnimation) {
            // Aller directement au contenu
            if (logo) logo.style.display = 'none';
            if (content) {
                content.style.display = 'block';
                content.classList.add('visible');
            }
            if (video) {
                video.muted = false;
                video.play();
            }
            document.body.classList.add('scrollable');
            if (menuIcon) menuIcon.style.display = 'block';
            if (footer) footer.classList.add('visible');
        }
        // Si c'est la première visite
        else {
            // Afficher le logo et attendre le clic
            if (logo) {
                logo.style.display = 'block';

                // Ajouter l'événement de clic pour l'animation du logo
                logo.addEventListener('click', function() {
                    // Jouer l'animation du logo
                    this.classList.add('logo-growing');

                    // Jouer la vidéo
                    if (video) {
                        video.muted = false;
                        video.play();
                    }

                    // Après l'animation, afficher le contenu
                    setTimeout(function() {
                        if (logo) logo.style.display = 'none';
                        if (content) {
                            content.style.display = 'block';
                            content.classList.add('visible');
                        }
                        document.body.classList.add('scrollable');
                        if (menuIcon) menuIcon.style.display = 'block';
                        if (footer) footer.classList.add('visible');

                        // Marquer l'animation comme vue pour cette session
                        sessionStorage.setItem('animationPlayed', 'true');
                    }, 950);
                });
            }
        }
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

        // Gérer le cas où le curseur passe du menu icon au header
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

    // Gestion de la galerie d'images
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

    // Filtrage des images par catégorie dans la galerie
    const categoryButtons = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-container .item');

    if (categoryButtons.length > 0 && galleryItems.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Mise à jour de la classe active
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                galleryItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});


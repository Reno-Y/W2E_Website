document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const video = document.getElementById('background-video');
    const content = document.getElementById('content');
    const logo = document.getElementById('logo');
    const muteButton = document.getElementById('mute-button');
    const volumeSlider = document.getElementById('volume-slider');
    const soundOn = document.querySelector('.sound-on');
    const soundOff = document.querySelector('.sound-off');

    // Sélection des icônes de menu (avec fallback pour différents ID)
    const menuIcon = document.getElementById('menu-icon')
    const menuIconBlue = document.getElementById('menu-icon-blue')

    // Fonction pour gérer les contrôles audio
    function setupAudioControls() {
        if (video && muteButton && volumeSlider) {
            // Définir le volume initial
            video.volume = volumeSlider.value;

            // Gérer le clic sur le bouton mute
            muteButton.addEventListener('click', function() {
                if (video.muted) {
                    video.muted = false;
                    soundOn.style.display = 'inline';
                    soundOff.style.display = 'none';
                } else {
                    video.muted = true;
                    soundOn.style.display = 'none';
                    soundOff.style.display = 'inline';
                }
            });

            // Gérer le changement de volume
            volumeSlider.addEventListener('input', function() {
                video.volume = this.value;
                // Si le volume est à 0, on considère que c'est muet
                if (parseFloat(this.value) === 0) {
                    video.muted = true;
                    soundOn.style.display = 'none';
                    soundOff.style.display = 'inline';
                } else if (video.muted) {
                    video.muted = false;
                    soundOn.style.display = 'inline';
                    soundOff.style.display = 'none';
                }
            });
        }
    }

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

    // Initialiser les contrôles audio
    setupAudioControls();

    // ---- CODE DE GESTION DES BILLETS (TICKETS) ----

    // Éléments des étapes
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const confirmation = document.getElementById('confirmation');

    // Boutons de navigation
    const selectConcertButtons = document.querySelectorAll('.select-concert-btn');
    const backToStep1Button = document.getElementById('back-to-step1');
    const goToStep3Button = document.getElementById('go-to-step3');
    const backToStep2Button = document.getElementById('back-to-step2');
    const backToHomeButton = document.getElementById('back-to-home');

    // Variables pour stocker les informations de la réservation
    let selectedConcert = null;

    // Prix des types de billets
    const ticketPrices = {
        'standard': { 1: 44.99, 2: 39.99, 3: 42.99, 4: 47.99, 5: 39.99, 6: 29.99}, // Prix standard par concert
        'vip': { 1: 84.99, 2: 74.99, 3: 80, 4: 89.99, 5 : 89.99,6 : 69.99},      // Prix VIP
        'early': { 1: 59.99, 2: 54.99, 3: 57, 4: 62.99 ,5 : 69.99, 6:49.99}     // Prix Early Entry
    };

    // Données des concerts (correspondant aux data-concert-id)
    const concertData = {
        1: { date: '26 Juin 2025', location: 'Paris, France', venue: 'L\'Olympia' },
        2: { date: '29 Juin 2025', location: 'Lyon, France', venue: 'Le Transbordeur' },
        3: { date: '2 Juillet 2025', location: 'Marseille, France', venue: 'Le Dôme' },
        4: { date: '5 Juillet 2025', location: 'Bruxelles, Belgique', venue: 'Ancienne Belgique'},
        5 : { date: '15 Août 2025', location : 'Tokyo, Japon', venue : 'Tokyo Dome City Hall' },
        6 : {date: '22 Août 2025', location: 'Séoul, Corée du Sud', venue: 'Blue Square' }
    };

    // Vérifier si les éléments de billetterie existent avant d'ajouter des écouteurs d'événements
    if (selectConcertButtons.length > 0) {
        // Étape 1: Sélection du concert
        selectConcertButtons.forEach(button => {
            button.addEventListener('click', function() {
                const concertCard = this.closest('.concert-card');
                selectedConcert = concertCard.dataset.concertId;

                // Masquer l'étape 1 et afficher l'étape 2
                if (step1 && step2) {
                    step1.classList.add('hidden');
                    step2.classList.remove('hidden');
                }
            });
        });
    }

    // Retour à l'étape 1
    if (backToStep1Button && step1 && step2) {
        backToStep1Button.addEventListener('click', function() {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        });
    }

    // Aller à l'étape 3
    if (goToStep3Button && step2 && step3) {
        goToStep3Button.addEventListener('click', function() {
            // Vérifier si le formulaire est valide
            const form = document.getElementById('ticket-form');
            if (!form || !form.checkValidity()) {
                if (form) form.reportValidity();
                return;
            }

            // Récupérer les données du formulaire
            const quantity = document.getElementById('ticket-quantity').value;
            const ticketType = document.getElementById('ticket-type').value;

            // Calcul du prix total
            const pricePerTicket = ticketPrices[ticketType][selectedConcert];
            const totalPrice = pricePerTicket * quantity;

            // Afficher le récapitulatif
            const concertSummary = document.getElementById('concert-summary');
            if (concertSummary) {
                concertSummary.innerHTML = `
                    <p><strong>Concert:</strong> ${concertData[selectedConcert].date} - ${concertData[selectedConcert].location}</p>
                    <p><strong>Lieu:</strong> ${concertData[selectedConcert].venue}</p>
                `;
            }

            const ticketSummary = document.getElementById('ticket-summary');
            if (ticketSummary) {
                ticketSummary.innerHTML = `
                    <p><strong>Billets:</strong> ${quantity} x ${getTicketTypeName(ticketType)} (${pricePerTicket}€ par billet)</p>
                `;
            }

            const totalPriceEl = document.getElementById('total-price');
            if (totalPriceEl) {
                totalPriceEl.innerHTML = `
                    <p><strong>Total:</strong> ${totalPrice}€</p>
                `;
            }

            // Masquer l'étape 2 et afficher l'étape 3
            step2.classList.add('hidden');
            step3.classList.remove('hidden');
        });
    }

    // Retour à l'étape 2
    if (backToStep2Button && step2 && step3) {
        backToStep2Button.addEventListener('click', function() {
            step3.classList.add('hidden');
            step2.classList.remove('hidden');
        });
    }

    // Confirmation du paiement
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm && step3 && confirmation) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simuler une vérification de paiement
            setTimeout(function() {
                // Récupérer les informations pour la confirmation
                const firstName = document.getElementById('firstname').value;
                const lastName = document.getElementById('lastname').value;
                const quantity = document.getElementById('ticket-quantity').value;
                const ticketType = document.getElementById('ticket-type').value;

                // Afficher les détails de confirmation
                const confirmationDetails = document.getElementById('confirmation-details');
                if (confirmationDetails) {
                    confirmationDetails.innerHTML = `
                        <p>Nom: ${firstName} ${lastName}</p>
                        <p>Concert: ${concertData[selectedConcert].date} - ${concertData[selectedConcert].venue}</p>
                        <p>Billets: ${quantity} x ${getTicketTypeName(ticketType)}</p>
                        <p>Un email de confirmation a été envoyé à votre adresse.</p>
                    `;
                }

                // Masquer l'étape 3 et afficher la confirmation
                step3.classList.add('hidden');
                confirmation.classList.remove('hidden');
            }, 1500);
        });
    }

    // Retour à l'accueil
    if (backToHomeButton) {
        backToHomeButton.addEventListener('click', function() {
            window.location.href = '../html/index.html';
        });
    }

    // Fonction utilitaire pour obtenir le nom du type de billet
    function getTicketTypeName(type) {
        switch(type) {
            case 'standard':
                return 'Standard';
            case 'vip':
                return 'VIP (accès backstage)';
            case 'early':
                return 'Early Entry';
            default:
                return type;
        }
    }

    // Validation des champs de carte bancaire
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 16) {
                value = value.slice(0, 16);
            }
            // Formater avec des espaces tous les 4 chiffres
            this.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        });
    }

    const expiryDate = document.getElementById('expiry-date');
    if (expiryDate) {
        expiryDate.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 4) {
                value = value.slice(0, 4);
            }
            if (value.length > 2) {
                this.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                this.value = value;
            }
        });
    }

    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 3) {
                value = value.slice(0, 3);
            }
            this.value = value;
        });
    }
});

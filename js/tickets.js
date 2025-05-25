document.addEventListener('DOMContentLoaded', function() {
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
        'standard': { 1: 45, 2: 40, 3: 42, 4: 47 }, // Prix standard par concert
        'vip': { 1: 85, 2: 75, 3: 80, 4: 90 },      // Prix VIP
        'early': { 1: 60, 2: 55, 3: 57, 4: 62 }     // Prix Early Entry
    };

    // Données des concerts (correspondant aux data-concert-id)
    const concertData = {
        1: { date: '26 Juin 2025', location: 'Paris, France', venue: 'L\'Olympia' },
        2: { date: '29 Juin 2025', location: 'Lyon, France', venue: 'Le Transbordeur' },
        3: { date: '2 Juillet 2025', location: 'Marseille, France', venue: 'Le Dôme' },
        4: { date: '5 Juillet 2025', location: 'Bruxelles, Belgique', venue: 'Ancienne Belgique' }
    };

    // Étape 1: Sélection du concert
    selectConcertButtons.forEach(button => {
        button.addEventListener('click', function() {
            const concertCard = this.closest('.concert-card');
            selectedConcert = concertCard.dataset.concertId;

            // Masquer l'étape 1 et afficher l'étape 2
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });
    });

    // Retour à l'étape 1
    backToStep1Button.addEventListener('click', function() {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
    });

    // Aller à l'étape 3
    goToStep3Button.addEventListener('click', function() {
        // Vérifier si le formulaire est valide
        const form = document.getElementById('ticket-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Récupérer les données du formulaire
        const quantity = document.getElementById('ticket-quantity').value;
        const ticketType = document.getElementById('ticket-type').value;

        // Calcul du prix total
        const pricePerTicket = ticketPrices[ticketType][selectedConcert];
        const totalPrice = pricePerTicket * quantity;

        // Afficher le récapitulatif
        document.getElementById('concert-summary').innerHTML = `
            <p><strong>Concert:</strong> ${concertData[selectedConcert].date} - ${concertData[selectedConcert].location}</p>
            <p><strong>Lieu:</strong> ${concertData[selectedConcert].venue}</p>
        `;

        document.getElementById('ticket-summary').innerHTML = `
            <p><strong>Billets:</strong> ${quantity} x ${getTicketTypeName(ticketType)} (${pricePerTicket}€ par billet)</p>
        `;

        document.getElementById('total-price').innerHTML = `
            <p><strong>Total:</strong> ${totalPrice}€</p>
        `;

        // Masquer l'étape 2 et afficher l'étape 3
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
    });

    // Retour à l'étape 2
    backToStep2Button.addEventListener('click', function() {
        step3.classList.add('hidden');
        step2.classList.remove('hidden');
    });

    // Confirmation du paiement
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();

        // Simuler une vérification de paiement
        setTimeout(function() {
            // Récupérer les informations pour la confirmation
            const firstName = document.getElementById('firstname').value;
            const lastName = document.getElementById('lastname').value;
            const quantity = document.getElementById('ticket-quantity').value;
            const ticketType = document.getElementById('ticket-type').value;

            // Afficher les détails de confirmation
            document.getElementById('confirmation-details').innerHTML = `
                <p>Nom: ${firstName} ${lastName}</p>
                <p>Concert: ${concertData[selectedConcert].date} - ${concertData[selectedConcert].venue}</p>
                <p>Billets: ${quantity} x ${getTicketTypeName(ticketType)}</p>
                <p>Un email de confirmation a été envoyé à votre adresse.</p>
            `;

            // Masquer l'étape 3 et afficher la confirmation
            step3.classList.add('hidden');
            confirmation.classList.remove('hidden');
        }, 1500);
    });

    // Retour à l'accueil
    backToHomeButton.addEventListener('click', function() {
        window.location.href = '../html/index.html';
    });

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
                value = value.substr(0, 16);
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
                value = value.substr(0, 4);
            }
            if (value.length > 2) {
                this.value = value.substr(0, 2) + '/' + value.substr(2);
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
                value = value.substr(0, 3);
            }
            this.value = value;
        });
    }
});


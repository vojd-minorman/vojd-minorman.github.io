// Menu Bar
const body = document.querySelector('body');
const menubar = body.querySelector('.menu-bar');
const toggle = body.querySelector('.icone');

function toggleMenubar() {
    menubar.classList.toggle('close');
}

toggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Empêche le clic sur l'icône de se propager et de fermer immédiatement le menu
    toggleMenubar();
});

// Fermer le menu en cliquant en dehors
document.addEventListener("click", (e) => {
    if (!menubar.contains(e.target) && !toggle.contains(e.target)) {
        menubar.classList.remove('close');
    }
});

// Empêche la fermeture du menu lorsque l'on clique à l'intérieur de celui-ci
menubar.addEventListener("click", (e) => {
    e.stopPropagation();
});




// Tableau pour stocker les contacts
let contacts = [];
console.log(contacts);

// Variable globale pour stocker le libellé sélectionné
let selectedLabel = '';

// Variable globale pour stocker les libellés avec des données factices à titre d'exemple
const labels = [];
console.log(labels);
function updateContactCount() {
    const contactCountSpan = document.getElementById('contactCount');
    contactCountSpan.textContent = contacts.length;
}

// Fonction pour sauvegarder un contact
function saveContact(contact = null, index = null, mode = 'ajout') {
    // Récupérer les valeurs du formulaire
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const company = document.getElementById('company').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const label = selectedLabel;

    // Créer un objet contact avec les valeurs du formulaire
    const newContact = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        company: company,
        jobTitle: jobTitle,
        label: label
    };

    if (mode === 'modification' && index !== null) {
        // Mettre à jour le contact existant avec les nouvelles données
        contacts[index] = newContact;
    } else {
        // Ajouter un nouveau contact à la liste
        contacts.push(newContact);
    }

    // Actualiser l'affichage des contacts
    displayContacts();

    // Mettre à jour le nombre de contacts
    updateContactCount();

    // Afficher les détails du contact dans la page principale
    const detailsHTML = `
        <div class="contact-details">
            <h2>Détails du Contact</h2>
            <p><strong>Prénom:</strong> ${firstName}</p>
            <p><strong>Nom:</strong> ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Téléphone:</strong> ${phone}</p>
            <p><strong>Entreprise:</strong> ${company}</p>
            <p><strong>Fonction:</strong> ${jobTitle}</p>
            <p><strong>Label:</strong> ${label}</p>
        </div>
    `;

    // Injecter les détails du contact dans la page principale
    const content = document.querySelector('.principale');
    content.innerHTML = detailsHTML;
}


function initializeLabelPopover(bodyContactLibelleDiv, btnLibelle) {
    const popoverDiv = document.createElement('div');
    popoverDiv.classList.add('popoverLabel');
    bodyContactLibelleDiv.appendChild(popoverDiv);

    labels.forEach(label => {
        const link = document.createElement('a');
        link.href = '#';
        link.innerHTML = `<p><i class="uil uil-label"></i> ${label} </p>`;
        popoverDiv.appendChild(link);

        link.addEventListener('click', (e) => {
            e.preventDefault();
            selectedLabel = label;
            btnLibelle.innerHTML = `<i class="fa fa-plus"></i> ${label}`;
            popoverDiv.style.display = 'none';
        });
    });
}


function displayContacts() {
    const content = document.querySelector('.principale');
    content.innerHTML = `
        <div class="contactInfos page" id="page1">
            <div class="contact-titre">
                <h1>Contacts</h1>
                <span>(${contacts.length})</span>
            </div>
        </div>
    `;

    const divTables = document.createElement('div');
    divTables.classList.add('contact-tableau');
    divTables.style.width = '100%';
    divTables.style.borderCollapse = 'collapse';
    content.appendChild(divTables);

    const contactsTable = document.createElement('table');
    contactsTable.style.width = '100%';
    contactsTable.style.borderCollapse = 'collapse';
    contactsTable.style.tableLayout = 'fixed';
    divTables.appendChild(contactsTable);

    const contactsTableHead = document.createElement('thead');
    contactsTable.appendChild(contactsTableHead);

    const headRow = document.createElement('tr');
    contactsTableHead.appendChild(headRow);

    const headings = ['Titre', 'Email', 'Numéro de téléphone', 'Fonction et entreprise', 'Libellé', ''];

    headings.forEach((headingText, index) => {
        const th = document.createElement('th');
        th.textContent = headingText;
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        th.style.borderBottom = '1px solid #ddd';
        th.style.fontWeight = '400';
        th.style.fontSize = '0.9rem';
        th.style.width = '20%'; // Fixer la largeur des colonnes du tableau
        
        if (window.innerWidth <= 768 && index !== 0) {
            th.classList.add('hidden-on-small-screen'); // Ajouter la classe pour masquer sur les petits écrans
        }

        headRow.appendChild(th);
    });

    const contactsTableBody = document.createElement('tbody');
    contactsTableBody.id = 'contactsTableBody';
    contactsTable.appendChild(contactsTableBody);

    contacts.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.classList.add('contact-row');
        row.style.paddingTop = '30px';
        contactsTableBody.appendChild(row);

        const rowData = [
            `${contact.firstName} ${contact.lastName}`,
            contact.email,
            contact.phone,
            `${contact.jobTitle}, ${contact.company}`,
            contact.label
        ];

        if (window.innerWidth <= 768) {
            rowData.splice(1); // Ne garder que le titre sur les petits écrans
        }

        rowData.forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
            cell.style.padding = '8px';
            cell.style.fontWeight = '400';
            cell.style.fontSize = '0.9rem';
            row.appendChild(cell);
        });

        const actionsCell = document.createElement('td');
        actionsCell.classList.add('actions');
        actionsCell.style.padding = '8px';
        row.appendChild(actionsCell);

        const editButton = document.createElement('button');
        editButton.classList.add('btn-supMod');
        editButton.innerHTML = `<i class="uil uil-pen"></i>`;
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            displayAddContactForm(contact, index, 'modification');
        });
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-supMod');
        deleteButton.innerHTML = `<i class="uil uil-trash"></i>`;
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteContact(index);
        });
        actionsCell.appendChild(deleteButton);

        // Afficher les boutons uniquement lorsque la souris est sur la ligne
        row.addEventListener('mouseenter', () => {
            row.classList.add('hover-row');
        });

        row.addEventListener('mouseleave', () => {
            row.classList.remove('hover-row');
        });

        // Ajouter un gestionnaire d'événements pour afficher les détails du contact sur clic
        if (window.innerWidth <= 768) {
            row.addEventListener('click', () => {
                displayContactDetails(contact);
            });
        }
        
    });

    // Réattacher les événements après avoir mis à jour le DOM
    attachLinkPageEventHandlers();
}


function displayContactDetails(contact) {
    const detailsHTML = `
        <div class="contact-details">
            <h2>Détails du Contact</h2>
            <p><strong>Prénom:</strong> ${contact.firstName}</p>
            <p><strong>Nom:</strong> ${contact.lastName}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Téléphone:</strong> ${contact.phone}</p>
            <p><strong>Entreprise:</strong> ${contact.company}</p>
            <p><strong>Fonction:</strong> ${contact.jobTitle}</p>
            <p><strong>Label:</strong> ${contact.label}</p>
            <button class="btn btn-secondary" onclick="displayContacts()">Retour à la liste</button>
        </div>
    `;

    const content = document.querySelector('.principale');
    content.innerHTML = detailsHTML;
}

// Appel initial pour afficher les contacts
displayContacts();
attachLinkPageEventHandlers();


// Fonction pour afficher le formulaire d'ajout/modification de contact
function displayAddContactForm(contact = null, index = null, mode = 'ajout') {
    const content = document.querySelector('.principale');
    content.innerHTML = '';

    const addContactDiv = document.createElement('div');
    addContactDiv.classList.add('addContact', 'page');
    addContactDiv.id = 'page2';
    content.appendChild(addContactDiv);

    const contactForm = document.createElement('form');
    contactForm.id = 'contactForm';
    addContactDiv.appendChild(contactForm);

    const addContactHeader = document.createElement('div');
    addContactHeader.classList.add('addContact__header');
    contactForm.appendChild(addContactHeader);

    const iconeBackDiv = document.createElement('div');
    iconeBackDiv.classList.add('icone-back');
    addContactHeader.appendChild(iconeBackDiv);

    // Ajouter un bouton de retour avec l'icône
    const backIcon = document.createElement('span');
    // backIcon.classList.add('linkPage');
    // backIcon.setAttribute('data-page', 'page1');
    backIcon.innerHTML = '<i class="fa fa-arrow-left linkPage" data-page="page1"></i>';
    iconeBackDiv.appendChild(backIcon);
    // content.prepend(iconeBackDiv);

    // Réattacher les événements après avoir mis à jour le DOM
    attachLinkPageEventHandlers();

    const btnSaveDiv = document.createElement('div');
    btnSaveDiv.classList.add('btn-save');
    addContactHeader.appendChild(btnSaveDiv);

    const saveContactBtn = document.createElement('button');
    saveContactBtn.classList.add('saveContactBtn');
    saveContactBtn.type = 'submit';
    saveContactBtn.textContent = 'Enregistrer';
    btnSaveDiv.appendChild(saveContactBtn);

    const addContactBody = document.createElement('div');
    addContactBody.classList.add('addContact__body');
    contactForm.appendChild(addContactBody);

    const bodyContactImgDiv = document.createElement('div');
    bodyContactImgDiv.classList.add('body-contact__img');
    addContactBody.appendChild(bodyContactImgDiv);

    const img = document.createElement('img');
    img.src = 'assets/img/silhouette.png';
    img.alt = '';
    img.classList.add('img-addC');
    bodyContactImgDiv.appendChild(img);

    const imgAjoutDiv = document.createElement('div');
    imgAjoutDiv.innerHTML = '<span class="img-ajout"><i class="fa fa-plus"></i></span>';
    bodyContactImgDiv.appendChild(imgAjoutDiv);

    const bodyContactLibelleDiv = document.createElement('div');
    bodyContactLibelleDiv.classList.add('body-contact__libelle');
    addContactBody.appendChild(bodyContactLibelleDiv);

    const btnLibelle = document.createElement('button');
    btnLibelle.classList.add('btn-libelle');
    btnLibelle.innerHTML = '<i class="fa fa-plus"></i> Libellé';
    bodyContactLibelleDiv.appendChild(btnLibelle);

    btnLibelle.addEventListener('click', (e) => {
        e.preventDefault();
        const labelPopover = document.querySelector('.popoverLabel');
        labelPopover.style.display = labelPopover.style.display === 'block' ? 'none' : 'block';
    });


    initializeLabelPopover(bodyContactLibelleDiv, btnLibelle);

    const bodyContactFormDiv = document.createElement('div');
    bodyContactFormDiv.classList.add('body-contact__form');
    addContactBody.appendChild(bodyContactFormDiv);

    const formGroups = [
        { label: 'Prénom:', id: 'firstName', placeholder: 'Prénom' },
        { label: 'Nom:', id: 'lastName', placeholder: 'Nom' },
        { label: 'Entreprise:', id: 'company', placeholder: 'Entreprise' },
        { label: 'Fonction:', id: 'jobTitle', placeholder: 'Fonction' },
        { label: 'Adresse e-mail:', id: 'email', placeholder: 'Adresse e-mail' },
        { label: 'Téléphone:', id: 'phone', placeholder: 'Téléphone' }
    ];

    formGroups.forEach(group => {
        const formGroupDiv = document.createElement('div');
        formGroupDiv.classList.add('form-group');
        bodyContactFormDiv.appendChild(formGroupDiv);

        const label = document.createElement('label');
        label.htmlFor = group.id;
        label.textContent = group.label;
        formGroupDiv.appendChild(label);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = group.id;
        input.classList.add('form-control');
        input.placeholder = group.placeholder;
        formGroupDiv.appendChild(input);
    });

    if (mode === 'modification' && contact) {
        document.getElementById('firstName').value = contact.firstName || '';
        document.getElementById('lastName').value = contact.lastName || '';
        document.getElementById('email').value = contact.email || '';
        document.getElementById('phone').value = contact.phone || '';
        document.getElementById('company').value = contact.company || '';
        document.getElementById('jobTitle').value = contact.jobTitle || '';
        selectedLabel = contact.label || '';
        document.querySelector('.btn-libelle').textContent = selectedLabel;
        saveContactBtn.textContent = 'Modifier';
    } else {
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('company').value = '';
        document.getElementById('jobTitle').value = '';
        selectedLabel = '';
        document.querySelector('.btn-libelle').textContent = 'Libellé';
        saveContactBtn.textContent = 'Enregistrer';
    }

    saveContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        saveContact(contact, index, mode);
    });
}

// Fonction pour supprimer un contact
function deleteContact(index) {
    if (index >= 0 && index < contacts.length) {
        contacts.splice(index, 1);
        displayContacts();
    } else {
        console.error('Invalid contact index');
    }
}

// Appel initial pour afficher les contacts
displayContacts();


function displayEditLabelModal(label, index) {
    // Afficher la fenêtre modale pour modifier le libellé
    const editLabelModal = new bootstrap.Modal(document.getElementById('editLabelModal'));
    editLabelModal.show();

    // Remplir la fenêtre modale avec le libellé actuel
    const editLabelInput = document.getElementById('editLabelInput');
    editLabelInput.value = label;

    // Ajouter un gestionnaire d'événements au bouton "Enregistrer" de la fenêtre modale pour enregistrer les modifications
    const saveEditLabelBtn = document.getElementById('saveEditLabelBtn');
    saveEditLabelBtn.addEventListener('click', () => {
        const newLabel = editLabelInput.value.trim();
        if (newLabel) {
            // Modifier le libellé dans le tableau labels
            labels[index] = newLabel;
            // Mettre à jour l'affichage des libellés
            updateLabelsDisplay();
            // Fermer la fenêtre modale après avoir enregistré les modifications
            editLabelModal.hide();
        }
    });
}

function updateLabelsDisplay() {
    const affichageLibelle = document.getElementById('affichageLibelle');
    affichageLibelle.innerHTML = ''; // Effacer les libellés existants

    labels.forEach((label, index) => {
        const labelContainer = document.createElement('div');
        labelContainer.classList.add('label-container');

        const labelLink = document.createElement('a');
        labelLink.href = '#';
        labelLink.innerHTML = `<span><i class="uil uil-label"></i> ${label}</span>`;
        labelContainer.appendChild(labelLink);

        // Créer le bouton "Modifier" pour chaque libellé
        const editBtn = document.createElement('button');
        editBtn.classList.add('btn-supMod', 'edit-btn')
        editBtn.innerHTML = `<i class="uil uil-pen"></i>`;
        labelContainer.appendChild(editBtn);

        // Créer le bouton "Supprimer" pour chaque libellé
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn-supMod', 'delete-btn')
        deleteBtn.innerHTML = `<i class="uil uil-trash"></i>`;;
        labelContainer.appendChild(deleteBtn);

        // Ajouter des gestionnaires d'événements pour afficher/masquer les boutons "Modifier" et "Supprimer"
        function affichageBtn() {
            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
        }
        function masquageBtn() {
            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
        }
        labelContainer.addEventListener('mouseenter', affichageBtn)
        labelContainer.addEventListener('mouseleave', masquageBtn)

        // Ajouter un gestionnaire d'événement au bouton "Modifier" pour ouvrir la fenêtre modale de modification
        editBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            // Appeler la fonction pour afficher la fenêtre modale de modification avec le libellé actuel et l'index correspondant
            displayEditLabelModal(label, index);
        });

        // Ajouter un gestionnaire d'événement au bouton "Supprimer" pour supprimer le libellé
        deleteBtn.addEventListener('click', () => {
            deleteLabel(index);
        });

        affichageLibelle.appendChild(labelContainer);
    });
}


function deleteLabel(index) {
    labels.splice(index, 1);
    updateLabelsDisplay(); // Mettre à jour l'affichage des libellés
}


function updateLabelsContainer() {
    const labelsContainer = document.querySelector('.labels-container');
    labelsContainer.innerHTML = ''; // Effacer les libellés existants

    labels.forEach(label => {
        const labelBtn = document.createElement('button');
        labelBtn.textContent = label;
        labelBtn.classList.add('label-btn');
        labelBtn.addEventListener('click', () => {
            selectedLabel = label;
            document.querySelector('.btn-libelle').textContent = label;
            // Fermer la modal après avoir choisi un label
        });
        labelsContainer.appendChild(labelBtn);
    });
}

// Fonction pour ajouter un nouveau champ de saisie de libellé dans une modale
function showNewLabelInput() {
    // Ouvrir la modale Bootstrap
    const newLabelModal = new bootstrap.Modal(document.getElementById('newLabelModal'));
    newLabelModal.show();

    // Ajouter un événement au bouton d'enregistrement de la modale
    const saveNewLabelBtn = document.getElementById('saveNewLabelBtn');
    saveNewLabelBtn.addEventListener('click', () => {
        const newLabelInput = document.getElementById('newLabelInput');
        const newLabel = newLabelInput.value.trim();
        if (newLabel) {
            // Ajouter le nouveau libellé au tableau labels
            labels.push(newLabel);

            // Mettre à jour les libellés affichés dans la fenêtre contextuelle
            updateLabelsDisplay();
            // updateLabelsContainer(); // Mettre à jour les libellés dans le conteneur

            // Réinitialiser le champ de saisie
            newLabelInput.value = '';

            // Fermer la modale
            newLabelModal.hide();

            // Réinitialiser le popover des libellés dans le formulaire de contact
            const bodyContactLibelleDiv = document.querySelector('.body-contact__libelle');
            const btnLibelle = document.querySelector('.btn-libelle');
            initializeLabelPopover(bodyContactLibelleDiv, btnLibelle);
        }
    }, { once: true }); // Ajout du { once: true } pour éviter d'ajouter plusieurs écouteurs d'événement
}

// Ajoutez l'événement pour afficher la modale
document.getElementById('creationLibelle').addEventListener('click', showNewLabelInput);




document.getElementById('creationLibelle').addEventListener('click', showNewLabelInput);

// Initialiser l'affichage des libellés existants
updateLabelsDisplay();


// Fonction pour attacher les gestionnaires d'événements aux liens dynamiques
function attachLinkPageEventHandlers() {
    document.querySelectorAll('.linkPage').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const page = this.getAttribute('data-page');
            switch (page) {
                case 'page1':
                    displayContacts();
                    break;
                case 'page2':
                    displayAddContactForm();
                    break;
                // Ajoutez d'autres cas pour d'autres pages si nécessaire
                default:
                    displayContacts(); // Par défaut, afficher la liste des contacts
            }
        });
    });
}

// Appel initial pour afficher les contacts et attacher les gestionnaires d'événements
displayContacts();
attachLinkPageEventHandlers();

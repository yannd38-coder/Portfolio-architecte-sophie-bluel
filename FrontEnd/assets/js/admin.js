const token = localStorage.getItem("token");
const modal = document.getElementById("modal-container");
const closeModal = document.getElementById("modal-close");
const btnAddForm = document.getElementById("btn-add-form");
const btnBack = document.getElementById("modal-back");
const viewGallery = document.getElementById("modal-add");
const viewAddPhoto = document.getElementById("modal-view-add");
const fileInput = document.getElementById("file-upload");
const imagePreview = document.getElementById("image-preview");
const modalFormContainer = document.getElementById("modal-add-form");
const formTitle = document.getElementById("form-title");
const selectCategory = document.getElementById("form-category");
const btnSubmitPhoto = document.getElementById("btn-submit-photo");

const uploadElements = modalFormContainer ? modalFormContainer.querySelectorAll(".upload-container > i, .upload-container > label, .upload-container > p") : [];
// si modalformcontainer est trouvé alors lance recherche sinon les [] veulent dire que renvoie tableau vide pour eviter bug/plantage 

// 1. CREATION DU MODE EDITION
if (token) {
    const body = document.querySelector("body");
    const headerAdmin = document.createElement("div");

    headerAdmin.id = "admin-banner";
    headerAdmin.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    body.prepend(headerAdmin);

    // Bouton logout
    const loginLink = document.querySelector("nav ul li a[href='login.html']");
    if (loginLink) {
        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });
    }

    // suppression des filtres (correction du sélecteur .filters)
    const filterContainer = document.querySelector(".filter") || document.querySelector(".filters");
    if (filterContainer) {
        filterContainer.style.display = "none";
    }

    // bouton modifier + icone
    const portfolioTitle = document.querySelector("#portfolio h2");
    if (portfolioTitle) {
        const modifyBtn = document.createElement("span");
        modifyBtn.className = "modifyBtn";
        modifyBtn.style.cursor = "pointer";
        modifyBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
        portfolioTitle.appendChild(modifyBtn);
    }
}
// 5. NAVIGATION INTERNE DE LA MODALE


if (btnAddForm && btnBack && viewGallery && viewAddPhoto) {
    btnAddForm.addEventListener("click", () => {
        viewGallery.style.display = "none";
        viewAddPhoto.style.display = "block";
        btnBack.style.visibility = "visible";
    });

    btnBack.addEventListener("click", () => {
        viewGallery.style.display = "block";
        viewAddPhoto.style.display = "none";
        btnBack.style.visibility = "hidden";
        resetFormPreview(); // vide les champs si on fait retour
    });
}

// 2. OUVERTURE / FERMETURE DE LA FENÊTRE MODALE

const modifyButton = document.querySelector(".modifyBtn");


if (modifyButton) {
    modifyButton.addEventListener("click", () => {
        if (modal) {
            if (viewGallery && viewAddPhoto && btnBack) {
                viewGallery.style.display = "block";
                viewAddPhoto.style.display = "none";
                btnBack.style.visibility = "hidden";
            }
            modal.showModal();
            loadModalGallery();
        }
    });
}

if (closeModal) {
    closeModal.addEventListener("click", () => {
        modal.close();
    });
}

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
}


// 3. RECUPERATION ET AFFICHAGE DE LA GALERIE DE LA MODALE
async function loadModalGallery() {
    const modalGallery = document.querySelector("#modal-add .modal-gallery");
    if (!modalGallery) return;

    modalGallery.innerHTML = "";

    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (response.ok) {
            const works = await response.json();

            works.forEach(work => {
                const figure = document.createElement("figure");
                const image = document.createElement("img");
                image.src = work.imageUrl;
                image.alt = work.title;

                const trashBtn = document.createElement("button");
                trashBtn.type = "button";
                trashBtn.className = "trash-btn";
                trashBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                trashBtn.dataset.id = work.id;

                trashBtn.addEventListener("click", async (e) => {
                    e.preventDefault();
                    const confirmDelete = confirm("Voulez-vous vraiment supprimer ce projet ?");
                    if (confirmDelete) {
                        await deleteWorks(work.id, figure);
                    }
                });

                figure.appendChild(image);
                figure.appendChild(trashBtn);
                modalGallery.appendChild(figure);
            });
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la page:", error);
    }
}

// 4. SUPPRESSION D'UN PROJET
async function deleteWorks(id, figureElement) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            figureElement.remove();

            try {
                const res = await fetch("http://localhost:5678/api/works");
                const newWorks = await res.json();

                const mainGallery = document.querySelector(".gallery");
                if (mainGallery) {
                    mainGallery.innerHTML = "";
                }

                if (typeof window.displayWorks === "function") {
                    window.displayWorks(newWorks);
                }
            } catch (err) {
                console.error("Erreur lors du rafraichissement de la galerie :", err);
            }

            console.log(`Le projet ${id} a été supprimé avec succès.`);
        } else {
            console.error("Impossible de supprimer le projet. Code erreur :", response.status);
        }
    } catch (error) {
        console.error("Erreur réseau globale lors de la suppression :", error);
    }
}


// 6. GESTION DU FORMULAIRE D'AJOUT (PREVIEW UNIFIÉE & VALIDATION)
async function loadCategory() {
    const categorySelect = document.getElementById("form-category");
    if (!categorySelect) return;

    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (response.ok) {
            const categories = await response.json();
            categorySelect.innerHTML = '<option value=""></option>';
            categories.forEach(
                category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
        }
    }
    catch (error) {
        console.error("erreur lors de la recuperation des catégories:", error);
    }
}
loadCategory();

// verif globale de validité du formulaire
function checkFormValidity() {
    if (!btnSubmitPhoto) return;
    const errorFileAdd = document.getElementById("error-fileAdd");
    const errorTitle = document.getElementById("error-title");
    const errorCategory = document.getElementById("error-category");
    //    verif de l'ajout du fichier
    const isFileValid = fileInput && fileInput.files && fileInput.files[0];
    if (!isFileValid) {
        if (errorFileAdd) errorFileAdd.textContent = "veuillez ajouter un fichier";
    }
    else {
        if (errorFileAdd) errorFileAdd.textContent = "";
    }
    // verif du titre
    const isTitleValid = formTitle && formTitle.value.trim() !== "";
    if (!isTitleValid) {
        if (errorTitle) errorTitle.textContent = "veuillez remplir le champ manquant";
    }
    else {
        if (errorTitle) errorTitle.textContent = "";
    }
    // verif category
    const isCategoryValid = selectCategory && selectCategory.value !== "";
    if (!isCategoryValid) {
        if (errorCategory) errorCategory.textContent = "veuillez selectionner une categorie";
    }
    else {
        if (errorCategory) errorCategory.textContent = "";
    }
    // verif finale et globale
    if (isFileValid && isTitleValid && isCategoryValid) {
        btnSubmitPhoto.disabled = false;
    } else {
        btnSubmitPhoto.disabled = true;
    }
    // ecouteur d'evenements pour titre+category
    if (formTitle) {
        formTitle.addEventListener("input", checkFormValidity);
    }

    if (selectCategory) {
        selectCategory.addEventListener("change", checkFormValidity);
    }
}

// ecouteur unique pour la selection du fichier et generer l'aperçu
if (fileInput && imagePreview) {
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        // ici je verifie si les fichier existe dans le dom, puis ecoute le changement/selection du fichier 
        // puis recup fichier selectionné par user le 1er et le seul
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                alert("L'image est trop lourde (4 Mo maximum).");
                fileInput.value = "";
                checkFormValidity();
                return;
            }
            // Affiche une alerte à l'utilisateur, réinitialise l'input (fileInput.value = ""), 
            // relance la vérification du formulaire pour désactiver le bouton de validation (checkFormValidity()), 
            // et stoppe la fonction (return).
            const reader = new FileReader();
            // (reader) permet de lire les fichiers presents sur l'ordinateur de user
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                // ca donne le lien temporaire géneré a la balise <img>
                imagePreview.style.display = "block";
                uploadElements.forEach(el => el.style.display = "none");
            };
            reader.readAsDataURL(file);
            // je dis a js de prendre le fichier image et de le transformer en un lien temporaire pour que le navigateur puisse l'afficher
        }
        else {
            imagePreview.src = "";
            imagePreview.style.display = "none";
            uploadElements.forEach(el => el.style.display = "block");
        }
        checkFormValidity();
    });
    // le rechargement de la page après depot image
    const form = document.getElementById("modal-add-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        form.reset();
        if (imagePreview) {
            imagePreview.src = "";
            imagePreview.style.display = "none";
        }
        if (uploadElements) {
            uploadElements.forEach(el => el.style.display = "block");
        }
        checkFormValidity();
    });

}

// mise a jour galerie

modalFormContainer.addEventListener('submit', async (event) => {
    event.preventDefault(); console.log("pas de rechargement de page ici");
    errorEmail.textContent = ""
    errorPassword.textContent = ""
    errorGlobal.textContent = ""
    // je crée les regle qui va etre injecté dans les if
    const email = baliseEmail.value;
    const password = balisePassword.value;
    console.log(password);
    console.log(email);


    const emailRegExp = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z]+$");
    if (emailRegExp.test(email)) {
        baliseEmail.classList.remove("error");
        console.log("le format est valide")
    } else {
        baliseEmail.classList.add("error");
        console.log("Erreur : Le format de l'email n'est pas valide");
        errorEmail.textContent("Le format de l'email n'est pas valide")
    }

    if (password.trim() !== "") {
        balisePassword.classList.remove("error");
        console.log("le format est valide")
    } else {
        balisePassword.classList.add("error");
        console.log("Erreur : Le mot de passe ne peut pas être vide");
        errorPassword.textContent("Erreur : Le mot de passe ne peut pas être vide")
    }
    if (email === "" || password === "") {
        errorGlobal.textContent("Erreur :Veuillez remplir tout les champs")
        // créer un p dans le html avec id error message, qui se rempli avec text content ici
        return
    }
    
    try {
        const response = await fetch("http://localhost:5678/api/users/login",
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        email: email,
                        password: password
                    }),
                headers: { "Content-Type": "application/json" }
            });
        if (response.ok) {
            const data = await response.json(); //je transforme la reponse(token+userid) recu de l'api en json
            localStorage.setItem("token", data.token); 
//je crée ici un enregistrement de la reponse de lapi.("la clé",et la valeur à enregistrer)   
// transformer la reponse en json, le token dans localStorage et ensuite je renvoie sur page accueil(windowlocation)  
            window.location.href = "index.html"; //je redirige le user vers accueil
        } else {
            // message derreur dans le p disant que erreur dans id et ou mdp
            errorGlobal.textContent = "Erreur dans l'identifiant ou le mot de passe."
        }
    } catch (error) {
        console.log(error)
        errorGlobal.textContent = "Erreur de connexion serveur."
    }
    
});
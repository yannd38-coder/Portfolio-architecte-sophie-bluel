// 1. CREATION DU MODE EDITION
// =========================================================================
const token = localStorage.getItem("token");

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

    // suppression des filtres (correction du sélecteur potentiel .filters)
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


// 2. OUVERTURE / FERMETURE DE LA FENÊTRE MODALE
// =========================================================================
const modal = document.getElementById("modal-container");
const modifyButton = document.querySelector(".modifyBtn");
const closeModal = document.getElementById("modal-close");

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
// =========================================================================
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
// =========================================================================
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

// 5. NAVIGATION INTERNE DE LA MODALE
// =========================================================================
const btnAddForm = document.getElementById("btn-add-form");
const btnBack = document.getElementById("modal-back");
const viewGallery = document.getElementById("modal-add");
const viewAddPhoto = document.getElementById("modal-view-add");

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
        resetFormPreview(); // Vide les champs si on fait retour
    });
}

// 6. GESTION DU FORMULAIRE D'AJOUT (PREVIEW UNIFIÉE & VALIDATION)
// =========================================================================
const fileInput = document.getElementById("file-upload");
const imagePreview = document.getElementById("image-preview");
const modalFormContainer = document.getElementById("modal-add-form");

// je récupère les éléments textuels internes au conteneur du formulaire
const uploadElements = modalFormContainer ? modalFormContainer.querySelectorAll(".upload-container > i, .upload-container > label, .upload-container > p") : [];
const formTitle = document.getElementById("form-title");
const selectCategory = document.getElementById("form-category");
const btnSubmitPhoto = document.getElementById("btn-submit-photo");

// Fonction de vérification globale de validité du formulaire
function checkFormValidity() {
    if (!btnSubmitPhoto) return;

    if (fileInput && fileInput.files[0] &&
        formTitle && formTitle.value.trim() !== "" &&
        selectCategory && selectCategory.value !== "") {

        btnSubmitPhoto.disabled = false;
    } else {
        btnSubmitPhoto.disabled = true;
    }
}
// ecouteur unique pour la sélection de fichier et génération de l'aperçu
if (fileInput && imagePreview) {
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                alert("L'image est trop lourde (4 Mo maximum).");
                fileInput.value = "";
                checkFormValidity();
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = "block";

                uploadElements.forEach(el => el.style.display = "none");
            };
            reader.readAsDataURL(file);
        }
        checkFormValidity();
    });
}

// ecouteurs de saisie textuelle pour débloquer le bouton de validation
if (formTitle) {
    formTitle.addEventListener("input", checkFormValidity);
}
if (selectCategory) {
    selectCategory.addEventListener("change", checkFormValidity);
}

// Fonction de réinitialisation complète du formulaire d'ajout
function resetFormPreview() {
    if (modalFormContainer) {
        modalFormContainer.reset();
    }
    if (imagePreview) {
        imagePreview.src = "#";
        imagePreview.style.display = "none";
    }
    uploadElements.forEach(el => el.style.display = "block");
    if (btnSubmitPhoto) {
        btnSubmitPhoto.disabled = true;
    }
}
// recuperation dynamique des categories
async function loadCategoriesForSelect() {
    const selectCategory = document.getElementById("form-category");
    if (!selectCategory) return;

    try {
        const response = await fetch("http://localhost:5678/api/categories")
        if (response.ok) {
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id; // pour que l'api attende l'ID numérique de la catégorie (1, 2, 3...)
                option.textContent = category.name;
                selectCategory.appendChild(option);
            });
        }
    }
    catch (error) {
        console.error("Erreur lors de la récuperation de la catégorie:", error);
    }
}
loadCategoriesForSelect();
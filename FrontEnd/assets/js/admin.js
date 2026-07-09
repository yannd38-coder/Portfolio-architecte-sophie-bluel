// CREATION DU MODE EDITION
const token = localStorage.getItem("token"); //je dis a js de recuperer les données du token qui sont dans le localstorage 
if (token) { //si il y a token alors (si pas null(en cas de 1e connexion ou de deconnexion ou nav privée))

    const body = document.querySelector("body"); //je sélectionne élément <body> du DOM pour pouvoir manipuler/integrer juste après

    const headerAdmin = document.createElement("div"); //je cree la <div> en mémoire dans JavaScript

    // creation de la banniere en haut de page noire
    headerAdmin.id = "admin-banner"; //j'attribues un ID pour le css

    headerAdmin.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    //la j'integre l'icone dans le html dans la div contenu dans le body

    body.prepend(headerAdmin);
    //vu que j'ai crée l'element div, ici je demande de le greffer en haut de la page avec le prepend(en premier enfant) (headerAdmin)

    // creation du bouton logout
    const loginLink = document.querySelector("nav ul li a[href='login.html']");//je vais chercher la liste du dom 
    if (loginLink) {
        loginLink.textContent = "logout"; //ce que doit contenir le texte affiché
        loginLink.href = "#" //le # permet de desactiver le renvoi vers index, ne se recharge pas et permet la deco
        loginLink.addEventListener("click", () => {//j'ecoute le click pour savoir quand le users clique sur le bouton
            localStorage.removeItem("token");//quand il clique je demande a js de retirer(supprimé) le token et ensuite de se recharger
            window.location.reload();
        });
    }

    // suppression des filtres
    const filterContainer = document.querySelector(".filter"); //je vais chercher lelement filter dans le html
    if (filterContainer) {
        filterContainer.style.display = "none"; //je veux ici faire disparaitre les filtres avec le style display egal à none
    }

    // creation du bouton modifier+icone
    const portfolioTitle = document.querySelector("#portfolio h2");//je vais chercher l'element h2 dans le portofolio dans le html
    if (portfolioTitle) {
        const modifyBtn = document.createElement("span");//je cree une span pour mettre le bouton dedans
        modifyBtn.className = "modifyBtn";//je crée une class pour le css
        modifyBtn.style.cursor = "pointer";
        modifyBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';//je cree licone + le mot modifier que j'integre au html avec innerhtml
        portfolioTitle.appendChild(modifyBtn);// je veux que ce bouton soit en fin dans la balise h2
    }
}
// modale

const modal = document.getElementById("modal-container");
const modifyButton = document.querySelector(".modifyBtn");
const closeModal = document.getElementById("modal-close");

if (modifyButton) {
    modifyButton.addEventListener("click", () => {
        if (modal) {
            modal.showModal(); loadModalGallery(); modal.style.backgroundColor = "red"; const modalWrapper = document.querySelector(".modal-wrapper");
            if (modalWrapper) {
                modalWrapper.style.width = "500px";
                // je modifie la TAILLE de la modale directement ici pour le moment avant css?
                // la COULEUR de l'arriere plan=>style.css=>dialog#modal-container::backdrop
            }
        }
    });
    // la fonction showModal va permettre d'ouvrir modal et gerer overlay
}
if (closeModal) {
    closeModal.addEventListener("click", () => { modal.close(); });
    // ferme modale et masque overlay
}
if (modal) {
    // 
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
            // ici je crée la fermeture au click en dehors de la modale
            // jecoute le clic, je recup tout les infos(la touches tapé, les coordonée du click) de event pour savoir ou users click
            // je dmande alors est ce que le clic(target) correspond strict à modal si non alors close
        }
    });
}

// AJOUT DES PHOTOS MODIFIABLE
async function loadModalGallery() {
    const modalGallery = document.querySelector(".modal-gallery");
    if (!modalGallery) return;
    // le !modalgallery, ! veut dire faux/nexiste pas. 
    //     // donc si pas de modalGallery dans le html tu arretes le chargement avec le return
    modalGallery.innerHTML = "";
    // je vide la galerie pour eviter doublons au chargement
    try {
        const response = await fetch("http://localhost:5678/api/works");
        // j'appelle l'api et si la reponse est ok alors
        if (response.ok) {
            const works = await response.json();

            works.forEach(work => {
                // works.forEach= je prends le tableau works de l'api qui contient les images et je demande a js
                // dappliquer pour chaque projet( chaque work) la fonction qui est dans les accolades
                // je crée 3 boite noire ou j'integre une boite qui contient les boites des images et l'icone

                const figure = document.createElement("figure");
                // je crée en memoire une balise html figure pendant que j'ajoute image/poubelle avant de mettre dans vrai html
                // comme cela si besoin de modifier le html pas de blocage pour l'utilisateur (plus souple si en memoire js)
                const image = document.createElement("img");
                // pareil que pour figure
                image.src = work.imageUrl;
                // recupere dans le tableau work lelement image url
                image.alt = work.title;

                const trashBtn = document.createElement("button");
                trashBtn.className = "trash-btn";
                // class pour le css
                trashBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                trashBtn.dataset.id = work.id;
                // je génére directement dans code HTML un attribut data-id, pour permettre de transmettre l'id selectionné vers poubelle
                // J' ajoute la variable "image" qu'on a créée juste au-dessus
                trashBtn.addEventListener("click", async (e) => {
                    e.preventDefault();
                    const confirmDelete = confirm("Voulez-vous vraiment supprimer ce projet ?");
                    if (confirmDelete) {
                        // On passe l'id du projet et l'élément <figure> complet à supprimer du DOM
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
// FONCTION SUPPRESSION
async function deleteWorks(id, figureElement) {
    const token = localStorage.getItem("token"); // Je récupère le token

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            // Si c'est ok supprime l'élément du dom de la modale
            figureElement.remove();

            //  Récupère les données à jour pour la galerie principale
            try {
                const res = await fetch("http://localhost:5678/api/works");
                const newWorks = await res.json();

                const mainGallery = document.querySelector(".gallery");
                if (mainGallery) {
                    mainGallery.innerHTML = "";
                }

                // envoi du nouveau tableau a la fonction globale
                if (typeof window.displayWorks === "function") {
                    window.displayWorks(newWorks);
                }
            } catch (err) {
                console.error("Erreur lors du rafraichissement de la galerie :", err);
            }

            console.log(`Le projet ${id} a été supprimé avec succès.`);
        } else {
            // Gere les echecs de l'API (ex: token KO, mauvaise id...)
            console.error("Impossible de supprimer le projet. Code erreur :", response.status);
        }
    } catch (error) {
        // Intercepte les pannes de réseau / serveur éteint
        console.error("Erreur réseau globale lors de la suppression :", error);
    }
}
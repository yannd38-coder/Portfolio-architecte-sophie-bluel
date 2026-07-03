const token = localStorage.getItem("token"); //je dis a js de recuperer les données du token qui sont dans le localstorage 
if (token) { //si il y a token alors (si pas null(en cas de 1e connexion ou de deconnexion ou nav privée))

    const body = document.querySelector("body"); //je sélectionne élément <body> du DOM pour pouvoir manipuler juste après

    const headerAdmin = document.createElement("div"); //je cree la <div> en mémoire dans JavaScript

    headerAdmin.id = "admin-banner"; //j'attribues un ID pour le css

    headerAdmin.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition'; //la j'integre l'icone dans le html dans la div contenu dans le body

    body.prepend(headerAdmin);  //vu que j'ai crée l'element div, ici je demande de le greffer en haut de la page avec le prepend(en premier enfant) (headerAdmin)
    const loginLink = document.querySelector("nav ul li a[href='login.html']");//je vais chercher la liste du dom 
    if (loginLink) {
        loginLink.textContent = "logout"; //ce que doit contenir le texte affiché
        loginLink.href = "#" //le # permet de desactiver le renvoi vers index, ne se recharge pas et permet la deco
        loginLink.addEventListener("click", () => {//j'ecoute le click pour savoir quand le users clique sur le bouton
            localStorage.removeItem("token");//quand il clique je demande a js de retirer(supprimé) le token et ensuite de se recharger
            window.location.reload();
        });
    }
    const filterContainer = document.querySelector(".filter"); //je vais chercher lelement filter dans le html
    if (filterContainer) {
        filterContainer.style.display = "none"; //je veux ici faire disparaitre les filtres avec ddisplay none
    }
    const portfolioTitle = document.querySelector("#portfolio h2");//je vais chercher l'element h2 dans le portofolio dans le html
    if (portfolioTitle) {
        const modifyBtn = document.createElement("span");//je cree une span pour mettre le bouton dedans
        modifyBtn.className = "modify-btn";//je crée une class pour le css
        modifyBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';//je cree licone + le mot modifier que j'integre au html avec innerhtml
        portfolioTitle.appendChild(modifyBtn);// je veux que ce bouton soit en fin dans la balise h2
    }
}


let works = [];
//RECUPERATION ET MISE PLACE DES PROJETS
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();//je viens interroger la base donnée pour une reponse en tableau d'objet
    console.log(works);
    displayWorks(works);
}

function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach(work => {
        gallery.innerHTML += `<figure><img src= "${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`

    })
}
getWorks()


//AJOUT DES FILTRES
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log(categories);
    displayCategory()
    sortWorksByCategory()
}

getCategories()
function displayCategory() {
}

function sortWorksByCategory() {
    //je declare une variable qui va recuperer tout les button du html
    let listboutons = document.querySelectorAll("button")
    //je crée la boucle pour parcourir tout les boutons de la boucle un a un. de 0 au dernier
    for (let i = 0; i < listboutons.length; i++) {
        //je cree et actionne le bouton actuel pour pouvoir l'afficher à la console quand mis en action
        let boutonActuel = listboutons[i]; console.log(boutonActuel);
        //je cree un ecouteur de click sur boutonActuel, quand user click = le code dessous se lancera
        boutonActuel.addEventListener("click", (event) => {
            //permet au navigateur de savoir ou le user à cliqué
            const monBouton = event.target
            //pour afficher à la console le num du bouton cliqué provenant du html
            console.log(`Utilisateur clique sur le bouton: ${monBouton.getAttribute("data-categoryId")}`);
            //permet de vider la gallery du html pour effacer les anciens projet et pour mise en place filtrage
            document.querySelector(".gallery").innerHTML = "";
            // je récupère la valeur de l'attribut data-categoryId (1,2 OU 3)
            const categoryIdChoisie = monBouton.dataset.categoryid;
            // le bouton Tous doit tout montrer(data-categoryId="0")
            if (categoryIdChoisie === "0") {
                // filtre dynamique qui converti le texte en nombre avec Number()
                displayWorks(works);
            } else {
                //Crée un nouveau tableau contenant uniquement les projets dont le "categoryId" correspond au numéro du bouton cliqué (converti en nombre avec number).
                const projetsFiltres = works.filter(item => item.categoryId === Number(categoryIdChoisie));
                //appel la fonction seulement si la cat choisie n'est pas 0
                displayWorks(projetsFiltres);
            }
        })
    }
}

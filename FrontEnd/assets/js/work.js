
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

    //mettre place boucle foreach sur works
    //créer une figure(element html) avec legende dedans pour chaque boucle
    //utiliser inner html sur gallery pour pouvoir rajouter dedans. donc mettre += a la place d'egal = seul pour eviter que les figures soient supprimé les un a la suite

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
    let listboutons = document.querySelectorAll("button") //je declare une variable qui va recuperer tout les button du html
    for (let i = 0; i < listboutons.length; i++) { //je crée la boucle pour parcourir tout les boutons de la boucle un a un. de 0 au dernier
        let boutonActuel = listboutons[i]; console.log(boutonActuel);//je cree et actionne le bouton actuel pour pouvoir l'afficher à la console quand mis en action
        boutonActuel.addEventListener("click", (event) => { //je cree un ecouteur de click sur boutonActuel, quand user click = le code dessous se lancera
            const monBouton = event.target //permet au navigateur de savoir ou le user à cliqué
            console.log(`Utilisateur clique sur le bouton: ${monBouton.getAttribute("data-categoryId")}`);//pour afficher à la console le num du bouton cliqué provenant du html
            document.querySelector(".gallery").innerHTML = "";//permet de vider la gallery du html pour effacer les anciens projet et pour mise en place filtrage

            // je récupère la valeur de l'attribut data-categoryId (1,2 OU 3)
            const categoryIdChoisie = monBouton.dataset.categoryid;

            if (categoryIdChoisie === "0") {
                // le bouton Tous doit tout montrer(data-categoryId="0")
                displayWorks(works);
            } else {
                // filtre dynamique qui converti le texte en nombre avec Number()
                const projetsFiltres = works.filter(item => item.categoryId === Number(categoryIdChoisie));//Crée un nouveau tableau contenant uniquement les projets dont le "categoryId" correspond au numéro du bouton cliqué (converti en nombre avec number).
                displayWorks(projetsFiltres);//appel la fonction seulement si la cat choisie n'est pas 0
            }
        })
    }
}


// AJOUT DE LA PAGE LOGIN
function LoginUser() {
    const loginLink = document.getElementById("nav-login");//je recupere l'element nav-login
    if (loginLink) {
        loginLink.addEventListener("click", (event) => { //ecouteur de click créer sur le loginform (le event permet d'avoir tout les infos sur le click)
            displayloginForm(); //lance la fonction
        });
    }
}
function displayloginForm() {
    const mainContainer = document.querySelector("main");//je selectionne le main dans le html pour le remplacer par le inner ci dessous
    mainContainer.innerHTML = `<section id="login">
    <h2>Log in</h2 >
        <form action="#" method="post">
            <label for="email">E-mail</label>
            <input type="email" name="email" id="email" required="required">
                <label for="name">Mot de passe</label>
                <input type="password" name="password" id="password" required="required">
                    <input type="submit" value="Se connecter">
                        <a href="#">Mot de passe oublié</a>
                    </form>
                </section>`;
}
LoginUser();
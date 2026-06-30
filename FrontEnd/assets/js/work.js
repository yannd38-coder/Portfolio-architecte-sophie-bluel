// const token=localStorage.getItem("token");
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


// // AJOUT DE LA PAGE LOGIN
// function LoginUser() {
//     //je recupere l'element nav-login
//     const loginLink = document.getElementById("nav-login");
//     if (loginLink) {
//         //ecouteur de click créer sur le loginform (le event permet d'avoir tout les infos sur le click)
//         loginLink.addEventListener("click", (event) => {
//             //lance la fonction
//             displayloginForm();
//         });
//     }
// }
// function displayloginForm() {
//     //je selectionne le main dans le html pour le remplacer par le inner ci dessous
//     const mainContainer = document.querySelector("main");
//     mainContainer.innerHTML = `<section id="login">
//     <h2>Log In</h2 >
//         <form action="#" method="post">
//             <label for="email">E-mail</label>
//             <input type="email" name="email" id="email" required="required">
//                 <label for="name">Mot de passe</label>
//                 <input type="password" name="password" id="password" required="required">
//                     <input type="submit" value="Se connecter">
//                         <a href="#">Mot de passe oublié</a>
//                     </form>
//                 </section>`;
// }
// LoginUser();
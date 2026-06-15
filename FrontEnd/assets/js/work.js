// let works = [];
// //RECUPERATION ET MISE PLACE DES PROJETS
// async function getWorks() {
//     const response = await fetch("http://localhost:5678/api/works");
//     works = await response.json();//je viens interroger la base donnée pour une reponse en tableau d'objet
//     console.log(works);
//     displayWorks(works);
// }

// function displayWorks(works) {
//     const gallery = document.querySelector(".gallery");
//     gallery.innerHTML = "";

//     //mettre place boucle foreach sur works
//     //créer une figure(element html) avec legende dedans pour chaque boucle
//     //utiliser inner html sur gallery pour pouvoir rajouter dedans. donc mettre += a la place d'egal = seul pour eviter que les figures soient supprimé les un a la suite

//     works.forEach(work => {
//         gallery.innerHTML += `<figure><img src= "${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`

//     })
// }
// getWorks()

// //AJOUT DES FILTRES
// async function getCategories() {
//     const response = await fetch("http://localhost:5678/api/categories");
//     const categories = await response.json();
//     console.log(categories);
//     displayCategory()
//     sortWorksByCategory()
// }
// getCategories()
// function displayCategory() {

// }

// function sortWorksByCategory() {
//     let listboutons = document.querySelectorAll("button")
//     for (let i = 0; i < listboutons.length; i++) {
//         let boutonActuel = listboutons[i]; console.log(boutonActuel);
//         boutonActuel.addEventListener("click", (event) => {
//             const monBouton = event.target
//             console.log(`Utilisateur clique sur le bouton: ${monBouton.getAttribute("data-categoryId")}`);
//             document.querySelector(".gallery").innerHTML = "";

//             // je récupère la valeur de l'attribut data-categoryId (1,2 OU 3)
//             const categoryIdChoisie = monBouton.dataset.categoryid;

//             if (categoryIdChoisie === "0") {
//                 // si c'est le bouton Tous (data-categoryId="0")
//                 displayWorks(works);
//             } else {
//                 // filtre dynamique qui converti le texte en nombre avec Number()
//                 const projetsFiltres = works.filter(item => item.categoryId === Number(categoryIdChoisie));
//                 displayWorks(projetsFiltres);
//             }
//             // if (monBouton.id === "btnObjets") { const objetsFiltres = works.filter(item => item.categoryId === 1); displayWorks(objetsFiltres); }
//             // if (monBouton.id === "btnAppartements") { const appartementsFiltres = works.filter(item => item.categoryId === 2); displayWorks(appartementsFiltres); }
//             // if (monBouton.id === "btnHotelsRestaurants") { const restaurantsFiltres = works.filter(item => item.categoryId === 3); displayWorks(restaurantsFiltres); }
//             // if (monBouton.id === "btnTous"); { displayWorks(works); }
//         })
//     }
//     function loginUser() {

//     }
// }





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
    let listboutons = document.querySelectorAll("button")
    for (let i = 0; i < listboutons.length; i++) {
        let boutonActuel = listboutons[i]; console.log(boutonActuel);
        boutonActuel.addEventListener("click", (event) => {
            const monBouton = event.target
            console.log(`Utilisateur clique sur le bouton: ${monBouton.getAttribute("data-categoryId")}`);
            document.querySelector(".gallery").innerHTML = "";

            // je récupère la valeur de l'attribut data-categoryId (1,2 OU 3)
            const categoryIdChoisie = monBouton.dataset.categoryid;

            if (categoryIdChoisie === "0") {
                // si c'est le bouton Tous (data-categoryId="0")
                displayWorks(works);
            } else {
                // filtre dynamique qui converti le texte en nombre avec Number()
                const projetsFiltres = works.filter(item => item.categoryId === Number(categoryIdChoisie));
                displayWorks(projetsFiltres);
            }
            // if (monBouton.id === "btnObjets") { const objetsFiltres = works.filter(item => item.categoryId === 1); displayWorks(objetsFiltres); }
            // if (monBouton.id === "btnAppartements") { const appartementsFiltres = works.filter(item => item.categoryId === 2); displayWorks(appartementsFiltres); }
            // if (monBouton.id === "btnHotelsRestaurants") { const restaurantsFiltres = works.filter(item => item.categoryId === 3); displayWorks(restaurantsFiltres); }
            // if (monBouton.id === "btnTous"); { displayWorks(works); }
        })
    }
}
function LoginUser() {
    const loginLink = document.getElementById("nav-login");
    if (loginLink) {
        loginLink.addEventListener("click", (event) => {
            displayloginForm();
        });
    }
}
function displayloginForm() {
    const mainContainer = document.querySelector("main");

    mainContainer.innerHTML = `<section id="login">
    <h2>Log in</h2 >
        <form action="#" method="post">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" required="required">
                <label for="name">Mot de passe</label>
                <input type="password" name="password" id="password" required="required">
                    <input type="submit" value="Se connecter">
                        <a href="#">Mot de passe oublié</a>
                    </form>
                </section>`;

}
LoginUser();
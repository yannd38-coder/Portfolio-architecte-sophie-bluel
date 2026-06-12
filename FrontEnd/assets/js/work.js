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
            
            // if (monBouton.id === "btnObjets") { const objetsFiltres = works.filter(item => item.categoryId === 1); displayWorks(objetsFiltres); }
            // if (monBouton.id === "btnAppartements") { const appartementsFiltres = works.filter(item => item.categoryId === 2); displayWorks(appartementsFiltres); }
            // if (monBouton.id === "btnHotelsRestaurants") { const restaurantsFiltres = works.filter(item => item.categoryId === 3); displayWorks(restaurantsFiltres); }
            // if (monBouton.id === "btnTous"); { displayWorks(works); }
        })
    }
}
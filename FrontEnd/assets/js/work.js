let works = [];
//RECUPERATION ET MISE PLACE DES PROJETS
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        works = await response.json();
        displayWorks(works);
    }
    catch (error) {
        console.error("erreur lors de recuperation du projet", error);
    }
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
    let listboutons = document.querySelectorAll(".filter button")  
    for (let i = 0; i < listboutons.length; i++) {
        let boutonActuel = listboutons[i]; console.log(boutonActuel);
        boutonActuel.addEventListener("click", (event) => {
            const monBouton = event.target
            console.log(`Utilisateur clique sur le bouton: ${monBouton.getAttribute("data-categoryId")}`);
            document.querySelector(".gallery").innerHTML = "";
            const categoryIdChoisie = monBouton.dataset.categoryid;
            if (categoryIdChoisie === "0") {
                displayWorks(works);
            } else {
                const projetsFiltres = works.filter(item => item.categoryId === Number(categoryIdChoisie));
                displayWorks(projetsFiltres);
            }
        })
    }
    window.displayWorks = displayWorks;
    window.getWorks = getWorks;
}

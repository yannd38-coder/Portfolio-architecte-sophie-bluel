let works = [];
//1. RECUPERATION ET MISE PLACE DES PROJETS
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

function displayWorks(worksToDisplay) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    worksToDisplay.forEach(work => {
        gallery.innerHTML += `<figure><img src= "${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`

    })
}



//2. AJOUT DES FILTRES
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        displayCategory(categories);
        sortWorksByCategory();
    }
    catch (error) {
        console.error("Erreur lors de recuperation des categories", error);
    }
}



function displayCategory(categories) {
    const filterContainer = document.querySelector(".filter");
    filterContainer.innerHTML = "";
    // Le bouton TOUS
    const btnAll = document.createElement("button");
    btnAll.className = "filter-btn active";
    btnAll.dataset.categoryId = "0";
    btnAll.textContent = "Tous";
    filterContainer.appendChild(btnAll);
    // Les autres boutons de filtrage
    categories.forEach(category => {
        const button = document.createElement("button");
        button.className = "filter-btn";
        button.dataset.categoryId = category.id;
        button.textContent = category.name;
        filterContainer.appendChild(button);
    });
}

function sortWorksByCategory() {
    let listboutons = document.querySelectorAll(".filter button")
    for (let i = 0; i < listboutons.length; i++) {
        let boutonActuel = listboutons[i];
        boutonActuel.addEventListener("click", (event) => {
            const monBouton = event.target;
            listboutons.forEach(btn => btn.classList.remove("active"));
            monBouton.classList.add("active");
            const categoryIdChoisie = monBouton.dataset.categoryId;
            if (categoryIdChoisie === "0") {
                displayWorks(works);
            } else {
                const projetsFiltres = works.filter(item => item.categoryId === Number(categoryIdChoisie));
                displayWorks(projetsFiltres);
            }
        })
    }
}
getWorks()
getCategories()
window.displayWorks = displayWorks;
window.getWorks = getWorks;

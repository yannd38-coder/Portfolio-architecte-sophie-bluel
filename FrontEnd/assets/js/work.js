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

function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach(work => {
        gallery.innerHTML += `<figure><img src= "${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`

    })
}
getWorks()


//2. AJOUT DES FILTRES
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    displayCategory();
    sortWorksByCategory();
}
getCategories()

function displayCategory() {
}

function sortWorksByCategory() {
    let listboutons = document.querySelectorAll(".filter button")
    for (let i = 0; i < listboutons.length; i++) {
        let boutonActuel = listboutons[i];
        boutonActuel.addEventListener("click", (event) => {
            const monBouton = event.target;
            listboutons.forEach(btn => btn.classList.remove("active"));
            monBouton.classList.add("active");
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

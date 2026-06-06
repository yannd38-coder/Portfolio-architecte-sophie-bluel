//RECUPERATION ET MISE PLACE DES PROJETS
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();//je viens interroger la base donnée pour une reponse en tableau d'objet
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
    const categories = await.response.json();
    console.log(categories)

}

const form = document.querySelector('form');
const baliseEmail = document.getElementById("email");
const balisePassword = document.getElementById("password");

const errorEmail = document.getElementById("error-email");
const errorPassword = document.getElementById("error-password");
const errorGlobal = document.getElementById("error-global");
// je vais chercher les elements dans le html

form.addEventListener('submit', async (event) => {
    event.preventDefault(); console.log("pas de rechargement de page ici");
    errorEmail.textContent = ""
    errorPassword.textContent = ""
    errorGlobal.textContent = ""
    // je crée les regle qui va etre injecté dans les if
    const email = baliseEmail.value;
    const password = balisePassword.value;
    console.log(password);
    console.log(email);


    const emailRegExp = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z]+$");
    if (emailRegExp.test(email)) {
        baliseEmail.classList.remove("error");
        console.log("le format est valide")
    } else {
        baliseEmail.classList.add("error");
        console.log("Erreur : Le format de l'email n'est pas valide");
        errorEmail.textContent("Le format de l'email n'est pas valide")
        // injecter dans le p un message derreur en disant que format mail pas bon 
    }

    if (password.trim() !== "") {
        balisePassword.classList.remove("error");
        console.log("le format est valide")
    } else {
        balisePassword.classList.add("error");
        console.log("Erreur : Le mot de passe ne peut pas être vide");
        errorPassword.textContent("Erreur : Le mot de passe ne peut pas être vide")
    }
    if (email === "" || password === "") {
        errorGlobal.textContent("Erreur :Veuillez remplir tout les champs")
        // créer un p dans le html avec id error message, qui se rempli avec text content ici
        return
    }
    try {
        const response = await fetch("http://localhost:5678/api/users/login",
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        email: email,
                        password: password
                    }),
                headers: { "Content-Type": "application/json" }
            });
        if (response.ok) {
            const data = await response.json(); //je transforme la reponse(token+userid) recu de l'api en json
            localStorage.setItem("token", data.token); //je crée ici un enregistrement de la reponse de lapi.("la clé",et la valeur à enregistrer)   transfomrer la reponse en json, le token dans localStorage et ensuite je renvoie sur page accueil(windowlocation)  
            window.location.href = "index.html"; //je redige le user vers accueil
        } else {
            // message derreur dans le p disant que erreur dans id et ou mdp
            errorGlobal.textContent = "Erreur dans l'identifiant ou le mot de passe."
        }
    } catch (error) {
        console.log(error)
        errorGlobal.textContent = "Erreur de connexion serveur."
    }
});








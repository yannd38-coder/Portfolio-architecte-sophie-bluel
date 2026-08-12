// 1. SÉLECTION DES ÉLÉMENTS DU DOM

const form = document.querySelector('form');
const baliseEmail = document.getElementById("email");
const balisePassword = document.getElementById("password");
const errorEmail = document.getElementById("error-email");
const errorPassword = document.getElementById("error-password");
const errorGlobal = document.getElementById("error-global");

// 2. ÉCOUTEUR D'ÉVÉNEMENT SUR LE FORMULAIRE
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 3. RÉINITIALISATION DES MESSAGES D'ERREUR
    if (errorEmail) errorEmail.textContent = "";
    if (errorPassword) errorPassword.textContent = "";
    if (errorGlobal) errorGlobal.textContent = "";

    baliseEmail.classList.remove("error");
    balisePassword.classList.remove("error");

    // Récupération + nettoyage des valeurs (retrait des espaces inutiles)
    const email = baliseEmail.value.trim();
    const password = balisePassword.value.trim();

    // 4. VÉRIFICATION DES CHAMPS VIDES
    if (email === "" || password === "") {
        if (errorGlobal) errorGlobal.textContent = "Erreur : Veuillez remplir tous les champs";
        if (email === "") baliseEmail.classList.add("error");
        if (password === "") balisePassword.classList.add("error");
        return;
    }

    // 5. VALIDATION FORMAT EMAIL
    const emailRegExp = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z]+$", "i");
    if (!emailRegExp.test(email)) {
        baliseEmail.classList.add("error");
        if (errorEmail) errorEmail.textContent = "Le format de l'email n'est pas valide";
        return;
    }

    // 6. REQUÊTE ASYNCHRONE D'AUTHENTIFICATION (FETCH API)
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // 7. GESTION DE LA RÉPONSE SERVEUR
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            // Redirection vers la page d'accueil
            window.location.href = "index.html";
        } else {
            // Statut 401 ou 404 (Identifiants incorrects)
            if (errorGlobal) errorGlobal.textContent = "Erreur dans l'identifiant ou le mot de passe.";
        }
    } catch (error) {
        // Erreur réseau / serveur inaccessible
        if (errorGlobal) errorGlobal.textContent = "Erreur de connexion au serveur.";
    }
});
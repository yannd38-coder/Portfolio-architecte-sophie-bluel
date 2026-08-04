const form = document.querySelector('form');
const baliseEmail = document.getElementById("email");
const balisePassword = document.getElementById("password");
const errorEmail = document.getElementById("error-email");
const errorPassword = document.getElementById("error-password");
const errorGlobal = document.getElementById("error-global");


form.addEventListener('submit', async (event) => {
    event.preventDefault(); console.log("pas de rechargement de page ici");
    errorEmail.textContent = ""
    errorPassword.textContent = ""
    errorGlobal.textContent = ""
    const email = baliseEmail.value;
    const password = balisePassword.value;
    console.log(password);
    console.log(email);


    const emailRegExp = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z]+$");
    if (emailRegExp.test(email)) {
        baliseEmail.classList.remove("error");
        console.log("le format est valide");
    } else {
        baliseEmail.classList.add("error");
        console.log("Erreur : Le format de l'email n'est pas valide");
        errorEmail.textContent("Le format de l'email n'est pas valide");
    }

    if (password.trim() !== "") {
        balisePassword.classList.remove("error");
        console.log("le format est valide");
        if (errorPassword) errorPassword.textContent = "";
    } else {
        balisePassword.classList.add("error");
        console.log("Erreur : Le mot de passe ne peut pas être vide");
        if (errorPassword) errorPassword.textContent = "Erreur : Le mot de passe ne peut pas être vide";
    }
    if (email === "" || password === "") {
        errorGlobal.textContent("Erreur :Veuillez remplir tout les champs");
        return;
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
            const data = await response.json();
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            errorGlobal.textContent = "Erreur dans l'identifiant ou le mot de passe."
        }
    } catch (error) {
        console.log(error)
        errorGlobal.textContent = "Erreur de connexion serveur."
    }

});
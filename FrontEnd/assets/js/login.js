
const form = document.querySelector('form');
const baliseEmail = document.getElementById("email");
const balisePassword = document.getElementById("password");

form.addEventListener('submit', async (event) => {
    event.preventDefault(); console.log("pas de rechargement de page ici");
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
        // injecter dans le p un message derreur en disant que format mail pas bon 
    }

    if (password.trim() !== "") {
        balisePassword.classList.remove("error");
        console.log("le format est valide")
    } else {
        balisePassword.classList.add("error");
        console.log("Erreur : Le mot de passe ne peut pas être vide");
    }
    if (email === "" || password === "") {
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
            console.log(await response.json())
            //   transfomrer la reponse en json, le token dans localStorage et ensuite je renvoie sur page acceuil(windowlocation)  
        } else {
            // message derreur dans le p disant que erreur dans id et ou mdp
        }
    } catch (error) {
        console.log(error)
    }
});





// export function connexionUser(){
//     const LoginUser= await fetch("http://localhost:5678/users/login");
//     const

// }
// fetch("http://localhost:5678/users/login", {/*objet de configuration*/ });


// {
//     /*objet de configuration*/
//     method: "POST"
// }
// {
//     /*objet de configuration*/
//     body: '{"commentaire":"Top Produit!"}'
// }
// {
//     /*objet de configuration*/
//     headers: { "Content-Type": "application/json" }
// }
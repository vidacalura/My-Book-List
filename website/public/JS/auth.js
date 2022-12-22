const loginBtn = document.getElementById("login-btn");
const nomeTxtbox = document.getElementById("nome");
const senhaTxtbox = document.getElementById("senha");
const erroDiv = document.getElementById("erro-msg");

loginBtn.addEventListener("click", (e) => {

    e.preventDefault();

    fetch("https://mybooklist.onrender.com/login", {
        method: "POST",
        headers: {
            'Content-type': "application/JSON"
        },
        body: JSON.stringify({
            nome: nomeTxtbox.value.trim(),
            senha: senhaTxtbox.value.trim()
        })
    })
    .then((res) => { return res.json(); })
    .then((data) => {
        if (data.error){
            const error = document.createElement("p");
            error.textContent = data.error;

            erroDiv.appendChild(error);
        }
        else {
            window.location.href = "https://mybooklist.onrender.com/user/";
        }
    });

});
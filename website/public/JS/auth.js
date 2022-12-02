const cadBtn = document.getElementById("cad-btn");
const nomeTxtbox = document.getElementById("nome");
const senhaTxtbox = document.getElementById("senha");
const confSenhaTxtbox = document.getElementById("conf-senha");
const erroDiv = document.getElementById("erro-msg");


cadBtn.addEventListener("click", (e) => {

    e.preventDefault();

    fetch("http://localhost:5500/cadastro", {
        method: "POST",
        headers: {
            'Content-type': "application/JSON"
        },
        body: JSON.stringify({
            nome: nomeTxtbox.value.trim(),
            senha: senhaTxtbox.value.trim(),
            confirmacaoSenha: confSenhaTxtbox.value.trim()
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
            window.location.href = "http://localhost:5000/";
        }
    });

});
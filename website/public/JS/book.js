const barraPesquisa = document.getElementById("barra-pesquisa");
const resultadosPesquisaDiv = document.getElementById("book-pesquisa-resultados");

barraPesquisa.addEventListener("keydown", (e) => {

    if (e.key == "Enter")
        procurarLivros(barraPesquisa.value);

});


async function procurarLivros(nome){

    fetch("http://localhost:4000/books/" + nome, {
        method: "GET",
        headers: {
            'Content-type': "application/JSON"
        }
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((res) => {
        if (res.message){
            while (resultadosPesquisaDiv.firstElementChild){
                resultadosPesquisaDiv.removeChild(resultadosPesquisaDiv.firstElementChild);
            }

            const message = document.createElement("h2");
            message.textContent = res.message;

            const criarBookBtn = document.createElement("a");
            criarBookBtn.textContent = "Clique aqui para registrar!";
            criarBookBtn.href = "/book/criar";

            resultadosPesquisaDiv.appendChild(message);
            resultadosPesquisaDiv.appendChild(criarBookBtn);
        }
        else if (res.error){
            alert(res.error);
        }
        else {
            while (resultadosPesquisaDiv.firstElementChild){
                resultadosPesquisaDiv.removeChild(resultadosPesquisaDiv.firstElementChild);
            }

            for (let i = 0; i < res.length; i++){
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("book");

                const bookContainer = document.createElement("div");
                bookContainer.classList.add("book-container");

                const textoContainer = document.createElement("div");
                textoContainer.classList.add("texto-container");

                const numero = document.createElement("p");
                numero.classList.add("numero");
                numero.textContent = i + 1;

                const bookTextoDiv = document.createElement("div");
                bookTextoDiv.classList.add("book-texto");

                const bookNome = document.createElement("h3");
                bookNome.classList.add("book-nome");
                bookNome.textContent = res[i].nome;

                const bookAutor = document.createElement("h4");
                bookAutor.classList.add("book-autor");
                bookAutor.textContent = res[i].autor;

                bookTextoDiv.appendChild(bookNome);
                bookTextoDiv.appendChild(bookAutor);

                const bookDadosDiv = document.createElement("div");
                bookDadosDiv.classList.add("book-dados");

                const bookScore = document.createElement("h3");
                bookScore.classList.add("book-score");
                bookScore.textContent = res[i].nota_media;

                const bookProgress = document.createElement("h3");
                bookProgress.classList.add("book-progress");
                bookProgress.textContent = res[i].capitulos;

                bookDadosDiv.appendChild(bookScore);
                bookDadosDiv.appendChild(bookProgress);

                const bookBtnsDiv = document.createElement("div");
                bookBtnsDiv.classList.add("book-btns");

                // Se for sua conta:
                // const btnEdit = document.createElement("button");

                bookDadosDiv.appendChild(bookBtnsDiv);
                textoContainer.appendChild(numero);
                textoContainer.appendChild(bookTextoDiv);
                bookContainer.appendChild(textoContainer);
                bookContainer.appendChild(bookDadosDiv);
                bookDiv.appendChild(bookContainer);
                resultadosPesquisaDiv.appendChild(bookDiv);
            }
        }
    });

}
const barraPesquisa = document.getElementById("barra-pesquisa");
const resultadosPesquisaDiv = document.getElementById("book-pesquisa-resultados");

barraPesquisa.addEventListener("keydown", (e) => {

    if (e.key == "Enter")
        procurarLivros(barraPesquisa.value);

});


async function procurarLivros(nome){

    fetch("https://my-book-list-api.vercel.app/api/books/" + nome, {
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

            const messageDiv = document.createElement("div");
            messageDiv.classList.add("book");
            messageDiv.classList.add("gap-4");

            const message = document.createElement("h2");
            message.textContent = res.message;

            const criarBookBtn = document.createElement("a");
            criarBookBtn.textContent = "Clique aqui para registrar!";
            criarBookBtn.href = "/book/criar";
            criarBookBtn.classList.add("font-bold");

            messageDiv.appendChild(message);
            messageDiv.appendChild(criarBookBtn);
            resultadosPesquisaDiv.appendChild(messageDiv);
        }
        else if (res.error){
            alert(res.error);
        }
        else {
            while (resultadosPesquisaDiv.firstElementChild){
                resultadosPesquisaDiv.removeChild(resultadosPesquisaDiv.firstElementChild);
            }

            const divCenter = document.createElement("div");
            divCenter.classList.add("book");

            const tabelaDiv = document.createElement("div");
            tabelaDiv.classList.add("tabela-div");

            const tabelaTexto = document.createElement("div");
            tabelaTexto.classList.add("book-texto");

            const p1 = document.createElement("p");
            p1.textContent = "Nome / Autor";
            tabelaTexto.appendChild(p1);

            const tabelaDados = document.createElement("div");
            tabelaDados.classList.add("tabela-dados");

            const p2 = document.createElement("p");
            p2.textContent = "Nota";

            const p3 = document.createElement("p");
            p3.textContent = "Capítulos";
            tabelaDados.appendChild(p2);
            tabelaDados.appendChild(p3);

            divCenter.appendChild(tabelaDiv)
            tabelaDiv.appendChild(tabelaTexto);
            tabelaDiv.appendChild(tabelaDados);
            resultadosPesquisaDiv.appendChild(divCenter);

            for (let i = 0; i < res.length; i++){
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("book");

                const bookContainer = document.createElement("div");
                bookContainer.classList.add("book-select-container");
                bookContainer.title = "Clique para adicionar à sua lista!";

                const textoContainer = document.createElement("div");
                textoContainer.classList.add("texto-container");

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
                bookProgress.classList.add("pr-8")
                bookProgress.textContent = res[i].capitulos;

                bookDadosDiv.appendChild(bookScore);
                bookDadosDiv.appendChild(bookProgress);

                textoContainer.appendChild(bookTextoDiv);
                bookContainer.appendChild(textoContainer);
                bookContainer.appendChild(bookDadosDiv);
                bookDiv.appendChild(bookContainer);
                resultadosPesquisaDiv.appendChild(bookDiv);

                bookDiv.addEventListener("click", () => {
                    adicionarLivroARegistros(res[i]);
                });
            }
        }
    });

}


function adicionarLivroARegistros(book){

    fetch("/regbook", {
        method: "POST",
        headers: {
            'Content-type': "application/JSON"
        },
        body: JSON.stringify({
            book
        })
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((res) => {
        if (res.error){
            alert(res.error);
        }
        else {
            alert(res.message);
        }
    });
    
}
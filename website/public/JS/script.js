const url = window.location.href.split("/");
const username = url[url.length - 1]
const listaDiv = document.getElementById("lista");
const listaUser = document.getElementById("lista-user");
listaUser.textContent = "Lista de " + username;

fetchBooks();


function fetchBooks(){
    fetch("http://localhost:4000/api/users/" + username, {
        method: "GET",
        headers: {
            'Content-type': "application/JSON"
        }
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((data) => { 
        if (data.message){
            alert(data.message);
        }
        else if (data.error){
            alert(data.error);
        }
        else {
            for (let i = 0; i < data.length; i++){
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
                bookNome.textContent = data[i].nome;

                const bookAutor = document.createElement("h4");
                bookAutor.classList.add("book-autor");
                bookAutor.textContent = data[i].autor;

                bookTextoDiv.appendChild(bookNome);
                bookTextoDiv.appendChild(bookAutor);

                const bookDadosDiv = document.createElement("div");
                bookDadosDiv.classList.add("book-dados");

                const bookScore = document.createElement("h3");
                bookScore.classList.add("book-score");
                bookScore.textContent = (data[i].nota == 0 ? "-" : data[i].nota);

                const bookProgress = document.createElement("h3");
                bookProgress.classList.add("book-progress");
                bookProgress.textContent = data[i].capitulos_lidos + "/" + data[i].capitulos_total;

                bookDadosDiv.appendChild(bookScore);
                bookDadosDiv.appendChild(bookProgress);

                const bookBtnsDiv = document.createElement("div");
                bookBtnsDiv.classList.add("book-btns");

                // Se for sua conta:
                const btnEdit = document.createElement("button");
                btnEdit.textContent = "Edit";

                btnEdit.addEventListener("click", () => { CRUDLivro(data[i]); });

                bookDadosDiv.appendChild(btnEdit)

                bookDadosDiv.appendChild(bookBtnsDiv);
                textoContainer.appendChild(numero);
                textoContainer.appendChild(bookTextoDiv);
                bookContainer.appendChild(textoContainer);
                bookContainer.appendChild(bookDadosDiv);
                bookDiv.appendChild(bookContainer);
                listaDiv.appendChild(bookDiv);
            }
        }
    });
}


async function CRUDLivro(book){

    fetch("http://localhost:5500/checarsessao/" + username, {
        method: "GET",
        headers: {
            "Content-type": "Application/JSON"
        }
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((res) => {
        if (res.check){

            const main = document.querySelector("main");
            main.className = "flex justify-center";

            main.addEventListener("click", (e) => {
                if (e.target == main){
                    // remover form
                    form.remove();
                }
            });

            const form = document.createElement("form");
            form.id = "edit-form";

            const formTitle = document.createElement("h2");
            formTitle.textContent = `Editar ${book.nome}`; 
            formTitle.className = "font-bold text-xl py-4";

            const inputNota = document.createElement("input");
            inputNota.type = "text";
            inputNota.placeholder = "Nova nota:";

            const br1 = document.createElement("br");
            const br2 = document.createElement("br");
            const br3 = document.createElement("br");

            const inputCapitulos = document.createElement("input");
            inputCapitulos.type = "number";
            inputCapitulos.placeholder = "Capítulos lidos:";

            const inputEstado = document.createElement("input");
            inputEstado.type = "text";
            inputEstado.placeholder = "Estado:";

            const divErro = document.createElement("div");

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("book");

            const envBtn = document.createElement("input");
            envBtn.type = "submit";
            envBtn.value = "Atualizar";

            envBtn.addEventListener("click", () => {
                fetch(
                    "http://localhost:5500/regbook?" + 
                    "userNome=null" + "&" +
                    "cod_book=" + book.cod_book + "&" +
                    "nota=" + inputNota.value.trim() + "&" +
                    "capitulos=" + inputCapitulos.value.trim() + "&" +
                    "estado=" + inputEstado.value.trim(), {
                    method: "PUT",
                    headers: {
                        "Content-type": "Application/JSON"
                    }
                })
                .then((rawRes) => { return rawRes.json(); })
                .then((res) => {
                    if (!res.error){
                        window.location.reload();
                    }
                    else {
                        alert(res.error);
                    }
                });
            });

            const delBtn = document.createElement("button");
            delBtn.textContent = "Deletar livro"

            delBtn.addEventListener("click", () => {
                fetch("http://localhost:5500/regbook?cod_book=" + book.cod_book, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "Application/JSON"
                    }
                })
                .then((rawRes) => { return rawRes.json(); })
                .then((res) => {
                    if (!res.error){
                        window.location.reload();
                    }
                    else {
                        alert(res.error);
                    }
                });

            });

            form.appendChild(formTitle);
            form.appendChild(inputNota);
            form.appendChild(br1);
            form.appendChild(inputCapitulos);
            form.appendChild(br2);
            form.appendChild(inputEstado);
            form.appendChild(divErro);
            form.appendChild(br3);
            btnContainer.appendChild(envBtn);
            btnContainer.appendChild(delBtn);
            form.appendChild(btnContainer);
            main.appendChild(form);
        }
        else {
            alert("Você não pode acessar os registros de outros usuários");
        }
    });

}
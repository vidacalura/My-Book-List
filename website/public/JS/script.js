const url = window.location.href.split("/");
const username = url[url.length - 1]
const listaDiv = document.getElementById("lista");
const listaUser = document.getElementById("lista-user");
listaUser.textContent = "Lista de " + username;

fetchBooks();


function fetchBooks(){
    fetch("http://localhost:4000/users/" + username, {
        method: "GET",
        headers: {
            'Content-type': "application/JSON"
        }
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((data) => { 
        let i = 1;

        for (const book of data){
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book");

            const bookContainer = document.createElement("div");
            bookContainer.classList.add("book-container");

            const textoContainer = document.createElement("div");
            textoContainer.classList.add("texto-container");

            const numero = document.createElement("p");
            numero.classList.add("numero");
            numero.textContent = i;

            const bookTextoDiv = document.createElement("div");
            bookTextoDiv.classList.add("book-texto");

            const bookNome = document.createElement("h3");
            bookNome.classList.add("book-nome");
            bookNome.textContent = book.nome;

            const bookAutor = document.createElement("h4");
            bookAutor.classList.add("book-autor");
            bookAutor.textContent = book.autor;

            bookTextoDiv.appendChild(bookNome);
            bookTextoDiv.appendChild(bookAutor);

            const bookDadosDiv = document.createElement("div");
            bookDadosDiv.classList.add("book-dados");

            const bookScore = document.createElement("h3");
            bookScore.classList.add("book-score");
            bookScore.textContent = book.nota;

            const bookProgress = document.createElement("h3");
            bookProgress.classList.add("book-progress");
            bookProgress.textContent = book.capitulos_lidos + "/" + book.capitulos_total;

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
            listaDiv.appendChild(bookDiv);
            
            i++;
        }
    });
}

/* 

API functions:
- findUserBooks
- deleteBook
- updateBook

*/
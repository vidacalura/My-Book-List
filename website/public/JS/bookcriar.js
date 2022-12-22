const bookNome = document.getElementById("book-nome");
const bookAutor = document.getElementById("book-autor");
const bookCapitulos = document.getElementById("book-capitulos");
const bookCadBtn = document.getElementById("book-cad-btn");

bookCadBtn.addEventListener("click", async () => {

    fetch("/books/criar", {
        method: "POST",
        headers: {
            'Content-type': "application/JSON"
        },
        body: JSON.stringify({
            nome: bookNome.value.trim(),
            autor: bookAutor.value.trim(),
            capitulos: bookCapitulos.value.trim()
        })
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((res) => {
        if (res.error){
            alert(res.error);
        }
        else {
            window.location = "/user/";
        }
    });

});
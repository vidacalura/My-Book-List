require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const crypto = require("crypto");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.listen(5500);

app.use(express.static("./public/CSS"));
app.use(express.static("./public/JS"));
app.use(express.json());

app.use(cors({ origin: "http://127.0.0.1:4000" }));

app.use(cookieParser());
app.use(sessions({
    secret: process.env.key,
    saveUninitialized:true,
    cookie: { maxAge: 253402300000000 },
    resave: false
}))


/* Rotas */
app.get("/user", (req, res) => {
    if (req.session.nome){
        res.redirect("/user/" + req.session.nome);
    }
    else {
        res.redirect("/cadastro");
    }
});

app.get("/user/:username", (req, res) => {
    res.status(200).sendFile("./public/index.html", { root: __dirname });    
});

app.get("/book", (req, res) => {
    res.status(200).sendFile("./public/book.html", { root: __dirname });
});

app.get("/book/criar", (req, res) => {
    res.status(200).sendFile("./public/bookcriar.html", { root: __dirname });
});

app.get("/cadastro", (req, res) => {
    res.status(200).sendFile("./public/cad.html", { root: __dirname });
});

app.get("/login", (req, res) => {
    res.status(200).sendFile("./public/login.html", { root: __dirname });
});

app.post("/cadastro", async (req, res) => {

    const { nome, senha, confirmacaoSenha } = req.body;

    if (validacaoUserCadastro(nome, senha, confirmacaoSenha)){
        // Encriptar dados
        const hash = crypto.createHmac('sha512', process.env.key);
        hash.update(senha);

        // Mandar para API
        fetch("http://127.0.0.1:4000/api/users/cad", {
            method: "POST",
            headers: {
                'Content-type': "application/JSON"
            },
            body: JSON.stringify({
                nome: nome,
                senha: hash.digest("hex")
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((data) => { 
            if (!data.error){
                // Iniciar sessão
                req.session.nome = nome;
                req.session.id = data.id;

                res.json({
                    "message": "Cadastrado com sucesso!"
                });
            }
            else {
                res.json({ "error": data.error });
            }
        });

    }
    else {
        res.json({
            "error": "Dados inválidos."
        });
    }

});

app.post("/books/criar", async (req, res) => {
    
    const { nome, autor, capitulos } = req.body;

    if (req.session.nome){
        if (validacaoBookCadastro(nome, autor, capitulos)){
            fetch("http://127.0.0.1:4000/api/books", {
                method: "POST",
                headers: {
                    'Content-type': "application/JSON"
                },
                body: JSON.stringify({
                    criadoPor: req.session.nome,
                    nome,
                    autor,
                    capitulos: Number(capitulos)
                })
            })
            .then((rawRes) => { return rawRes.json(); })
            .then((jsonRes) => {
                res.json(jsonRes);
            });
        }
        else {
            res.json({ "error": "Valores inválidos" });
        }
    }
    else{
        res.json({ "error": "Você precisa estar logado para cadastrar um livro." });
    }

});

// Registra o estado de um livro para um usuário
app.post("/regbook", async (req, res) => {

    const userNome = req.session.nome;

    if (userNome){
        const { book } = req.body;

        fetch("http://127.0.0.1:4000/api/regbook/", {
            method: "POST",
            headers: {
                'Content-type': "application/JSON"
            },
            body: JSON.stringify({
                userNome,
                cod_book: book.cod_book,
                capitulos_total: book.capitulos
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((jsonRes) => {
            if (jsonRes.error){
                res.json({ "error": "Falha ao registrar livro" });
            }
            else {
                res.json({ "message": "Livro registrado ao seu perfil com sucesso!" });
            }
        });
    }
    else {
        res.json({
            "error": "Você precisa estar logado para registrar um livro ao seu perfil."
        });
    }

});

app.post("/login", async (req, res) => {

    const { nome, senha } = req.body;

    const hash = crypto.createHmac('sha512', process.env.key);
    hash.update(senha);

    fetch("http://127.0.0.1:4000/api/users/login", {
            method: "POST",
            headers: {
                'Content-type': "application/JSON"
            },
            body: JSON.stringify({
                nome: nome,
                senha: hash.digest("hex")
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((data) => { 
            if (!data.error){
                // Iniciar sessão
                req.session.nome = nome;
                req.session.id = data.id;

                res.json({
                    "message": "Login efetuado com sucesso!"
                });
            }
            else {
                res.json({
                    "error": data.error
                });
            }
        });

});

app.get("/checarsessao/:nome", (req, res) => {

    if (req.session.nome == req.params.nome){
        res.json({ "check": true });
    }
    else {
        res.json({ "check": false });
    }

});

app.put("/regbook", (req, res) => {

    const { nota, capitulos, estado, cod_book } = req.query;
    let reqUrl = "http://127.0.0.1:4000/api/regbook?"

    if (validacaoRegUpdate(nota, capitulos, estado)){
        if (nota != ""){
            reqUrl += `nota=${nota}&`
        }
        if (capitulos != ""){
            reqUrl += `capitulos=${capitulos}&`
        }
        if (estado != ""){
            reqUrl += `estado=${estado}&`
        }

        if (reqUrl == "http://127.0.0.1:4000/api/regbook?"){
            res.json({ "error": "Argumentos insuficientes" });
        }
        else {
            reqUrl += `cod_book=${cod_book}&userNome=${req.session.nome}`
            fetch(reqUrl, {
                method: "PUT",
                headers: {
                    "Content-type": "Application/JSON"
                }
            })
            .then((rawRes) => { return rawRes.json(); })
            .then((jsonRes) => {
                res.json(jsonRes);
            });
        }
    }
    else {
        res.json({ "error": "Argumentos inválidos" });
    }

});

app.delete("/regbook", (req, res) => {
    
    if (req.query.cod_book){
        fetch("http://127.0.0.1:4000/api/regbook?cod_book=" + req.query.cod_book +
              "&userNome=" + req.session.nome, {
            method: "DELETE",
            headers: {
                "Content-type": "Application/JSON"
            }
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((jsonRes) => {
            res.json(jsonRes)
        });
    }
    else {
        res.json({ "error": "Erro ao excluir livro" });
    }

});


// Cadastro 
function validacaoUserCadastro(n, s, cs){

    if (n.length > 16 || n.length <= 3){
        return false;
    }
    if (cs != s){
        return false;
    }
    if (s.length < 8){
        return false;
    }

    return true;
}

function validacaoBookCadastro(n, a, c){

    if (!n || !a || !c){
        return false;
    }
    if (n.length > 60){
        return false;
    }
    if (a.length > 30){
        return false;
    }
    if (c.length > 3){
        return false;
    }

    return true;

}

function validacaoRegUpdate(n, c, e){

    if (n){
        if (Number(n) > 10 || Number(n) < 1){
            return false;
        }
    }
    if (c){
        if (c.length > 3){
            return false;
        }
    }
    if (e){
        if (Number(e) > 3 || Number(e) < 0){
            return false;
        }
    }

    return true;

}
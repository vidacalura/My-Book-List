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
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 253402300000000 },
    resave: false
}))


/* Rotas */
app.get("/:username", (req, res) => {
    res.status(200).sendFile("./public/index.html", { root: __dirname });    
});

app.get("/book", (req, res) => {
    res.status(200).sendFile("./public/book.html", { root: __dirname });
});

app.get("/cadastro", (req, res) => {
    res.status(200).sendFile("./public/cad.html", { root: __dirname });
});

app.get("/login", (req, res) => {
    res.status(200).sendFile("./public/auth.html", { root: __dirname });
});

app.post("/cadastro", (req, res) => {

    const { nome, senha, confirmacaoSenha } = req.body;

    if (validacaoDadosCadastro(nome, senha, confirmacaoSenha)){
        // Encriptar dados
        const hash = crypto.createHmac('sha512', process.env.KEY);
        hash.update(senha);

        // Mandar para API
        fetch("http://127.0.0.1:4000/users", {
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
            // Iniciar sessão
            req.session.nome = nome;
            req.session.id = data.id;

            console.log(req.session);

            res.json({
                "message": "Cadastrado com sucesso!"
            });
        });

    }
    else {
        res.json({
            "error": "Dados inválidos."
        });
    }

});


/* Cadastro */
function validacaoDadosCadastro(n, s, cs){

    if (n.length > 16 || n.length <= 3){
        return false;
    }
    else if (cs != s){
        return false;
    }
    else if (s.length < 8){
        return false;
    }

    return true;
}
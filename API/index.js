const routes = require("./routes/api");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: [ "https://mybooklist.onrender.com/", "http://localhost:5500" ] }));

app.use("/api", routes);


app.listen(port);


/* API: */
// Verificar se livro já existe antes de cadastro de livros

/* Client: */
// estado (livro)
// Responsividade

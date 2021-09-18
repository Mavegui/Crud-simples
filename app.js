const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
require("./models/Nomes")
const Nome = mongoose.model("nome")

const app = express();

//BodyParser
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

//Handlebars
//Forma padrão de usar handlebars, isso facilita em não ter erros;
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}))
app.set('view engine', 'handlebars')

//mongoose
mongoose.promise = global.promise;
mongoose.connect("mongodb://localhost/pessoanome", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log("Conectado krl!!!")
}).catch((err) => {
  console.log("Deu merda aqui, erro: " + err)
})

//rotas

app.get("/", (req, res)=>{
  Nome.find().sort({
    date: "desc"
  }).then((nome)=>{
    res.render("pessoa", {
      nome: nome
    })
  }).catch((err)=>{
     console.log("Houve um erro:"+err);
  })
})


app.get("/user", (req, res)=>{
  res.render("addpessoa")
})

app.post("/user", (req, res)=>{

  const novoNome ={
    nome: req.body.nome,
    sobrenome: req.body.sobrenome
  }
  new Nome(novoNome).save().then(()=>{
    console.log("Nome salvo com sucesso!");
    res.redirect("/")
  }).catch((err)=>{
    console.log("Houve um erro: "+err);

  })
})

app.post("/deletar", (req, res)=>{
  Nome.deleteOne({
    _id: req.body.id
  }).then(()=>{
    console.log("Deletado com sucesso!");
    res.redirect("/")
  }).catch((err)=>{
    console.log("Erro: "+err);
  })
})


app.get("/edit/:id", (req, res)=>{
  Nome.findOne({
    _id: req.params.id
  }).then((nome)=>{
    res.render("editnome", {
      nome: nome
    })
  }).catch((err)=>{
    console.log("Erro: "+err);
  })
})


app.post("/edit", (req, res)=>{
  Nome.findOne({
    _id: req.body.id
  }).then((nome)=>{
    nome.nome = req.body.nome,
    nome.sobrenome = req.body.sobrenome

    nome.save().then(()=>{
      console.log("Nome editado com sucesso!");
      res.redirect("/")
    })
  }).catch((err)=>{
    console.log("Erro: "+err);
  })
})

app.get("/info", (req, res)=>{
  res.render("info")
})

app.listen(8081, function() {
	console.log("Servidor rodando na url http://localhost:8081");
})

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Nome = new Schema({
  nome:{
    type: String,
    required: true
  },
  sobrenome:{
    type: String,
    required: true
  }
})

mongoose.model("nome", Nome)

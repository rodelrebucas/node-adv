let mongoose = require('mongoose')

let ingredients = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    amount: Number
})
let RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: String,
    ingredients: [ingredients]
})

module.exports = mongoose.model('Recipe', RecipeSchema)
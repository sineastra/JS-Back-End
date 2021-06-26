const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
    // IMPLEMENT THE CUSTOM SCHEMA
})

// CHANGE THE NAME
const Custom = mongoose.model("CHANGE_THE_NAME", CustomSchema)

module.exports = Custom

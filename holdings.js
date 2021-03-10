const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Portfolio');

const Schema = mongoose.Schema;

const holdingSchema = new Schema({
    asset: {
        type: String, 
        required: true, 
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Holdings', holdingSchema);
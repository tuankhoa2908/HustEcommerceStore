const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    cataegory: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        enum: ["Apple", "Samsung", "Lenovo", "Xiaomi", "Huawei", "Realme", "Vsmart"]
    },
    quantity: {
        type: Number,
        require: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        required: true,
    },
    ratings: [
        {
            star: Number,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        }
    ]
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Product', productSchema);
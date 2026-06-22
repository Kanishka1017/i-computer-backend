import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productId : {
            type : String,
            unique : true,
            required : true
        },
        name : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        altName :{
            type : [String],
            default : []
        },
        price : {
            type :Number,
            required : true
        },
        labelldPrice : {
            type : Number
        },
        category : {
            type : String,
            default : "other"
        },
        images : {
            type : String,
            default : ["/image/default-product-1.png"]
        },
        isVisible :{
            type : Boolean,
            default : true,
            required : true
        },
        brand : {
            type : String,
            default : "Generic"
        },
        model : {
            type : String,
            default : "Standard"
        }

})

const Product = mongoose.model("Product",productSchema);
export default Product;
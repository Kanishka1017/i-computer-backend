import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res){

    if(isAdmin(req)){
        res.status(403).json({
            message : "Access denide.admins only"
        })
        return;
    }

    try{
        const existingProduct = await Product.findOne({
            productId : req.body.productId
        })

        if(existingProduct){
            res.status(400).json({message : "product with given productId alredy exists"});
            return;
        }

        const data = {}
        data.productId = req.body.productId;

        if(req.body.name == null){
            res.status(400).json({message : "Product name is required"})
            return;
        }
        data.name = req.body.name;

        data.description = req.body.description || ""

        data.altName = req.body.altName || []

        if(req.body.price == null){
            res.status(400).json({  message : "Product Price is required"})
            return;  
        }
        data.price = req.body.price;

        data.labelldPrice = req.body.labelldPrice || req.body.price

        data.category = req.body.category || "other"

        data.images = req.body.images || ["/image/default-product-1.png"]

        data.isVisible = req.body.isVisible

        data.brand = req.body.brand || "Generic"

        data.model =req.body.model ||  "Standard"

        const newProduct = new Product(data);
        await newProduct.save();
        res.status(201).json({message : "Product Create Successfull", product : newProduct})

    }catch(error){
        res.status(500).json({message : "error calculating product", error : error})
    }
}

export async function getProduct(req , res){
    try{

        if(isAdmin(req)){
            const product = await Product.find();
            res.status(500).json(Products);
        }else{
            const products = await Product.find({isVisible : true})
            res.status(200).json(products);
        }

        

    }catch(error){
        res.status(500).json({message : "error feching product", error : error})
    }
}

export async function deleteProduct(req , res){
    if(isAdmin(req)){
        res.status(403).json({message : "Accessed denide. Admin Only!"})
        return;
    }
    try{
        const productId = req.params.productId;

        await Product.deleteOne({productId : productId});

        res.status(200).json({message : "Product delete successfull"});


    }catch(error){
        res.status(500).json({message : "Error deleting product", error : error})
    }
}

export async function updateproduct(req , res){

    if(isAdmin(req)){
        res.status(403).json({
            message : "Access denide.admins only"
        })
        return;
    }

    try{
        const productId = req.params.productId;

        const data = {}

        if(req.body.name == null){
            res.status(400).json({message : "Product name is required"})
            return;
        }
        data.name = req.body.name;

        data.description = req.body.description || ""

        data.altName = req.body.altName || []

        if(req.body.price == null){
            res.status(400).json({  message : "Product Price is required"})
            return;  
        }
        data.price = req.body.price;

        data.labelldPrice = req.body.labelldPrice || req.body.price

        data.category = req.body.category || "other"

        data.images = req.body.images || ["/image/default-product-1.png"]

        data.isVisible = req.body.isVisible

        data.brand = req.body.brand || "Generic"

        data.model =req.body.model ||  "Standard"

       await Product.updateOne({productId : productId}, data)

        res.status(201).json({message : "Product Updating Successfull"})

    }catch(error){
        res.status(500).json({message : "error Updating product", error : error})
    }

}
export async function getProductById(req , res){
    try{
        const productId = req.params.productId;
        const product = await Product.findOne({productId : productId})

        if(product == null){
            res.status(404).json({message : "Product not found"});
            return;
        }

        if(!product.isVisible){
            if(!isAdmin(req)){
                res.status(404).json({message : "Product not found"})
                return;
            }
        }
        res.status(200).json(Product);

    }catch(error){
        res.status(500).json({message : "Erroe fetching Product", error : error})
    }
}
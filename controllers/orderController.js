import { parse } from "dotenv";
import Order from "../models/orders.js";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req,res){

    if(req.user == null){
        res.status(401).json({message : "Unathorized. pleace log in to the place in order"});
        return;
    }

    try{

    const orderData ={
        orderId: "ORD000001",
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        addressLine1 : req.body.addressLine1,
        addressLine2 : req.body.addressLine2,
        city : req.body.city,
        country : req.body.country,
        postalCode : req.body.postalCode,
        email : req.user.email,
        items : [],
        phone : req.body.phone,
        total : 0
    }

    if(req.body.firstName == null){
        orderData.firstName = req.user.firstName
    }

    if(req.body.lastName == null){
        orderData.lastName = req.user.lastName
    }

    const lastOrder = await Order.findOne().sort({date : -1})

    if(lastOrder != null){
        const lastOrderId = lastOrder.orderId //eg: "ORD0000030"

        const lastOrderNumberInString = lastOrderId.replace("ORD","") //"0000030"

        const lastOrderNumber = parseInt(lastOrderNumberInString) //29

        const newOrderNumber = lastOrderNumber + 1 //30

        const newOrderNumberInString = newOrderNumber.toString().padStart(6,(0)) //"000030"

        orderData.orderId = "ORD" + newOrderNumberInString //"ORD000030"
    }

    for(let i =0; i< req.body.items.length; i++){
        const item = req.body.items[i]
        const product = await Product.findOne({productId : item.productId})

        if(product==null){
            res.status(404).json({message : "product with id " + item.productId + "not found.pleace remove it from your cart and try again"})
            return;
        }

        if(product.isVisible == false){
            res.status(404).json({message :"product with id" + item.productId + "is not available.pleace remove it from your cart and try again"})
            return;
        }

       // if(product.qty < item.qty){
         //   res.status(404).json({message :"only "+ product.qty + "items available for product for product with id "+ item.productId +  "is not available.pleace remove it from your cart and try again"})
           // return;
        //}

        orderData.items.push({
            productId : product.productId,
            name : product.name,
            price : product.price,
            labelledPrice : product.labelledPrice,
            Image : product.images[0],
            qty : item.qty
        })
        orderData.total += product.price * item.qty

    }

    const order = new Order(orderData);
    await order.save();
    
    //reduce  the qty from the prodcts collection
   // for(let i =0; i<orderData.items.length; i++){
       // const item = orderData.items[i]
       // await product.updateOne({productId : item.productId},{ $inc : {qty : -item.qty}})
    //}

    res.status(201).json({message :"Order create successfully",orderId : orderData.orderId})

}catch(error){
    console.log("error creating order", error)
    res.status(500).json({message : "error creating order", error : error});
}
}

export async function  getorders(req,res){
    if(req.user == null){
        res.status(401).json({message :"Unotherized. pleace log in to view your order "})
        return;
    }

    const pageSizeInString = req.params.pageSize || "10"
    const pageNumberInString = req.params.pageNumber || "1"

    //String values convert to int...

    const pageSize = parseInt(pageSizeInString);
    const pageNumber = parseInt(pageNumberInString);

try{

    if(isAdmin(req)){
        const numberOfOrders = await Order.countDocuments()

        const numberofPages = Math.ceil(numberOfOrders/pageSize)

        const orders = await Order.find().sort({date : -1}).skip((pageNumber -1)*pageSize).limit(pageSize)

        res.json({
            orders : orders,
            totalPages : numberofPages
        })

    }else{
        const numberOfOrders = await orders.countDocuments()

        const numberofPages = Math.cbrt(numberOfOrders/pageSize)

        const orders = await orders.find({email : req .user.email}).sort({date : -1}).skip((pageNumber -1)*pageSize).limit(pageSize)

        res.json({
            orders : orders,
            totalPages : numberofPages
        })
    }

}catch(error){
    console.log("Error fetching orders", error);
    res.status(500).json({message : "Error fetching orders", error : error})
}

}
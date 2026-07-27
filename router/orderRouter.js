import exprees from "express"
import { createOrder, getorders } from "../controllers/orderController.js";
 
const orderRouter = exprees.Router();

orderRouter.post("/",createOrder);
orderRouter.get("/:pageSize/:pageNumber",getorders)

export default orderRouter;
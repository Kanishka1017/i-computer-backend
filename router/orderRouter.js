import exprees from "express"
import { createOrder, getorders, updateOrderStatusAndNotes } from "../controllers/orderController.js";
 
const orderRouter = exprees.Router();

orderRouter.post("/",createOrder);
orderRouter.get("/:pageSize/:pageNumber",getorders);
orderRouter.put("/:orderId", updateOrderStatusAndNotes)

export default orderRouter;
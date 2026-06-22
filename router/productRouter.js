import exprees from "express"
import { createProduct, deleteProduct, getProduct, getProductById, updateproduct } from "../controllers/productController.js";

const productRouter = exprees.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProduct);
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateproduct)
productRouter.get("/:productId",getProductById)

export default productRouter;
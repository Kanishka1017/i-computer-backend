import exprees from "express"
import { createProduct, deleteProduct, getProduct, getProductById, searchProduct, updateproduct } from "../controllers/productController.js";

const productRouter = exprees.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProduct);
productRouter.get("/search/:query",searchProduct)

productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateproduct)
productRouter.get("/:productId",getProductById)

export default productRouter;
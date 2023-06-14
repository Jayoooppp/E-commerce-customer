import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } })
    return res.status(203).json(products);
}
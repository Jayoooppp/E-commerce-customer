import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK);


export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.json("Only POST requests are allowed")
    }
    await mongooseConnect();
    const { name, email, address, city, postalcode, country, products } = req.body;
    const productIds = products;
    const uniqueIds = [...new Set(productIds)]
    const productsInfo = await Product.find({ _id: uniqueIds })

    let line_items = []
    for (const id of uniqueIds) {
        const productInfo = productsInfo.find((prod) => prod._id.toString() === id);
        const quantity = productIds.filter((p_id) => p_id === id)?.length || 0;
        if (quantity > 0 && productInfo) {
            console.log("herer")
            line_items.push({
                quantity,
                price_data: {
                    currency: "INR",
                    product_data: { name: productInfo.title },
                    unit_amount: quantity * productInfo.price * 100,
                }
            })
        }
    }
    const orderInfo = await Order.create({
        name, email, address, city, postalcode, country, line_items, paid: false
    });


    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + "/cart?Success=true",
        cancel_url: process.env.PUBLIC_URL + "/cart?Canceled=true",
        metadata: { orderId: orderInfo._id.toString(), test: 'ok' },
    });

    return res.status(203).json({
        url: session.url,
    })
}
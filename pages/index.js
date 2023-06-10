import Header from "@/components/Header";
import Featured from "@/components/Featured";
import Product from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import NewProducts from "@/components/NewProduct";
export default function HomePage({ featuredProduct, newProducts }) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProduct = "647b78069bb40b1f95405e22"
  await mongooseConnect();
  const product = await Product.findById(featuredProduct)
  const newProduct = await Product.find({}, null, { sort: { "_id": -1 } })
  return {
    props:
    {
      featuredProduct: JSON.parse(JSON.stringify(product)),
      newProducts: JSON.parse(JSON.stringify(newProduct))

    }
  }
}
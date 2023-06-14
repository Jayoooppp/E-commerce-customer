import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import styled from "styled-components";
import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";

const Title = styled.h2`
  font-size: 2rem;
  margin:30px 10px  20px;
  font-weight: normal;
`;

const Pdiv = styled.div`
    margin:0px 40px;
`


export default function Products({ products }) {
    return (
        <>
            <Header />
            <Title>All Products</Title>
            <Pdiv>
                <ProductsGrid products={products} />
            </Pdiv>

        </>
    )
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}).sort({ createdAt: -1 })
    return {
        props: {
            products: JSON.parse(JSON.stringify(products))
        }
    }
}
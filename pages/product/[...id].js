import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { useRouter } from "next/router"
import styled from "styled-components";
import Button from "@/components/Button";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import CartIcon from "@/components/icons/CartIcon";

const ColumnWrapper = styled.div`
    display:grid;
    grid-template-columns:.8fr 1.2fr;
    gap:40px;
    margin-top:40px;

`;

const PriceRow = styled.div`
    display:flex;
    gap:20px;
    align-items:center;
`

const Price = styled.span`
    font-size:1.4rem;
`

export default function ProductDetails({ product }) {
    const router = useRouter();
    const id = router.query.id;
    const { addProduct } = useContext(CartContext);



    return (
        <>
            <Header />
            <Center>
                <ColumnWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <p>{product.description}</p>
                        <PriceRow>
                            <div><Price>₹ {product?.price}</Price></div>
                            <div>
                                <Button primary onClick={() => addProduct(product._id)}><CartIcon />Add to Cart</Button>
                            </div>
                        </PriceRow>
                    </div>
                </ColumnWrapper>
            </Center>
        </>
    )
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id)

    return {
        props: {
            product: JSON.parse(JSON.stringify(product))
        }
    }


}
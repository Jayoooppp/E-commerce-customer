import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Button from "@/components/Button";
import { useContext, useDebugValue, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import Input from "@/components/Input";
import axios from "axios";
import { getSession } from "next-auth/react";

const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;


export default function CartPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);

  const [products, setProducts] = useState([])
  useEffect(() => {
    // fetch all cart products
    if (cartProducts?.length > 0) {
      axios.post("/api/cart", { ids: cartProducts })
        .then((res) => {
          setProducts(res.data)
        })
    }
  }, [cartProducts])
  const moreProduct = (id) => {
    addProduct(id);
  }

  const lessProduct = (id) => {
    removeProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    postalCode: "",
    address: "",
    country: ""
  })

  const handleValueChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const goToPayment = async (e) => {
    e.preventDefault();
    formData["products"] = cartProducts;
    await axios.post("/api/checkout", formData)
      .then((res) => {
        if (res.data.url) {
          window.location = res.data.url;
        }
      })

  }

  const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

  const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

  const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

  const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

  const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

  const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;
  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnWrapper>
            <Box>
              <h1>Thank You for placing Order!!!</h1>
              <p>We have mailed you the order details</p>
            </Box>
          </ColumnWrapper>

        </Center>
      </>
    )

  }


  return (

    <div>
      <Header />
      <Center>
        <ColumnWrapper>
          <Box>
            <h2>Cart</h2>
            {!cartProducts?.length && (
              <div>Your Cart is empty</div>
            )}

            {!!cartProducts?.length && (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {products.map((product) => (
                      <>
                        <tr>
                          <ProductInfoCell>
                            <ProductImageBox>
                              <img src={product.images[0]} alt={product.title} />
                            </ProductImageBox>
                            {product.title}
                          </ProductInfoCell>
                          <td>
                            <Button onClick={() => lessProduct(product._id)}>-</Button>
                            <QuantityLabel>
                              {cartProducts.filter(id => id === product._id).length}
                            </QuantityLabel>
                            <Button onClick={() => moreProduct(product._id)}>+</Button>

                          </td>
                          <td>₹{cartProducts.filter(id => id === product._id).length * product.price}</td>
                        </tr>
                      </>

                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td>₹{total}</td>
                    </tr>
                  </>
                </tbody>
              </table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Order Information</h2>
              <form>

                <Input type="text" placeholder="Name" value={formData.name} name="name" onChange={(e) => handleValueChange(e)} />
                <Input type="email" placeholder="Email" value={formData.email} name="email" onChange={(e) => handleValueChange(e)} />
                <CityHolder>
                  <Input type="text" placeholder="City" value={formData.city} name="city" onChange={(e) => handleValueChange(e)} />
                  <Input type="text" placeholder="Postal Code" value={formData.postalCode} name="postalCode" onChange={(e) => handleValueChange(e)} />
                </CityHolder>
                <Input type="text" placeholder="Stree Address" name="address" value={formData.address} onChange={(e) => handleValueChange(e)} />
                <Input type="text" placeholder="Country" name="country" value={formData.country} onChange={(e) => handleValueChange(e)} />

                <Button black block size={'l'} type="submit" onClick={(e) => goToPayment(e)}>Continue to Payment</Button>
              </form>
            </Box>
          )}
        </ColumnWrapper>
      </Center>
    </div>
  )
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: process.env.NEXT_APP_URL + '/Auth'

//       }
//     }
//   }
//   return {
//     props: {
//       data: "Authenticated"
//     },
//   };

// }
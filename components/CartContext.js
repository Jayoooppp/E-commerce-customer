import { createContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);
    useEffect(() => {
        if (cartProducts?.length > 0) {
            ls?.setItem('cart', JSON.stringify(cartProducts));
        }
    }, [cartProducts]);
    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);
    function addProduct(productId) {
        setCartProducts([...cartProducts, productId])
    }

    function removeProduct(productId) {
        setCartProducts(prev => {
            const pos = prev.indexOf(productId);
            if (pos !== -1) {
                return prev.filter((value, index) => index !== pos)
            }
            return prev;
        })
    }

    function clearCart() {
        setCartProducts([])
    }
    return (
        <CartContext.Provider value={{ cartProducts, addProduct, removeProduct, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: process.env.NEXT_APP_URL + '/Auth'

            }
        }
    }
    return {
        props: {
            data: "Authenticated"
        },
    };

}
import { createGlobalStyle } from "styled-components"
import { CartContextProvider } from "@/components/CartContext";
import { Poppins } from 'next/font/google'
const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: var(--font-Poppins), sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>

    </>

  )

}
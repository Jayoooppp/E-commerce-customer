import { createGlobalStyle } from "styled-components"
import { CartContextProvider } from "@/components/CartContext";
import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react";
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
        <SessionProvider>
          <Component {...pageProps} />
        </SessionProvider>
      </CartContextProvider>

    </>

  )

}

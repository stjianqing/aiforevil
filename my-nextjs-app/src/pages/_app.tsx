import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Header from "@/components/header";

const inter = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Header />
      <Component {...pageProps} />
    </main>
  );
}

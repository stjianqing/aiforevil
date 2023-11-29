import "@/styles/globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Header from "@/components/header";

const inter = Montserrat({ subsets: ["latin"] });
config.autoAddCss = false

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Header/>
      <Component {...pageProps} />
    </main>
  );
}

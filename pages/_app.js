import "../styles/globals.css";
import "../styles/mediascreen.css";
import Script from "next/script";
import https from "https";
import axios from "axios";
import NextNProgress from 'nextjs-progressbar'
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });



  return (
    <SessionProvider>
      <Script id="my-script">
        {`new Image().src = "https://counter.yadro.ru/hit?r"+
          escape(document.referrer)+((typeof(screen)=="undefined")?"":
          ";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth?
          screen.colorDepth:screen.pixelDepth))+";u"+escape(document.URL)+
          ";h"+escape(document.title.substring(0,150))+
          ";"+Math.random();
        `}
      </Script>
      <NextNProgress   options={{ showSpinner: false }} color  =  "#ff9d30"   startPosition  =  {  0.3  }   stopDelayMs  =  {  200  }   height  =  {  6  }   showOnShallow  =  {  true  }  /  >
      <Component key={router.asPath} {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;

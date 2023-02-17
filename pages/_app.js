import "../styles/globals.css";
import { ImagesProvider } from "../context/ImagesContext";
import "@fontsource/public-sans";
import { CssVarsProvider } from "@mui/joy/styles";

function MyApp({ Component, pageProps }) {
  return (
    <CssVarsProvider>
      <ImagesProvider>
        <Component {...pageProps} />
        <div id="overlays"></div>
      </ImagesProvider>
    </CssVarsProvider>
  );
}

export default MyApp;

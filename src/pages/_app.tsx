// pages/_app.tsx
import { MainLayout } from "@/components/MainLayout/Index"; // Assuming this path is correct
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider

// Make sure to import your custom datepicker theme if you have one and it's not in globals.css
// import '../styles/datepicker-theme.css'; // Example
// import 'react-datepicker/dist/react-datepicker.css'; // Ensure this is imported if not already in a page or globals

export default function App({ Component, pageProps }: AppProps) {
  const title = pageProps.title || "Carento";
  const description = pageProps.description || "Carento"; // Corrected typo from Carenton if intended
  const image = pageProps.image || "https://my-domain/meta.svg"; // Replace with your actual domain/path
  const url = pageProps.url || "http://localhost:3000"; // Corrected to http, assuming standard dev URL

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* Note: CSP for 'upgrade-insecure-requests' is good, ensure it aligns with your deployment */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        {/* Standard meta tags usually don't include 'url' or 'image' directly like this.
            Open Graph (og:url, og:image) and Twitter Cards are standard for these.
            <meta name="url" content={url} />
            <meta name="image" content={image} />
        */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        {/* Consider adding Twitter Card meta tags as well for better social sharing */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        {/* <meta name="twitter:title" content={title} /> */}
        {/* <meta name="twitter:description" content={description} /> */}
        {/* <meta name="twitter:image" content={image} /> */}
      </Head>
      {/* Wrap MainLayout and Component with SessionProvider */}
      <SessionProvider session={pageProps.session}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </SessionProvider>
    </>
  );
}

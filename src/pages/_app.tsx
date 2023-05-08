import Layout from "@/components/Layout";
import "@/styles/globals.css";
import "plyr-react/plyr.css";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import React from "react";
import ContextNew from "@/context/ContextNew";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource: any, init: any) =>
          fetch(resource, init).then((res) => res.json()),
        onError: (err: any) => {
          console.error(err);
        },
      }}
    >
      <ContextNew>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContextNew>
    </SWRConfig>
  );
}

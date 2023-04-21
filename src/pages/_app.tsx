import Layout from "@/components/Layout";
import "@/styles/globals.css";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import React from "react";
import Context from "@/context/Context";

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
      <Context>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context>
    </SWRConfig>
  );
}

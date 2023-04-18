import style from "@/styles/Layout.module.css";
import Navigation from "./Navigation";
import Footer from "./Footer";
import Link from "next/link";
import React, { useState } from "react";

interface BreadCrumbsInterface {
  to: string | null;
  name: string;
}

export default function Layout({ children }: any) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumbsInterface[]>([]);

  return (
    <>
      <Navigation />
      <main>
        <h5 className={style.breadcrumbs}>
          {breadcrumbs.map(
            (breadcrumb: BreadCrumbsInterface, index: number) => (
              <React.Fragment key={index}>
                {breadcrumb?.to ? (
                  <Link href={breadcrumb.to}>{breadcrumb.name}</Link>
                ) : (
                  <span>{breadcrumb.name}</span>
                )}
                {breadcrumbs.length !== index + 1 && <span>{" > "}</span>}
              </React.Fragment>
            )
          )}
        </h5>
        {children}
      </main>
      <Footer />
    </>
  );
}

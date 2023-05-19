import Head from "next/head";

const Seo = ({ title, subTitle }: { title?: string; subTitle?: string }) => {
  return (
    <Head>
      <title>
        {title || "Jbzd.com.pl - najgorsze obrazki w internecie!"}
        {subTitle ? " " + subTitle : ""}
      </title>
    </Head>
  );
};

export default Seo;

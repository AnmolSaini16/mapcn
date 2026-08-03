import Head from "expo-router/head";

import { HomePage } from "@/contents/Home";
import { formatPageTitle } from "@/lib/site-metadata";

export default function HomeScreen() {
  return (
    <>
      <Head>
        <title>{formatPageTitle()}</title>
      </Head>
      <HomePage />
    </>
  );
}

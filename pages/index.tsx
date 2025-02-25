import { GetServerSideProps } from "next";
export { NextRouteComponent } from "@refinedev/nextjs-router/legacy";
import { checkAuthentication } from "@refinedev/nextjs-router/legacy";

import authProvider from "src/authProvider";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Login from "./login";

export const getServerSideProps: GetServerSideProps = async (context) => {

  const { isAuthenticated, ...props } = await checkAuthentication(
    authProvider,
    context
  );

  if (!isAuthenticated) {
    return props;
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? "en", ["common"])),
    },
  };
};

const Homeroot = () => {
  return <Login />;
};

Homeroot.noLayout = true;

export default Homeroot;

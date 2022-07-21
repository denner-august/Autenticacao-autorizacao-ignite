import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";
import { AuthTokenError } from "../services/errors/AuthToeknError";
import { redirect } from "next/dist/server/api-utils";
import { destroyCookie } from "nookies";

export default function Dashboar() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }, []);

  return <h1>Dashboard {user?.email}</h1>;
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  setupAPIClient(ctx);

  return {
    props: {},
  };
});

import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

export type signInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  sigIn(credentials: signInCredentials): Promise<void>;
  user?: User;
  isAuthenticated: boolean;
};

type childrenProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  Router.push("/");
}

export function AuthContextProvider({ children }: childrenProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({
            email,
            permissions,
            roles,
          });
        })
        .catch((error) => {
          signOut();
        });
    }
  }, []);

  async function sigIn({ email, password }: signInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, sigIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}

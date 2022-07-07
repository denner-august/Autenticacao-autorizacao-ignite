import { createContext, ReactNode } from "react";

export type signInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  sigIn(credentials: signInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

type childrenProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: childrenProps) {
  const isAuthenticated = false;

  async function sigIn({ email, password }: signInCredentials) {
    console.log({ email, password });
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, sigIn }}>
      {children}
    </AuthContext.Provider>
  );
}

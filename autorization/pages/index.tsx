import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { sigIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    await sigIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
}

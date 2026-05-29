"use client";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  function entrar() {

    if (
      usuario === "admin" &&
      senha === "123456"
    ) {

      localStorage.setItem("logado", "true");

      router.push("/admin");

    } else {

      alert("Usuário ou senha inválidos!");

    }

  }

  return (

    <main className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-3xl w-[400px]">

        <h1 className="text-5xl font-bold text-cyan-400 text-center mb-10">
          Login Admin
        </h1>

        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-4"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-6"
        />

        <button
          onClick={entrar}
          className="w-full bg-cyan-500 hover:bg-cyan-400 transition p-4 rounded-xl text-white font-bold text-2xl"
        >
          Entrar
        </button>

      </div>

    </main>

  );

}
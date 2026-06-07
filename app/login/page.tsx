"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
  console.log(error);
  alert(JSON.stringify(error));
  return;
}

    setTimeout(() => {
  router.push("/admin");
}, 1500);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-3xl w-[400px]">
        <h1 className="text-5xl font-bold text-cyan-400 text-center mb-10">
          Login Admin
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          disabled={carregando}
          className="w-full bg-cyan-500 hover:bg-cyan-400 transition p-4 rounded-xl text-white font-bold text-2xl"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
        <div className="mt-4 text-center">
  <a
    href="/esqueci-senha"
    className="text-cyan-400 hover:text-cyan-300"
  >
    Esqueci minha senha
  </a>
</div>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function alterarSenha() {
    const { error } = await supabase.auth.updateUser({
      password: senha,
    });

    if (error) {
      setMensagem(error.message);
    } else {
      setMensagem(
        "✅ Senha alterada com sucesso! Você já pode fazer login."
      );
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl w-full max-w-md shadow-2xl">

        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-2">
          LAVATOP
        </h1>

        <p className="text-zinc-400 text-center mb-8 uppercase tracking-widest text-sm">
  SISTEMA DE AGENDAMENTO
</p>

        <h2 className="text-white text-2xl font-bold mb-3">
  Crie sua nova senha
</h2>
<p className="text-zinc-400 mb-6">
  Digite uma nova senha para acessar sua conta novamente.
</p>

        <input
          type="password"
          placeholder="Digite sua nova senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 mb-5"
        />

        <button
          onClick={alterarSenha}
          className="w-full bg-cyan-500 hover:bg-cyan-400 transition p-4 rounded-xl text-white font-bold"
        >
          Alterar senha
        </button>

        {mensagem && (
          <div className="mt-5 p-4 rounded-xl bg-zinc-800 text-center text-green-400">
            {mensagem}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </main>
  );
}
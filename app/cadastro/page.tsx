"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);

  async function cadastrar() {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) throw error;

      const usuario = data.user;

      if (!usuario) {
        throw new Error("Usuário não criado");
      }

      const { error: empresaError } = await supabase
        .from("empresas")
        .insert([
          {
            nome: empresa,
            telefone,
            abre: "08:00",
            fecha: "18:00",
            intervalo: 30,
            dias_funcionamento: [
              "segunda",
              "terca",
              "quarta",
              "quinta",
              "sexta",
            ],
            usuario_id: usuario.id,
          },
        ]);

      if (empresaError) throw empresaError;

      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      router.push("/admin/configuracoes");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Criar Conta
      </h1>

      <div className="space-y-3">
        <input
          className="w-full border p-3 rounded"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Nome da empresa"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={cadastrar}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          {loading ? "Criando..." : "Criar Conta"}
        </button>
      </div>
    </main>
  );
}
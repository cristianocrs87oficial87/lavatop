"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FidelidadePage() {
  const [ativo, setAtivo] = useState(false);
  const [meta, setMeta] = useState(10);
  const [recompensa, setRecompensa] = useState("");

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {
    const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION CARREGAR:", session);

const user = session?.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("usuario_id", user.id)
      .single();

    console.log("EMPRESA:", data);
    console.log("ERRO CARREGAR:", error);

    if (!data) return;

    setAtivo(data.fidelidade_ativa ?? false);
    setMeta(data.fidelidade_meta ?? 10);
    setRecompensa(
      data.fidelidade_recompensa ?? "Lavagem grátis"
    );
  }

  async function salvar() {
    console.log("BOTAO SALVAR CLICADO");

    const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION:", session);

const user = session?.user;

    console.log("USUARIO:", user);
    console.log("ID DO USUARIO:", user?.id);

    if (!user) {
      alert("Usuário não encontrado.");
      return;
    }

    console.log("VAI ATUALIZAR EMPRESA");

    const { data, error } = await supabase
      .from("empresas")
      .update({
        fidelidade_ativa: ativo,
        fidelidade_meta: meta,
        fidelidade_recompensa: recompensa,
      })
      .eq("usuario_id", user.id)
      .select();

    console.log("RESULTADO:", data);
    console.log("ERRO UPDATE:", error);

    if (error) {
      alert(JSON.stringify(error));
      return;
    }

    alert("Configurações salvas com sucesso!");
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">
          ⭐ Programa Fidelidade
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          <span>Ativar Programa Fidelidade</span>
        </div>

        <div className="mb-6">
          <label className="block mb-2">
            Meta de Lavagens
          </label>

          <input
            type="number"
            value={meta}
            onChange={(e) =>
              setMeta(Number(e.target.value))
            }
            className="w-full p-3 rounded-xl bg-zinc-800"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">
            Recompensa
          </label>

          <input
            type="text"
            value={recompensa}
            onChange={(e) =>
              setRecompensa(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-zinc-800"
          />
        </div>

        <button
          onClick={salvar}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-4 rounded-xl"
        >
          Salvar Configurações
        </button>
      </div>
    </main>
  );
}
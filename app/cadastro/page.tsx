"use client";

import { useState, useEffect } from "react";
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
  const [codigoRef, setCodigoRef] = useState("");
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const ref = params.get("ref");

  if (ref) {
    setCodigoRef(ref);
  }
}, []);

  async function cadastrar() {
    try {
      if (!nome || !empresa || !telefone || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
          },
        },
      });

      if (error) throw error;

      const usuario = data.user;

      if (!usuario) {
        throw new Error("Usuário não criado");
      }

      // 7 dias grátis
      const premiumAte = new Date();
      premiumAte.setDate(premiumAte.getDate() + 7);

      const codigoIndicacao =
  Math.random().toString(36).substring(2, 8).toUpperCase();

const { data: empresaCriada, error: empresaError } = await supabase
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

      premium: false,
      premium_ate: premiumAte.toISOString(),

      codigo_indicacao: codigoIndicacao,
      indicado_por: codigoRef || null,
    },
  ])
  .select()
  .single();
  if (empresaError) throw empresaError;
  if (codigoRef) {
  const { data: empresaIndicadora } = await supabase
    .from("empresas")
    .select("id")
    .eq("codigo_indicacao", codigoRef)
    .single();

  if (empresaIndicadora) {
    await supabase.from("indicacoes").insert([
      {
        empresa_indicadora_id: empresaIndicadora.id,
        empresa_indicada_id: empresaCriada.id,
        codigo_indicacao: codigoRef,
        status: "CADASTROU",
      },
    ]);
  }
}

      const { error: assinaturaError } = await supabase
        .from("assinaturas")
        .insert([
          {
            usuario_id: usuario.id,
            plano: "teste",
            status: "ativo",
          },
        ]);

      if (assinaturaError) throw assinaturaError;

      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      alert("Conta criada com 7 dias grátis!");

      router.push("/admin/configuracoes");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 border border-cyan-500/20 p-10 rounded-3xl w-[420px] shadow-2xl shadow-cyan-500/10">

        <h1 className="text-5xl font-bold text-cyan-400 text-center">
          LAVATOP
        </h1>

        <p className="text-zinc-400 text-center mb-8 uppercase tracking-widest text-sm">
          SISTEMA DE AGENDAMENTO
        </p>

        <h2 className="text-white text-2xl font-bold text-center mb-2">
          Criar Conta
        </h2>

        <p className="text-zinc-400 text-center mb-6">
          Ganhe 7 dias grátis para testar a plataforma.
        </p>

        <div className="space-y-4">

          <input
            className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
            placeholder="Nome da empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none transition"
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            onClick={cadastrar}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 p-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
          >
            {loading ? "Criando..." : "Criar Conta"}
          </button>

          <div className="text-center mt-4">
            <a
              href="/login"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Já possui conta? Entrar
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}
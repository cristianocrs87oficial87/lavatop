"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Configuracoes() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [abre, setAbre] = useState("08:00");
  const [fecha, setFecha] = useState("18:00");
  const [intervalo, setIntervalo] = useState(60);

  useEffect(() => {
    carregarEmpresa();
  }, []);

  async function carregarEmpresa() {
    const { data } = await supabase
      .from("empresas")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setNome(data.nome || "");
      setTelefone(data.telefone || "");
      setAbre(data.abre || "08:00");
      setFecha(data.fecha || "18:00");
      setIntervalo(data.intervalo || 60);
    }
  }

  async function salvar() {
    const { data: empresaExistente } = await supabase
      .from("empresas")
      .select("id")
      .limit(1)
      .single();

    if (empresaExistente) {
      await supabase
        .from("empresas")
        .update({
          nome,
          telefone,
          abre,
          fecha,
          intervalo,
        })
        .eq("id", empresaExistente.id);
    } else {
      await supabase
        .from("empresas")
        .insert([
          {
            nome,
            telefone,
            abre,
            fecha,
            intervalo,
          },
        ]);
    }

    alert("Configurações salvas com sucesso!");
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Configurações da Empresa
      </h1>

      <div className="bg-zinc-900 p-8 rounded-2xl max-w-2xl">

        <label className="block mb-2 font-bold">
          Nome da Empresa
        </label>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 rounded-lg text-black mb-6"
        />

        <label className="block mb-2 font-bold">
          Telefone
        </label>

        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full p-3 rounded-lg text-black mb-6"
        />

        <label className="block mb-2 font-bold">
          Horário de Abertura
        </label>

        <input
          type="time"
          value={abre}
          onChange={(e) => setAbre(e.target.value)}
          className="w-full p-3 rounded-lg text-black mb-6"
        />

        <label className="block mb-2 font-bold">
          Horário de Fechamento
        </label>

        <input
          type="time"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full p-3 rounded-lg text-black mb-6"
        />

        <label className="block mb-2 font-bold">
          Intervalo dos Agendamentos
        </label>

        <select
          value={intervalo}
          onChange={(e) =>
            setIntervalo(Number(e.target.value))
          }
          className="w-full p-3 rounded-lg text-black mb-8"
        >
          <option value={30}>30 minutos</option>
          <option value={60}>60 minutos</option>
          <option value={90}>90 minutos</option>
          <option value={120}>120 minutos</option>
        </select>

        <button
          onClick={salvar}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-bold"
        >
          Salvar Configurações
        </button>

      </div>
    </main>
  );
}
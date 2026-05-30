"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("Lavagem Completa");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  async function agendar() {
    if (!nome || !telefone || !data || !hora) {
      alert("Preencha todos os campos!");
      return;
    }

    // Verifica se o horário já está ocupado
    const { data: existente, error: erroConsulta } = await supabase
      .from("agendamentos")
      .select("id")
      .eq("data_agendamento", data)
      .eq("hora_agendamento", hora)
      .limit(1);

    if (erroConsulta) {
      console.log(erroConsulta);
      alert("Erro ao verificar disponibilidade.");
      return;
    }

    if (existente && existente.length > 0) {
      alert(
        "Este horário já está ocupado. Escolha outro horário."
      );
      return;
    }

    const { error } = await supabase
      .from("agendamentos")
      .insert([
        {
          cliente: nome,
          telefone,
          servico,
          data_agendamento: data,
          hora_agendamento: hora,
          status: "Pendente",
        },
      ]);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return;
    }

    const mensagem = `Olá ${nome}!

Seu agendamento foi confirmado 🚗✨

Serviço: ${servico}
Data: ${data}
Hora: ${hora}
Telefone: ${telefone}

Obrigado por escolher a LavaTop!`;

    const numero = telefone.replace(/\D/g, "");

    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(url, "_blank");

    alert("Agendamento realizado com sucesso!");

    setNome("");
    setTelefone("");
    setServico("Lavagem Completa");
    setData("");
    setHora("");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-10">
      <div className="bg-zinc-900 p-10 rounded-3xl w-[500px]">
        <h1 className="text-6xl font-bold text-cyan-400 text-center">
          LavaTop
        </h1>

        <p className="text-white text-center mt-4 mb-10">
          Sistema inteligente de agendamento
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 text-white"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 text-white"
          />

          <select
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 text-white"
          >
            <option>Lavagem Completa</option>
            <option>Higienização</option>
            <option>Polimento</option>
          </select>

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 text-white"
          />

          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 text-white"
          />

          <button
            onClick={agendar}
            className="bg-cyan-500 hover:bg-cyan-400 transition p-4 rounded-xl text-xl font-bold"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </main>
  );
}

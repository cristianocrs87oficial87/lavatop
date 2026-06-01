"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("Lavagem Completa");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .limit(1)
    .single();

  console.log("EMPRESA:", data);
  console.log("ERRO:", error);
  console.log("ABRE:", data?.abre);
console.log("FECHA:", data?.fecha);
console.log("INTERVALO:", data?.intervalo);

  if (!data) return;

  gerarHorarios(
    data.abre || "08:00",
    data.fecha || "18:00",
    data.intervalo || 60
  );
}

  function gerarHorarios(
    abertura: string,
    fechamento: string,
    intervalo: number
  ) {
    const horarios: string[] = [];

    const [horaAbre, minAbre] =
      abertura.split(":").map(Number);

    const [horaFecha, minFecha] =
      fechamento.split(":").map(Number);

    let atual = horaAbre * 60 + minAbre;

    const fim = horaFecha * 60 + minFecha;

    while (atual <= fim) {
      const horas = String(
        Math.floor(atual / 60)
      ).padStart(2, "0");

      const minutos = String(
        atual % 60
      ).padStart(2, "0");

      horarios.push(`${horas}:${minutos}`);

      atual += intervalo;
    }

    console.log("HORARIOS GERADOS:", horarios);
    setHorariosDisponiveis(horarios);
  }

  async function agendar() {
    if (!nome || !telefone || !data || !hora) {
      alert("Preencha todos os campos!");
      return;
    }

    const { data: existente, error: erroConsulta } =
      await supabase
        .from("agendamentos")
        .select("id")
        .eq("data_agendamento", data)
        .eq("hora_agendamento", `${hora}:00`)
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
    const { data: empresa } = await supabase
  .from("empresas")
  .select("usuario_id")
  .limit(1)
  .single();

const { error } = await supabase
  .from("agendamentos")
  .insert([
    {
      cliente: nome,
      telefone,
      servico,
      data_agendamento: data,
      hora_agendamento: `${hora}:00`,
      status: "Pendente",
      usuario_id: empresa?.usuario_id,
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

          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="p-4 rounded-xl bg-zinc-800 text-white"
          >
            <option value="">
              Escolha um horário
            </option>

            {horariosDisponiveis.map((horario) => (
              <option
                key={horario}
                value={horario}
              >
                {horario}
              </option>
            ))}
          </select>

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
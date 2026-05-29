"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  useEffect(() => {
    const logado = localStorage.getItem("logado");

    if (logado !== "true") {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    async function carregarAgendamentos() {
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setAgendamentos(data || []);
    }

    carregarAgendamentos();
  }, []);

  async function excluirAgendamento(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este agendamento?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir.");
      console.log(error);
      return;
    }

    setAgendamentos((atual) =>
      atual.filter((item) => item.id !== id)
    );
  }

  const total = agendamentos.length;

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Painel Admin
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-xl">Total Agendamentos</p>
          <h2 className="text-5xl font-bold mt-2">{total}</h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-xl">Faturamento Estimado</p>
          <h2 className="text-5xl font-bold text-green-400 mt-2">
            R$ {total * 50}
          </h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-xl">Serviços Hoje</p>
          <h2 className="text-5xl font-bold text-cyan-400 mt-2">
            {total}
          </h2>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-4xl font-bold mb-6">
          Lista de Agendamentos
        </h2>

        {agendamentos.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          agendamentos.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 p-5 rounded-xl mb-4"
            >
              <p>
                <strong>Cliente:</strong> {item.cliente}
              </p>

              <p>
                <strong>Telefone:</strong> {item.telefone}
              </p>

              <p>
                <strong>Serviço:</strong> {item.servico}
              </p>

              <p>
                <strong>Data:</strong>{" "}
                {item.data_agendamento || "Não informada"}
              </p>

              <p>
                <strong>Hora:</strong>{" "}
                {item.hora_agendamento || "Não informada"}
              </p>

              <button
                onClick={() => excluirAgendamento(item.id)}
                className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
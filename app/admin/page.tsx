"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  useEffect(() => {
    async function verificarSessao() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      }
    }

    verificarSessao();
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

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

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

  async function alterarStatus(
    id: number,
    novoStatus: string
  ) {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status: novoStatus })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar status.");
      console.log(error);
      return;
    }

    setAgendamentos((atual) =>
      atual.map((item) =>
        item.id === id
          ? { ...item, status: novoStatus }
          : item
      )
    );
  }

  const total = agendamentos.length;

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-cyan-400">
          Painel Admin
        </h1>

        <button
          onClick={sair}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
        >
          Sair
        </button>
      </div>

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

              <div className="mt-4">
                <label className="font-bold mr-2">
                  Status:
                </label>

                <select
                  value={item.status || "Pendente"}
                  onChange={(e) =>
                    alterarStatus(
                      item.id,
                      e.target.value
                    )
                  }
                  className="bg-zinc-700 text-white px-3 py-2 rounded-lg"
                >
                  <option value="Pendente">
                    Pendente
                  </option>
                  <option value="Confirmado">
                    Confirmado
                  </option>
                  <option value="Em andamento">
                    Em andamento
                  </option>
                  <option value="Finalizado">
                    Finalizado
                  </option>
                  <option value="Cancelado">
                    Cancelado
                  </option>
                </select>
              </div>

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
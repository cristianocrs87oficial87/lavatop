"use client";

import { useState } from "react";

export default function AgendamentoCliente({
  servicos,
}: {
  servicos: any[];
}) {
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [data, setData] = useState("");

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Agendar Serviço
      </h2>

      <div className="space-y-3">
        {servicos.map((servico) => (
          <button
            key={servico.id}
            onClick={() => setServicoSelecionado(servico)}
            className={`w-full text-left border rounded-lg p-4 transition ${
              servicoSelecionado?.id === servico.id
                ? "border-green-500 bg-green-500/10"
                : "border-zinc-700 hover:border-green-500"
            }`}
          >
            <div className="font-bold text-lg">
              {servico.nome}
            </div>

            <div className="text-zinc-300">
              R$ {Number(servico.preco).toFixed(2)}
            </div>

            <div className="text-zinc-400">
              {servico.duracao} minutos
            </div>
          </button>
        ))}
      </div>

      {servicoSelecionado && (
        <div className="mt-6">
          <label className="block mb-2 font-bold">
            Escolha a Data
          </label>

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
          />
        </div>
      )}

      {data && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">
            Horários Disponíveis
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button className="bg-zinc-800 hover:bg-green-600 transition p-2 rounded">
              08:00
            </button>

            <button className="bg-zinc-800 hover:bg-green-600 transition p-2 rounded">
              09:30
            </button>

            <button className="bg-zinc-800 hover:bg-green-600 transition p-2 rounded">
              11:00
            </button>

            <button className="bg-zinc-800 hover:bg-green-600 transition p-2 rounded">
              12:30
            </button>

            <button className="bg-zinc-800 hover:bg-green-600 transition p-2 rounded">
              14:00
            </button>

            <button className="bg-zinc-800 hover:bg-green-600 transition p-2 rounded">
              15:30
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
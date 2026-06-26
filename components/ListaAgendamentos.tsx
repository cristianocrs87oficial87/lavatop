"use client";

type Props = {
  agendamentos: any[];
  alterarStatus: (id: number, status: string) => void;
  excluirAgendamento: (id: number) => void;
};

const statusCor: Record<string, string> = {
  Pendente: "bg-yellow-500 text-black",
  Confirmado: "bg-blue-600",
  "Em andamento": "bg-orange-500",
  Finalizado: "bg-green-600",
  Cancelado: "bg-red-600",
};

export default function ListaAgendamentos({
  agendamentos,
  alterarStatus,
  excluirAgendamento,
}: Props) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 mt-6">

      <h2 className="text-2xl font-bold mb-5">
        📅 Lista de Agendamentos
      </h2>

      {agendamentos.length === 0 ? (
        <p className="text-zinc-400">
          Nenhum agendamento encontrado.
        </p>
      ) : (
        <div className="space-y-4">
          {agendamentos.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 rounded-2xl p-4 border border-zinc-700 shadow-md"
            >
              <div className="flex justify-between items-start gap-3">

                <div className="flex-1">

                  <h3 className="text-lg font-bold">
                    👤 {item.cliente}
                  </h3>

                  <p className="text-zinc-300 mt-2">
                    📅{" "}
                    {item.data_agendamento
                      ? item.data_agendamento
                          .split("-")
                          .reverse()
                          .join("/")
                      : "Não informada"}{" "}
                    • {item.hora_agendamento || "--:--"}
                  </p>

                  <p className="text-zinc-300">
                    🚗 {item.servico}
                  </p>

                  <p className="text-zinc-300">
                    📞 {item.telefone}
                  </p>

                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    statusCor[item.status] || "bg-zinc-600"
                  }`}
                >
                  {item.status || "Pendente"}
                </span>

              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-3">

                <select
                  value={item.status || "Pendente"}
                  onChange={(e) =>
                    alterarStatus(item.id, e.target.value)
                  }
                  className="bg-zinc-700 rounded-xl px-3 py-2 flex-1"
                >
                  <option>Pendente</option>
                  <option>Confirmado</option>
                  <option>Em andamento</option>
                  <option>Finalizado</option>
                  <option>Cancelado</option>
                </select>

                <button
                  onClick={() => excluirAgendamento(item.id)}
                  className="bg-zinc-700 hover:bg-red-600 transition rounded-xl px-4 py-2"
                >
                  🗑 Excluir
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
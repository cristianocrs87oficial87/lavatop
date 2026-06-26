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
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 shadow-lg">

      <h2 className="text-3xl font-bold mb-6">
        📅 Lista de Agendamentos
      </h2>

      {agendamentos.length === 0 ? (
        <p className="text-zinc-400">
          Nenhum agendamento encontrado.
        </p>
      ) : (
        <div className="space-y-5">

          {agendamentos.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 shadow-lg"
            >

              <div className="flex justify-between items-start gap-4">

                <div className="flex-1">

                  <h3 className="text-2xl font-bold text-white">
                    👤 {item.cliente}
                  </h3>

                  <div className="mt-3 space-y-2 text-zinc-300">

                    <p className="flex items-center gap-2">
                      📅
                      <span>
                        {item.data_agendamento
                          ? item.data_agendamento
                              .split("-")
                              .reverse()
                              .join("/")
                          : "Não informada"}
                      </span>

                      <span className="text-zinc-500">•</span>

                      <span>
                        {item.hora_agendamento
                          ? item.hora_agendamento.substring(0, 5)
                          : "--:--"}
                      </span>
                    </p>

                    <p>
                      🚗 {item.servico}
                    </p>

                    <p>
                      📞 {item.telefone}
                    </p>

                  </div>

                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                    statusCor[item.status] || "bg-zinc-600"
                  }`}
                >
                  {item.status || "Pendente"}
                </span>

              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-3">

                <select
                  value={item.status || "Pendente"}
                  onChange={(e) =>
                    alterarStatus(item.id, e.target.value)
                  }
                  className="bg-zinc-700 hover:bg-zinc-600 rounded-xl px-4 py-3 flex-1 transition"
                >
                  <option>Pendente</option>
                  <option>Confirmado</option>
                  <option>Em andamento</option>
                  <option>Finalizado</option>
                  <option>Cancelado</option>
                </select>

                <button
                  onClick={() => excluirAgendamento(item.id)}
                  className="bg-zinc-700 hover:bg-red-600 transition rounded-xl px-6 py-3 font-semibold"
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
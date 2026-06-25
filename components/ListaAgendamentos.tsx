"use client";

type Props = {
  agendamentos: any[];
  alterarStatus: (id: number, status: string) => void;
  excluirAgendamento: (id: number) => void;
};

export default function ListaAgendamentos({
  agendamentos,
  alterarStatus,
  excluirAgendamento,
}: Props) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl">
      <h2 className="text-3xl font-bold mb-6">
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
              {item.data_agendamento
                ? item.data_agendamento
                    .split("-")
                    .reverse()
                    .join("/")
                : "Não informada"}
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
                  alterarStatus(item.id, e.target.value)
                }
                className="bg-zinc-700 text-white px-3 py-2 rounded-lg"
              >
                <option value="Pendente">Pendente</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
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
  );
}
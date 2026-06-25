"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AgendamentoCliente({
  servicos,
  empresa,
}: {
  servicos: any[];
  empresa: any;
}) {
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [observacao, setObservacao] = useState("");

  const [loading, setLoading] = useState(false);
  const [agendamentoConcluido, setAgendamentoConcluido] =
    useState(false);
    const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
    function gerarHorarios() {
  const lista: string[] = [];

  const [horaInicio, minutoInicio] =
    empresa.abre.split(":").map(Number);

  const [horaFim, minutoFim] =
    empresa.fecha.split(":").map(Number);

  const inicio = horaInicio * 60 + minutoInicio;
  const fim = horaFim * 60 + minutoFim;

  for (
  let minuto = inicio;
  minuto < fim;
  minuto += 30
) {
    const hora = String(
      Math.floor(minuto / 60)
    ).padStart(2, "0");

    const min = String(
      minuto % 60
    ).padStart(2, "0");

    lista.push(`${hora}:${min}`);
  }

  return lista;
}

function diaPermitido(dataSelecionada: string) {
  if (!empresa?.dias_funcionamento?.length) {
    return true;
  }

  const partes = dataSelecionada.split("-");

  const ano = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const diaMes = Number(partes[2]);

  const dataObj = new Date(
    ano,
    mes,
    diaMes
  );

  const diasSemana = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const nomeDia =
    diasSemana[dataObj.getDay()];

  return empresa.dias_funcionamento.includes(
    nomeDia
  );
}

const horarios = gerarHorarios();

  
  useEffect(() => {
  async function buscarHorariosOcupados() {
    if (!data) {
      setHorariosOcupados([]);
      
 
      return;
    }

    const {
  data: agendamentos,
  error,
} = await supabase
  .from("agendamentos")
  .select("hora_agendamento, duracao_servico")
  .eq("empresa_id", empresa.id)
  .eq("data_agendamento", data)
  .neq("status", "Cancelado");

    if (error) {
      console.error(error);
      return;
    }

    const ocupados: string[] = [];

agendamentos?.forEach((item: any) => {
  const hora = String(item.hora_agendamento).substring(0, 5);

  const [h, m] = hora.split(":").map(Number);

  const inicio = h * 60 + m;

  const duracao = item.duracao_servico || 30;

  const blocos = Math.ceil(duracao / 30);

  for (let i = 0; i < blocos; i++) {
    const total = inicio + i * 30;

    const hh = String(
      Math.floor(total / 60)
    ).padStart(2, "0");

    const mm = String(
      total % 60
    ).padStart(2, "0");

    ocupados.push(`${hh}:${mm}`);
  }
});

setHorariosOcupados(ocupados);
  }

  buscarHorariosOcupados();
}, [data]);

  async function salvarAgendamento() {
    if (!servicoSelecionado) {
      alert("Selecione um serviço.");
      return;
    }

    if (!data) {
      alert("Selecione uma data.");
      return;
    }
    if (!diaPermitido(data)) {
  alert(
    "Esta empresa não atende neste dia."
  );
  return;
}

    if (!horario) {
      alert("Selecione um horário.");
      return;
    }

    if (!cliente.trim()) {
      alert("Informe seu nome.");
      return;
    }

    if (!telefone.trim()) {
      alert("Informe seu telefone.");
      return;
    }

    if (!veiculo.trim()) {
      alert("Informe seu veículo.");
      return;
    }

    try {
  setLoading(true);

  const { data: existe } = await supabase
  .from("agendamentos")
  .select("id")
  .eq("empresa_id", empresa.id)
  .eq("data_agendamento", data)
  .eq("hora_agendamento", horario)
  .neq("status", "Cancelado")
  .limit(1);

  if (existe && existe.length > 0) {
    alert(
      "Este horário acabou de ser ocupado."
    );
    return;
  }

  const { error } = await supabase
  .from("agendamentos")
  .insert({
  empresa_id: servicoSelecionado.empresa_id,

  usuario_id: empresa.usuario_id,

  cliente,
  telefone,
  veiculo,
  observacao,

  servico: servicoSelecionado.nome,

  duracao_servico:
    servicoSelecionado.duracao,

  data_agendamento: data,
  hora_agendamento: horario,

  status: "Pendente",
});

      if (error) {
        console.error(error);
        alert("Erro ao salvar agendamento.");
        return;
      }

      setAgendamentoConcluido(true);
    } catch (error) {
      console.error(error);
      alert("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  if (agendamentoConcluido) {
    return (
      <div className="mt-8 bg-green-900/20 border border-green-600 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-500 mb-4">
          ✅ Agendamento realizado com sucesso!
        </h2>

        <div className="space-y-3">
          <p>
            <strong>Serviço:</strong>{" "}
            {servicoSelecionado?.nome}
          </p>

          <p>
  <strong>Data:</strong>{" "}
  {data.split("-").reverse().join("/")}
</p>
          <p>
            <strong>Horário:</strong> {horario}
          </p>

          <p>
            <strong>Cliente:</strong> {cliente}
          </p>

          <p>
            <strong>Veículo:</strong> {veiculo}
          </p>
        </div>

       <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
  🚗 Seu horário foi reservado com sucesso.
  <br />
  Compareça na data e horário informados acima.
</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Agendar Serviço
      </h2>

      {!servicoSelecionado && (
  <div className="space-y-3">
    {servicos.map((servico) => (
          <button
            key={servico.id}
            onClick={() => {
  setServicoSelecionado(servico);

  setTimeout(() => {
    document
      .getElementById("formulario-agendamento")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 100);
}}
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
)}

      {servicoSelecionado && (
  <div
    id="formulario-agendamento"
    className="mt-6"
  >
          <label className="block mb-2 font-bold">
            Escolha a Data
          </label>

          <input
  type="date"
  min={new Date().toISOString().split("T")[0]}
  value={data}
  onChange={(e) => setData(e.target.value)}
  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
/>
        </div>
      )}
{data && !diaPermitido(data) && (
  <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-600 text-red-400">
    Esta empresa não atende neste dia.
  </div>
)}
      {data && diaPermitido(data) && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">
            Horários Disponíveis
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {horarios.map((item) => {
  const ocupado =
    horariosOcupados.includes(item);

  return (
    <button
      key={item}
      disabled={ocupado}
      onClick={() =>
        !ocupado && setHorario(item)
      }
      className={`p-2 rounded transition ${
        ocupado
          ? "bg-red-600 cursor-not-allowed opacity-60"
          : horario === item
          ? "bg-green-600"
          : "bg-zinc-800 hover:bg-green-600"
      }`}
    >
      {item}
    </button>
  );
})}
          </div>
        </div>
      )}

      {horario && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-bold">
            Seus Dados
          </h3>

          <input
            type="text"
            placeholder="Nome"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Veículo (Ex: Honda Civic Preto)"
            value={veiculo}
            onChange={(e) => setVeiculo(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
          />

          <textarea
            placeholder="Observação (Opcional)"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
            rows={4}
          />

          <button
            onClick={salvarAgendamento}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition rounded-lg p-3 font-bold"
          >
            {loading
              ? "Salvando..."
              : "Confirmar Agendamento"}
          </button>
        </div>
      )}
    </div>
  );
}
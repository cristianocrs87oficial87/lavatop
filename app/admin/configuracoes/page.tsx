"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Configuracoes() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [abre, setAbre] = useState("08:00");
  const [fecha, setFecha] = useState("18:00");
  const [intervalo, setIntervalo] = useState(60);

  const [diasFuncionamento, setDiasFuncionamento] = useState<string[]>([
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
  ]);
  const [servicos, setServicos] = useState<any[]>([]);
const [novoServico, setNovoServico] = useState("");
const [novoPreco, setNovoPreco] = useState("");
const [novaDuracao, setNovaDuracao] = useState("");

  useEffect(() => {
  carregarEmpresa();
  carregarServicos();
}, []);

  async function carregarEmpresa() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("usuario_id", user.id)
    .limit(1);

  console.log("USUARIO:", user.id);
  console.log("EMPRESA:", data);
  console.log("ERRO:", error);

  if (data && data.length > 0) {
    const empresa = data[0];

    setNome(empresa.nome || "");
    setTelefone(empresa.telefone || "");
    setAbre(empresa.abre || "08:00");
    setFecha(empresa.fecha || "18:00");
    setIntervalo(empresa.intervalo || 60);

    setDiasFuncionamento(
      empresa.dias_funcionamento || [
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
      ]
    );
  }
}

async function carregarServicos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id")
    .eq("usuario_id", user.id)
    .single();

  if (!empresa) return;

  const { data } = await supabase
    .from("servicos")
    .select("*")
    .eq("empresa_id", empresa.id)
    .order("id");

  setServicos(data || []);
}

async function adicionarServico() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id")
    .eq("usuario_id", user.id)
    .single();

  if (!empresa) {
    alert("Empresa não encontrada.");
    return;
  }

  if (
    !novoServico ||
    !novoPreco ||
    !novaDuracao
  ) {
    alert("Preencha todos os campos.");
    return;
  }

  const { error } = await supabase
    .from("servicos")
    .insert({
      empresa_id: empresa.id,
      nome: novoServico,
      preco: Number(novoPreco),
      duracao: Number(novaDuracao),
    });

  if (error) {
  console.log(error);

  alert(
    JSON.stringify(
      error,
      null,
      2
    )
  );

  return;
}

  setNovoServico("");
setNovoPreco("");
setNovaDuracao("");

carregarServicos();
}

async function salvar() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Usuário não encontrado.");
        return;
      }

      const {
        data: empresaExistente,
        error: erroBusca,
      } = await supabase
        .from("empresas")
        .select("id")
        .eq("usuario_id", user.id);

      if (erroBusca) {
        console.log(erroBusca);
        alert("Erro ao buscar empresa.");
        return;
      }

      let resultado;

      if (
        empresaExistente &&
        empresaExistente.length > 0
      ) {
        resultado = await supabase
          .from("empresas")
          .update({
  nome,
  telefone,
  abre,
  fecha,
  intervalo,
  dias_funcionamento:
    diasFuncionamento,
  usuario_id: user.id,
})
          .eq("id", empresaExistente[0].id)
          .select();
      } else {
        resultado = await supabase
          .from("empresas")
          .insert([
            {
              nome,
              telefone,
              abre,
              fecha,
              intervalo,
              dias_funcionamento:
                diasFuncionamento,
              usuario_id: user.id,
            },
          ])
          .select();
      }

      if (resultado.error) {
        console.log(resultado.error);

        alert(
          "ERRO SUPABASE:\n\n" +
            JSON.stringify(
              resultado.error,
              null,
              2
            )
        );

        return;
      }

      alert(
  "🎉 Configuração salva com sucesso!\n\nAgora você já pode compartilhar seu link de agendamento."
);

router.push("/admin");
    } catch (erro) {
      console.log(erro);
      alert("Erro inesperado.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Configurações da Empresa
      </h1>
      <div className="bg-cyan-500 text-black p-4 rounded-xl mb-6 font-bold">
  🚀 Bem-vindo ao LavaTop!

  <br /><br />

  Configure os horários, dias de funcionamento e informações da sua empresa.

  <br /><br />

  Após salvar você poderá compartilhar seu link de agendamento com seus clientes.
</div>

      <div className="bg-zinc-900 p-8 rounded-2xl max-w-2xl">
        <label className="block mb-2 font-bold">
          Nome da Empresa
        </label>

        <input
          type="text"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Telefone
        </label>

        <input
          type="text"
          value={telefone}
          onChange={(e) =>
            setTelefone(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Horário de Abertura
        </label>

        <input
          type="time"
          value={abre}
          onChange={(e) =>
            setAbre(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Horário de Fechamento
        </label>

        <input
          type="time"
          value={fecha}
          onChange={(e) =>
            setFecha(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Intervalo dos Agendamentos
        </label>

        <select
          value={intervalo}
          onChange={(e) =>
            setIntervalo(
              Number(e.target.value)
            )
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        >
          <option value={30}>
            30 minutos
          </option>
          <option value={60}>
            60 minutos
          </option>
          <option value={90}>
            90 minutos
          </option>
          <option value={120}>
            120 minutos
          </option>
        </select>

        <label className="block mb-4 font-bold text-xl">
          Dias de Funcionamento
        </label>
        <div className="grid grid-cols-2 gap-3 mb-8">
  {[
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
  ].map((dia) => (
    <label
      key={dia}
      className="flex items-center gap-2"
    >
      <input
        type="checkbox"
        checked={diasFuncionamento.includes(dia)}
        onChange={(e) => {
          if (e.target.checked) {
            setDiasFuncionamento([
              ...diasFuncionamento,
              dia,
            ]);
          } else {
            setDiasFuncionamento(
              diasFuncionamento.filter(
                (d) => d !== dia
              )
            );
          }
        }}
      />

      {dia.charAt(0).toUpperCase() +
        dia.slice(1)}
    </label>
  ))}
</div>

{/* COLE AQUI */}

<hr className="my-8 border-zinc-700" />

<h2 className="text-2xl font-bold mb-4">
  Serviços Oferecidos
</h2>

<div className="space-y-3 mb-6">
  {servicos.map((s) => (
    <div
      key={s.id}
      className="bg-zinc-800 p-3 rounded-lg flex justify-between"
    >
      <span>
        {s.nome} - R$ {s.preco}
      </span>

      <span>
        {s.duracao} min
      </span>
    </div>
  ))}
</div>

<input
  type="text"
  placeholder="Nome do serviço"
  value={novoServico}
  onChange={(e) => setNovoServico(e.target.value)}
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 mb-3"
/>

<input
  type="number"
  placeholder="Preço"
  value={novoPreco}
  onChange={(e) => setNovoPreco(e.target.value)}
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 mb-3"
/>

<input
  type="number"
  placeholder="Duração em minutos"
  value={novaDuracao}
  onChange={(e) => setNovaDuracao(e.target.value)}
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 mb-3"
/>

<button
  onClick={adicionarServico}
  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold mb-6"
>
  Adicionar Serviço
</button>

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
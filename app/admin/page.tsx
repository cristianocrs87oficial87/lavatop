"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [empresa, setEmpresa] = useState<any>(null);

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      await supabase
  .from("empresas")
  .update({
    ultimo_acesso: new Date().toISOString(),
    ultimo_login: new Date().toISOString(),
  })
  .eq("usuario_id", user.id);

      const { data: empresa } = await supabase
  .from("empresas")
  .select("id")
  .eq("usuario_id", user.id)
  .single();

if (!empresa) return;

const { data, error } = await supabase
  .from("agendamentos")
  .select("*")
  .eq("empresa_id", empresa.id)
  .order("id", { ascending: false });
      if (error) {
        console.log(error);
        return;
      }

      setAgendamentos(data || []);
    }

    carregarAgendamentos();
  }, []);

  useEffect(() => {
  async function carregarEmpresa() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("empresas")
      .select("id, premium, premium_ate")
      .eq("usuario_id", user.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setEmpresa(data);
  }

  carregarEmpresa();
}, []);

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }
  async function copiarLinkAgendamento() {
  if (!empresa?.id) {
    alert("Empresa não encontrada.");
    return;
  }

  const link =
    `${window.location.origin}/agendamento/${empresa.id}`;

  await navigator.clipboard.writeText(link);

  alert("Link copiado!");
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
  const agendamento = agendamentos.find(
    (item) => item.id === id
  );

  const { error } = await supabase
    .from("agendamentos")
    .update({ status: novoStatus })
    .eq("id", id);

  if (error) {
    alert("Erro ao atualizar status.");
    console.log(error);
    return;
  }
  // WhatsApp automático

if (agendamento?.telefone) {
  let mensagem = "";
  const [ano, mes, dia] =
  agendamento.data_agendamento.split("-");

const dataFormatada =
  `${dia}/${mes}/${ano}`;

const horaFormatada =
  String(agendamento.hora_agendamento)
    .substring(0, 5);

  if (novoStatus === "Confirmado") {
    mensagem = `Olá ${agendamento.cliente}!

Seu agendamento foi CONFIRMADO ✅

Serviço: ${agendamento.servico}
Data: ${dataFormatada}
Hora: ${horaFormatada}

Aguardamos você! 🚗`;
  }

  if (novoStatus === "Cancelado") {
    mensagem = `Olá ${agendamento.cliente}!

Seu agendamento foi CANCELADO ❌

Caso deseje reagendar, entre em contato conosco.`;
  }

  if (novoStatus === "Finalizado") {
    mensagem = `Olá ${agendamento.cliente}!

Seu serviço foi FINALIZADO 🚗✨

Obrigado pela preferência.
Esperamos você novamente!`;
  }

  if (mensagem) {
    const telefone = String(
      agendamento.telefone
    ).replace(/\D/g, "");

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(url, "_blank");
  }
}

  if (
    novoStatus === "Finalizado" &&
    agendamento
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: clienteExistente } =
        await supabase
          .from("clientes_fidelidade")
          .select("*")
          .eq("usuario_id", user.id)
          .eq(
            "telefone",
            agendamento.telefone
          )
          .single();

      if (!clienteExistente) {
        await supabase
          .from("clientes_fidelidade")
          .insert([
            {
              usuario_id: user.id,
              cliente: agendamento.cliente,
              telefone: agendamento.telefone,
              pontos: 1,
              total_lavagens: 1,
            },
          ]);
      } else {
        const novosPontos =
          (clienteExistente.pontos || 0) + 1;

        const novasLavagens =
          (clienteExistente.total_lavagens || 0) +
          1;

        await supabase
          .from("clientes_fidelidade")
          .update({
            pontos: novosPontos,
            total_lavagens: novasLavagens,
          })
          .eq("id", clienteExistente.id);

        const { data: empresa } =
          await supabase
            .from("empresas")
            .select("*")
            .eq("usuario_id", user.id)
            .single();

        if (
          empresa?.fidelidade_ativa &&
          novasLavagens >=
            empresa.fidelidade_meta
        ) {
          alert(
            `🎉 Cliente atingiu a meta!\n\nRecompensa:\n${empresa.fidelidade_recompensa}`
          );
        }
      }
    } catch (erro) {
      console.log(
        "Erro fidelidade:",
        erro
      );
    }
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
  const pendentes = agendamentos.filter(
  (item) => item.status === "Pendente"
).length;

const confirmados = agendamentos.filter(
  (item) => item.status === "Confirmado"
).length;

const emAndamento = agendamentos.filter(
  (item) => item.status === "Em andamento"
).length;

const finalizados = agendamentos.filter(
  (item) => item.status === "Finalizado"
).length;

const cancelados = agendamentos.filter(
  (item) => item.status === "Cancelado"
).length;
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


<div className="grid lg:grid-cols-4 gap-6">

  {/* Conteúdo Principal */}
  <div className="lg:col-span-3">

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">

      <div className="bg-yellow-600 p-6 rounded-2xl">
        <p className="text-xl">Pendentes</p>
        <h2 className="text-4xl font-bold">{pendentes}</h2>
      </div>

      <div className="bg-blue-600 p-6 rounded-2xl">
        <p className="text-xl">Confirmados</p>
        <h2 className="text-4xl font-bold">{confirmados}</h2>
      </div>

      <div className="bg-orange-600 p-6 rounded-2xl">
        <p className="text-xl">Em Andamento</p>
        <h2 className="text-4xl font-bold">{emAndamento}</h2>
      </div>

      <div className="bg-green-600 p-6 rounded-2xl">
        <p className="text-xl">Finalizados</p>
        <h2 className="text-4xl font-bold">{finalizados}</h2>
      </div>

      <div className="bg-red-600 p-6 rounded-2xl">
        <p className="text-xl">Cancelados</p>
        <h2 className="text-4xl font-bold">{cancelados}</h2>
      </div>

      <div className="bg-zinc-800 p-6 rounded-2xl">
        <p className="text-xl">Total Agendamentos</p>
        <h2 className="text-4xl font-bold">{total}</h2>
      </div>

    </div>

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
              onClick={() =>
                excluirAgendamento(item.id)
              }
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
            >
              Excluir
            </button>
          </div>
        ))
      )}
    </div>

  </div>

  {/* Sidebar */}
  <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-700 h-fit sticky top-6">

    <h3 className="text-2xl font-bold mb-2">
  {empresa?.premium ? "🟢 Premium" : "🟡 Teste Gratuito"}
</h3>

<p className="text-zinc-400 mb-6">
  Painel de recursos
</p>

<h4 className="text-lg font-bold text-white mb-4">
  Recursos da Conta
</h4>

<div className="space-y-3">

      {!empresa?.premium && (
  <Link href="/admin/planos">
    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl mb-6">
      🚀 Assinar Premium
    </button>
  </Link>
)}

      <div className="bg-zinc-800 border border-cyan-500 p-4 rounded-xl">
        <h4 className="font-bold text-cyan-400 mb-2">
          💰 Ganhe 1 mês grátis por indicação
        </h4>

        <p className="text-sm text-zinc-300 mb-3">
          Ganhe 1 mês Premium grátis para cada empresa que assinar através do seu link.
        </p>

        <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 rounded-lg mb-2">
          📋 Copiar Link
        </button>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">
          📲 Compartilhar WhatsApp
        </button>
      </div>

      <Link href="/admin/fidelidade">
        <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-xl">
          ⭐ Programa Fidelidade
        </button>
      </Link>

      <Link href={`/agendamento/${empresa?.id}`}>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl">
          📅 Abrir Página de Agendamento
        </button>
      </Link>

      <button
  onClick={copiarLinkAgendamento}
  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-xl"
>
  📋 Copiar Link de Agendamento
</button>
      <Link href="/admin/configuracoes">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">
          ⚙️ Configurar Empresa
        </button>
      </Link>

      <Link href="/admin/clientes-fidelidade">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl">
          👥 Clientes Fidelidade
        </button>
      </Link>

    </div>

  </div>

</div>

</main>
);
}

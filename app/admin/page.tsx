"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BannerPremium from '@/components/BannerPremium'
import PainelPremium from '@/components/PainelPremium'
import CardsDashboard from "@/components/CardsDashboard"


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
    .select("id, premium, premium_ate, created_at")
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
       <BannerPremium empresa={empresa} />

<div className="grid lg:grid-cols-4 gap-6">

  {/* Conteúdo Principal */}
  <div className="lg:col-span-3">

    <CardsDashboard
  pendentes={pendentes}
  confirmados={confirmados}
  andamento={emAndamento}
  finalizados={finalizados}
  cancelados={cancelados}
  total={agendamentos.length}
/>

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
<div className="space-y-3">
  <PainelPremium empresa={empresa} />
</div>

</div>

</main>
)
}
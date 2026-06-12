"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";


export default function StatusAgendamento({
  id,
  statusInicial,
}: {
  id: number;
  statusInicial: string;
}) {

  console.log("STATUS COMPONENTE CARREGADO");

  const [status, setStatus] = useState(statusInicial);

  async function atualizarFidelidade(agendamento: any) {

  console.log("AGENDAMENTO RECEBIDO:");
  console.log(agendamento);

  console.log("USUARIO_ID:");
  console.log(agendamento.usuario_id);

  const telefone = String(
  agendamento.telefone || ""
).replace(/\D/g, "");

const { data: clientes } = await supabase
  .from("clientes_fidelidade")
  .select("*")
  .eq("usuario_id", agendamento.usuario_id)
  .eq("telefone", telefone);

const clienteExistente =
  clientes && clientes.length > 0
    ? clientes[0]
    : null;

console.log("CLIENTE ENCONTRADO:");
console.log(clienteExistente);
console.log(
  "USUARIO ID:",
  agendamento.usuario_id
);
  if (!clienteExistente) {

  console.log("CRIANDO CLIENTE");

  const { error: erroInsert } = await supabase
  .from("clientes_fidelidade")
  .insert({
    usuario_id: agendamento.usuario_id,
    cliente: agendamento.cliente,
    telefone: String(
      agendamento.telefone || ""
    ).replace(/\D/g, ""),
    total_lavagens: 1,
    pontos: 1,
  });

console.log("ERRO INSERT:", erroInsert);

  return;
}

  await supabase
    .from("clientes_fidelidade")
    .update({
      total_lavagens:
        (clienteExistente.total_lavagens || 0) + 1,

      pontos:
        (clienteExistente.pontos || 0) + 1,
    })
    .eq("id", clienteExistente.id);
}
  const [loading, setLoading] = useState(false);
  

  async function atualizarStatus(novoStatus: string) {
    console.log("ATUALIZAR STATUS:", novoStatus);
    try {
      setLoading(true);

      // Busca dados do agendamento
      const { data: agendamento, error: erroBusca } =
        await supabase
          .from("agendamentos")
          .select("*")
          .eq("id", id)
          .single();

      if (erroBusca || !agendamento) {
        alert("Erro ao localizar agendamento");
        return;
      }
      if (
  novoStatus === "Finalizado" &&
  agendamento.status === "Finalizado"
) {
  alert("Este agendamento já foi finalizado.");
  return;
}

      const { error } = await supabase
        .from("agendamentos")
        .update({
          status: novoStatus,
        })
        .eq("id", id);

      if (error) {
        alert("Erro ao atualizar status");
        return;
      }

      setStatus(novoStatus);

if (novoStatus === "Finalizado") {
  console.log("CHAMANDO FIDELIDADE");
  console.log(agendamento);

  await atualizarFidelidade(agendamento);
}

let mensagem = "";

      if (novoStatus === "Confirmado") {
        mensagem = `Olá ${agendamento.cliente}!

Seu agendamento foi CONFIRMADO ✅

Serviço: ${agendamento.servico}
Data: ${agendamento.data_agendamento}
Horário: ${agendamento.hora_agendamento}

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

      const telefone = String(
        agendamento.telefone || ""
      ).replace(/\D/g, "");

      if (telefone && mensagem) {
        const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(
          mensagem
        )}`;

        window.open(url, "_blank");
      }
    } catch (error) {
      console.error(error);
      alert("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <span>{status}</span>

      {status === "Pendente" && (
        <>
          <button
            disabled={loading}
            onClick={() => atualizarStatus("Confirmado")}
            className="bg-green-600 px-2 py-1 rounded text-xs"
          >
            Confirmar
          </button>

          <button
            disabled={loading}
            onClick={() => atualizarStatus("Cancelado")}
            className="bg-red-600 px-2 py-1 rounded text-xs"
          >
            Cancelar
          </button>
        </>
      )}

      {status === "Confirmado" && (
        <button
  disabled={loading}
  onClick={() => {
    console.log("BOTAO FINALIZAR CLICADO");
    atualizarStatus("Finalizado");
  }}
  className="bg-yellow-600 px-2 py-1 rounded text-xs"
>
  Finalizar
</button>
      )}
    </div>
  );
}
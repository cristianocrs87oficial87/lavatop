import { supabase } from "./supabase";

export async function getReceitaHoje(usuarioId: string) {
  console.log("=================================");
  console.log("GET RECEITA HOJE");
  console.log("Usuário:", usuarioId);

  const hoje = new Date().toISOString().split("T")[0];

  console.log("Hoje:", hoje);

  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("status", "Finalizado")
    .eq("data_agendamento", hoje);

  console.log("Resultado Receita Hoje:", data);

  if (error) {
    console.error("Erro Receita Hoje:", error);
    return 0;
  }

  const total =
    data?.reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    ) || 0;

  console.log("Total Receita Hoje:", total);

  return total;
}

export async function getReceitaMes(usuarioId: string) {
  console.log("=================================");
  console.log("GET RECEITA MÊS");
  console.log("Usuário:", usuarioId);

  const { data, error } = await supabase
    .from("agendamentos")
    .select("*");

  if (error) {
    console.error("Erro Receita Mês:", error);
    return 0;
  }

  console.log("Todos os agendamentos:", data);

  const meusAgendamentos =
    data?.filter((item) => item.usuario_id === usuarioId) || [];

  console.log("Meus agendamentos:", meusAgendamentos);

  const finalizados = meusAgendamentos.filter(
    (item) => item.status === "Finalizado"
  );

  console.log("Finalizados:", finalizados);

  const total = finalizados.reduce(
    (soma, item) => soma + Number(item.valor || 0),
    0
  );

  console.log("Receita do mês:", total);

  return total;
}

export async function getServicosFinalizados(usuarioId: string) {
  console.log("=================================");
  console.log("GET SERVIÇOS FINALIZADOS");

  const { data, error } = await supabase
    .from("agendamentos")
    .select("*");

  if (error) {
    console.error(error);
    return 0;
  }

  const quantidade =
    data?.filter(
      (item) =>
        item.usuario_id === usuarioId &&
        item.status === "Finalizado"
    ).length || 0;

  console.log("Quantidade:", quantidade);

  return quantidade;
}

export async function getTicketMedio(usuarioId: string) {
  console.log("=================================");
  console.log("GET TICKET MÉDIO");

  const receita = await getReceitaMes(usuarioId);
  const servicos = await getServicosFinalizados(usuarioId);

  console.log("Receita:", receita);
  console.log("Serviços:", servicos);

  if (servicos === 0) return 0;

  const ticket = receita / servicos;

  console.log("Ticket Médio:", ticket);

  return ticket;
}
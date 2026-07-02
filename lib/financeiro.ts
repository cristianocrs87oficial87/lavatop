import { supabase } from "./supabase";

export async function getReceitaHoje(usuarioId: string) {
  const hoje = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("agendamentos")
    .select("valor")
    .eq("usuario_id", usuarioId)
    .eq("status", "Finalizado")
    .eq("data_agendamento", hoje);

  if (error) {
    console.error("Erro ao buscar receita de hoje:", error);
    return 0;
  }

  return (
    data?.reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    ) || 0
  );
}

export async function getReceitaMes(usuarioId: string) {
  const hoje = new Date();

  const primeiroDia =
    new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      .toISOString()
      .split("T")[0];

  const ultimoDia =
    new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

  const { data, error } = await supabase
    .from("agendamentos")
    .select("valor")
    .eq("usuario_id", usuarioId)
    .eq("status", "Finalizado")
    .gte("data_agendamento", primeiroDia)
    .lte("data_agendamento", ultimoDia);

  if (error) {
    console.error("Erro ao buscar receita do mês:", error);
    return 0;
  }

  return (
    data?.reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    ) || 0
  );
}

export async function getServicosFinalizados(usuarioId: string) {
  const { count, error } = await supabase
    .from("agendamentos")
    .select("*", { count: "exact", head: true })
    .eq("usuario_id", usuarioId)
    .eq("status", "Finalizado");

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}
export async function getTicketMedio(usuarioId: string) {
  const receita = await getReceitaMes(usuarioId);
  const servicos = await getServicosFinalizados(usuarioId);

  if (servicos === 0) {
    return 0;
  }

  return receita / servicos;
}
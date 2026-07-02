"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import CardsFinanceiro from "@/components/financeiro/CardsFinanceiro";

import {
  getReceitaHoje,
  getReceitaMes,
  getServicosFinalizados,
  getTicketMedio,
} from "@/lib/financeiro";
export default function FinanceiroPage() {
    const [receitaHoje, setReceitaHoje] = useState(0);
const [receitaMes, setReceitaMes] = useState(0);
const [servicosFinalizados, setServicosFinalizados] = useState(0);
const [ticketMedio, setTicketMedio] = useState(0);

useEffect(() => {
  async function carregarFinanceiro() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setReceitaHoje(await getReceitaHoje(user.id));
    setReceitaMes(await getReceitaMes(user.id));
    setServicosFinalizados(
      await getServicosFinalizados(user.id)
    );
    setTicketMedio(
  await getTicketMedio(user.id)
);
  }

  carregarFinanceiro();
}, []);
  return (
    <div className="space-y-8">

      {/* Título */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          💰 Financeiro
        </h1>

        <p className="text-zinc-400 mt-2">
          Acompanhe o desempenho financeiro da sua empresa.
        </p>
      </div>

      {/* Indicadores */}
      <CardsFinanceiro
  receitaHoje={receitaHoje}
  receitaMes={receitaMes}
  ticketMedio={ticketMedio}
  servicosFinalizados={servicosFinalizados}
  servicoMaisVendido="-"
/>

      {/* Gráfico */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg">

        <h2 className="text-xl font-bold text-white mb-5">
          📈 Receita dos Últimos 30 Dias
        </h2>

        <div className="h-80 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
          O gráfico será implementado na próxima etapa.
        </div>

      </div>

      {/* Rankings */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg">

          <h2 className="text-xl font-bold text-white mb-5">
            🏆 Serviços Mais Vendidos
          </h2>

          <div className="text-zinc-500">
            Nenhum dado disponível.
          </div>

        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg">

          <h2 className="text-xl font-bold text-white mb-5">
            👥 Clientes que Mais Gastaram
          </h2>

          <div className="text-zinc-500">
            Nenhum dado disponível.
          </div>

        </div>

      </div>

      {/* Premium */}
      <div className="rounded-2xl border border-yellow-500 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6">

        <h2 className="text-2xl font-bold text-yellow-400 mb-5">
          ⭐ Recursos Exclusivos do LavaTop PRO
        </h2>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">

          <Item texto="Meta mensal" />
          <Item texto="Comparativo mensal" />
          <Item texto="Gráfico anual" />
          <Item texto="Ranking de clientes" />
          <Item texto="Exportar PDF" />
          <Item texto="Exportar Excel" />
          <Item texto="Horário mais movimentado" />
          <Item texto="Melhor dia da semana" />
          <Item texto="Previsão de faturamento" />

        </div>

      </div>

    </div>
  );
}

function Item({
  texto,
}: {
  texto: string;
}) {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 hover:border-yellow-500 transition">
      🔒 {texto}
    </div>
  );
}
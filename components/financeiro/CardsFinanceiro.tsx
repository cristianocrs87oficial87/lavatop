"use client";

type Props = {
  receitaHoje: number;
  receitaMes?: number;
  ticketMedio?: number;
  servicosFinalizados?: number;
  servicoMaisVendido?: string;
};

export default function CardsFinanceiro({
  receitaHoje,
  receitaMes = 0,
  ticketMedio = 0,
  servicosFinalizados = 0,
  servicoMaisVendido = "-",
}: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

      <Card
        titulo="Receita Hoje"
        valor={formatarMoeda(receitaHoje)}
        icone="💰"
        cor="bg-emerald-600"
      />

      <Card
        titulo="Receita do Mês"
        valor={formatarMoeda(receitaMes)}
        icone="📅"
        cor="bg-cyan-600"
      />

      <Card
        titulo="Ticket Médio"
        valor={formatarMoeda(ticketMedio)}
        icone="🎯"
        cor="bg-violet-600"
      />

      <Card
        titulo="Serviços Finalizados"
        valor={String(servicosFinalizados)}
        icone="🚗"
        cor="bg-orange-600"
      />

      <Card
        titulo="Mais Vendido"
        valor={servicoMaisVendido}
        icone="🏆"
        cor="bg-pink-600"
      />

    </div>
  );
}

type CardProps = {
  titulo: string;
  valor: string;
  icone: string;
  cor: string;
};

function Card({
  titulo,
  valor,
  icone,
  cor,
}: CardProps) {
  return (
    <div className={`${cor} rounded-2xl p-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">{titulo}</p>
          <h2 className="text-3xl font-bold text-white mt-2">
            {valor}
          </h2>
        </div>

        <span className="text-4xl">{icone}</span>
      </div>
    </div>
  );
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
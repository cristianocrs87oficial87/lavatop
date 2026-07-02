export default function FinanceiroPage() {
  return (
    <div className="space-y-8">

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          💰 Financeiro
        </h1>

        <p className="text-zinc-400 mt-2">
          Acompanhe o desempenho financeiro da sua empresa.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

        <Card
          titulo="Receita Hoje"
          valor="R$ 0,00"
          cor="bg-emerald-600"
        />

        <Card
          titulo="Receita do Mês"
          valor="R$ 0,00"
          cor="bg-cyan-600"
        />

        <Card
          titulo="Ticket Médio"
          valor="R$ 0,00"
          cor="bg-violet-600"
        />

        <Card
          titulo="Serviços Finalizados"
          valor="0"
          cor="bg-orange-500"
        />

        <Card
          titulo="Mais Vendido"
          valor="-"
          cor="bg-pink-600"
        />

      </div>

      {/* Gráfico */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">

        <h2 className="text-xl font-bold text-white mb-4">
          📈 Receita dos Últimos 30 Dias
        </h2>

        <div className="h-72 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
          Gráfico será adicionado na próxima etapa
        </div>

      </div>

      {/* Rankings */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">

          <h2 className="text-xl font-bold mb-4">
            🏆 Serviços Mais Vendidos
          </h2>

          <p className="text-zinc-500">
            Nenhum dado disponível.
          </p>

        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">

          <h2 className="text-xl font-bold mb-4">
            👥 Clientes que Mais Gastaram
          </h2>

          <p className="text-zinc-500">
            Nenhum dado disponível.
          </p>

        </div>

      </div>

      {/* Premium */}
      <div className="rounded-2xl border border-yellow-500 bg-yellow-500/10 p-6">

        <h2 className="text-2xl font-bold text-yellow-400">
          ⭐ Recursos Premium
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">

          <Item texto="Meta mensal" />
          <Item texto="Comparativo mensal" />
          <Item texto="Gráfico anual" />
          <Item texto="Exportar PDF" />
          <Item texto="Exportar Excel" />
          <Item texto="Previsão de faturamento" />

        </div>

      </div>

    </div>
  );
}

function Card({
  titulo,
  valor,
  cor,
}: {
  titulo: string;
  valor: string;
  cor: string;
}) {
  return (
    <div className={`${cor} rounded-2xl p-5 shadow-lg`}>

      <p className="text-sm text-white/80">
        {titulo}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {valor}
      </h2>

    </div>
  );
}

function Item({
  texto,
}: {
  texto: string;
}) {
  return (
    <div className="rounded-xl bg-zinc-900 p-4">
      🔒 {texto}
    </div>
  );
}
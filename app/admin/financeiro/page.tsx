export default function FinanceiroPage() {
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
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

        <Card
          icone="💰"
          titulo="Receita Hoje"
          valor="R$ 0,00"
          descricao="Valor recebido hoje"
          cor="from-emerald-500 to-emerald-700"
        />

        <Card
          icone="📅"
          titulo="Receita do Mês"
          valor="R$ 0,00"
          descricao="Faturamento do mês"
          cor="from-cyan-500 to-cyan-700"
        />

        <Card
          icone="🎯"
          titulo="Ticket Médio"
          valor="R$ 0,00"
          descricao="Média por atendimento"
          cor="from-violet-500 to-violet-700"
        />

        <Card
          icone="🚗"
          titulo="Serviços Finalizados"
          valor="0"
          descricao="Total concluído"
          cor="from-orange-500 to-orange-700"
        />

        <Card
          icone="🏆"
          titulo="Mais Vendido"
          valor="-"
          descricao="Serviço campeão"
          cor="from-pink-500 to-pink-700"
        />

      </div>

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

function Card({
  icone,
  titulo,
  valor,
  descricao,
  cor,
}: {
  icone: string;
  titulo: string;
  valor: string;
  descricao: string;
  cor: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${cor} rounded-2xl p-5 shadow-xl hover:scale-[1.03] transition-all duration-300`}
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-white/80 text-sm">
            {titulo}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {valor}
          </h2>

          <p className="text-white/80 text-xs mt-3">
            {descricao}
          </p>

        </div>

        <div className="text-4xl">
          {icone}
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
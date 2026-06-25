interface CardsDashboardProps {
  totalEmpresas: number
  premium: number
  teste: number
  receitaMensal: number
  receitaAnual: number
  conversao: number
  pixPagos: number
  pixPendentes: number
  empresasAtivasHoje: number
  empresasSemAcesso: number
}

export default function CardsDashboard({
  totalEmpresas,
  premium,
  teste,
  receitaMensal,
  receitaAnual,
  conversao,
  pixPagos,
  pixPendentes,
  empresasAtivasHoje,
  empresasSemAcesso,
}: CardsDashboardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Empresas</p>
        <h2 className="text-2xl font-bold">{totalEmpresas}</h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Premium</p>
        <h2 className="text-2xl font-bold text-green-400">{premium}</h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Teste</p>
        <h2 className="text-2xl font-bold text-yellow-400">{teste}</h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Receita Mensal</p>
        <h2 className="text-2xl font-bold">
          R$ {receitaMensal.toFixed(2)}
        </h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Receita Anual</p>
        <h2 className="text-2xl font-bold">
          R$ {receitaAnual.toFixed(2)}
        </h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Conversão</p>
        <h2 className="text-2xl font-bold">
          {conversao.toFixed(1)}%
        </h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">PIX Pagos</p>
        <h2 className="text-2xl font-bold">{pixPagos}</h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">PIX Pendentes</p>
        <h2 className="text-2xl font-bold">{pixPendentes}</h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Ativas Hoje</p>
        <h2 className="text-2xl font-bold">{empresasAtivasHoje}</h2>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Sem acesso (+3 dias)</p>
        <h2 className="text-2xl font-bold text-red-400">
          {empresasSemAcesso}
        </h2>
      </div>

    </div>
  )
}
type Props = {
  pendentes: number
  confirmados: number
  andamento: number
  finalizados: number
  cancelados: number
  total: number
}

export default function CardsDashboard({
  pendentes,
  confirmados,
  andamento,
  finalizados,
  cancelados,
  total,
}: Props) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 mb-6">

      <div className="bg-yellow-600 rounded-2xl p-4 shadow-lg">
        <p className="text-sm opacity-90">Pendentes</p>
        <h2 className="text-3xl font-bold mt-1">{pendentes}</h2>
      </div>

      <div className="bg-blue-600 rounded-2xl p-4 shadow-lg">
        <p className="text-sm opacity-90">Confirmados</p>
        <h2 className="text-3xl font-bold mt-1">{confirmados}</h2>
      </div>

      <div className="bg-orange-600 rounded-2xl p-4 shadow-lg">
        <p className="text-sm opacity-90">Em andamento</p>
        <h2 className="text-3xl font-bold mt-1">{andamento}</h2>
      </div>

      <div className="bg-green-600 rounded-2xl p-4 shadow-lg">
        <p className="text-sm opacity-90">Finalizados</p>
        <h2 className="text-3xl font-bold mt-1">{finalizados}</h2>
      </div>

      <div className="bg-red-600 rounded-2xl p-4 shadow-lg">
        <p className="text-sm opacity-90">Cancelados</p>
        <h2 className="text-3xl font-bold mt-1">{cancelados}</h2>
      </div>

      <div className="bg-zinc-800 rounded-2xl p-4 shadow-lg">
        <p className="text-sm opacity-90">Total</p>
        <h2 className="text-3xl font-bold mt-1">{total}</h2>
      </div>

    </div>
  )
}
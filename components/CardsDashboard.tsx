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
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">

      <div className="bg-yellow-600 p-6 rounded-xl">
        <p>Pendentes</p>
        <h2 className="text-4xl font-bold">{pendentes}</h2>
      </div>

      <div className="bg-blue-600 p-6 rounded-xl">
        <p>Confirmados</p>
        <h2 className="text-4xl font-bold">{confirmados}</h2>
      </div>

      <div className="bg-orange-600 p-6 rounded-xl">
        <p>Em andamento</p>
        <h2 className="text-4xl font-bold">{andamento}</h2>
      </div>

      <div className="bg-green-600 p-6 rounded-xl">
        <p>Finalizados</p>
        <h2 className="text-4xl font-bold">{finalizados}</h2>
      </div>

      <div className="bg-red-600 p-6 rounded-xl">
        <p>Cancelados</p>
        <h2 className="text-4xl font-bold">{cancelados}</h2>
      </div>

      <div className="bg-zinc-800 p-6 rounded-xl">
        <p>Total Agendamentos</p>
        <h2 className="text-4xl font-bold">{total}</h2>
      </div>

    </div>
  )
}
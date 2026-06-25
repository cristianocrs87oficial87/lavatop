'use client'

type Props = {
  empresa: {
    premium: boolean
    premium_ate: string | null
    created_at: string
  } | null
}

export default function BannerPremium({ empresa }: Props) {
  if (!empresa) return null

  return (
    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800 shadow-xl">

      <div className="p-8 flex flex-col lg:flex-row justify-between gap-8">

        <div className="flex-1">

          <div className="text-yellow-300 font-bold text-lg mb-3">
            ⭐ TESTE GRATUITO
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            Bem-vindo ao LavaTop!
          </h2>

          <p className="text-gray-200 text-lg">
            Aproveite seu período de avaliação para conhecer todos os recursos do sistema.
          </p>

        </div>

        <div className="w-full lg:w-80 bg-black/20 rounded-xl p-6">

          <div className="text-white text-lg font-bold mb-2">
            Recursos Premium
          </div>

          <ul className="space-y-2 text-gray-100 text-sm">
            <li>✅ Agendamentos ilimitados</li>
            <li>✅ Programa Fidelidade</li>
            <li>✅ Atualizações automáticas</li>
            <li>✅ Suporte prioritário</li>
          </ul>

          <button
            className="mt-6 w-full rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 transition"
          >
            💳 Assinar Premium
          </button>

        </div>

      </div>

    </div>
  )
}
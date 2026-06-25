'use client'

type Props = {
  empresa: any
}

export default function PainelPremium({ empresa }: Props) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 text-white">
      <h2 className="text-xl font-bold">
        ⭐ Painel Premium
      </h2>

      <p className="mt-3 text-gray-300">
        Em construção...
      </p>
    </div>
  )
}
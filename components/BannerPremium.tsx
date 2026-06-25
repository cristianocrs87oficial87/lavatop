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

  const hoje = new Date()

  // Empresa em teste
  if (!empresa.premium) {
    const criado = new Date(empresa.created_at)

    const dias = Math.floor(
      (hoje.getTime() - criado.getTime()) /
      (1000 * 60 * 60 * 24)
    )

    const restantes = 7 - dias

    if (restantes <= 0) {
      return (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg">
            ❌ Seu período de teste terminou
          </h2>

          <p>
            Assine o LavaTop Premium para continuar utilizando o sistema.
          </p>
        </div>
      )
    }

    if (restantes <= 1) {
      return (
        <div className="bg-orange-500 text-white p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg">
            ⏳ Seu teste termina amanhã
          </h2>

          <p>
            Evite interrupções assinando o Premium.
          </p>
        </div>
      )
    }

    if (restantes <= 3) {
      return (
        <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg">
            ⚠️ Seu teste termina em {restantes} dias
          </h2>

          <p>
            Aproveite para assinar antes do vencimento.
          </p>
        </div>
      )
    }

    return null
  }

  // Empresa Premium
  if (empresa.premium && empresa.premium_ate) {
    const vence = new Date(empresa.premium_ate)

    const dias = Math.ceil(
      (vence.getTime() - hoje.getTime()) /
      (1000 * 60 * 60 * 24)
    )

    if (dias <= 0) {
      return (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg">
            ❌ Seu Premium venceu
          </h2>

          <p>
            Renove sua assinatura para continuar utilizando os recursos Premium.
          </p>
        </div>
      )
    }

    if (dias <= 3) {
      return (
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg">
            ⭐ Seu Premium vence em {dias} dias
          </h2>

          <p>
            Renove agora para evitar interrupções.
          </p>
        </div>
      )
    }
  }

  return null
}
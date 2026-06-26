"use client";

import Link from "next/link";

type Props = {
  premium: boolean;
  premiumAte: string | null;
};

export default function BannerTesteGratis({
  premium,
  premiumAte,
}: Props) {
  if (!premiumAte) return null;

  const hoje = new Date();
  const validade = new Date(premiumAte);

  const diasRestantes = Math.max(
    0,
    Math.ceil(
      (validade.getTime() - hoje.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  let cor = "border-cyan-500";
  let titulo = "🆓 Teste Gratuito";
  let texto = "text-cyan-400";

  if (premium) {
    cor = "border-green-500";
    titulo = "👑 LavaTop Pro Ativo";
    texto = "text-green-400";
  } else if (diasRestantes <= 2) {
    cor = "border-red-500";
    texto = "text-red-400";
  } else if (diasRestantes <= 5) {
    cor = "border-yellow-500";
    texto = "text-yellow-400";
  }

  return (
    <div
      className={`bg-zinc-900 border-2 ${cor} rounded-2xl p-5 mb-6 shadow-lg`}
    >
      <h2 className={`text-2xl font-bold ${texto}`}>
        {titulo}
      </h2>

      <p className="text-zinc-300 mt-2">
        📅 Válido até{" "}
        <strong>
          {validade.toLocaleDateString("pt-BR")}
        </strong>
      </p>

      {premium ? (
        <>
          <p className="text-green-400 mt-3 font-semibold">
            ✅ Seu LavaTop Pro está ativo.
          </p>

          <p className="text-zinc-300 mt-2">
            Todos os recursos premium estão liberados para sua empresa.
          </p>
        </>
      ) : (
        <>
          <p className={`mt-4 text-lg font-bold ${texto}`}>
            ⏳ Seu teste termina em{" "}
            <strong>{diasRestantes} dias</strong>.
          </p>

          <p className="text-zinc-300 mt-3">
            Continue utilizando todos os recursos do LavaTop sem interrupções.
          </p>

          <div className="mt-4 space-y-2 text-sm text-zinc-200">
            <p>✅ Agendamentos ilimitados</p>
            <p>✅ Programa Fidelidade</p>
            <p>✅ WhatsApp Automático</p>
            <p>✅ Painel completo de gestão</p>
          </div>

          <Link
            href="/admin/planos"
            className="mt-6 w-full text-center inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition"
          >
            🚀 Ativar LavaTop Pro
          </Link>
        </>
      )}
    </div>
  );
}
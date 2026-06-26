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
    titulo = "👑 Plano LavaTop Pro Ativo";
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
      className={`bg-zinc-900 border ${cor} rounded-2xl p-6 mb-6`}
    >
      <h2 className={`text-2xl font-bold ${texto}`}>
        {titulo}
      </h2>

      <p className="text-zinc-300 mt-3">
        📅 Válido até{" "}
        <strong>
          {validade.toLocaleDateString("pt-BR")}
        </strong>
      </p>

      {premium ? (
        <p className="text-green-400 mt-3 font-semibold">
          ✅ Todos os recursos do LavaTop Pro estão
          liberados.
        </p>
      ) : (
        <>
          <p className={`mt-3 font-semibold ${texto}`}>
            ⏳ Restam{" "}
            <strong>{diasRestantes} dias</strong> de
            teste.
          </p>

          <p className="text-zinc-300 mt-2">
            Aproveite todos os recursos do LavaTop Pro.
            Após o término do teste será necessário
            assinar um plano para continuar utilizando
            o sistema.
          </p>

          <Link
            href="/admin/planos"
            className="mt-5 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition"
          >
            👑 Assinar LavaTop Pro
          </Link>
        </>
      )}
    </div>
  );
}
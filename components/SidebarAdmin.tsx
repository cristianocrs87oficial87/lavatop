"use client";

import Link from "next/link";

type Props = {
  empresa: any;
};

export default function SidebarAdmin({ empresa }: Props) {
  const linkAgendamento = empresa?.id
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/agendamento/${empresa.id}`
    : "";

  const linkIndicacao = empresa?.id
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/cadastro?ref=${empresa.id}`
    : "";

  function copiarLink(link: string) {
    navigator.clipboard.writeText(link);
    alert("Link copiado!");
  }

  function compartilharWhatsapp() {
    const texto = `Conheça o LavaTop!

Sistema completo para Lava Rápido.

Cadastre-se usando meu link:

${linkIndicacao}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  }

  return (
    <div className="space-y-4">

      {/* MENU */}

      <div className="bg-zinc-900 rounded-2xl p-5">

        <h2 className="text-xl font-bold text-cyan-400 mb-5">
          📋 Menu
        </h2>

        <div className="flex flex-col gap-3">

          <Link
            href="/admin"
            className="bg-zinc-800 hover:bg-cyan-600 transition p-3 rounded-xl font-semibold"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/admin/configuracoes"
            className="bg-zinc-800 hover:bg-cyan-600 transition p-3 rounded-xl font-semibold"
          >
            ⚙ Configurações
          </Link>

          <Link
            href="/admin/fidelidade"
            className="bg-zinc-800 hover:bg-cyan-600 transition p-3 rounded-xl font-semibold"
          >
            🎁 Programa Fidelidade
          </Link>

          <Link
            href="/admin/clientes-fidelidade"
            className="bg-zinc-800 hover:bg-cyan-600 transition p-3 rounded-xl font-semibold"
          >
            👥 Clientes Fidelidade
          </Link>

          <Link
            href="/admin/planos"
            className="bg-zinc-800 hover:bg-cyan-600 transition p-3 rounded-xl font-semibold"
          >
            💎 Premium
          </Link>

          {empresa?.master && (
            <Link
              href="/admin/master"
              className="bg-yellow-600 hover:bg-yellow-500 transition p-3 rounded-xl font-bold"
            >
              👑 Painel Master
            </Link>
          )}
        </div>
      </div>

      {/* AGENDAMENTO */}

      <div className="bg-zinc-900 rounded-2xl p-5">

        <h2 className="text-lg font-bold text-cyan-400 mb-4">
          🚗 Agendamento
        </h2>

        <div className="flex flex-col gap-3">

          <a
            href={linkAgendamento}
            target="_blank"
            className="bg-purple-600 hover:bg-purple-700 p-3 rounded-xl text-center font-bold"
          >
            🌐 Abrir Página
          </a>

          <button
            onClick={() => copiarLink(linkAgendamento)}
            className="bg-zinc-700 hover:bg-zinc-600 p-3 rounded-xl font-bold"
          >
            📋 Copiar Link
          </button>

        </div>

      </div>

      {/* INDICAÇÃO */}

      <div className="bg-zinc-900 rounded-2xl p-5">

        <h2 className="text-lg font-bold text-yellow-400 mb-2">
          🎁 Indique e Ganhe
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          Ganhe 1 mês Premium para cada empresa que assinar usando seu link.
        </p>

        <div className="flex flex-col gap-3">

          <button
            onClick={() => copiarLink(linkIndicacao)}
            className="bg-cyan-600 hover:bg-cyan-700 p-3 rounded-xl font-bold"
          >
            📋 Copiar Link de Indicação
          </button>

          <button
            onClick={compartilharWhatsapp}
            className="bg-green-600 hover:bg-green-700 p-3 rounded-xl font-bold"
          >
            📲 Compartilhar WhatsApp
          </button>

        </div>

      </div>

    </div>
  );
}
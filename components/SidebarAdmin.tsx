"use client";

import Link from "next/link";

type Props = {
  empresa: any;
};

export default function SidebarAdmin({ empresa }: Props) {
  function abrirPaginaAgendamento() {
    if (!empresa?.id) {
      alert("Empresa não encontrada.");
      return;
    }

    window.open(
      `${window.location.origin}/agendamento/${empresa.id}`,
      "_blank"
    );
  }

  function copiarLinkAgendamento() {
    if (!empresa?.id) {
      alert("Empresa não encontrada.");
      return;
    }

    navigator.clipboard.writeText(
      `${window.location.origin}/agendamento/${empresa.id}`
    );

    alert("Link copiado!");
  }

  function copiarLinkIndicacao() {
    if (!empresa?.id) {
      alert("Empresa não encontrada.");
      return;
    }

    navigator.clipboard.writeText(
      `${window.location.origin}/cadastro?ref=${empresa.id}`
    );

    alert("Link de indicação copiado!");
  }

  function compartilharWhatsapp() {
    if (!empresa?.id) {
      alert("Empresa não encontrada.");
      return;
    }

    const link =
      `${window.location.origin}/cadastro?ref=${empresa.id}`;

    const texto =
`🚗 Conheça o LavaTop!

Sistema completo para Lava Rápido.

Cadastre-se usando meu link:

${link}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  }

  return (
    <div className="space-y-4">

      <div className="bg-zinc-900 rounded-2xl p-5">

        <h2 className="text-xl font-bold text-cyan-400 mb-5">
          📋 Menu
        </h2>

        <div className="flex flex-col gap-3">

          <Link
            href="/admin"
            className="bg-zinc-800 hover:bg-cyan-600 p-3 rounded-xl font-semibold"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/admin/configuracoes"
            className="bg-zinc-800 hover:bg-cyan-600 p-3 rounded-xl font-semibold"
          >
            ⚙️ Configuração da Empresa
          </Link>

          <Link
            href="/admin/fidelidade"
            className="bg-zinc-800 hover:bg-cyan-600 p-3 rounded-xl font-semibold"
          >
            🎁 Programa Fidelidade
          </Link>

          <Link
            href="/admin/clientes-fidelidade"
            className="bg-zinc-800 hover:bg-cyan-600 p-3 rounded-xl font-semibold"
          >
            👥 Clientes Fidelidade
          </Link>

          <Link
            href="/admin/planos"
            className="bg-zinc-800 hover:bg-cyan-600 p-3 rounded-xl font-semibold"
          >
            💎 Premium
          </Link>

        </div>

      </div>

      <div className="bg-zinc-900 rounded-2xl p-5">

        <h2 className="text-lg font-bold text-cyan-400 mb-4">
          🚗 Agendamento
        </h2>

        <div className="flex flex-col gap-3">

          <button
            onClick={abrirPaginaAgendamento}
            className="bg-purple-600 hover:bg-purple-700 p-3 rounded-xl font-bold"
          >
            🌐 Abrir Página
          </button>

          <button
            onClick={copiarLinkAgendamento}
            className="bg-zinc-700 hover:bg-zinc-600 p-3 rounded-xl font-bold"
          >
            📋 Copiar Link
          </button>

        </div>

      </div>

      <div className="bg-zinc-900 rounded-2xl p-5">

        <h2 className="text-lg font-bold text-yellow-400 mb-2">
          🎁 Indique e Ganhe
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          Ganhe 1 mês Premium para cada empresa indicada.
        </p>

        <div className="flex flex-col gap-3">

          <button
            onClick={copiarLinkIndicacao}
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
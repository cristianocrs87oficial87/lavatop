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

    {/* MENU */}
    <div className="bg-zinc-900 rounded-2xl p-5">

      <h2 className="text-xl font-bold text-cyan-400 mb-5">
        📋 Menu
      </h2>

      <div className="flex flex-col gap-3">

        <Link
          href="/admin/configuracoes"
          className="bg-zinc-800 hover:bg-cyan-600 p-3 rounded-xl font-semibold"
        >
          ⚙️ Configuração da Empresa
        </Link>

        <Link
          href="/admin/planos"
          className="bg-zinc-800 hover:bg-yellow-500 p-3 rounded-xl font-semibold"
        >
          👑 Plano LavaTop Pro
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

      </div>

    </div>

    {/* PÁGINA DE AGENDAMENTO */}
    <div className="bg-zinc-900 rounded-2xl p-5">

      <h2 className="text-lg font-bold text-cyan-400 mb-4">
        🌐 Página de Agendamento
      </h2>

      <div className="flex flex-col gap-3">

        <button
          onClick={abrirPaginaAgendamento}
          className="bg-purple-600 hover:bg-purple-700 p-3 rounded-xl font-bold"
        >
          🌐 Abrir Página de Agendamento
        </button>

        <button
          onClick={copiarLinkAgendamento}
          className="bg-zinc-700 hover:bg-zinc-600 p-3 rounded-xl font-bold"
        >
          🔗 Copiar Link de Agendamento
        </button>

      </div>

    </div>

    {/* COMPARTILHE E GANHE */}
    <div className="bg-zinc-900 rounded-2xl p-5">

      <h2 className="text-lg font-bold text-yellow-400 mb-2">
        🤝 Compartilhe e Ganhe
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Indique outra empresa e ganhe <strong>30 dias grátis do Plano LavaTop Pro</strong> quando ela assinar.
      </p>

      <div className="flex flex-col gap-3">

        <button
          onClick={copiarLinkIndicacao}
          className="bg-cyan-600 hover:bg-cyan-700 p-3 rounded-xl font-bold"
        >
          🤝 Copiar Link de Indicação
        </button>

        <button
          onClick={compartilharWhatsapp}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl font-bold"
        >
          📲 Compartilhar no WhatsApp
        </button>

      </div>

    </div>

  </div>
);
}
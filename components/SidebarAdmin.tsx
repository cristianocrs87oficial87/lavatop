"use client";

import Link from "next/link";

type Props = {
  empresa: any;
};

export default function SidebarAdmin({ empresa }: Props) {
  return (
    <div className="space-y-4">

      <div className="bg-zinc-900 rounded-2xl p-5">

        <h2 className="text-xl font-bold text-cyan-400 mb-5">
          Menu
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

    </div>
  );
}
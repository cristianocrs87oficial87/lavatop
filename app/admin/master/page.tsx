"use client";

import { useEffect, useState } from "react";

export default function MasterAdminPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);

  useEffect(() => {
    carregarEmpresas();
  }, []);

  async function carregarEmpresas() {
    try {
      const response = await fetch("/api/master/empresas");
      const data = await response.json();
      setEmpresas(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function ativarPremium(id: number) {
}

async function excluirEmpresa(id: number) {
  const confirmar = confirm(
    "Deseja realmente excluir esta empresa?"
  );

  if (!confirmar) return;

  try {
    const response = await fetch(
      "/api/master/excluir",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
  console.log(data);
  alert(data.error || "Erro ao excluir");
  return;
}

    alert("Empresa excluída com sucesso!");

    carregarEmpresas();
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir");
  }
}

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Master Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="text-zinc-400 text-sm">
            Total Empresas
          </h2>
          <p className="text-3xl font-bold">
            {empresas.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="text-zinc-400 text-sm">
            Premium
          </h2>
          <p className="text-3xl font-bold text-green-400">
            {empresas.filter((e) => e.premium).length}
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="text-zinc-400 text-sm">
            Gratuitas
          </h2>
          <p className="text-3xl font-bold text-yellow-400">
            {empresas.filter((e) => !e.premium).length}
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="text-zinc-400 text-sm">
            Faturamento Mensal
          </h2>
          <p className="text-3xl font-bold text-cyan-400">
            R$ {empresas.filter((e) => e.premium).length * 97}
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Empresas
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-2">Empresa</th>
              <th className="text-left">Telefone</th>
              <th className="text-left">Premium</th>
              <th className="text-left">Role</th>
              <th className="text-left">Ações</th>
            </tr>
          </thead>

          <tbody>
            {empresas.map((empresa) => (
              <tr
                key={empresa.id}
                className="border-b border-zinc-800"
              >
                <td className="py-3">{empresa.nome}</td>
                <td>{empresa.telefone}</td>
                <td>
                  {empresa.premium ? "✅" : "❌"}
                </td>
                <td>{empresa.role}</td>

                <td className="flex gap-2 py-2">
  <button
    onClick={() =>
      ativarPremium(empresa.id)
    }
    className="bg-green-600 px-3 py-1 rounded text-sm"
  >
    Premium
  </button>

  <button
    onClick={() =>
      excluirEmpresa(empresa.id)
    }
    className="bg-red-600 px-3 py-1 rounded text-sm"
  >
    Excluir
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientesFidelidadePage() {
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("clientes_fidelidade")
      .select("*")
      .eq("usuario_id", user.id)
      .order("pontos", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setClientes(data || []);
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-5xl font-bold text-cyan-400 mb-8">
        ⭐ Clientes Fidelidade
      </h1>

      <div className="bg-zinc-900 rounded-2xl p-6">
        {clientes.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-zinc-700">
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Telefone</th>
                  <th className="p-3">Pontos</th>
                  <th className="p-3">Lavagens</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-zinc-800"
                  >
                    <td className="p-3">
                      {cliente.cliente}
                    </td>

                    <td className="p-3">
                      {cliente.telefone}
                    </td>

                    <td className="p-3 text-cyan-400 font-bold">
                      {cliente.pontos}
                    </td>

                    <td className="p-3">
                      {cliente.total_lavagens}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
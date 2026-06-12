"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientesFidelidadePage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [meta, setMeta] = useState(10);
  const [recompensa, setRecompensa] = useState("Lavagem grátis");

  useEffect(() => {
    carregarConfiguracoes();
    carregarClientes();
  }, []);

  async function carregarConfiguracoes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("empresas")
      .select(
        "fidelidade_meta, fidelidade_recompensa"
      )
      .eq("usuario_id", user.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    if (!data) return;

    setMeta(data.fidelidade_meta || 10);

    setRecompensa(
      data.fidelidade_recompensa ||
        "Lavagem grátis"
    );
  }

  async function carregarClientes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("clientes_fidelidade")
      .select("*")
      .eq("usuario_id", user.id)
      .order("pontos", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setClientes(data || []);
  }
  async function resgatarRecompensa(cliente: any) {
  const confirmar = confirm(
    `Confirmar resgate da recompensa de ${cliente.cliente}?`
  );

  if (!confirmar) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error: erroHistorico } =
    await supabase
      .from("recompensas_resgatadas")
      .insert({
        usuario_id: user.id,
        cliente_id: null,
        cliente: cliente.cliente,
        telefone: cliente.telefone,
        recompensa,
      });

  if (erroHistorico) {
    console.log(erroHistorico);
    alert("Erro ao registrar resgate.");
    return;
  }

  const { error: erroReset } =
    await supabase
      .from("clientes_fidelidade")
      .update({
        pontos: 0,
        total_lavagens: 0,
      })
      .eq("id", cliente.id);

  if (erroReset) {
    console.log(erroReset);
    alert("Erro ao resetar cliente.");
    return;
  }

  alert("Recompensa resgatada com sucesso!");

  carregarClientes();
}

  const totalClientes = clientes.length;

  const totalLavagens = clientes.reduce(
    (acc, item) =>
      acc + (item.total_lavagens || 0),
    0
  );

  const totalPontos = clientes.reduce(
    (acc, item) =>
      acc + (item.pontos || 0),
    0
  );

  const clientesPremiados = clientes.filter(
    (item) =>
      (item.total_lavagens || 0) >= meta
  ).length;

  return (
    <main className="min-h-screen bg-black p-10 text-white">

      <h1 className="text-5xl font-bold text-cyan-400 mb-3">
        ⭐ Clientes Fidelidade
      </h1>

      <p className="text-zinc-400 mb-10">
        Meta atual: {meta} lavagens
        <br />
        Recompensa: {recompensa}
      </p>

      <div className="grid md:grid-cols-4 gap-5 mb-10">

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-400">
            Clientes
          </p>

          <h2 className="text-4xl font-bold">
            {totalClientes}
          </h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-400">
            Lavagens
          </p>

          <h2 className="text-4xl font-bold">
            {totalLavagens}
          </h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-400">
            Pontos
          </p>

          <h2 className="text-4xl font-bold">
            {totalPontos}
          </h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-400">
            Premiados
          </p>

          <h2 className="text-4xl font-bold text-green-400">
            {clientesPremiados}
          </h2>
        </div>

      </div>

      <div className="space-y-5">

        {clientes.length === 0 && (
          <div className="bg-zinc-900 p-6 rounded-2xl">
            Nenhum cliente encontrado.
          </div>
        )}

        {clientes.map((cliente) => {

          const lavagens =
            cliente.total_lavagens || 0;

          const progresso =
            ((lavagens % meta) / meta) * 100;

          const faltam =
            meta - (lavagens % meta);

          const premiado =
            lavagens >= meta;

          return (
            <div
              key={cliente.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-2xl font-bold">
                    {cliente.cliente}
                  </h2>

                  <p className="text-zinc-400">
                    {cliente.telefone}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-cyan-400 font-bold text-xl">
                    {cliente.pontos} pontos
                  </p>
                </div>

              </div>

              <div className="mt-5">

                <div className="flex justify-between mb-2">

                  <span>
                    {lavagens} lavagens
                  </span>

                  <span>
                    {lavagens % meta}/{meta}
                  </span>

                </div>

                <div className="w-full h-4 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all"
                    style={{
                      width: `${progresso}%`,
                    }}
                  />
                </div>

              </div>

              {!premiado ? (
                <p className="mt-4 text-yellow-400 font-semibold">
                  Faltam {faltam} lavagens para ganhar:
                  <br />
                  <strong>
                    {recompensa}
                  </strong>
                </p>
              ) : (
                <div className="mt-4">

  <p className="text-green-400 font-bold mb-3">
    🎉 Recompensa liberada:
    <br />
    <strong>{recompensa}</strong>
  </p>

  <button
    onClick={() => resgatarRecompensa(cliente)}
    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-black font-bold"
  >
    Resgatar Recompensa
  </button>

</div>
              )}

            </div>
          );
        })}

      </div>

    </main>
  );
}
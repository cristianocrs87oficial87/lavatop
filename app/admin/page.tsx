"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    async function verificarSessao() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      }
    }

    verificarSessao();
  }, [router]);

  useEffect(() => {
    async function carregarAgendamentos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("usuario_id", user.id)
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setAgendamentos(data || []);
    }

    carregarAgendamentos();
  }, []);

  useEffect(() => {
  async function carregarEmpresa() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("empresas")
      .select("premium, premium_ate")
      .eq("usuario_id", user.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setEmpresa(data);
  }

  carregarEmpresa();
}, []);

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function excluirAgendamento(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este agendamento?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir.");
      console.log(error);
      return;
    }

    setAgendamentos((atual) =>
      atual.filter((item) => item.id !== id)
    );
  }

  async function alterarStatus(
  id: number,
  novoStatus: string
) {
  const agendamento = agendamentos.find(
    (item) => item.id === id
  );

  const { error } = await supabase
    .from("agendamentos")
    .update({ status: novoStatus })
    .eq("id", id);

  if (error) {
    alert("Erro ao atualizar status.");
    console.log(error);
    return;
  }

  if (
    novoStatus === "Finalizado" &&
    agendamento
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: clienteExistente } =
        await supabase
          .from("clientes_fidelidade")
          .select("*")
          .eq("usuario_id", user.id)
          .eq(
            "telefone",
            agendamento.telefone
          )
          .single();

      if (!clienteExistente) {
        await supabase
          .from("clientes_fidelidade")
          .insert([
            {
              usuario_id: user.id,
              cliente: agendamento.cliente,
              telefone: agendamento.telefone,
              pontos: 1,
              total_lavagens: 1,
            },
          ]);
      } else {
        const novosPontos =
          (clienteExistente.pontos || 0) + 1;

        const novasLavagens =
          (clienteExistente.total_lavagens || 0) +
          1;

        await supabase
          .from("clientes_fidelidade")
          .update({
            pontos: novosPontos,
            total_lavagens: novasLavagens,
          })
          .eq("id", clienteExistente.id);

        const { data: empresa } =
          await supabase
            .from("empresas")
            .select("*")
            .eq("usuario_id", user.id)
            .single();

        if (
          empresa?.fidelidade_ativa &&
          novasLavagens >=
            empresa.fidelidade_meta
        ) {
          alert(
            `🎉 Cliente atingiu a meta!\n\nRecompensa:\n${empresa.fidelidade_recompensa}`
          );
        }
      }
    } catch (erro) {
      console.log(
        "Erro fidelidade:",
        erro
      );
    }
  }

  setAgendamentos((atual) =>
    atual.map((item) =>
      item.id === id
        ? { ...item, status: novoStatus }
        : item
    )
  );
}

  const total = agendamentos.length;
  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-cyan-400">
          Painel Admin
        </h1>

        <button
          onClick={sair}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-xl">Total Agendamentos</p>
          <h2 className="text-5xl font-bold mt-2">
            {total}
          </h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-xl">
            Faturamento Estimado
          </p>
          <h2 className="text-5xl font-bold text-green-400 mt-2">
            R$ {total * 50}
          </h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p className="text-xl">Serviços Hoje</p>
          <h2 className="text-5xl font-bold text-cyan-400 mt-2">
            {total}
          </h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
          <p className="text-xl">Plano Atual</p>

          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
  {empresa?.premium
  ? "Premium"
  : "Teste Grátis"}
</h2>

<p className="mt-2 mb-4">
  {empresa === null
    ? "Verificando plano..."
    : `Status: ${empresa.premium ? "Ativo" : "Teste"}`}
</p>

          <Link href="/admin/planos">
  <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl">
    🚀 Fazer Upgrade para Premium
  </button>
</Link>
<Link href="/admin/fidelidade">
  <button className="w-full mt-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-xl">
    ⭐ Programa Fidelidade
  </button>
</Link>
<Link href="/admin/clientes-fidelidade">
<Link href="/">
  <button className="w-full mt-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl">
    📅 Abrir Página de Agendamento
  </button>
</Link>

<button
  onClick={() => {
    navigator.clipboard.writeText(window.location.origin);
    alert("Link copiado!");
  }}
  className="w-full mt-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-xl"
>
  📋 Copiar Link de Agendamento
</button>

<Link href="/admin/configuracoes">
  <button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl">
    ⚙️ Configurar Empresa
  </button>
</Link>
  <button className="w-full mt-3 bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl">
    👥 Clientes Fidelidade
  </button>
</Link>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-4xl font-bold mb-6">
          Lista de Agendamentos
        </h2>

        {agendamentos.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          agendamentos.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 p-5 rounded-xl mb-4"
            >
              <p>
                <strong>Cliente:</strong>{" "}
                {item.cliente}
              </p>

              <p>
                <strong>Telefone:</strong>{" "}
                {item.telefone}
              </p>

              <p>
                <strong>Serviço:</strong>{" "}
                {item.servico}
              </p>

              <p>
                <strong>Data:</strong>{" "}
                {item.data_agendamento ||
                  "Não informada"}
              </p>

              <p>
                <strong>Hora:</strong>{" "}
                {item.hora_agendamento ||
                  "Não informada"}
              </p>

              <div className="mt-4">
                <label className="font-bold mr-2">
                  Status:
                </label>

                <select
                  value={item.status || "Pendente"}
                  onChange={(e) =>
                    alterarStatus(
                      item.id,
                      e.target.value
                    )
                  }
                  className="bg-zinc-700 text-white px-3 py-2 rounded-lg"
                >
                  <option value="Pendente">
                    Pendente
                  </option>
                  <option value="Confirmado">
                    Confirmado
                  </option>
                  <option value="Em andamento">
                    Em andamento
                  </option>
                  <option value="Finalizado">
                    Finalizado
                  </option>
                  <option value="Cancelado">
                    Cancelado
                  </option>
                </select>
              </div>

              <button
                onClick={() =>
                  excluirAgendamento(item.id)
                }
                className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
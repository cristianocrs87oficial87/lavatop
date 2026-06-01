"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Configuracoes() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [abre, setAbre] = useState("08:00");
  const [fecha, setFecha] = useState("18:00");
  const [intervalo, setIntervalo] = useState(60);

  const [diasFuncionamento, setDiasFuncionamento] = useState<string[]>([
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
  ]);

  useEffect(() => {
    carregarEmpresa();
  }, []);

  async function carregarEmpresa() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("usuario_id", user.id)
      .limit(1);

    console.log("USUARIO:", user.id);
    console.log("EMPRESA:", data);
    console.log("ERRO:", error);

    if (data && data.length > 0) {
      const empresa = data[0];

      setNome(empresa.nome || "");
      setTelefone(empresa.telefone || "");
      setAbre(empresa.abre || "08:00");
      setFecha(empresa.fecha || "18:00");
      setIntervalo(empresa.intervalo || 60);

      setDiasFuncionamento(
        empresa.dias_funcionamento || [
          "segunda",
          "terca",
          "quarta",
          "quinta",
          "sexta",
        ]
      );
    }
  }

  async function salvar() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Usuário não encontrado.");
        return;
      }

      const {
        data: empresaExistente,
        error: erroBusca,
      } = await supabase
        .from("empresas")
        .select("id")
        .eq("usuario_id", user.id);

      if (erroBusca) {
        console.log(erroBusca);
        alert("Erro ao buscar empresa.");
        return;
      }

      let resultado;

      if (
        empresaExistente &&
        empresaExistente.length > 0
      ) {
        resultado = await supabase
          .from("empresas")
          .update({
  nome,
  telefone,
  abre,
  fecha,
  intervalo,
  dias_funcionamento:
    diasFuncionamento,
  usuario_id: user.id,
})
          .eq("id", empresaExistente[0].id)
          .select();
      } else {
        resultado = await supabase
          .from("empresas")
          .insert([
            {
              nome,
              telefone,
              abre,
              fecha,
              intervalo,
              dias_funcionamento:
                diasFuncionamento,
              usuario_id: user.id,
            },
          ])
          .select();
      }

      if (resultado.error) {
        console.log(resultado.error);

        alert(
          "ERRO SUPABASE:\n\n" +
            JSON.stringify(
              resultado.error,
              null,
              2
            )
        );

        return;
      }

      alert(
        "Configurações salvas com sucesso!"
      );

      carregarEmpresa();
    } catch (erro) {
      console.log(erro);
      alert("Erro inesperado.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Configurações da Empresa
      </h1>

      <div className="bg-zinc-900 p-8 rounded-2xl max-w-2xl">
        <label className="block mb-2 font-bold">
          Nome da Empresa
        </label>

        <input
          type="text"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Telefone
        </label>

        <input
          type="text"
          value={telefone}
          onChange={(e) =>
            setTelefone(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Horário de Abertura
        </label>

        <input
          type="time"
          value={abre}
          onChange={(e) =>
            setAbre(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Horário de Fechamento
        </label>

        <input
          type="time"
          value={fecha}
          onChange={(e) =>
            setFecha(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        />

        <label className="block mb-2 font-bold">
          Intervalo dos Agendamentos
        </label>

        <select
          value={intervalo}
          onChange={(e) =>
            setIntervalo(
              Number(e.target.value)
            )
          }
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
        >
          <option value={30}>
            30 minutos
          </option>
          <option value={60}>
            60 minutos
          </option>
          <option value={90}>
            90 minutos
          </option>
          <option value={120}>
            120 minutos
          </option>
        </select>

        <label className="block mb-4 font-bold text-xl">
          Dias de Funcionamento
        </label>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            "segunda",
            "terca",
            "quarta",
            "quinta",
            "sexta",
            "sabado",
            "domingo",
          ].map((dia) => (
            <label
              key={dia}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={diasFuncionamento.includes(
                  dia
                )}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDiasFuncionamento([
                      ...diasFuncionamento,
                      dia,
                    ]);
                  } else {
                    setDiasFuncionamento(
                      diasFuncionamento.filter(
                        (d) => d !== dia
                      )
                    );
                  }
                }}
              />

              {dia.charAt(0).toUpperCase() +
                dia.slice(1)}
            </label>
          ))}
        </div>

        <button
          onClick={salvar}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-bold"
        >
          Salvar Configurações
        </button>
      </div>
    </main>
  );
}
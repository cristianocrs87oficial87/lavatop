"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Configuracoes() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [abre, setAbre] = useState("08:00");
  const [fecha, setFecha] = useState("18:00");
  const [logoUrl, setLogoUrl] = useState("");
const [bannerUrl, setBannerUrl] = useState("");
const [corPrincipal, setCorPrincipal] = useState("#06b6d4");
const [mensagemCliente, setMensagemCliente] = useState(
  "🚘 Especialistas em estética automotiva.\n\nOferecemos lavagem completa, higienização interna, cristalização de pintura, polimento, limpeza técnica, hidratação de couro e diversos serviços para manter seu veículo limpo, protegido e valorizado.\n\nAgende seu atendimento de forma rápida e escolha o melhor horário para cuidar do seu veículo."
);

  const [diasFuncionamento, setDiasFuncionamento] = useState<string[]>([
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
  ]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
const [novoServico, setNovoServico] = useState("");
const [novoPreco, setNovoPreco] = useState("");
const [novaDuracao, setNovaDuracao] = useState("");



  useEffect(() => {
  carregarEmpresa();
  carregarServicos();
}, []);
async function uploadLogo(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const arquivo = e.target.files?.[0];

  if (!arquivo) return;

  const nomeArquivo =
    Date.now() + "-" + arquivo.name;

  const { error } = await supabase.storage
    .from("logos")
    .upload(nomeArquivo, arquivo);

  if (error) {
    alert("Erro ao enviar logo.");
    console.log(error);
    return;
  }

  const { data } = supabase.storage
    .from("logos")
    .getPublicUrl(nomeArquivo);

  setLogoUrl(data.publicUrl);
}
async function uploadBanner(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const arquivo = e.target.files?.[0];

  if (!arquivo) return;

  const nomeArquivo =
    Date.now() + "-" + arquivo.name;

  const { error } = await supabase.storage
    .from("banners")
    .upload(nomeArquivo, arquivo);

  if (error) {
    alert("Erro ao enviar banner.");
    console.log(error);
    return;
  }

  const { data } = supabase.storage
    .from("banners")
    .getPublicUrl(nomeArquivo);

  setBannerUrl(data.publicUrl);
}


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
    setWhatsapp(empresa.whatsapp || "");
    setAbre(empresa.abre || "08:00");
    setFecha(empresa.fecha || "18:00");
    setLogoUrl(empresa.logo_url || "");
setBannerUrl(empresa.banner_url || "");
setCorPrincipal(
  empresa.cor_principal || "#06b6d4"
);
setMensagemCliente(
  empresa.mensagem_cliente || ""
);

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

async function carregarServicos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id")
    .eq("usuario_id", user.id)
    .single();

  if (!empresa) return;

  const { data } = await supabase
    .from("servicos")
    .select("*")
    .eq("empresa_id", empresa.id)
    .order("id");

  setServicos(data || []);
}
async function excluirServico(id: number) {
  const confirmar = confirm(
    "Deseja realmente excluir este serviço?"
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("servicos")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erro ao excluir serviço.");
    return;
  }

  setServicos(
    servicos.filter((s) => s.id !== id)
  );
}
function editarServico(servico: any) {
  setEditandoId(servico.id);

  setNovoServico(servico.nome);
  setNovoPreco(servico.preco);
  setNovaDuracao(servico.duracao);
}
async function adicionarServico() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id")
    .eq("usuario_id", user.id)
    .single();

  if (!empresa) {
    alert("Empresa não encontrada.");
    return;
  }

  if (
    !novoServico ||
    !novoPreco ||
    !novaDuracao
  ) {
    alert("Preencha todos os campos.");
    return;
  }

  let error;

if (editandoId) {
  const resultado = await supabase
    .from("servicos")
    .update({
      nome: novoServico,
      preco: Number(novoPreco),
      duracao: Number(novaDuracao),
    })
    .eq("id", editandoId);

  error = resultado.error;
} else {
  const resultado = await supabase
    .from("servicos")
    .insert({
      empresa_id: empresa.id,
      nome: novoServico,
      preco: Number(novoPreco),
      duracao: Number(novaDuracao),
    });

  error = resultado.error;
}

  if (error) {
  console.log(error);

  alert(
    JSON.stringify(
      error,
      null,
      2
    )
  );

  return;
}

  setNovoServico("");
setNovoPreco("");
setNovaDuracao("");
setEditandoId(null);

carregarServicos();
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
  whatsapp,
  abre,
  fecha,

  dias_funcionamento: diasFuncionamento,

  logo_url: logoUrl,
  banner_url: bannerUrl,
  cor_principal: corPrincipal,
  mensagem_cliente: mensagemCliente,

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
    whatsapp,
    abre,
    fecha,

    dias_funcionamento: diasFuncionamento,

    logo_url: logoUrl,
    banner_url: bannerUrl,
    cor_principal: corPrincipal,
    mensagem_cliente: mensagemCliente,

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
  "🎉 Configuração salva com sucesso!\n\nAgora você já pode compartilhar seu link de agendamento."
);

router.push("/admin");
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
      <div className="bg-cyan-500 text-black p-4 rounded-xl mb-6 font-bold">
  🚀 Bem-vindo ao LavaTop!

  <br /><br />

  Configure os horários, dias de funcionamento e informações da sua empresa.

  <br /><br />

  Após salvar você poderá compartilhar seu link de agendamento com seus clientes.
</div>

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
        checked={diasFuncionamento.includes(dia)}
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

<h2 className="text-2xl font-bold mb-6 text-cyan-400">
  🎨 Identidade Visual
</h2>
<p className="text-zinc-400 mb-6">
  Personalize a aparência da sua página de agendamento com sua logo, banner e cores da marca.
</p>

<div className="grid lg:grid-cols-2 gap-8 mb-8">

  {/* LOGO */}
  <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">

    <h3 className="font-bold text-lg mb-4">
      Logo da Empresa
    </h3>

    <div className="flex justify-center mb-4">
      {logoUrl ? (
        <img
  src={logoUrl}
  alt="Logo"
  className="w-48 h-48 rounded-full object-contain bg-black border-4 border-cyan-500 p-2"
/>
      ) : (
        <div className="w-32 h-32 rounded-full bg-black border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center text-center">
  <span className="text-zinc-400 text-xs">
    LOGO
  </span>

  <span className="text-zinc-500 text-[10px] mt-1">
    500x500px
  </span>
</div>
      )}
    </div>

    <p className="text-sm text-zinc-400 mb-4 text-center">
      Recomendado:
      <br />
      500x500px
      <br />
      PNG transparente
    </p>

    <label className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-bold cursor-pointer text-center block">
      📸 Adicionar Logo

      <input
        type="file"
        accept="image/*"
        onChange={uploadLogo}
        className="hidden"
      />
    </label>

  </div>

  {/* BANNER */}
  <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">

    <h3 className="font-bold text-lg mb-4">
      Banner da Empresa
    </h3>

    <div className="mb-4">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Banner"
          className="w-full h-52 rounded-xl object-cover border border-zinc-600"
        />
      ) : (
        <div className="w-full h-40 rounded-xl bg-black border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center">
  <span className="text-zinc-400 font-semibold">
    BANNER DA EMPRESA
  </span>

  <span className="text-zinc-500 text-sm mt-2">
    1920 x 500 px
  </span>
</div>
      )}
    </div>

    <p className="text-sm text-zinc-400 mb-4 text-center">
      Recomendado:
      <br />
      1920x500px
      <br />
      JPG ou PNG
    </p>

    <label className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold cursor-pointer text-center block">
      🖼️ Adicionar Banner

      <input
        type="file"
        accept="image/*"
        onChange={uploadBanner}
        className="hidden"
      />
    </label>

  </div>

</div>

<label className="block mb-2 font-bold">
  Cor Principal
</label>

<input
  type="color"
  value={corPrincipal}
  onChange={(e) =>
    setCorPrincipal(e.target.value)
  }
  className="w-full h-14 rounded-lg mb-6"
/>

<label className="block mb-2 font-bold">
  Descrição da Empresa
</label>

<p className="text-sm text-gray-400 mb-2">
  Esta descrição será exibida para seus clientes na página de agendamento.
</p>

<textarea
  value={mensagemCliente}
  onChange={(e) =>
    setMensagemCliente(e.target.value)
  }
  rows={4}
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
/>
<label className="block mb-2 font-bold">
  WhatsApp da Empresa
</label>

<input
  type="text"
  value={whatsapp}
  onChange={(e) =>
    setWhatsapp(e.target.value)
  }
  placeholder="(12) 99123-4567"
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-6"
/>

<hr className="my-8 border-zinc-700" />

<h2 className="text-2xl font-bold mb-4">
  Serviços Oferecidos
</h2>

<div className="space-y-3 mb-6">
  {servicos.map((s) => (
    <div
      key={s.id}
      className="bg-zinc-800 p-3 rounded-lg"
    >
      <div className="flex justify-between">
        <span>
          {s.nome} - R$ {s.preco}
        </span>

        <span>
          {s.duracao} min
        </span>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => editarServico(s)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
        >
          ✏️ Editar
        </button>

        <button
          onClick={() => excluirServico(s.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  ))}
</div>

<input
  type="text"
  placeholder="Nome do serviço"
  value={novoServico}
  onChange={(e) => setNovoServico(e.target.value)}
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 mb-3"
/>

<input
  type="number"
  placeholder="Preço"
  value={novoPreco}
  onChange={(e) => setNovoPreco(e.target.value)}
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 mb-3"
/>

<input
  type="number"
  placeholder="Duração em minutos"
  value={novaDuracao}
  onChange={(e) => setNovaDuracao(e.target.value)}
  className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 mb-3"
/>

<button
  onClick={adicionarServico}
  className={`px-4 py-2 rounded-lg font-bold mb-6 ${
    editandoId
      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
      : "bg-green-600 hover:bg-green-700 text-white"
  }`}
>
  {editandoId
    ? "💾 Atualizar Serviço"
    : "➕ Adicionar Serviço"}
</button>

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
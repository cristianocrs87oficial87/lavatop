"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";

export default function Planos() {
  const [pix, setPix] = useState<any>(null);
const [status, setStatus] = useState("");
const [premiumAtivado, setPremiumAtivado] = useState(false);

const [premium, setPremium] = useState(false);
const [premiumAte, setPremiumAte] = useState<string | null>(null);
const router = useRouter();

  async function gerarPixMensal() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Usuário não encontrado.");
        return;
      }

      const response = await fetch(
        `/api/pay2m/pix?user_id=${user.id}&plano=mensal`
      );

      const data = await response.json();

      setPix({
        copiaecola: data.content,
        reference_code: data.reference_code,
      });
      setStatus("⏳ Aguardando pagamento...");
setPremiumAtivado(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao gerar PIX.");
    }
  }

  async function gerarPixAnual() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Usuário não encontrado.");
        return;
      }

      const response = await fetch(
        `/api/pay2m/pix?user_id=${user.id}&plano=anual`
      );

      const data = await response.json();

      setPix({
        copiaecola: data.content,
        reference_code: data.reference_code,
      });
      setStatus("⏳ Aguardando pagamento...");
setPremiumAtivado(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao gerar PIX.");
    }
  }

  async function copiarPix() {
  if (!pix?.copiaecola) return;

  await navigator.clipboard.writeText(
    pix.copiaecola
  );

  alert("PIX copiado!");
}
useEffect(() => {
  async function carregarPremium() {
    await fetch("/api/verificar-premium");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: empresa } = await supabase
      .from("empresas")
      .select("premium, premium_ate")
      .eq("usuario_id", user.id)
      .single();

    if (!empresa) return;

    const premiumAtivo =
      empresa.premium &&
      empresa.premium_ate &&
      new Date(empresa.premium_ate) > new Date();

    setPremium(!!premiumAtivo);
    setPremiumAte(empresa.premium_ate);
  }

  carregarPremium();
}, []);

useEffect(() => {
  if (!pix?.reference_code) return;

  const interval = setInterval(async () => {
    try {
      await fetch("/api/pay2m/check-payments");

      const response = await fetch(
        `/api/pay2m/status/${pix.reference_code}`
      );

      const data = await response.json();

      console.log("STATUS PIX:", data.status);

      if (data.status === "awaiting_payment") {
        setStatus("⏳ Aguardando pagamento...");
      }

     if (data.status === "paid") {
  setStatus("✅ Pagamento aprovado");
  setPremiumAtivado(true);

  setPremium(true);


  clearInterval(interval);

  setTimeout(() => {
    router.push("/admin");
  }, 3000);
}
    } catch (error) {
      console.log(error);
    }
  }, 15000);

  return () => clearInterval(interval);
}, [pix]);

  const dataPremium = premiumAte
  ? new Date(premiumAte).toLocaleDateString("pt-BR")
  : null;
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Escolha seu Plano
      </h1>
      <div className="bg-cyan-500 text-black font-bold p-4 rounded-xl mb-8 text-center">
  🎁 Novos clientes recebem 7 dias grátis para testar o LavaTop.
</div>
<div className="bg-zinc-900 border border-cyan-500 p-6 rounded-2xl mb-8">
  <h2 className="text-2xl font-bold text-cyan-400 mb-3">
    Plano Atual
  </h2>

  <p className="text-2xl font-bold text-green-400">
  {premium ? "⭐ Premium Ativo" : "🆓 Teste Grátis"}
</p>

  <p className="text-zinc-300 mt-2">
  Válido até: {dataPremium || "-"}
</p>

{premium && (
  <p className="text-green-400 mt-2">
    ✔ Todos os recursos Premium liberados
  </p>
)}
</div>

      <div className="grid md:grid-cols-2 gap-6">
        
<div className="bg-zinc-900 p-6 rounded-2xl border border-yellow-500">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            Premium Mensal
          </h2>

          <p className="text-green-400 font-bold mb-2">
            ⭐ Mais Escolhido
          </p>

          <p className="text-4xl font-bold mb-4">
            R$ 49,90/mês
          </p>

          <p>Agendamentos ilimitados</p>
          <p>Relatórios avançados</p>
          <p>WhatsApp avançado</p>
          <p>Suporte prioritário</p>

          {premium ? (
  <div className="mt-6 bg-green-600 p-4 rounded-xl text-center">
    <p className="font-bold">
      ⭐ Premium ativo até {dataPremium}
    </p>
  </div>
) : (
  <button
    onClick={gerarPixMensal}
    className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl"
  >
    🚀 Gerar PIX Mensal
  </button>
)}
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-green-500">
  <h2 className="text-3xl font-bold text-green-400 mb-4">
    Premium Anual
  </h2>

  <p className="text-4xl font-bold mb-2">
    R$ 497,00/ano
  </p>

  <p className="text-green-400 font-bold mb-4">
    Economize mais de R$ 100 por ano
  </p>

  <p>Tudo do Premium</p>
  <p>Suporte prioritário</p>

  {premium ? (
    <div className="mt-6 bg-green-600 p-4 rounded-xl text-center">
      <p className="font-bold">
        ⭐ Premium ativo até {dataPremium}
      </p>
    </div>
  ) : (
    <button
      onClick={gerarPixAnual}
      className="mt-6 w-full bg-green-500 hover:bg-green-600 font-bold py-3 rounded-xl"
    >
      🚀 Gerar PIX Anual
    </button>
  )}
</div>
      </div>

      {pix && (
        <div className="mt-10 bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Pagamento PIX
          </h2>

          <p className="mb-4 text-green-400">
            PIX gerado com sucesso
          </p>
          <p className="mb-4 text-yellow-400 font-bold">
  {status}
</p>

          <div className="flex justify-center mb-6">
  <div className="bg-white p-4 rounded-xl">
    <QRCodeSVG
      value={pix.copiaecola}
      size={250}
    />
  </div>
</div>

<textarea
            readOnly
            value={pix.copiaecola}
            className="w-full mt-4 p-4 bg-zinc-800 rounded-xl h-40"
          />

          <button
            onClick={copiarPix}
            
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3 rounded-xl"
          >
            📋 Copiar PIX
          </button>

          <p className="mt-4 text-sm text-zinc-400">
            Referência: {pix.reference_code}
          </p>
          {premiumAtivado && (
  <div className="mt-6 bg-green-600 p-6 rounded-xl">
    <h3 className="text-3xl font-bold">
      🎉 Premium ativado com sucesso!
    </h3>

    <p className="mt-2">
  Seu plano já está ativo e liberado.
</p>

<p className="mt-2 font-bold">
  Redirecionando para o painel...
</p>
  </div>
)}
        </div>
      )}
    </main>
  );
}
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

  const [mostrarPix, setMostrarPix] = useState(false);

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

setMostrarPix(true);

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

setMostrarPix(true);

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

  setStatus("✅ PIX copiado");
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

clearInterval(interval);

setTimeout(() => {
  setMostrarPix(false);

  setTimeout(() => {
    router.push("/admin");
  }, 2000);
}, 3000);
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
  const diasRestantes = premiumAte
  ? Math.max(
      0,
      Math.ceil(
        (new Date(premiumAte).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    )
  : 0;
  return (
    <>
    {mostrarPix && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-zinc-900 p-6 rounded-2xl max-w-md w-full border border-cyan-500">

      <h2 className="text-3xl font-bold mb-4">
        Pagamento PIX
      </h2>

      {mostrarPix && (
        <>
          <div className="bg-white p-4 rounded-xl flex justify-center mb-4">
            <QRCodeSVG
              value={pix.copiaecola}
              size={220}
            />
          </div>

          <button
            onClick={copiarPix}
            className="w-full bg-cyan-500 text-black font-bold py-3 rounded-xl mb-3"
          >
            📋 Copiar PIX
          </button>

          <p className="text-center text-yellow-400">
            <p className="text-center text-yellow-400">
  {status}
</p>
          </p>
        </>
      )}

      <button
        onClick={() => setMostrarPix(false)}
        className="w-full mt-4 bg-red-600 py-3 rounded-xl"
      >
        Fechar
      </button>

    </div>
  </div>
)}
    
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

  <p className={`text-2xl font-bold ${premium ? "text-yellow-400" : "text-green-400"}`}>
  {premium ? "👑 Plano LavaTop Pro" : "🆓 Teste Grátis"}
</p>

<p className="text-zinc-300 mt-2">
  📅 Válido até: <strong>{dataPremium || "-"}</strong>
</p>

{premium ? (
  <p className="text-green-400 mt-2 font-semibold">
    ✔ Assinatura ativa.
  </p>
) : (
  <p className="text-cyan-400 mt-2 font-semibold">
    ⏳ Restam {diasRestantes} dia{diasRestantes !== 1 ? "s" : ""} de teste.
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
    </main>
  </>
);
}
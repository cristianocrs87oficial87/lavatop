"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function PremiumPage() {
  const [pix, setPix] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusPagamento, setStatusPagamento] =
  useState("awaiting_payment");
  
  useEffect(() => {
  if (!referenceCode) return;

  const intervalo = setInterval(async () => {
    try {
      await fetch("/api/pay2m/check-payments");

      const response = await fetch(
        `/api/pay2m/status/${referenceCode}`
      );

      const data = await response.json();

      console.log("STATUS PIX:", data.status);

      if (data.status === "paid") {
        setStatusPagamento("paid");

        alert(
          "✅ Pagamento aprovado! Plano Premium ativado."
        );

        window.location.href = "/admin";
      }
    } catch (error) {
      console.log(error);
    }
  }, 5000);

  return () => clearInterval(intervalo);
}, [referenceCode]);

  async function gerarPix() {
    setLoading(true);

    try {
      const response = await fetch("/api/pay2m/pix");
const data = await response.json();

console.log("RETORNO PAY2M:", data);

alert(
  JSON.stringify(data, null, 2)
);

      setPix(data.content);
      setReferenceCode(data.reference_code);

      const qrImage = await QRCode.toDataURL(data.content);

      setQrCode(qrImage);
      setTimeout(() => {
  document
    .getElementById("area-pix")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}, 300);
    } catch (error) {
      console.log(error);
      alert("Erro ao gerar PIX");
    }

    setLoading(false);
  }

  async function copiarPix() {
    await navigator.clipboard.writeText(pix);
    alert("PIX copiado!");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-10">
      <div className="bg-zinc-900 p-6 rounded-3xl max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">
          Plano Premium LavaTop
        </h1>

        <p className="text-center text-white mt-4">
          Assine por R$ 10,00
        </p>

        <button
          onClick={gerarPix}
          disabled={loading}
          className="w-full mt-8 bg-cyan-500 p-4 rounded-xl font-bold"
        >
          {loading
  ? "⏳ Gerando PIX..."
  : "🚀 Gerar PIX"}
        </button>

        {pix && (
  <div
    id="area-pix"
    className="mt-8"
  >
            <h2 className="text-white font-bold text-center mb-4">
              Escaneie o QR Code
            </h2>

            <div className="flex justify-center">
              <img
                src={qrCode}
                alt="QR Code PIX"
                className="bg-white p-4 rounded-xl"
              />
            </div>

            <h2 className="text-white font-bold mt-8 mb-4">
              PIX Copia e Cola
            </h2>

            <div className="w-full p-4 rounded-xl bg-zinc-800 text-white break-all text-xs min-h-[150px]">
  {pix}
</div>
            <button
              onClick={copiarPix}
              className="w-full mt-4 bg-green-600 p-4 rounded-xl font-bold text-white"
            >
              Copiar PIX
            </button>

            <p className="text-zinc-400 text-sm mt-4 break-all">
              Referência: {referenceCode}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
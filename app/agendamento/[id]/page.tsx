import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import AgendamentoCliente from "@/components/AgendamentoCliente";

export default async function AgendamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: empresa, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !empresa) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">
          Empresa não encontrada
        </h1>
      </div>
    );
  }

  const { data: servicos } = await supabase
    .from("servicos")
    .select("*")
    .eq("empresa_id", empresa.id)
    .order("nome");

  return (
    <div className="min-h-screen bg-black text-white">

      {empresa.banner_url && (
        <div className="w-full bg-black flex justify-center">
          <img
            src={empresa.banner_url}
            alt="Banner"
            className="w-full max-w-[1920px] h-auto"
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden">

          <div className="p-8">

            <div className="flex flex-col items-center text-center">

              {empresa.logo_url && (
                <img
                  src={empresa.logo_url}
                  alt="Logo"
                  className="w-40 h-40 rounded-full border-4 object-contain bg-black p-1 mb-4 -mt-2"
                  style={{
                    borderColor:
                      empresa.cor_principal || "#06b6d4",
                  }}
                />
              )}

              <h1 className="text-4xl font-bold mb-3">
                {empresa.nome}
              </h1>

              <p className="text-zinc-400 mb-6 max-w-2xl">
                {empresa.mensagem_cliente ||
                  "Agende seu horário online em poucos segundos."}
              </p>

              <div className="flex flex-wrap gap-3 justify-center mb-8">

                <div
                  className="px-4 py-2 rounded-xl text-white font-semibold"
                  style={{
                    background:
                      empresa.cor_principal || "#06b6d4",
                  }}
                >
                  📞 {empresa.telefone}
                </div>

                <div className="bg-zinc-800 px-4 py-2 rounded-xl">
                  ⏰ {empresa.abre} às {empresa.fecha}
                </div>

              </div>

            </div>


            <div
              className="rounded-2xl p-6"
              style={{
                border: `2px solid ${empresa.cor_principal || "#06b6d4"}`,
              }}
            >
              <h2 className="text-2xl font-bold mb-6">
                📅 Agendar Serviço
              </h2>

              <AgendamentoCliente
  servicos={servicos || []}
  empresa={empresa}
/>

            </div>

          </div>

    </div>

    {empresa.whatsapp && (
      <a
        href={`https://wa.me/55${empresa.whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300"
      >
        <FaWhatsapp size={28} />
        <span className="font-semibold">
          Falar no WhatsApp
        </span>
      </a>
    )}

  </div>
);


    </div>
  );
}
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
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6">
          {empresa.nome}
        </h1>

        <div className="space-y-3">
          <p>
            <strong>Telefone:</strong> {empresa.telefone}
          </p>

          <p>
            <strong>Abre:</strong> {empresa.abre}
          </p>

          <p>
            <strong>Fecha:</strong> {empresa.fecha}
          </p>

          <p>
            <strong>Intervalo:</strong> {empresa.intervalo} min
          </p>

          <p>
            <strong>Dias:</strong>
          </p>

          <ul className="list-disc ml-6">
            {empresa.dias_funcionamento?.map((dia: string) => (
              <li key={dia}>{dia}</li>
            ))}
          </ul>
        </div>

        <hr className="my-8 border-zinc-700" />

        <AgendamentoCliente servicos={servicos || []} />
          
      </div>
    </div>
  );
}
import StatusAgendamento from "@/app/components/StatusAgendamento";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AgendamentosPage() {
  const { data: agendamentos, error } = await supabaseAdmin
    .from("agendamentos")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("AGENDAMENTOS:", agendamentos);
  console.log("ERRO:", error);

return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Agendamentos
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border border-zinc-800">
            <thead>
              <tr className="bg-zinc-900">
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Telefone</th>
                <th className="p-3 text-left">Veículo</th>
                <th className="p-3 text-left">Serviço</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Hora</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {agendamentos?.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-zinc-800"
                >
                  <td className="p-3">{item.cliente}</td>
                  <td className="p-3">{item.telefone}</td>
                  <td className="p-3">{item.veiculo}</td>
                  <td className="p-3">{item.servico}</td>
                  <td className="p-3">
                    {item.data_agendamento}
                  </td>
                  <td className="p-3">
                    {item.hora_agendamento}
                  </td>
                  <td className="p-3">
  <StatusAgendamento
    id={item.id}
    statusInicial={item.status}
  />
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default function Planos() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Escolha seu Plano
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Grátis
          </h2>

          <p>Até 50 agendamentos por mês</p>
          <p>Suporte básico</p>
          <p>Painel administrativo</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-yellow-500">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            Premium Mensal
          </h2>

          <p className="text-4xl font-bold mb-4">
            R$ 29,90
          </p>

          <p>Agendamentos ilimitados</p>
          <p>Relatórios avançados</p>
          <p>WhatsApp avançado</p>
          <p>Suporte prioritário</p>

          <button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl">
            Assinar Agora
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-green-500">
          <h2 className="text-3xl font-bold text-green-400 mb-4">
            Premium Anual
          </h2>

          <p className="text-4xl font-bold mb-4">
            R$ 299,00
          </p>

          <p>Tudo do Premium</p>
          <p>2 meses grátis</p>

          <button className="mt-6 w-full bg-green-500 hover:bg-green-600 font-bold py-3 rounded-xl">
            Assinar Anual
          </button>
        </div>
      </div>
    </main>
  );
}
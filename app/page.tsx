import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

    <h1 className="text-3xl font-extrabold">
  Lava<span className="text-cyan-400">Top</span>
</h1>

    <nav className="flex items-center gap-8">

      <a href="#beneficios" className="hover:text-cyan-400">
        Recursos
      </a>

      <a href="#precos" className="hover:text-cyan-400">
        Preços
      </a>

      <Link
        href="/login"
        className="hover:text-cyan-400"
      >
        Entrar
      </Link>

      <Link
        href="/cadastro"
        className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg font-semibold"
      >
        Criar Conta
      </Link>
    

    </nav>

  </div>
</header>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          <div>
            <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm">
              Sistema para Lava-Rápidos
            </span>

            <h1 className="text-5xl md:text-7xl font-bold mt-6">
              Seu lava-rápido agendando clientes
              <span className="text-cyan-400"> 24 horas por dia</span>
            </h1>

            <p className="text-gray-400 text-xl mt-6">
              Receba agendamentos online, fidelize clientes e aumente seu faturamento sem depender apenas do WhatsApp.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                href="/cadastro"
                className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl font-bold"
              >
                Criar Conta
              </Link>

              <Link
                href="/login"
                className="border border-cyan-500 px-8 py-4 rounded-xl"
              >
                Entrar
              </Link>
            </div>
          </div>

          <div>
            <div className="flex justify-center">
  <img
    src="/dashboard.png"
    alt="Dashboard LavaTop"
    className="w-full scale-125 rounded-3xl shadow-2xl border border-cyan-500"
  />
</div>
          </div>

        </div>
      </section>

      {/* BENEFÍCIOS */}
      {/* ESTATÍSTICAS */}
<section id="beneficios" className="py-12 border-t border-zinc-800 border-b border-zinc-800">
  <div className="max-w-6xl mx-auto px-6">

    <div className="grid md:grid-cols-4 gap-8 text-center">

      <div>
        <h3 className="text-4xl font-bold text-cyan-400">
          24h
        </h3>
        <p className="text-gray-400 mt-2">
          Agendamento Online
        </p>
      </div>

      <div>
        <h3 className="text-4xl font-bold text-cyan-400">
          100%
        </h3>
        <p className="text-gray-400 mt-2">
          Na Nuvem
        </p>
      </div>

      <div>
        <h3 className="text-4xl font-bold text-cyan-400">
          PIX
        </h3>
        <p className="text-gray-400 mt-2">
          Pagamento Integrado
        </p>
      </div>

      <div>
        <h3 className="text-4xl font-bold text-cyan-400">
          ⭐
        </h3>
        <p className="text-gray-400 mt-2">
          Fidelidade Integrada
        </p>
      </div>

    </div>

  </div>
</section>
      <section id="beneficios" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-16">
            Tudo que seu lava-rápido precisa
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-zinc-900 p-8 rounded-2xl">
              <h3 className="text-cyan-400 text-xl font-bold">
                📅 Agendamento Online
              </h3>
              <p className="mt-4 text-gray-400">
                Seus clientes agendam sozinhos 24 horas por dia.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl">
              <h3 className="text-cyan-400 text-xl font-bold">
                ⭐ Fidelidade
              </h3>
              <p className="mt-4 text-gray-400">
                Acumule pontos e faça seus clientes voltarem mais vezes.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl">
              <h3 className="text-cyan-400 text-xl font-bold">
                📱 WhatsApp
              </h3>
              <p className="mt-4 text-gray-400">
                Compartilhe seu link de agendamento facilmente.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl">
              <h3 className="text-cyan-400 text-xl font-bold">
                💰 PIX
              </h3>
              <p className="mt-4 text-gray-400">
                Receba pagamentos rápidos e seguros.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl">
              <h3 className="text-cyan-400 text-xl font-bold">
                📊 Gestão
              </h3>
              <p className="mt-4 text-gray-400">
                Controle agendamentos e clientes em um único lugar.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl">
              <h3 className="text-cyan-400 text-xl font-bold">
                🔒 Segurança
              </h3>
              <p className="mt-4 text-gray-400">
                Dados protegidos com Supabase e RLS.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="precos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-16">
            Como funciona
          </h2>

          <div className="grid md:grid-cols-5 gap-6 text-center">

            <div>
              <div className="text-5xl">1️⃣</div>
              <p className="mt-4">Cliente acessa o link</p>
            </div>

            <div>
              <div className="text-5xl">2️⃣</div>
              <p className="mt-4">Escolhe o serviço</p>
            </div>

            <div>
              <div className="text-5xl">3️⃣</div>
              <p className="mt-4">Seleciona horário</p>
            </div>

            <div>
              <div className="text-5xl">4️⃣</div>
              <p className="mt-4">Confirma o agendamento</p>
            </div>

            <div>
              <div className="text-5xl">5️⃣</div>
              <p className="mt-4">Você recebe o cliente</p>
            </div>

          </div>

        </div>
      </section>

      {/* PREÇO */}
      <section id="precos" className="py-24 px-6 bg-zinc-950">

        <div className="max-w-xl mx-auto">

          <div className="bg-zinc-900 rounded-3xl p-10 border border-cyan-500">

            <h2 className="text-4xl font-bold text-center">
              Plano Premium
            </h2>

            <div className="text-center mt-6">

  <p className="text-gray-400 text-lg mb-2">
    7 Dias Grátis
  </p>

  <span className="text-6xl font-bold text-cyan-400">
    R$49,90
  </span>

  <p className="text-gray-400 mt-2">
    por mês
  </p>

  <div className="mt-4 text-base text-gray-300 font-medium">
    <p>✓ Sem taxa de adesão</p>
    <p>✓ Cancele quando quiser</p>
  </div>

</div>

            <ul className="space-y-4 mt-10">
              <li>✔ Agendamentos ilimitados</li>
              <li>✔ Programa fidelidade</li>
              <li>✔ Painel administrativo</li>
              <li>✔ Compartilhamento WhatsApp</li>
              <li>✔ Atualizações futuras</li>
            </ul>

            <Link
              href="/cadastro"
              className="block text-center bg-cyan-500 hover:bg-cyan-600 mt-10 py-4 rounded-xl font-bold"
            >
              Começar Teste Grátis
            </Link>
            <p className="mt-6 text-gray-400">
  ✅ 7 Dias Grátis • ✅ Sem Taxa de Adesão • ✅ Cancelamento Livre
</p>

          </div>

        </div>

      </section>
    
{/* DEPOIMENTOS */}
<section className="py-24 px-6">

  <div className="max-w-6xl mx-auto">

    <h2 className="text-4xl font-bold text-center mb-16">
      Por que escolher o LavaTop
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <p>
          Receba agendamentos 24 horas por dia.
        </p>

        <p className="mt-4 text-cyan-400 font-bold">
      
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <p>
          Fidelize clientes automaticamente.
        </p>

        <p className="mt-4 text-cyan-400 font-bold">
          
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <p>
          Organize seu lava-rápido em poucos minutos.
        </p>

        <p className="mt-4 text-cyan-400 font-bold">
          
        </p>
      </div>

    </div>

  </div>

</section>
{/* FAQ */}
<section className="py-24 px-6 bg-zinc-950">

  <div className="max-w-4xl mx-auto">

    <h2 className="text-4xl font-bold text-center mb-16">
      Perguntas Frequentes
    </h2>

    <div className="space-y-6">

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h3 className="text-cyan-400 font-bold text-xl">
          Preciso instalar algo?
        </h3>

        <p className="text-gray-400 mt-2">
          Não. O LavaTop funciona diretamente pelo navegador.
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h3 className="text-cyan-400 font-bold text-xl">
          Funciona no celular?
        </h3>

        <p className="text-gray-400 mt-2">
          Sim. Você pode usar pelo celular, tablet ou computador.
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h3 className="text-cyan-400 font-bold text-xl">
          Posso cancelar quando quiser?
        </h3>

        <p className="text-gray-400 mt-2">
          Sim. Não existe fidelidade contratual.
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h3 className="text-cyan-400 font-bold text-xl">
          Tem programa fidelidade?
        </h3>

        <p className="text-gray-400 mt-2">
          Sim. O sistema possui programa fidelidade integrado.
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h3 className="text-cyan-400 font-bold text-xl">
          Como meus clientes fazem agendamentos?
        </h3>

        <p className="text-gray-400 mt-2">
          Basta compartilhar seu link exclusivo de agendamento.
        </p>
      </div>

    </div>

  </div>

</section>

 {/* CTA FINAL */}
<section className="py-24 px-6 text-center">

  <div className="max-w-4xl mx-auto">

    <h2 className="text-5xl font-bold">
      Pronto para modernizar seu lava-rápido?
    </h2>

    <p className="text-gray-400 text-xl mt-6">
      Receba agendamentos online 24 horas por dia,
      organize sua operação e fidelize seus clientes.
    </p>

    <Link
      href="/cadastro"
      className="inline-block bg-cyan-500 hover:bg-cyan-600 mt-10 px-10 py-5 rounded-xl font-bold text-xl"
    >
      Começar Teste Grátis
    </Link>
    <p className="mt-6 text-gray-400">
  ✅ 7 Dias Grátis • ✅ Sem Taxa de Adesão • ✅ Cancelamento Livre
</p>

<a
  href="https://wa.me/5512996063041"
  target="_blank"
  className="block mt-4 text-cyan-400 hover:text-cyan-300"
>
  Dúvidas? Fale conosco pelo WhatsApp
</a>

  </div>

</section>
<footer className="border-t border-zinc-800 py-10 text-center text-gray-500">

  <h3 className="text-white font-bold text-xl mb-4">
    Lava<span className="text-cyan-400">Top</span>
  </h3>

  <p>
    Agendamentos • Fidelidade • WhatsApp • PIX • Multiempresa
  </p>

  <p className="mt-3 text-sm">
    © 2026 LavaTop. Todos os direitos reservados.
  </p>

</footer>
<a
  href="https://wa.me/5512996063041?text=Olá!%20Gostaria%20de%20conhecer%20o%20LavaTop."
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg z-50 font-bold"
>
  💬 WhatsApp
</a>
    </main>
  );
}
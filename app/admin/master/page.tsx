'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MasterPage() {
 const [empresas, setEmpresas] = useState<any[]>([])
const [totalEmpresas, setTotalEmpresas] = useState(0)
const [premiumAtivas, setPremiumAtivas] = useState(0)
const [testeGratis, setTesteGratis] = useState(0)
const [taxaConversao, setTaxaConversao] = useState(0)


const [receitaMensal, setReceitaMensal] = useState(0)
const [pixPagos, setPixPagos] = useState(0)
const [pixPendentes, setPixPendentes] = useState(0)
const [agendamentosTotal, setAgendamentosTotal] = useState(0)
const [agendamentosHoje, setAgendamentosHoje] = useState(0)
  useEffect(() => {
  carregarDados()
}, [])
async function verificarAcesso() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (
    user?.email !== 'cristianocrs87oficial@gmail.com'
  ) {
    window.location.href = '/admin'
    return
  }

  carregarDados()
}

  async function carregarDados() {
  const { data, error } = await supabase
  .from('empresas')
  .select('*')

console.log('DATA:', data)
console.log('ERROR:', error)

  console.log('EMPRESAS:', data)

  if (!data) return

  setEmpresas(data)
  setTotalEmpresas(data.length)
  setPremiumAtivas(data.filter(e => e.premium).length)
  setTesteGratis(data.filter(e => !e.premium).length)
  const premium = data.filter(e => e.premium).length

setTaxaConversao(
  Number(((premium / data.length) * 100).toFixed(1))
)
  const { data: pagamentos } = await supabase
  .from('premium_pagamentos')
  .select('*')

if (pagamentos) {
  const pagos = pagamentos.filter(
    (p) => p.status === 'paid'
  )

  const pendentes = pagamentos.filter(
    (p) => p.status === 'pending'
  )

  setPixPagos(pagos.length)
  setPixPendentes(pendentes.length)

  const totalReceita = pagos.reduce(
    (acc, p) => acc + Number(p.valor || 0),
    0
  )

  setReceitaMensal(totalReceita)
}

const { data: agendamentos } = await supabase
  .from('agendamentos')
  .select('*')
  console.log('AGENDAMENTOS:', agendamentos)

if (agendamentos) {
  setAgendamentosTotal(agendamentos.length)

  const hoje = new Date().toISOString().split('T')[0]

  const hojeCount = agendamentos.filter(
    (a) => a.data === hoje
  ).length

  setAgendamentosHoje(hojeCount)
}
}
const receitaAnual = receitaMensal * 12
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Painel Master LavaTop
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">

  <div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-500">🏢 Empresas</h2>
    <p className="text-3xl font-bold">{totalEmpresas}</p>
  </div>

  <div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-500">⭐ Premium</h2>
    <p className="text-3xl font-bold">{premiumAtivas}</p>
  </div>
<div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-500">🆓 Teste Grátis</h2>
    <p className="text-3xl font-bold">{testeGratis}</p>
  </div>

  <div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-400">💰 Receita Mensal</h2>
    <p className="text-3xl font-bold text-green-400">
      R$ {receitaMensal.toFixed(2)}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-400">💎 Receita Anual</h2>
    <p className="text-3xl font-bold text-cyan-400">
      R$ {receitaAnual.toFixed(2)}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-400">📈 Conversão Premium</h2>
    <p className="text-3xl font-bold text-yellow-400">
      {taxaConversao}%
    </p>
  </div>

</div>

<div className="grid md:grid-cols-2 gap-4 mb-6">

  <div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-400">💵 PIX Pagos</h2>
    <p className="text-3xl font-bold text-green-400">
      {pixPagos}
    </p>
  </div>

  <div className="bg-gray-800 rounded-xl shadow-lg p-4">
    <h2 className="text-gray-400">⏳ PIX Pendentes</h2>
    <p className="text-3xl font-bold text-red-400">
      {pixPendentes}
    </p>
  </div>

</div>
<div className="bg-gray-800 rounded-xl shadow-lg p-4 mt-6">
  <h2 className="text-xl font-bold mb-4">
    Empresas Cadastradas
  </h2>
        <table className="w-full text-white">
          <thead>
  <tr className="border-b">
    <th className="text-left py-2">Empresa</th>
    <th className="text-left py-2">Telefone</th>
    <th className="text-left py-2">Plano</th>
    <th className="text-left py-2">Premium Até</th>
    <th className="text-left py-2">Cadastro</th>
  </tr>
</thead>

          <tbody>
  {empresas.map((empresa) => (
    <tr key={empresa.id} className="border-b">

      <td className="py-2">
        {empresa.nome}
      </td>

      <td className="py-2">
        {empresa.telefone || '-'}
      </td>

      <td className="py-2">
        {empresa.premium ? 'Premium' : 'Teste'}
      </td>

      <td className="py-2">
        {empresa.premium_ate
          ? new Date(empresa.premium_ate).toLocaleDateString('pt-BR')
          : '-'}
      </td>

      <td className="py-2">
        {new Date(empresa.created_at).toLocaleDateString('pt-BR')}
      </td>

    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  )
}
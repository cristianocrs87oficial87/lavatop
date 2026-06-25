'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import CardsDashboard from './components/CardsDashboard'

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
const [empresasAtivasHoje, setEmpresasAtivasHoje] = useState(0)
const [empresasSemAcesso, setEmpresasSemAcesso] = useState(0)
const [busca, setBusca] = useState('')
const [filtro, setFiltro] = useState('todos')
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
  const hoje = new Date()

let ativasHoje = 0
let semAcesso = 0

data.forEach((empresa) => {
  if (!empresa.ultimo_acesso) {
    semAcesso++
    return
  }

  const ultimo = new Date(empresa.ultimo_acesso)

  const diferencaDias = Math.floor(
    (hoje.getTime() - ultimo.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  if (diferencaDias === 0) {
    ativasHoje++
  }

  if (diferencaDias >= 3) {
    semAcesso++
  }
})

setEmpresasAtivasHoje(ativasHoje)
setEmpresasSemAcesso(semAcesso)
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
async function alterarPremium(
  id: string,
  premiumAtual: boolean
) {
  const novaData = new Date()
  novaData.setDate(novaData.getDate() + 30)

  const { error } = await supabase
    .from('empresas')
    .update({
      premium: !premiumAtual,
      premium_ate: !premiumAtual
        ? novaData.toISOString()
        : null
    })
    .eq('id', id)

  if (error) {
    alert('Erro ao alterar Premium')
    return
  }

  carregarDados()
}

async function excluirEmpresa(empresaId: number) {

  console.log('EXCLUINDO:', empresaId)

  const confirmar = confirm(
    'Deseja realmente excluir esta empresa?'
  )

  if (!confirmar) return

  // Apaga agendamentos
  await supabase
    .from('agendamentos')
    .delete()
    .eq('empresa_id', empresaId)

  // Apaga serviços
  await supabase
    .from('servicos')
    .delete()
    .eq('empresa_id', empresaId)

  // Remove vínculo dos usuários
  await supabase
    .from('usuarios')
    .update({
      empresa_id: null
    })
    .eq('empresa_id', empresaId)

  // Apaga empresa
  const { error, data } = await supabase
  .from('empresas')
  .delete()
  .eq('id', empresaId)
  .select()

console.log('DELETE RESULT:', data)
console.log('DELETE ERROR:', error)

  if (error) {
    alert(error.message)
    return
  }

  alert('Empresa excluída com sucesso')

  carregarDados()
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
  <h2 className="text-gray-400">
    🟢 Ativas Hoje
  </h2>

  <p className="text-3xl font-bold text-green-400">
    {empresasAtivasHoje}
  </p>
</div>

<div className="bg-gray-800 rounded-xl shadow-lg p-4">
  <h2 className="text-gray-400">
    🔴 Sem acessar (+3 dias)
  </h2>

  <p className="text-3xl font-bold text-red-400">
    {empresasSemAcesso}
  </p>
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
  <div className="mb-6 flex gap-4">

  <input
    type="text"
    placeholder="🔍 Buscar empresa ou telefone..."
    value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
  />

  <select
    value={filtro}
    onChange={(e) => setFiltro(e.target.value)}
    className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white"
  >
    <option value="todos">Todos</option>
    <option value="premium">Premium</option>
    <option value="teste">Teste</option>
    <option value="expirado">Teste Expirado</option>
    <option value="nunca">Nunca acessou</option>
    <option value="ativo">Ativas Hoje</option>
    <option value="pouco">Pouco Ativas</option>
  </select>

</div>
        <table className="w-full text-white">
          <thead>
  <tr className="border-b">
    <th className="text-left py-2">Empresa</th>
    <th className="text-left py-2">Telefone</th>
    <th className="text-left py-2">Plano</th>
    <th className="text-left py-2">Premium Até</th>
    <th className="text-left py-2">Cadastro</th>

<th className="text-left py-2">
Último acesso
</th>
<th className="text-left py-2">
Dias de Teste
</th>
<th className="text-left py-2">
Status CRM
</th>
<th className="text-left py-2">
  Score
</th>
<th className="text-left py-2">Ações</th>
  </tr>
</thead>

          <tbody>
  {empresas
  .filter((empresa) => {

  const termo = busca.toLowerCase()

  const encontrado =
    empresa.nome.toLowerCase().includes(termo) ||
    (empresa.telefone ?? '').toLowerCase().includes(termo)

  if (!encontrado) return false

  switch (filtro) {

    case 'premium':
      return empresa.premium

    case 'teste':
      return !empresa.premium

    case 'nunca':
      return !empresa.ultimo_acesso

    case 'ativo':
      if (!empresa.ultimo_acesso) return false

      return (
        new Date().toDateString() ===
        new Date(empresa.ultimo_acesso).toDateString()
      )

    case 'pouco':
      if (!empresa.ultimo_acesso) return false

      {
        const dias = Math.floor(
          (Date.now() -
            new Date(empresa.ultimo_acesso).getTime()) /
            (1000 * 60 * 60 * 24)
        )

        return dias >= 1 && dias <= 2
      }

    case 'expirado':
      if (empresa.premium) return false

      {
        const criado = new Date(empresa.created_at)

        const dias = Math.floor(
          (Date.now() - criado.getTime()) /
          (1000 * 60 * 60 * 24)
        )

        return dias > 7
      }

    default:
      return true
  }

})
  .map((empresa) => (
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
      <td className="py-2">
  {empresa.ultimo_acesso
    ? new Date(
        empresa.ultimo_acesso
      ).toLocaleString('pt-BR')
    : '-'}
</td>
<td className="py-2">
  {empresa.premium ? (
    <span className="text-green-400">
      Premium
    </span>
  ) : (() => {
      const criado = new Date(
        empresa.created_at
      )

      const hoje = new Date()

      const dias = Math.floor(
        (hoje.getTime() -
          criado.getTime()) /
          (1000 * 60 * 60 * 24)
      )

      const restantes = 7 - dias

      if (restantes <= 0)
        return (
          <span className="text-red-500 font-bold">
            🔴 Expirado
          </span>
        )

      if (restantes <= 2)
        return (
          <span className="text-yellow-400 font-bold">
            🟡 {restantes} dias
          </span>
        )

      return (
        <span className="text-green-400">
          🟢 {restantes} dias
        </span>
      )
    })()}
</td>

<td className="py-2">
  {!empresa.ultimo_acesso ? (
    <span className="text-red-500">
      🔴 Nunca entrou
    </span>
  ) : (() => {
      const dias = Math.floor(
        (new Date().getTime() -
          new Date(
            empresa.ultimo_acesso
          ).getTime()) /
          (1000 * 60 * 60 * 24)
      )

      if (dias === 0)
        return (
          <span className="text-green-400">
            🟢 Ativo Hoje
          </span>
        )

      if (dias <= 2)
        return (
          <span className="text-yellow-400">
            🟡 Pouco ativo
          </span>
        )

      return (
        <span className="text-red-500">
          🔴 Precisa contato
        </span>
      )
    })()}
</td>
<td className="py-2">
  {(() => {

    let score = 0

    if (empresa.ultimo_acesso)
      score += 30

    if (empresa.telefone)
      score += 10

    if (empresa.premium)
      score += 30

    if (agendamentosTotal > 0)
      score += 20

    if (empresa.logo_url)
      score += 10

    return (
      <div>
        <div className="font-bold">
          {score}/100
        </div>

        <div
          className={`text-xs ${
            score >= 80
              ? 'text-green-400'
              : score >= 50
              ? 'text-yellow-400'
              : 'text-red-400'
          }`}
        >
          {score >= 80
            ? '🟢 Excelente'
            : score >= 50
            ? '🟡 Boa'
            : '🔴 Baixa'}
        </div>
      </div>
    )

  })()}
</td>
      <td className="py-2">
  <div className="flex gap-2">

  <button
    onClick={() =>
      alterarPremium(
        empresa.id,
        empresa.premium
      )
    }
    className={`px-3 py-1 rounded text-sm font-medium ${
      empresa.premium
        ? 'bg-yellow-600 hover:bg-yellow-700'
        : 'bg-green-600 hover:bg-green-700'
    }`}
  >
    {empresa.premium ? 'Remover' : 'Premium'}
  </button>

  <button
    onClick={() => {
      if (!empresa.telefone) {
        alert('Empresa sem telefone.')
        return
      }

      const numero = empresa.telefone.replace(/\D/g, '')

      window.open(
        `https://wa.me/55${numero}`,
        '_blank'
      )
    }}
    className="px-3 py-1 rounded text-sm font-medium bg-green-500 hover:bg-green-600"
  >
    WhatsApp
  </button>

  <button
    onClick={() =>
      excluirEmpresa(empresa.id)
    }
    className="px-3 py-1 rounded text-sm font-medium bg-red-600 hover:bg-red-700"
  >
    Excluir
  </button>

</div>
</td>

    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  )
}
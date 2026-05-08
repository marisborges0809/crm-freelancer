import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

const Leads = () => {
  const { clients, leads, addLead, updateLeadStatus } = useCRM();
  
  // 1. Estados para Filtro e Formulário
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedClient, setSelectedClient] = useState('');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  const statusOptions = ['PROPOSTA', 'NEGOCIACAO', 'CONTRATADO', 'PERDIDO'];

  const statusColors = {
    PROPOSTA: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    NEGOCIACAO: 'bg-blue-100 text-blue-700 border-blue-200',
    CONTRATADO: 'bg-green-100 text-green-700 border-green-200',
    PERDIDO: 'bg-red-100 text-red-700 border-red-200'
  };

  // 2. Lógica de Filtro: Se for 'TODOS', mostra tudo. Se não, filtra pelo status.
  const filteredLeads = statusFilter === 'TODOS' 
    ? leads 
    : leads.filter(l => l.status === statusFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClient || !title || !value) return alert("Preencha tudo!");
    addLead(selectedClient, title, value);
    setTitle(''); setValue('');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Pipeline de Leads</h2>
          <p className="text-gray-500">Total: {filteredLeads.length} registros nesta visão.</p>
        </div>

        {/* 3. Filtro de Status (Botões de Aba) */}
        <div className="flex bg-gray-200 p-1 rounded-lg overflow-x-auto">
          <button 
            onClick={() => setStatusFilter('TODOS')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${statusFilter === 'TODOS' ? 'bg-white shadow text-slate-800' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Todos
          </button>
          {statusOptions.map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${statusFilter === status ? 'bg-white shadow text-slate-800' : 'text-gray-600 hover:text-gray-800'}`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Formulário de Novo Lead */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Novo Trabalho</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            className="p-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Selecionar Cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input 
            className="p-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            type="text" placeholder="Nome do Projeto" value={title} onChange={(e) => setTitle(e.target.value)}
          />
          <input 
            className="p-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            type="number" placeholder="Valor Estimado" value={value} onChange={(e) => setValue(e.target.value)}
          />
          <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition shadow-lg active:scale-95">
            Adicionar Lead
          </button>
        </form>
      </section>

      {/* Lista de Leads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest">Projeto / Cliente</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest">Valor</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest">Status Atual</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest text-right">Alterar Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.length > 0 ? (
              filteredLeads.map(lead => {
                const clientName = clients.find(c => c.id === lead.clientId)?.name || '---';
                return (
                  <tr key={lead.id} className="hover:bg-blue-50/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{lead.title}</div>
                      <div className="text-xs text-gray-400 font-medium italic">{clientName}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">R$ {Number(lead.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-black border ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        className="text-xs border border-gray-300 rounded-md p-1.5 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      >
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-400 italic">
                  Nenhum lead encontrado nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;
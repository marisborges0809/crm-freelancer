import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

const Clients = () => {
  const { clients, addClient, deleteClient, leads } = useCRM();
  
  // 1. Estado para o termo de busca
  const [searchTerm, setSearchTerm] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 2. Lógica de Filtro Derivado (Acontece a cada tecla digitada)
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return alert("Preencha tudo!");
    addClient(name, email);
    setName(''); setEmail('');
  };

  const handleDelete = (client) => {
    const count = leads.filter(l => l.clientId === client.id).length;
    const msg = count > 0 
      ? `Atenção: "${client.name}" tem ${count} lead(s). Tudo será excluído. Confirmar?`
      : `Excluir o cliente "${client.name}"?`;
    if (window.confirm(msg)) deleteClient(client.id);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Meus Clientes</h2>
          <p className="text-gray-500">Base total: {clients.length} contatos.</p>
        </div>

        {/* 3. Input de Busca com estilo Tailwind */}
        <div className="relative w-full md:w-64">
          <input 
            type="text"
            placeholder="Buscar cliente..."
            className="w-full p-2 pl-4 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Card de Cadastro */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Novo Cadastro</h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input 
            className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)}
          />
          <input 
            className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
            Adicionar
          </button>
        </form>
      </section>

      {/* Grid de Clientes Filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => {
            const totalLeads = leads.filter(l => l.clientId === client.id).length;
            return (
              <div key={client.id} className="bg-white p-5 rounded-xl border border-gray-200 flex justify-between items-center hover:border-blue-300 transition">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{client.name}</h4>
                  <p className="text-gray-500 text-sm">{client.email}</p>
                  <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    {totalLeads} {totalLeads === 1 ? 'PROJETO' : 'PROJETOS'}
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(client)}
                  className="text-gray-400 hover:text-red-500 p-2 transition"
                  title="Excluir cliente"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            Nenhum cliente encontrado para "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
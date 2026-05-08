import React, { createContext, useState, useEffect, useContext } from 'react';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  // 1. ESTADOS: Carregam do LocalStorage ou iniciam como arrays vazios
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('crm_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. PERSISTÊNCIA: Salva no navegador sempre que algo mudar
  useEffect(() => {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [clients, leads]);

  // 3. AÇÃO: Adicionar Cliente
  const addClient = (name, email) => {
    const newClient = { 
      id: Date.now().toString(), // ID como String para evitar erro de comparação
      name, 
      email,
      createdAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
  };

  // 4. AÇÃO: Adicionar Lead (Trabalho)
  const addLead = (clientId, title, value) => {
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: String(clientId), // Garante que o vínculo seja String
      title,
      value: parseFloat(value) || 0,
      status: 'PROPOSTA',
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [...prev, newLead]);
  };

  // 5. AÇÃO: Atualizar Status do Lead
  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  // 6. AÇÃO: Deletar Cliente (COM EXCLUSÃO EM CASCATA)
  const deleteClient = (clientId) => {
    const idToMatch = String(clientId);

    // Remove o cliente
    setClients(prev => prev.filter(c => String(c.id) !== idToMatch));
    
    // Remove todos os leads vinculados a esse ID (Evita leads órfãos)
    setLeads(prev => prev.filter(l => String(l.clientId) !== idToMatch));
  };

  // 7. EXPOSIÇÃO: Disponibiliza dados e funções para todo o App
  return (
    <CRMContext.Provider value={{ 
      clients, 
      leads, 
      addClient, 
      addLead, 
      updateLeadStatus, 
      deleteClient 
    }}>
      {children}
    </CRMContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nos componentes
export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error("useCRM deve ser usado dentro de um CRMProvider");
  }
  return context;
};
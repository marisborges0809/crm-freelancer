import React from 'react';
import { useCRM } from '../context/CRMContext';

const Dashboard = () => {
  const { leads, clients } = useCRM();

  // Cálculos Inteligentes
  const totalLeads = leads.length;
  
  const leadsContratados = leads.filter(l => l.status === 'CONTRATADO');
  const receitaTotal = leadsContratados.reduce((acc, lead) => acc + lead.value, 0);
  
  const leadsPerdidos = leads.filter(l => l.status === 'PERDIDO').length;
  
  // Taxa de conversão: (Contratados / Total de Leads finalizados) * 100
  const totalFinalizados = leadsContratados.length + leadsPerdidos;
  const taxaConversao = totalFinalizados > 0 
    ? ((leadsContratados.length / totalFinalizados) * 100).toFixed(1) 
    : 0;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard de Performance</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>💰 Receita Contratada</h3>
          <p style={numberStyle}>R$ {receitaTotal.toFixed(2)}</p>
        </div>
        
        <div style={cardStyle}>
          <h3>📈 Taxa de Conversão</h3>
          <p style={numberStyle}>{taxaConversao}%</p>
        </div>

        <div style={cardStyle}>
          <h3>📂 Total de Leads</h3>
          <p style={numberStyle}>{totalLeads}</p>
        </div>
      </div>

      <h3>Resumo de Clientes ({clients.length})</h3>
      <p>Você tem {clients.length} clientes cadastrados na sua base.</p>
    </div>
  );
};

// Estilos rápidos para os cards
const cardStyle = {
  flex: 1,
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  textAlign: 'center'
};

const numberStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50'
};

export default Dashboard;
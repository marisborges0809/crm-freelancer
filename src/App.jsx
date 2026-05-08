import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CRMProvider } from './context/CRMContext';
import Clients from './pages/Clients';

function App() {
  return (
    <CRMProvider>
      <BrowserRouter>
        {/* Menu de Navegação */}
        <nav style={{ padding: '20px', background: '#eee', display: 'flex', gap: '15px' }}>
          <Link to="/">Dashboard</Link>
          <Link to="/clientes">Clientes</Link>
          <Link to="/leads">Leads</Link>
        </nav>

        {/* Definição das Rotas */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/leads" element={<Leads />} />
        </Routes>
      </BrowserRouter>
    </CRMProvider>
  );
}

export default App;
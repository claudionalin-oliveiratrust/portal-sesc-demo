import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import NewOperationSimple from './components/NewOperationSimple.jsx';
import Analysts from './components/Analysts.jsx';
import Settings from './components/Settings.jsx';
import OperationDetails from './components/OperationDetails.jsx';
import Legal from './components/Legal.jsx';
import NcPipeline from "./components/NcPipeline.jsx";
import BankDetails from "./components/BankDetails.jsx";
import NewNcOperation from "./components/NewNcOperation.jsx";
import PdfReader from "./components/PdfReader.jsx";
import Ferramentas from './components/Ferramentas.jsx';
import Templates from './components/Templates.jsx';

import {
  FileText, Plus, Search, Filter, BarChart3, Settings as SettingsIcon, Users, Building2,
  Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Scale, Wifi, Cog, Mail
} from 'lucide-react';

import './App.css';

// --- DADOS MOCKADOS GLOBAIS ATUALIZADOS ---
const initialOperations = [
  { id: 1, name: 'CDB Banco XYZ 2024', type: 'Dívida', status: 'ativa', value: 50000000, issuer: 'Banco XYZ S.A.', cnpj: '11222333000144', analyst: 'Ana Silva', maturity: '15/12/2024', progress: 75, cadastroRegularizado: true },
  { id: 2, name: 'CRI Imobiliário Premium', type: 'Securitização', status: 'ativa', value: 120000000, issuer: 'Securitizadora ABC', cnpj: '22333444000155', analyst: 'Carlos Santos', maturity: '20/11/2025', progress: 60, cadastroRegularizado: true },
  { id: 3, name: 'Debêntures Tech Innovation', type: 'Dívida', status: 'ativa', value: 85000000, issuer: 'Tech Innovation S.A.', cnpj: '33444555000166', analyst: 'Maria Oliveira', maturity: '10/06/2026', progress: 45, cadastroRegularizado: true },
  { id: 4, name: 'CRA Agro Forte', type: 'Securitização', status: 'concluida', value: 200000000, issuer: 'Agro Forte S.A.', cnpj: '44555666000177', analyst: 'Ana Silva', maturity: '01/03/2024', progress: 100, cadastroRegularizado: true },
  // --- OPERAÇÃO PENDENTE PARA TESTE DO MONITOR ---
  { id: 5, name: 'CRI Empreendimento Futuro', type: 'Securitização', status: 'pendente', value: 95000000, issuer: 'Emissora a Confirmar', cnpj: '11674045000168', analyst: 'A definir', maturity: '31/12/2027', progress: 0, cadastroRegularizado: false },
];

const initialDocuments = [
  { id: 1, operationId: 1, type: 'termo_emissao', name: 'Termo de Emissão', versions: [{ id: 1, version: '1.0', file: 'termo_emissao_v1.pdf', uploadDate: '2024-01-15', uploadedBy: 'Ana Silva', status: 'aprovado' }, { id: 2, version: '1.1', file: 'termo_emissao_v1.1.pdf', uploadDate: '2024-01-20', uploadedBy: 'Ana Silva', status: 'atual' }], minutes: [{ id: 1, date: '2024-01-16', author: 'Ana Silva', content: 'Primeira versão aprovada pelo compliance.' }] },
  { id: 2, operationId: 1, type: 'contrato_prestacao', name: 'Contrato de Prestação de Serviços', versions: [{ id: 1, version: '1.0', file: 'contrato_prestacao_v1.pdf', uploadDate: '2024-01-10', uploadedBy: 'Fernanda Costa', status: 'atual' }], minutes: [{ id: 1, date: '2024-01-12', author: 'Fernanda Costa', content: 'Contrato enviado para análise do jurídico.' }] },
];

const initialLegalTasks = [
  { id: 1, operationId: 1, documentId: 1, versionId: 2, operationName: 'CDB Banco XYZ 2024', documentName: 'Termo de Emissão v1.1', assignedBy: 'Ana Silva', assignedDate: '2025-10-01', status: 'Pendente', deadline: null },
];

const initialBanks = [
  { id: 1, name: 'Banco Bradesco S.A.', cnpj: '60.746.948/0001-12', contract: 'Contrato_Guarda_Chuva_Bradesco.pdf', remunerationType: 'volume', remunerationValue: '0.5%' },
];

function StatusBadge({ status }) {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
  const statusClasses = {
    ativa: "bg-green-100 text-green-800",
    concluida: "bg-blue-100 text-blue-800",
    pendente: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img src="/oliveira-trust-logo.svg" alt="Oliveira Trust" className="h-8 w-auto" />
                <div className="border-l border-gray-300 pl-3">
                  <h1 className="text-xl font-bold text-gray-900">Portal SESC</h1>
                  <p className="text-xs text-gray-500">Sistema de Controle de Operações Financeiras</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600"><span className="font-medium">Claudio Nalin</span><span className="text-gray-400 ml-2">Admin</span></div>
            </div>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8" id="main-nav">
            <Button variant="ghost" className={isActive('/dashboard') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/dashboard')}><BarChart3 className="w-4 h-4 mr-2" />Dashboard</Button>
            <Button variant="ghost" className={isActive('/operations') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/operations')}><FileText className="w-4 h-4 mr-2" />Operações</Button>
            <Button variant="ghost" className={isActive('/analysts') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/analysts')}><Users className="w-4 h-4 mr-2" />Analistas</Button>
            <Button variant="ghost" className={isActive('/legal') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/legal')}><Scale className="w-4 h-4 mr-2" />Jurídico</Button>
            <Button variant="ghost" className={isActive('/nc-pipeline') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/nc-pipeline')}><Building2 className="w-4 h-4 mr-2" />Esteira de NC</Button>
            <Button variant="ghost" className={isActive('/settings') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/settings')}><SettingsIcon className="w-4 h-4 mr-2" />Configurações</Button>
            <Button variant="ghost" className={isActive('/ferramentas') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/ferramentas')}><Cog className="w-4 h-4 mr-2" />Ferramentas</Button>
            <Button variant="ghost" className={isActive('/templates') ? "text-[#D40404] border-b-2 border-[#D40404]" : "text-gray-600 hover:text-[#D40404]"} onClick={() => navigate('/templates')}><Mail className="w-4 h-4 mr-2" />Templates</Button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

function Dashboard({ operations }) {
  const navigate = useNavigate();
  const stats = [
    { title: 'Total de Operações', value: operations.length, icon: FileText, color: 'text-blue-600' },
    { title: 'Operações Ativas', value: operations.filter(op => op.status === 'ativa').length, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Valor Total', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(operations.reduce((sum, op) => sum + op.value, 0)), icon: DollarSign, color: 'text-purple-600' },
    { title: 'Analistas Ativos', value: '3', icon: Users, color: 'text-orange-600' }
  ];
  const statusData = [
    { name: 'Ativas', value: operations.filter(op => op.status === 'ativa').length, color: '#16a34a' },
    { name: 'Concluídas', value: operations.filter(op => op.status === 'concluida').length, color: '#2563eb' },
    { name: 'Pendentes', value: operations.filter(op => op.status === 'pendente').length, color: '#f97316' },
  ];
  const typeData = [
    { name: 'Dívida', value: operations.filter(op => op.type === 'Dívida').reduce((sum, op) => sum + op.value, 0) },
    { name: 'Securitização', value: operations.filter(op => op.type === 'Securitização').reduce((sum, op) => sum + op.value, 0) },
  ];

  return (
    <div className="space-y-8">
      <div className="dashboard-grid">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader><CardTitle>Operações por Status</CardTitle><CardDescription>Distribuição das operações por seu estado atual.</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader><CardTitle>Valor por Tipo de Operação</CardTitle><CardDescription>Soma dos valores totais agrupados por tipo.</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="stats-grid">{stats.map((stat, index) => (<Card key={index}><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">{stat.title}</p><p className="text-2xl font-bold text-gray-900">{stat.value}</p></div><stat.icon className={`w-8 h-8 ${stat.color}`} /></div></CardContent></Card>))}</div>
      <Card id="recent-ops-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Operações Recentes</CardTitle><CardDescription>Últimas operações criadas no sistema</CardDescription></div>
          <Button className="bg-[#D40404] hover:bg-[#B30303]" onClick={() => navigate('/operations/new')}><Plus className="w-4 h-4 mr-2" />Nova Operação</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operations.slice(0, 3).map((operation) => (
              <Card key={operation.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/operations/${operation.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#D40404] rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-white" /></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{operation.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" />{operation.issuer}</span>
                          <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{operation.analyst}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(operation.value)}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={operation.type === 'Dívida' ? 'default' : 'secondary'}>{operation.type}</Badge>
                          <StatusBadge status={operation.status} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 relative">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="2" /><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#D40404" strokeWidth="2" strokeDasharray={`${operation.progress}, 100`} /></svg>
                          <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-semibold text-gray-900">{operation.progress}%</span></div>
                        </div>
                        <span className="text-xs text-gray-500">Progresso</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Operations({ operations }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [analystFilter, setAnalystFilter] = useState('all');
  const filteredOperations = operations.filter(operation => {
    const matchesSearch = operation.name.toLowerCase().includes(searchTerm.toLowerCase()) || operation.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || operation.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || operation.status === statusFilter;
    const matchesAnalyst = analystFilter === 'all' || operation.analyst === analystFilter;
    return matchesSearch && matchesType && matchesStatus && matchesAnalyst;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Operações</h1><p className="text-gray-600">Gerencie todas as operações do sistema</p></div>
        <Button className="bg-[#D40404] hover:bg-[#B30303]" onClick={() => navigate('/operations/new')}><Plus className="w-4 h-4 mr-2" />Nova Operação</Button>
      </div>
      <Card><CardContent className="p-6"><div className="filters-grid"><div className="flex-1"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Buscar operações..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div></div><Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Todos os tipos" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os tipos</SelectItem><SelectItem value="Dívida">Dívida Corporativa</SelectItem><SelectItem value="Securitização">Securitização</SelectItem></SelectContent></Select><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-32"><SelectValue placeholder="Todos os status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="ativa">Ativa</SelectItem><SelectItem value="concluida">Concluída</SelectItem><SelectItem value="pendente">Pendente</SelectItem></SelectContent></Select><Select value={analystFilter} onValueChange={setAnalystFilter}><SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Todos os analistas" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os analistas</SelectItem><SelectItem value="Ana Silva">Ana Silva</SelectItem><SelectItem value="Carlos Santos">Carlos Santos</SelectItem><SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem><SelectItem value="João Pereira">João Pereira</SelectItem><SelectItem value="Fernanda Costa">Fernanda Costa</SelectItem></SelectContent></Select></div></CardContent></Card>
      <div className="space-y-4">
        {filteredOperations.map((operation) => (
          <Card key={operation.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/operations/${operation.id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D40404] rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-white" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{operation.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" />{operation.issuer}</span>
                      <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{operation.analyst}</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{operation.maturity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(operation.value)}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={operation.type === 'Dívida' ? 'default' : 'secondary'}>{operation.type}</Badge>
                      <StatusBadge status={operation.status} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="2" /><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#D40404" strokeWidth="2" strokeDasharray={`${operation.progress}, 100`} /></svg>
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-semibold text-gray-900">{operation.progress}%</span></div>
                    </div>
                    <span className="text-xs text-gray-500">Progresso</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredOperations.length === 0 && (<Card><CardContent className="p-12 text-center"><FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma operação encontrada</h3><p className="text-gray-600 mb-4">Tente ajustar os filtros ou criar uma nova operação.</p><Button className="bg-[#D40404] hover:bg-[#B30303]" onClick={() => navigate('/operations/new')}><Plus className="w-4 h-4 mr-2" />Nova Operação</Button></CardContent></Card>)}
    </div>
  );
}

function App() {
  const [operations, setOperations] = useState(initialOperations);
  const [documents, setDocuments] = useState(initialDocuments);
  const [legalTasks, setLegalTasks] = useState(initialLegalTasks);
  const [banks, setBanks] = useState(initialBanks);
  const [apiLogs, setApiLogs] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const addApiLog = (status, message) => {
    const newLog = { id: Date.now(), timestamp: new Date().toLocaleString('pt-BR'), status, message };
    setApiLogs(prevLogs => [newLog, ...prevLogs].slice(0, 10));
  };

  const addOperation = (newOpData) => {
    const newId = Math.max(...operations.map(op => op.id), 0) + 1;
    const newStatus = newOpData.issuer ? 'ativa' : 'pendente';
    const newOperation = {
      ...newOpData,
      id: newId,
      status: newStatus,
      progress: newStatus === 'pendente' ? 0 : 5,
      issuer: newOpData.issuer || 'Confidencial',
      cadastroRegularizado: !!newOpData.issuer,
      cnpj: newOpData.cnpj || '',
    };
    setOperations(prev => [newOperation, ...prev]);
    setDocuments(prev => {
      const newDocs = [
        { id: Math.random(), operationId: newId, type: 'termo_emissao', name: 'Termo de Emissão', versions: [], minutes: [] },
        { id: Math.random(), operationId: newId, type: 'contrato_prestacao', name: 'Contrato de Prestação de Serviços', versions: [], minutes: [] },
      ];
      return [...prev, ...newDocs];
    });
    return newId;
  };

  useEffect(() => {
    const MONITOR_INTERVAL = 30000;

    const checkPendingOperations = async () => {
      if (!isMonitoring) return;
      const pendingOps = operations.filter(op => op.status === 'pendente' && op.cnpj && !op.cadastroRegularizado);
      if (pendingOps.length === 0) return;

      console.log(`MONITOR: Verificando ${pendingOps.length} operação(ões) pendente(s)...`);

      for (const op of pendingOps) {
        console.log(`MONITOR: Verificando CNPJ ${op.cnpj} para a operação #${op.id}`);
        const fakeApiCall = new Promise(resolve => setTimeout(() => resolve({ statusCadastro: 'Regular' }), 2000));
        const result = await fakeApiCall;

        if (result.statusCadastro === 'Regular') {
          console.log(`MONITOR: CNPJ ${op.cnpj} está REGULAR. Marcando checklist para a operação #${op.id}.`);
          setOperations(prevOps =>
            prevOps.map(prevOp =>
              prevOp.id === op.id ? { ...prevOp, cadastroRegularizado: true } : prevOp
            )
          );
          alert(`O cadastro da emissora para a operação "${op.name}" foi regularizado!`);
          addApiLog('Sucesso', `(Monitor) Checklist de cadastro regularizado para Op #${op.id}.`);
        }
      }
    };

    const intervalId = setInterval(checkPendingOperations, MONITOR_INTERVAL);
    return () => clearInterval(intervalId);
  }, [operations, isMonitoring]);

  const processIncomingOperation = (data, source = "Automático") => {
    try {
      const newOperationPayload = {
        name: data["Nome da Operação"],
        type: data["Tipo de Ativo"] === 'Debênture' ? 'Dívida' : 'Securitização',
        value: data["Volume da Oferta"],
        issuer: (data["Emissora"] === "Confidencial" || !data["CNPJ da Emissora"]) ? null : data["Emissora"],
        cnpj: data["CNPJ da Emissora"],
        analyst: 'A definir',
        maturity: 'A definir',
      };
      const newId = addOperation(newOperationPayload);
      addApiLog('Sucesso', `(${source}) Operação #${newId} "${newOperationPayload.name}" criada.`);
    } catch (error) {
      addApiLog('Falha', `(${source}) Erro ao processar dados: ${error.message}`);
    }
  };

  useEffect(() => {
    const incomingApiData = {
      "Nome da Operação": "DEB160 12.431 - R$5.3BI - Santander - AENA",
      "Tipo de Emissão": "ICVM 160 (Pública)",
      "Tipo de Ativo": "Debênture",
      "Serviço": "Escrituração + Liquidação",
      "Emissora": "Confidencial",
      "CNPJ da Emissora": "",
      "Volume da Oferta": 5300000000,
      "Quantidade de Séries": 2,
      "Remuneração da Operação": "R$ 5500.00,2800000.00",
      "Coordenador": "BANCO SANTANDER (BRASIL) S.A."
    };
    const timer = setTimeout(() => processIncomingOperation(incomingApiData), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTestWebhook = () => {
    const testData = {
      "Nome da Operação": `OPERAÇÃO DE TESTE - ${new Date().toLocaleTimeString('pt-BR')}`,
      "Tipo de Ativo": "CRI",
      "Emissora": "Confidencial",
      "CNPJ da Emissora": "11674045000168",
      "Volume da Oferta": Math.floor(Math.random() * 10000000),
      "Tipo de Emissão": "ICVM 476",
      "Serviço": "Agente Fiduciário",
      "Coordenador": "TEST BANK"
    };
    processIncomingOperation(testData, "Teste Manual");
  };

  const addBank = (newBankData) => {
    const newBank = { id: Math.max(...banks.map(b => b.id), 0) + 1, ...newBankData, contract: null, remunerationType: null, remunerationValue: null };
    setBanks(prev => [newBank, ...prev]);
  };

  return (
    <Layout>
      <div className="fixed bottom-4 left-4 z-50">
        <Badge variant={isMonitoring ? "default" : "destructive"} className={isMonitoring ? "bg-blue-600 text-white" : ""}>
          <Wifi className={`w-4 h-4 mr-2 ${isMonitoring ? 'animate-pulse' : ''}`} />
          {isMonitoring ? "Monitoramento Cadastral Ativo" : "Monitoramento Pausado"}
        </Badge>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard operations={operations} />} />
        <Route path="/operations" element={<Operations operations={operations} />} />
        <Route path="/operations/new" element={<NewOperationSimple addOperation={addOperation} setDocuments={setDocuments} />} />
        <Route 
          path="/operations/:id" 
          element={<OperationDetails 
            operations={operations} 
            setOperations={setOperations} // Adicionado para a edição funcionar
            documents={documents} 
            setDocuments={setDocuments} 
            legalTasks={legalTasks}       // Adicionado para ler as tarefas
            setLegalTasks={setLegalTasks} // Adicionado para criar novas tarefas
          />} 
        />
        <Route path="/analysts" element={<Analysts />} />
        <Route path="/legal" element={<Legal legalTasks={legalTasks} setLegalTasks={setLegalTasks} documents={documents} setDocuments={setDocuments} />} />
        <Route path="/nc-pipeline" element={<NcPipeline banks={banks} addBank={addBank} />} />
        <Route path="/nc-pipeline/:bankId" element={<BankDetails banks={banks} />} />
        <Route path="/nc-pipeline/:bankId/new-operation" element={<NewNcOperation />} />
        <Route path="/settings" element={<Settings logs={apiLogs} onTestWebhook={handleTestWebhook} />}/>
        <Route path="/ferramentas" element={<Ferramentas />} />
        <Route path="/templates" element={<Templates />} />
      </Routes>
    </Layout>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import NewOperationSimple from "./components/NewOperationSimple.jsx";
import Analysts from "./components/Analysts.jsx";
import Settings from "./components/Settings.jsx";
import OperationDetails from "./components/OperationDetails.jsx";
import Legal from "./components/Legal.jsx";
import NcPipeline from "./components/NcPipeline.jsx";
import BankDetails from "./components/BankDetails.jsx";
import NewNcOperation from "./components/NewNcOperation.jsx";
import Ferramentas from "./components/Ferramentas.jsx";
import Templates from "./components/Templates.jsx";
import Conciliacao from "./components/Conciliacao.jsx";

import {
  FileText,
  Plus,
  Search,
  Filter,
  BarChart3,
  Settings as SettingsIcon,
  Users,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Scale,
  Wifi,
  Cog,
  Mail,
  ChevronDown,
  Wrench,
  FileSignature,
  Info,
  XCircle,
  CheckCircle2,
  Bell,
  Calculator,
} from "lucide-react";

import "./App.css";

// --- DADOS INICIAIS (MOCK) ---
const initialOperations = [
  {
    id: 1,
    name: "CDB Banco XYZ 2024",
    type: "Dívida",
    regime: "Pública",
    status: "ativa",
    value: 50000000,
    issuer: "Banco XYZ S.A.",
    cnpj: "11222333000144",
    issuerAddress: "Av. Paulista, 1000 - São Paulo, SP",
    issuerZipCode: "01310-100",
    issuerActivity: "Banco Múltiplo",
    analyst: "Ana Silva",
    maturity: "2024-12-15",
    progress: 75,
    cadastroRegularizado: true,
    issueDate: "2024-01-10",
    idProposta: "PROP-001",
    servico: "Escrituração",
    wdl: "WDL-XYZ",
    agenteFiduciarioOT: "Sim",
    remuneracao: "5000",
    periodicidade: "Anual",
  },
  {
    id: 2,
    name: "CRI Imobiliário Premium",
    type: "Securitização",
    regime: "Pública",
    status: "ativa",
    value: 120000000,
    issuer: "Securitizadora ABC",
    cnpj: "22333444000155",
    issuerAddress: "Rua das Flores, 500 - Rio de Janeiro, RJ",
    issuerZipCode: "20031-000",
    issuerActivity: "Securitização de recebíveis",
    analyst: "Carlos Santos",
    maturity: "2025-11-20",
    progress: 60,
    cadastroRegularizado: true,
    issueDate: "2024-02-20",
    idProposta: "PROP-002",
    servico: "Escrituração e Liquidação",
    wdl: "WDL-ABC",
    agenteFiduciarioOT: "Não",
    remuneracao: "12000",
    periodicidade: "Mensal",
  },
  {
    id: 3,
    name: "Debêntures Tech Innovation",
    type: "Dívida",
    regime: "Privada",
    status: "ativa",
    value: 85000000,
    issuer: "Tech Innovation S.A.",
    cnpj: "33444555000166",
    issuerAddress: "Av. Inovação, 123 - Campinas, SP",
    issuerZipCode: "13083-852",
    issuerActivity: "Desenvolvimento de Software",
    analyst: "Maria Oliveira",
    maturity: "2026-06-10",
    progress: 45,
    cadastroRegularizado: true,
    issueDate: "2024-03-15",
    idProposta: "PROP-003",
    servico: "Escrituração",
    wdl: "WDL-TECH",
    agenteFiduciarioOT: "Sim",
    remuneracao: "8500",
    periodicidade: "Semestral",
  },
  {
    id: 4,
    name: "CRA Agro Forte",
    type: "Securitização",
    regime: "Pública",
    status: "concluida",
    value: 200000000,
    issuer: "Agro Forte S.A.",
    cnpj: "44555666000177",
    issuerAddress: "Rodovia BR-163, km 100 - Sorriso, MT",
    issuerZipCode: "78890-000",
    issuerActivity: "Agronegócio",
    analyst: "Ana Silva",
    maturity: "2024-03-01",
    progress: 100,
    cadastroRegularizado: true,
    issueDate: "2023-09-01",
    idProposta: "PROP-004",
    servico: "Escrituração e Liquidação",
    wdl: "WDL-AGRO",
    agenteFiduciarioOT: "Sim",
    remuneracao: "20000",
    periodicidade: "Anual",
  },
  {
    id: 5,
    name: "CRI Empreendimento Futuro",
    type: "Securitização",
    regime: "Pública",
    status: "pendente",
    value: 95000000,
    issuer: "Emissora a Confirmar",
    cnpj: "11674045000168",
    issuerAddress: "A definir",
    issuerZipCode: "A definir",
    issuerActivity: "A definir",
    analyst: "A definir",
    maturity: "2027-12-31",
    progress: 0,
    cadastroRegularizado: false,
    issueDate: null,
    idProposta: "PROP-005",
    servico: "Escrituração",
    wdl: "WDL-FUTURO",
    agenteFiduciarioOT: "A definir",
    remuneracao: "9500",
    periodicidade: "Mensal",
  },
];
const initialDocuments = [
  {
    id: 1,
    operationId: 1,
    type: "termo_emissao",
    name: "Termo de Emissão",
    versions: [
      {
        id: 1,
        version: "1.0",
        file: "termo_emissao_v1.pdf",
        uploadDate: "2024-01-15",
        uploadedBy: "Ana Silva",
        status: "aprovado",
      },
      {
        id: 2,
        version: "1.1",
        file: "termo_emissao_v1.1.pdf",
        uploadDate: "2024-01-20",
        uploadedBy: "Ana Silva",
        status: "atual",
      },
    ],
    minutes: [
      {
        id: 1,
        date: "2024-01-16",
        author: "Ana Silva",
        content: "Primeira versão aprovada pelo compliance.",
      },
    ],
  },
  {
    id: 2,
    operationId: 1,
    type: "contrato_prestacao",
    name: "Contrato de Prestação de Serviços",
    versions: [
      {
        id: 1,
        version: "1.0",
        file: "contrato_prestacao_v1.pdf",
        uploadDate: "2024-01-10",
        uploadedBy: "Fernanda Costa",
        status: "atual",
      },
    ],
    minutes: [
      {
        id: 1,
        date: "2024-01-12",
        author: "Fernanda Costa",
        content: "Contrato enviado para análise do jurídico.",
      },
    ],
  },
];
const initialLegalTasks = [
  {
    id: 1,
    operationId: 1,
    documentId: 1,
    versionId: 2,
    operationName: "CDB Banco XYZ 2024",
    documentName: "Termo de Emissão v1.1",
    fileName: "termo_emissao_v1.1.pdf",
    assignedBy: "Ana Silva",
    assignedDate: "2025-10-01",
    status: "Pendente",
    deadline: null,
  },
];
const initialBanks = [
  {
    id: 1,
    name: "Banco Bradesco S.A.",
    cnpj: "60.746.948/0001-12",
    contract: "Contrato_Guarda_Chuva_Bradesco.pdf",
    remunerationType: "volume",
    remunerationValue: "0.5%",
  },
];

// --- COMPONENTES AUXILIARES ---

function StatusBadge({ status }) {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
  const statusClasses = {
    ativa: "bg-green-100 text-green-800",
    concluida: "bg-blue-100 text-blue-800",
    pendente: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {" "}
      {status}{" "}
    </span>
  );
}

function NotificationAlert({ notification, onDismiss }) {
  const ICONS = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };
  const BORDER_COLORS = {
    success: "border-green-500",
    error: "border-red-500",
    info: "border-blue-500",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-4 border-l-4 ${
        BORDER_COLORS[notification.type] || "border-gray-500"
      } flex items-start space-x-3`}
    >
      <div className="flex-shrink-0">
        {ICONS[notification.type] || <Info className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-gray-800">{notification.title}</p>
        <p className="text-sm text-gray-600">{notification.message}</p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        {" "}
        <XCircle className="w-4 h-4" />{" "}
      </button>
    </div>
  );
}

function Layout({
  children,
  notificationAlerts,
  removeNotificationAlert,
  notificationHistory,
  hasUnread,
  markAsRead,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const isFerramentasActive =
    isActive("/ferramentas") || isActive("/templates");

  const ICONS = {
    success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
        {notificationAlerts.map((notif) => (
          <NotificationAlert
            key={notif.id}
            notification={notif}
            onDismiss={removeNotificationAlert}
          />
        ))}
      </div>

      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/oliveira-trust-logo.svg"
                  alt="Oliveira Trust"
                  className="h-8 w-auto"
                />
                <div className="border-l border-gray-300 pl-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    Portal SESC
                  </h1>
                  <p className="text-xs text-gray-500">
                    Sistema de Controle de Operações Financeiras
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu onOpenChange={(open) => open && markAsRead()}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {notificationHistory.length > 0 ? (
                      notificationHistory.map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className="flex items-start space-x-2 p-2"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {ICONS[notif.type]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notif.message}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <p className="p-4 text-center text-sm text-gray-500">
                        Nenhuma notificação recente.
                      </p>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Claudio Nalin</span>
                <span className="text-gray-400 ml-2">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8" id="main-nav">
            <Button
              variant="ghost"
              className={
                isActive("/dashboard")
                  ? "text-[#D40404] border-b-2 border-[#D40404]"
                  : "text-gray-600 hover:text-[#D40404]"
              }
              onClick={() => navigate("/dashboard")}
            >
              {" "}
              <BarChart3 className="w-4 h-4 mr-2" /> Dashboard{" "}
            </Button>
            <Button
              variant="ghost"
              className={
                isActive("/operations")
                  ? "text-[#D40404] border-b-2 border-[#D40404]"
                  : "text-gray-600 hover:text-[#D40404]"
              }
              onClick={() => navigate("/operations")}
            >
              {" "}
              <FileText className="w-4 h-4 mr-2" /> Operações{" "}
            </Button>
            <Button
              variant="ghost"
              className={
                isActive("/analysts")
                  ? "text-[#D40404] border-b-2 border-[#D40404]"
                  : "text-gray-600 hover:text-[#D40404]"
              }
              onClick={() => navigate("/analysts")}
            >
              {" "}
              <Users className="w-4 h-4 mr-2" /> Analistas{" "}
            </Button>
            <Button
              variant="ghost"
              className={
                isActive("/legal")
                  ? "text-[#D40404] border-b-2 border-[#D40404]"
                  : "text-gray-600 hover:text-[#D40404]"
              }
              onClick={() => navigate("/legal")}
            >
              {" "}
              <Scale className="w-4 h-4 mr-2" /> Jurídico{" "}
            </Button>
            <Button
              variant="ghost"
              className={
                isActive("/nc-pipeline")
                  ? "text-[#D40404] border-b-2 border-[#D40404]"
                  : "text-gray-600 hover:text-[#D40404]"
              }
              onClick={() => navigate("/nc-pipeline")}
            >
              {" "}
              <Building2 className="w-4 h-4 mr-2" /> Esteira de NC{" "}
            </Button>
            <Button
              variant="ghost"
              className={
                isActive("/settings")
                  ? "text-[#D40404] border-b-2 border-[#D40404]"
                  : "text-gray-600 hover:text-[#D40404]"
              }
              onClick={() => navigate("/settings")}
            >
              {" "}
              <SettingsIcon className="w-4 h-4 mr-2" /> Configurações{" "}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={
                    isFerramentasActive
                      ? "text-[#D40404] border-b-2 border-[#D40404]"
                      : "text-gray-600 hover:text-[#D40404]"
                  }
                >
                  {" "}
                  <Wrench className="w-4 h-4 mr-2" /> Ferramentas{" "}
                  <ChevronDown className="w-4 h-4 ml-1" />{" "}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Itens Disponíveis</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/ferramentas")}>
                  {" "}
                  <Cog className="w-4 h-4 mr-2" /> <span>Conversor B3</span>{" "}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/templates")}>
                  {" "}
                  <FileSignature className="w-4 h-4 mr-2" />{" "}
                  <span>Template de Emails</span>{" "}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/conciliacao")}>
                  <Calculator className="w-4 h-4 mr-2" />
                  <span>Conciliação de Recursos</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

// --- COMPONENTE DASHBOARD CORRIGIDO ---
function Dashboard({ operations }) {
  const navigate = useNavigate();
  const totalOperations = operations.length;
  const activeOperations = operations.filter(
    (op) => op.status === "ativa"
  ).length;
  const totalValue = operations.reduce((sum, op) => sum + op.value, 0);
  const pendingOperations = operations.filter(
    (op) => op.status === "pendente"
  ).length;
  const statusData = [
    { name: "Ativas", value: activeOperations, color: "#16a34a" },
    {
      name: "Concluídas",
      value: operations.filter((op) => op.status === "concluida").length,
      color: "#2563eb",
    },
    { name: "Pendentes", value: pendingOperations, color: "#f97316" },
  ];
  const typeData = [
    {
      name: "Dívida",
      value: operations
        .filter((op) => op.type === "Dívida")
        .reduce((sum, op) => sum + op.value, 0),
    },
    {
      name: "Securitização",
      value: operations
        .filter((op) => op.type === "Securitização")
        .reduce((sum, op) => sum + op.value, 0),
    },
  ];

  const KpiCard = ({ title, value, icon: Icon, description }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {description && (
              <p className="text-xs text-gray-400">{description}</p>
            )}
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-6 h-6 text-[#D40404]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-[#D40404]" /> Visão Geral
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            title="Total de Operações"
            value={totalOperations}
            icon={FileText}
            description="Operações no sistema"
          />
          <KpiCard
            title="Operações Ativas"
            value={activeOperations}
            icon={CheckCircle}
            description="Em andamento"
          />
          <KpiCard
            title="Operações Pendentes"
            value={pendingOperations}
            icon={AlertCircle}
            description="Aguardando dados"
          />
          <KpiCard
            title="Valor Total"
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              notation: "compact",
            }).format(totalValue)}
            icon={DollarSign}
            description="Soma de todas as operações"
          />
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-[#D40404]" /> Análise de
          Portfólio
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Operações por Status</CardTitle>
              <CardDescription className="text-xs">
                {" "}
                Distribuição do total de operações{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                {" "}
                Valor por Tipo de Operação{" "}
              </CardTitle>
              <CardDescription className="text-xs">
                {" "}
                Soma dos valores por tipo de ativo{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={typeData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(value)
                    }
                  />
                  <Bar dataKey="value" fill="#D40404" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
      <Card id="recent-ops-card" className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Operações Recentes</CardTitle>
            <CardDescription>
              {" "}
              Últimas operações criadas ou atualizadas no sistema{" "}
            </CardDescription>
          </div>
          <Button
            className="bg-[#D40404] hover:bg-[#B30303]"
            onClick={() => navigate("/operations/new")}
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Operação
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operations.slice(0, 3).map((operation) => (
              <Card
                key={operation.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/operations/${operation.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#D40404] rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {" "}
                          {operation.name}{" "}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            {" "}
                            <Building2 className="w-4 h-4 mr-1" />{" "}
                            {operation.issuer}{" "}
                          </span>
                          <span className="flex items-center">
                            {" "}
                            <Users className="w-4 h-4 mr-1" />{" "}
                            {operation.analyst}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(operation.value)}{" "}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              operation.type === "Dívida"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {" "}
                            {operation.type}{" "}
                          </Badge>
                          <StatusBadge status={operation.status} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 relative">
                          <svg
                            className="w-16 h-16 transform -rotate-90"
                            viewBox="0 0 36 36"
                          >
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#D40404"
                              strokeWidth="2"
                              strokeDasharray={`${operation.progress}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-900">
                              {" "}
                              {operation.progress}%{" "}
                            </span>
                          </div>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [analystFilter, setAnalystFilter] = useState("all");
  const filteredOperations = operations.filter((operation) => {
    const matchesSearch =
      operation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || operation.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || operation.status === statusFilter;
    const matchesAnalyst =
      analystFilter === "all" || operation.analyst === analystFilter;
    return matchesSearch && matchesType && matchesStatus && matchesAnalyst;
  });
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-gray-900">Operações</h1>{" "}
          <p className="text-gray-600">
            {" "}
            Gerencie todas as operações do sistema{" "}
          </p>{" "}
        </div>{" "}
        <Button
          className="bg-[#D40404] hover:bg-[#B30303]"
          onClick={() => navigate("/operations/new")}
        >
          {" "}
          <Plus className="w-4 h-4 mr-2" /> Nova Operação{" "}
        </Button>{" "}
      </div>{" "}
      <Card>
        {" "}
        <CardContent className="p-6">
          {" "}
          <div className="filters-grid">
            {" "}
            <div className="flex-1">
              {" "}
              <div className="relative">
                {" "}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />{" "}
                <Input
                  placeholder="Buscar operações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />{" "}
              </div>{" "}
            </div>{" "}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              {" "}
              <SelectTrigger className="w-full md:w-48">
                {" "}
                <SelectValue placeholder="Todos os tipos" />{" "}
              </SelectTrigger>{" "}
              <SelectContent>
                {" "}
                <SelectItem value="all">Todos os tipos</SelectItem>{" "}
                <SelectItem value="Dívida">Dívida Corporativa</SelectItem>{" "}
                <SelectItem value="Securitização">Securitização</SelectItem>{" "}
              </SelectContent>{" "}
            </Select>{" "}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              {" "}
              <SelectTrigger className="w-full md:w-32">
                {" "}
                <SelectValue placeholder="Todos os status" />{" "}
              </SelectTrigger>{" "}
              <SelectContent>
                {" "}
                <SelectItem value="all">Todos</SelectItem>{" "}
                <SelectItem value="ativa">Ativa</SelectItem>{" "}
                <SelectItem value="concluida">Concluída</SelectItem>{" "}
                <SelectItem value="pendente">Pendente</SelectItem>{" "}
              </SelectContent>{" "}
            </Select>{" "}
            <Select value={analystFilter} onValueChange={setAnalystFilter}>
              {" "}
              <SelectTrigger className="w-full md:w-48">
                {" "}
                <SelectValue placeholder="Todos os analistas" />{" "}
              </SelectTrigger>{" "}
              <SelectContent>
                {" "}
                <SelectItem value="all">Todos os analistas</SelectItem>{" "}
                <SelectItem value="Ana Silva">Ana Silva</SelectItem>{" "}
                <SelectItem value="Carlos Santos">Carlos Santos</SelectItem>{" "}
                <SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem>{" "}
                <SelectItem value="João Pereira">João Pereira</SelectItem>{" "}
                <SelectItem value="Fernanda Costa">Fernanda Costa</SelectItem>{" "}
              </SelectContent>{" "}
            </Select>{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>{" "}
      <div className="space-y-4">
        {" "}
        {filteredOperations.map((operation) => (
          <Card
            key={operation.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/operations/${operation.id}`)}
          >
            {" "}
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div className="flex items-center space-x-4">
                  {" "}
                  <div className="w-12 h-12 bg-[#D40404] rounded-lg flex items-center justify-center">
                    {" "}
                    <FileText className="w-6 h-6 text-white" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {" "}
                      {operation.name}{" "}
                    </h3>{" "}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {" "}
                      <span className="flex items-center">
                        {" "}
                        <Building2 className="w-4 h-4 mr-1" />{" "}
                        {operation.issuer}{" "}
                      </span>{" "}
                      <span className="flex items-center">
                        {" "}
                        <Users className="w-4 h-4 mr-1" /> {operation.analyst}{" "}
                      </span>{" "}
                      <span className="flex items-center">
                        {" "}
                        <Calendar className="w-4 h-4 mr-1" />{" "}
                        {operation.maturity}{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-center space-x-4">
                  {" "}
                  <div className="text-right">
                    {" "}
                    <p className="text-lg font-semibold text-gray-900">
                      {" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(operation.value)}{" "}
                    </p>{" "}
                    <div className="flex items-center space-x-2">
                      {" "}
                      <Badge
                        variant={
                          operation.type === "Dívida" ? "default" : "secondary"
                        }
                      >
                        {" "}
                        {operation.type}{" "}
                      </Badge>{" "}
                      <StatusBadge status={operation.status} />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex flex-col items-center space-y-2">
                    {" "}
                    <div className="w-16 h-16 relative">
                      {" "}
                      <svg
                        className="w-16 h-16 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        {" "}
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />{" "}
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#D40404"
                          strokeWidth="2"
                          strokeDasharray={`${operation.progress}, 100`}
                        />{" "}
                      </svg>{" "}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {" "}
                        <span className="text-sm font-semibold text-gray-900">
                          {" "}
                          {operation.progress}%{" "}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <span className="text-xs text-gray-500">Progresso</span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
      {filteredOperations.length === 0 && (
        <Card>
          {" "}
          <CardContent className="p-12 text-center">
            {" "}
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />{" "}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {" "}
              Nenhuma operação encontrada{" "}
            </h3>{" "}
            <p className="text-gray-600 mb-4">
              {" "}
              Tente ajustar os filtros ou criar uma nova operação.{" "}
            </p>{" "}
            <Button
              className="bg-[#D40404] hover:bg-[#B30303]"
              onClick={() => navigate("/operations/new")}
            >
              {" "}
              <Plus className="w-4 h-4 mr-2" /> Nova Operação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  const [operations, setOperations] = useState(initialOperations);
  const [documents, setDocuments] = useState(initialDocuments);
  const [legalTasks, setLegalTasks] = useState(initialLegalTasks);
  const [banks, setBanks] = useState(initialBanks);
  const [apiLogs, setApiLogs] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const [notificationAlerts, setNotificationAlerts] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const addNotification = (notification) => {
    const newNotification = { ...notification, id: Date.now(), read: false };
    setNotificationAlerts((prev) => [...prev, newNotification]);
    setNotificationHistory((prev) => [newNotification, ...prev].slice(0, 20));
    setHasUnread(true);
  };

  const removeNotificationAlert = (id) => {
    setNotificationAlerts((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAsRead = () => {
    if (hasUnread) {
      setHasUnread(false);
      setNotificationHistory((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const addApiLog = (status, message) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString("pt-BR"),
      status,
      message,
    };
    setApiLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 10));
  };

  const addOperation = (newOpData) => {
    const newId = Math.max(...operations.map((op) => op.id), 0) + 1;
    const newStatus = newOpData.issuer ? "ativa" : "pendente";
    const newOperation = {
      ...newOpData,
      id: newId,
      status: newStatus,
      progress: newStatus === "pendente" ? 0 : 5,
      issuer: newOpData.issuer || "Confidencial",
      cadastroRegularizado: !!newOpData.issuer,
      cnpj: newOpData.cnpj || "",
    };
    setOperations((prev) => [newOperation, ...prev]);
    setDocuments((prev) => {
      const newDocs = [
        {
          id: Math.random(),
          operationId: newId,
          type: "termo_emissao",
          name: "Termo de Emissão",
          versions: [],
          minutes: [],
        },
        {
          id: Math.random(),
          operationId: newId,
          type: "contrato_prestacao",
          name: "Contrato de Prestação de Serviços",
          versions: [],
          minutes: [],
        },
      ];
      return [...prev, ...newDocs];
    });
    addNotification({
      type: "success",
      title: "Operação Criada",
      message: `A operação "${newOperation.name}" foi adicionada.`,
    });
    return newId;
  };

  useEffect(() => {
    const MONITOR_INTERVAL = 30000;
    const checkPendingOperations = async () => {
      if (!isMonitoring) return;
      const pendingOps = operations.filter(
        (op) => op.status === "pendente" && op.cnpj && !op.cadastroRegularizado
      );
      if (pendingOps.length === 0) return;
      for (const op of pendingOps) {
        const fakeApiCall = new Promise((resolve) =>
          setTimeout(() => resolve({ statusCadastro: "Regular" }), 2000)
        );
        const result = await fakeApiCall;
        if (result.statusCadastro === "Regular") {
          setOperations((prevOps) =>
            prevOps.map((prevOp) =>
              prevOp.id === op.id
                ? { ...prevOp, cadastroRegularizado: true }
                : prevOp
            )
          );
          addNotification({
            type: "info",
            title: "Cadastro Regularizado",
            message: `Emissora da op. "${op.name}" está regular.`,
          });
          addApiLog(
            "Sucesso",
            `(Monitor) Cadastro regularizado para Op #${op.id}.`
          );
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
        type:
          data["Tipo de Ativo"] === "Debênture" ? "Dívida" : "Securitização",
        value: data["Volume da Oferta"],
        issuer:
          data["Emissora"] === "Confidencial" || !data["CNPJ da Emissora"]
            ? null
            : data["Emissora"],
        cnpj: data["CNPJ da Emissora"],
        analyst: "A definir",
        maturity: "A definir",
      };
      const newId = addOperation(newOperationPayload);
      addApiLog(
        "Sucesso",
        `(${source}) Operação #${newId} "${newOperationPayload.name}" criada.`
      );
    } catch (error) {
      addApiLog(
        "Falha",
        `(${source}) Erro ao processar dados: ${error.message}`
      );
      addNotification({
        type: "error",
        title: "Falha na Integração",
        message: `Erro ao processar operação vinda de ${source}.`,
      });
    }
  };

  useEffect(() => {
    const incomingApiData = {
      "Nome da Operação": "DEB160 12.431 - R$5.3BI - Santander - AENA",
      "Tipo de Emissão": "ICVM 160 (Pública)",
      "Tipo de Ativo": "Debênture",
      Serviço: "Escrituração + Liquidação",
      Emissora: "Confidencial",
      "CNPJ da Emissora": "",
      "Volume da Oferta": 5300000000,
      "Quantidade de Séries": 2,
      "Remuneração da Operação": "R$ 5500.00,2800000.00",
      Coordenador: "BANCO SANTANDER (BRASIL) S.A.",
    };
    const timer = setTimeout(
      () => processIncomingOperation(incomingApiData),
      2000
    );
    return () => clearTimeout(timer);
  }, []);

  const handleTestWebhook = () => {
    const testData = {
      "Nome da Operação": `OPERAÇÃO DE TESTE - ${new Date().toLocaleTimeString(
        "pt-BR"
      )}`,
      "Tipo de Ativo": "CRI",
      Emissora: "Confidencial",
      "CNPJ da Emissora": "11674045000168",
      "Volume da Oferta": Math.floor(Math.random() * 10000000),
      "Tipo de Emissão": "ICVM 476",
      Serviço: "Agente Fiduciário",
      Coordenador: "TEST BANK",
    };
    processIncomingOperation(testData, "Teste Manual");
  };

  const addBank = (newBankData) => {
    const newBank = {
      id: Math.max(...banks.map((b) => b.id), 0) + 1,
      ...newBankData,
      contract: null,
      remunerationType: null,
      remunerationValue: null,
    };
    setBanks((prev) => [newBank, ...prev]);
    addNotification({
      type: "success",
      title: "Banco Adicionado",
      message: `O banco "${newBank.name}" foi adicionado.`,
    });
  };

  return (
    <Layout
      notificationAlerts={notificationAlerts}
      removeNotificationAlert={removeNotificationAlert}
      notificationHistory={notificationHistory}
      hasUnread={hasUnread}
      markAsRead={markAsRead}
    >
      <div className="fixed bottom-4 left-4 z-50">
        <Badge
          variant={isMonitoring ? "default" : "destructive"}
          className={isMonitoring ? "bg-blue-600 text-white" : ""}
        >
          <Wifi
            className={`w-4 h-4 mr-2 ${isMonitoring ? "animate-pulse" : ""}`}
          />
          {isMonitoring ? "Monitoramento Ativo" : "Monitoramento Pausado"}
        </Badge>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={<Dashboard operations={operations} />}
        />
        <Route
          path="/operations"
          element={<Operations operations={operations} />}
        />
        <Route
          path="/operations/new"
          element={
            <NewOperationSimple
              addOperation={addOperation}
              setDocuments={setDocuments}
            />
          }
        />
        <Route
          path="/operations/:id"
          element={
            <OperationDetails
              operations={operations}
              setOperations={setOperations}
              documents={documents}
              setDocuments={setDocuments}
              legalTasks={legalTasks}
              setLegalTasks={setLegalTasks}
              addNotification={addNotification}
            />
          }
        />
        <Route
          path="/analysts"
          element={<Analysts operations={operations} />}
        />
        <Route
          path="/legal"
          element={
            <Legal
              legalTasks={legalTasks}
              setLegalTasks={setLegalTasks}
              documents={documents}
              setDocuments={setDocuments}
              addNotification={addNotification}
            />
          }
        />
        <Route
          path="/nc-pipeline"
          element={<NcPipeline banks={banks} addBank={addBank} />}
        />
        <Route
          path="/nc-pipeline/:bankId"
          element={<BankDetails banks={banks} />}
        />
        <Route
          path="/nc-pipeline/:bankId/new-operation"
          element={<NewNcOperation />}
        />
        <Route
          path="/settings"
          element={
            <Settings logs={apiLogs} onTestWebhook={handleTestWebhook} />
          }
        />
        <Route path="/ferramentas" element={<Ferramentas />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/conciliacao" element={<Conciliacao />} />
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

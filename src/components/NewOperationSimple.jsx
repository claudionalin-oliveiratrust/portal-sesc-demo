import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  User,
  Building2,
  DollarSign,
  CheckCircle,
  Loader2
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Tipo e Nome', icon: FileText },
  { id: 2, title: 'Analista Responsável', icon: User },
  { id: 3, title: 'Dados da Emissora', icon: Building2 },
  { id: 4, title: 'Valores e Datas', icon: DollarSign },
  { id: 5, title: 'Confirmação', icon: CheckCircle }
];

const ANALYSTS = [
  { id: 1, name: 'Ana Silva', email: 'ana.silva@sesc.com.br', department: 'Renda Fixa' },
  { id: 2, name: 'Carlos Santos', email: 'carlos.santos@sesc.com.br', department: 'Securitização' },
  { id: 3, name: 'Maria Oliveira', email: 'maria.oliveira@sesc.com.br', department: 'Estruturação' },
  { id: 4, name: 'João Pereira', email: 'joao.pereira@sesc.com.br', department: 'Compliance' },
  { id: 5, name: 'Fernanda Costa', email: 'fernanda.costa@sesc.com.br', department: 'Jurídico' }
];

// --- DADOS PARA OS NOVOS SELECTS ---
const servicosSolicitados = ["Escrituração", "Escrituração e Liquidação"];
const periodicidades = ["Mensal", "Trimestral", "Semestral", "Anual", "No vencimento"];

export default function NewOperationSimple({ addOperation, setDocuments }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // --- ESTADO DO FORMULÁRIO ATUALIZADO COM NOVOS CAMPOS ---
  const [formData, setFormData] = useState({
    // Seus campos existentes
    name: '',
    type: '',
    regime: '',
    primaryAnalyst: '',
    issuerName: '',
    issuerCnpj: '',
    issuerAddress: '',
    issuerZipCode: '',
    issuerActivity: '',
    emails: '',
    value: '',
    maturityDate: '',
    issueDate: '',
    // --- NOVOS CAMPOS ADICIONADOS ---
    idProposta: '',
    servico: '',
    wdl: '',
    numeroEmissao: '',
    qtdSeries: '',
    agenteFiduciarioOT: 'yes',
    remuneracao: '',
    periodicidade: '',
  });
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCnpjBlur = async (cnpj) => {
    const cleanedCnpj = cnpj.replace(/\D/g, '');
    if (cleanedCnpj.length !== 14) {
      handleInputChange('issuerName', '');
      handleInputChange('issuerAddress', '');
      handleInputChange('issuerZipCode', '');
      handleInputChange('issuerActivity', '');
      return;
    }

    setIsFetchingCnpj(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}` );
      if (!response.ok) {
        throw new Error('CNPJ não encontrado ou inválido.');
      }
      const data = await response.json();
      
      handleInputChange('issuerName', data.razao_social || '');
      handleInputChange('issuerAddress', `${data.logradouro || ''}, ${data.numero || ''} - ${data.bairro || ''}, ${data.municipio || ''} - ${data.uf || ''}`);
      handleInputChange('issuerZipCode', data.cep || '');
      handleInputChange('issuerActivity', data.cnae_fiscal_descricao || '');

    } catch (error) {
      alert(error.message);
      handleInputChange('issuerName', '');
      handleInputChange('issuerAddress', '');
      handleInputChange('issuerZipCode', '');
      handleInputChange('issuerActivity', '');
    } finally {
      setIsFetchingCnpj(false);
    }
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / (STEPS.length - 1)) * 100;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.type && formData.servico;
      case 2:
        return formData.primaryAnalyst;
      case 3:
        return formData.issuerName && formData.issuerCnpj;
      case 4:
        return formData.value && formData.maturityDate && formData.issueDate && formData.wdl;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(STEPS.length, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    const selectedAnalyst = ANALYSTS.find(a => a.id.toString() === formData.primaryAnalyst);

    const newOperationData = {
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value) || 0,
      issuer: formData.issuerName,
      analyst: selectedAnalyst ? selectedAnalyst.name : 'Não definido',
      maturity: formData.maturityDate,
    };

    const newOperationId = addOperation(newOperationData);

    // Sua lógica para criar documentos (mantida 100%)
    setDocuments(prevDocs => {
      const newOperationDocuments = [
        {
          id: prevDocs.length > 0 ? Math.max(...prevDocs.map(d => d.id)) + 1 : 1,
          operationId: newOperationId,
          type: 'termo_emissao',
          name: 'Termo de Emissão',
          versions: [],
          minutes: []
        },
        {
          id: prevDocs.length > 0 ? Math.max(...prevDocs.map(d => d.id)) + 2 : 2,
          operationId: newOperationId,
          type: 'contrato_prestacao',
          name: 'Contrato de Prestação de Serviços',
          versions: [],
          minutes: []
        }
      ];
      return [...prevDocs, ...newOperationDocuments];
    });

    alert('Operação criada com sucesso!');
    navigate(`/operations/${newOperationId}`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tipo e Nome</CardTitle>
              <CardDescription>Defina o tipo, regime e nome da operação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* --- CAMPO NOVO ADICIONADO --- */}
              <div className="space-y-2">
                <Label htmlFor="idProposta">ID Proposta</Label>
                <Input
                  id="idProposta"
                  placeholder="Número da proposta comercial, se já existir"
                  value={formData.idProposta}
                  onChange={(e) => handleInputChange('idProposta', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Apelido da Operação *</Label>
                <Input
                  id="name"
                  placeholder={formData.type === 'securitizacao' ? "Ex: CRI Greenfield 2024, CRA Agro Master" : "Ex: DEB XYZ 2024, CDB ABC Série A"}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <p className="text-xs text-gray-500">Nome simplificado para identificação rápida da operação</p>
              </div>

              {/* --- CAMPO NOVO ADICIONADO --- */}
              <div className="space-y-2">
                <Label htmlFor="servico">Serviço Solicitado *</Label>
                <Select value={formData.servico} onValueChange={(value) => handleInputChange('servico', value)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo de serviço que a OT irá prestar" /></SelectTrigger>
                  <SelectContent>
                    {servicosSolicitados.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Operação *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={formData.type === 'Dívida' ? 'default' : 'outline'}
                    className={`h-auto p-4 ${formData.type === 'Dívida' ? 'bg-[#D40404] hover:bg-[#B30303]' : ''}`}
                    onClick={() => handleInputChange('type', 'Dívida')}
                  >
                    <div className="text-left">
                      <h3 className="font-semibold">Dívida Corporativa</h3>
                      <p className="text-sm opacity-80">CDB, CCB, Debêntures, Notas Comerciais</p>
                    </div>
                  </Button>
                  
                  <Button
                    variant={formData.type === 'Securitização' ? 'default' : 'outline'}
                    className={`h-auto p-4 ${formData.type === 'Securitização' ? 'bg-[#D40404] hover:bg-[#B30303]' : ''}`}
                    onClick={() => handleInputChange('type', 'Securitização')}
                  >
                    <div className="text-left">
                      <h3 className="font-semibold">Securitização</h3>
                      <p className="text-sm opacity-80">CRI, CRA, CCI, FIDC</p>
                    </div>
                  </Button>
                </div>
              </div>

              {formData.type === 'Dívida' && (
                <div className="space-y-2">
                  <Label>Regime da Oferta *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={formData.regime === 'publica' ? 'default' : 'outline'}
                      className={`h-auto p-4 ${formData.regime === 'publica' ? 'bg-[#D40404] hover:bg-[#B30303]' : ''}`}
                      onClick={() => handleInputChange('regime', 'publica')}
                    >
                      <div className="text-left">
                        <h3 className="font-semibold">Oferta Pública</h3>
                        <p className="text-sm opacity-80">Com registro na CVM</p>
                      </div>
                    </Button>
                    
                    <Button
                      variant={formData.regime === 'privada' ? 'default' : 'outline'}
                      className={`h-auto p-4 ${formData.regime === 'privada' ? 'bg-[#D40404] hover:bg-[#B30303]' : ''}`}
                      onClick={() => handleInputChange('regime', 'privada')}
                    >
                      <div className="text-left">
                        <h3 className="font-semibold">Oferta Privada</h3>
                        <p className="text-sm opacity-80">Restrita a investidores qualificados</p>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analista Responsável</CardTitle>
              <CardDescription>Atribua um analista principal para esta operação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Analista Principal *</Label>
                <Select value={formData.primaryAnalyst} onValueChange={(value) => handleInputChange('primaryAnalyst', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o analista principal" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANALYSTS.map(analyst => (
                      <SelectItem key={analyst.id} value={analyst.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{analyst.name}</span>
                          <span className="text-sm text-gray-500">{analyst.department} - {analyst.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.primaryAnalyst && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#D40404] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {ANALYSTS.find(a => a.id.toString() === formData.primaryAnalyst)?.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {ANALYSTS.find(a => a.id.toString() === formData.primaryAnalyst)?.department}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>
                {formData.type === 'Securitização' ? 'Dados da Securitizadora' : 'Dados da Emissora'}
              </CardTitle>
              <CardDescription>
                Digite o CNPJ para buscar as informações da empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="issuerCnpj">CNPJ *</Label>
                <div className="relative">
                  <Input
                    id="issuerCnpj"
                    placeholder="Digite 14 dígitos e saia do campo"
                    value={formData.issuerCnpj}
                    onChange={(e) => handleInputChange('issuerCnpj', e.target.value)}
                    onBlur={(e) => handleCnpjBlur(e.target.value)}
                    disabled={isFetchingCnpj}
                  />
                  {isFetchingCnpj && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issuerName">Nome da Emissora *</Label>
                  <Input
                    id="issuerName"
                    placeholder="Preenchido automaticamente"
                    value={formData.issuerName}
                    onChange={(e) => handleInputChange('issuerName', e.target.value)}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuerActivity">Atividade Principal</Label>
                  <Input
                    id="issuerActivity"
                    placeholder="Preenchido automaticamente"
                    value={formData.issuerActivity}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuerAddress">Endereço</Label>
                <Input
                  id="issuerAddress"
                  placeholder="Preenchido automaticamente"
                  value={formData.issuerAddress}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issuerZipCode">CEP</Label>
                  <Input
                    id="issuerZipCode"
                    placeholder="Preenchido automaticamente"
                    value={formData.issuerZipCode}
                    disabled
                  />
                </div>
                {formData.type === 'Securitização' && (
                  <div className="space-y-2">
                    <Label htmlFor="emails">Emails da Securitizadora</Label>
                    <Input
                      id="emails"
                      placeholder="contato@empresa.com.br"
                      value={formData.emails || ''}
                      onChange={(e) => handleInputChange('emails', e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              {/* --- CAMPOS NOVOS ADICIONADOS --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroEmissao">Número da Emissão</Label>
                  <Input
                    id="numeroEmissao"
                    type="number"
                    placeholder="Ex: 1, 2, 3"
                    value={formData.numeroEmissao}
                    onChange={(e) => handleInputChange('numeroEmissao', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Número sequencial da emissão para esta emissora.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qtdSeries">Quantidade de Séries</Label>
                  <Input
                    id="qtdSeries"
                    type="number"
                    placeholder="Número de séries que serão emitidas"
                    value={formData.qtdSeries}
                    onChange={(e) => handleInputChange('qtdSeries', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Valores, Datas e Detalhes</CardTitle>
              <CardDescription>Informações financeiras, cronograma e escopo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Valor da Operação *</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="Ex: 50000000"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Data de Emissão *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maturityDate">Data de Vencimento *</Label>
                  <Input
                    id="maturityDate"
                    type="date"
                    value={formData.maturityDate}
                    onChange={(e) => handleInputChange('maturityDate', e.target.value)}
                  />
                </div>
              </div>

              {/* --- CAMPOS NOVOS ADICIONADOS --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="remuneracao">Remuneração</Label>
                  <Input
                    id="remuneracao"
                    type="number"
                    placeholder="R$ 0,00"
                    value={formData.remuneracao}
                    onChange={(e) => handleInputChange('remuneracao', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodicidade">Periodicidade do Pagamento</Label>
                  <Select value={formData.periodicidade} onValueChange={(value) => handleInputChange('periodicidade', value)}>
                    <SelectTrigger><SelectValue placeholder="Frequência do pagamento" /></SelectTrigger>
                    <SelectContent>
                      {periodicidades.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Agente Fiduciário será a OT? *</Label>
                <RadioGroup 
                  value={formData.agenteFiduciarioOT} 
                  onValueChange={(value) => handleInputChange('agenteFiduciarioOT', value)}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="r-yes" /><Label htmlFor="r-yes">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="r-no" /><Label htmlFor="r-no">Não</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wdl">WDL (Work, Demand and Legal) *</Label>
                <Textarea
                  id="wdl"
                  placeholder="Descreva o escopo do trabalho, demandas e aspectos legais da operação."
                  value={formData.wdl}
                  onChange={(e) => handleInputChange('wdl', e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Confirmação</CardTitle>
              <CardDescription>Revise as informações antes de criar a operação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* --- LÓGICA DE EXIBIÇÃO MELHORADA --- */}
              <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {Object.entries(formData).map(([key, value]) => {
                  if (!value) return null; // Não mostra campos vazios
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  
                  let displayValue = value;
                  if (key === 'primaryAnalyst') {
                    displayValue = ANALYSTS.find(a => a.id.toString() === value)?.name;
                  } else if (key === 'agenteFiduciarioOT') {
                    displayValue = value === 'yes' ? 'Sim' : 'Não';
                  }

                  return (
                    <div key={key} className="flex justify-between border-b pb-1">
                      <p className="font-medium text-gray-600">{label}:</p>
                      <p className="text-gray-900 text-right">{displayValue}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Próximos passos:</strong> Após criar a operação, você poderá adicionar os documentos necessários 
                  (Termo de Emissão e Contrato de Prestação de Serviços) na página de detalhes da operação.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Operação</h1>
          <p className="text-gray-600">Crie uma nova operação no sistema</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/operations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Etapa {currentStep} de {STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(getStepProgress())}% concluído
              </span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            
            <div className="flex items-center justify-between">
              {STEPS.map((step) => (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > step.id 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.id 
                      ? 'bg-[#D40404] text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-center text-gray-600 max-w-20">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {renderStep()}

      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        
        {currentStep < STEPS.length ? (
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-[#D40404] hover:bg-[#B30303]"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Criar Operação
          </Button>
        )}
      </div>
    </div>
  );
}

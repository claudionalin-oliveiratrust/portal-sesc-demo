import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Plus, FileText, Banknote, Percent, Loader2, Search, Calculator, Info, DollarSign } from 'lucide-react';

// --- INÍCIO: COMPONENTE DE CÁLCULO DE CUSTOS B3 ---
function CalculoCustosB3Modal({ open, onOpenChange }) {
  // Estados do formulário
  const [tipoEmissao, setTipoEmissao] = useState('publica'); // 'publica' ou 'privada'
  const [valorEmissao, setValorEmissao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [conta69, setConta69] = useState('nao'); // 'sim' ou 'nao'
  const [tipoCustodia, setTipoCustodia] = useState('simplificada'); // 'simplificada' ou 'nao_simplificada'
  
  // Estados dos resultados
  const [resultados, setResultados] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Configuração das faixas e taxas (baseada na planilha Excel)
  const config = {
    emissao_publica: {
      taxa_registro: {
        faixas: [
          { de: 0, ate: 50000000, percentual: 0.00029 },
          { de: 50000000.01, ate: 250000000, percentual: 0.00023 },
          { de: 250000000.01, ate: 1000000000, percentual: 0.000175 },
          { de: 1000000000.01, ate: 2500000000, percentual: 0.00013 },
          { de: 2500000000.01, ate: 50000000000, percentual: 0.00009 }
        ],
        valor_minimo: 6402.90
      },
      taxa_liquidacao_str: {
        percentual: 0.00001,
        minimo: 4.06,
        maximo: 202.93
      }
    },
    emissao_privada: {
      taxa_registro: {
        faixas: [
          { de: 0, ate: 50000000, percentual: 0.00003 },
          { de: 50000000, ate: 100000000, percentual: 0.0000255 },
          { de: 100000000, ate: Infinity, percentual: 0.0000214 }
        ]
      },
      custodia_simplificada: {
        faixas: [
          { de: 0, ate: 100000000, percentual: 0.00002 },
          { de: 100000000, ate: 300000000, percentual: 0.0000178 },
          { de: 300000000, ate: Infinity, percentual: 0.0000155 }
        ]
      },
      custodia_nao_simplificada: {
        faixas: [
          { de: 0, ate: 500000000, percentual: 0.0000175 },
          { de: 500000000, ate: 1000000000, percentual: 0.00001667 },
          { de: 1000000000, ate: Infinity, percentual: 0.0000156 }
        ]
      }
    }
  };

  // Função para calcular taxa por faixas
  const calcularTaxaPorFaixas = (valor, faixas) => {
    let valorRestante = valor;
    let taxaTotal = 0;
    let detalhes = [];

    for (const faixa of faixas) {
      if (valorRestante <= 0) break;

      const valorFaixa = Math.min(valorRestante, faixa.ate - faixa.de);
      const taxaFaixa = valorFaixa * faixa.percentual;
      
      if (valorFaixa > 0) {
        taxaTotal += taxaFaixa;
        detalhes.push({
          faixa: `R$ ${faixa.de.toLocaleString('pt-BR')} - R$ ${faixa.ate === Infinity ? '∞' : faixa.ate.toLocaleString('pt-BR')}`,
          valor: valorFaixa,
          percentual: faixa.percentual,
          taxa: taxaFaixa
        });
        valorRestante -= valorFaixa;
      }
    }

    return { taxaTotal, detalhes };
  };

  // Função principal de cálculo
  const calcularCustos = () => {
    setIsCalculating(true);
    
    // Calcular valor total da emissão
    let valorTotal = parseFloat(valorEmissao) || 0;
    if (quantidade && precoUnitario) {
      valorTotal = parseFloat(quantidade) * parseFloat(precoUnitario);
    }

    if (valorTotal <= 0) {
      alert('Por favor, informe o valor da emissão ou quantidade e preço unitário.');
      setIsCalculating(false);
      return;
    }

    let resultadosCalculo = {
      valorTotal,
      taxaRegistro: 0,
      taxaLiquidacao: 0,
      taxaCustodia: 0,
      total: 0,
      detalhes: []
    };

    if (tipoEmissao === 'publica') {
      // Cálculo para Emissão Pública
      const { taxaTotal: taxaReg, detalhes: detalhesReg } = calcularTaxaPorFaixas(
        valorTotal, 
        config.emissao_publica.taxa_registro.faixas
      );
      
      resultadosCalculo.taxaRegistro = Math.max(taxaReg, config.emissao_publica.taxa_registro.valor_minimo);
      resultadosCalculo.detalhes.push({
        tipo: 'Taxa de Registro',
        detalhes: detalhesReg,
        valorMinimo: config.emissao_publica.taxa_registro.valor_minimo
      });

      // Taxa de Liquidação (apenas se Conta 69 = Sim)
      if (conta69 === 'sim') {
        const taxaLiq = valorTotal * config.emissao_publica.taxa_liquidacao_str.percentual;
        resultadosCalculo.taxaLiquidacao = Math.max(
          Math.min(taxaLiq, config.emissao_publica.taxa_liquidacao_str.maximo),
          config.emissao_publica.taxa_liquidacao_str.minimo
        );
      }

    } else {
      // Cálculo para Emissão Privada
      const { taxaTotal: taxaReg, detalhes: detalhesReg } = calcularTaxaPorFaixas(
        valorTotal, 
        config.emissao_privada.taxa_registro.faixas
      );
      
      resultadosCalculo.taxaRegistro = taxaReg;
      resultadosCalculo.detalhes.push({
        tipo: 'Taxa de Registro - Colocação Primária',
        detalhes: detalhesReg
      });

      // Taxa de Custódia
      const faixasCustodia = tipoCustodia === 'simplificada' 
        ? config.emissao_privada.custodia_simplificada.faixas
        : config.emissao_privada.custodia_nao_simplificada.faixas;

      const { taxaTotal: taxaCust, detalhes: detalhesCust } = calcularTaxaPorFaixas(valorTotal, faixasCustodia);
      
      resultadosCalculo.taxaCustodia = taxaCust;
      resultadosCalculo.detalhes.push({
        tipo: `Taxa de Custódia Mensal ${tipoCustodia === 'simplificada' ? 'Simplificada' : 'Não Simplificada'}`,
        detalhes: detalhesCust
      });
    }

    resultadosCalculo.total = resultadosCalculo.taxaRegistro + resultadosCalculo.taxaLiquidacao + resultadosCalculo.taxaCustodia;
    
    setResultados(resultadosCalculo);
    setIsCalculating(false);
  };

  const limparFormulario = () => {
    setValorEmissao('');
    setQuantidade('');
    setPrecoUnitario('');
    setResultados(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Cálculo de Custos de Registro B3
          </DialogTitle>
          <DialogDescription>
            Calcule as taxas de registro, custódia e liquidação para emissões públicas e privadas na B3.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card>
            <CardContent className="space-y-6 pt-6">
              
              {/* Tipo de Emissão */}
              <div className="space-y-2">
                <Label>Tipo de Emissão</Label>
                <Select value={tipoEmissao} onValueChange={setTipoEmissao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publica">Emissão Pública</SelectItem>
                    <SelectItem value="privada">Emissão Privada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dados da Emissão */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorEmissao">Valor Total da Emissão (R$)</Label>
                  <Input
                    id="valorEmissao"
                    type="number"
                    placeholder="Ex: 400000000"
                    value={valorEmissao}
                    onChange={(e) => setValorEmissao(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade (opcional)</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Ex: 400000"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="precoUnitario">Preço Unitário (R$) (opcional)</Label>
                  <Input
                    id="precoUnitario"
                    type="number"
                    placeholder="Ex: 1000"
                    value={precoUnitario}
                    onChange={(e) => setPrecoUnitario(e.target.value)}
                  />
                </div>
              </div>

              {/* Opções específicas por tipo */}
              {tipoEmissao === 'publica' && (
                <div className="space-y-2">
                  <Label>Liquidação pela Conta 69?</Label>
                  <Select value={conta69} onValueChange={setConta69}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="sim">Sim</SelectItem>
                    </SelectContent>
                  </Select>
                  {conta69 === 'sim' && (
                    <div className="flex items-center p-2 bg-blue-50 rounded-md">
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm text-blue-700">
                        Taxa de Liquidação Financeira (STR) será aplicada
                      </span>
                    </div>
                  )}
                </div>
              )}

              {tipoEmissao === 'privada' && (
                <div className="space-y-2">
                  <Label>Tipo de Custódia</Label>
                  <Select value={tipoCustodia} onValueChange={setTipoCustodia}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simplificada">Simplificada</SelectItem>
                      <SelectItem value="nao_simplificada">Não Simplificada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-2">
                <Button onClick={calcularCustos} disabled={isCalculating} className="flex-1">
                  {isCalculating ? 'Calculando...' : 'Calcular Custos'}
                </Button>
                <Button variant="outline" onClick={limparFormulario}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {resultados && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Resultados do Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Resumo */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Valor da Emissão</div>
                    <div className="text-lg font-bold">R$ {resultados.valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Taxa de Registro</div>
                    <div className="text-lg font-bold text-blue-600">R$ {resultados.taxaRegistro.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                  </div>
                  
                  {resultados.taxaLiquidacao > 0 && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Taxa de Liquidação</div>
                      <div className="text-lg font-bold text-green-600">R$ {resultados.taxaLiquidacao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                    </div>
                  )}
                  
                  {resultados.taxaCustodia > 0 && (
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Taxa de Custódia</div>
                      <div className="text-lg font-bold text-purple-600">R$ {resultados.taxaCustodia.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-xl font-bold text-red-600">R$ {resultados.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                  </div>
                </div>

                {/* Detalhamento */}
                {resultados.detalhes.map((detalhe, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-gray-800">{detalhe.tipo}</h4>
                    <div className="space-y-1">
                      {detalhe.detalhes.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                          <span>{item.faixa}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{(item.percentual * 100).toFixed(4)}%</Badge>
                            <span className="font-medium">R$ {item.taxa.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {detalhe.valorMinimo && (
                      <div className="text-xs text-gray-600">
                        * Valor mínimo aplicado: R$ {detalhe.valorMinimo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
// --- FIM: COMPONENTE DE CÁLCULO DE CUSTOS B3 ---

// Componente do Modal para cadastrar novo banco (sem alterações)
function NewBankModal({ open, onOpenChange, addBank }) {
  const [cnpj, setCnpj] = useState('');
  const [bankName, setBankName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCnpjBlur = async () => {
    const onlyNumbers = cnpj.replace(/\D/g, '');
    if (onlyNumbers.length !== 14) {
      setError('CNPJ deve ter 14 dígitos.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${onlyNumbers}` );
      if (!response.ok) throw new Error('CNPJ não encontrado ou inválido.');
      
      const data = await response.json();
      setBankName(data.razao_social || 'Nome não encontrado');
    } catch (err) {
      setError(err.message);
      setBankName('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!bankName || !cnpj) {
      setError('Preencha o CNPJ e valide para obter o nome do banco.');
      return;
    }
    addBank({ name: bankName, cnpj });
    onOpenChange(false); // Fecha o modal
    setCnpj('');
    setBankName('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Banco</DialogTitle>
          <DialogDescription>
            Insira o CNPJ do banco para buscar os dados e adicioná-lo à esteira.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ do Banco</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cnpj"
                placeholder="Digite os 14 dígitos do CNPJ"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                onBlur={handleCnpjBlur}
              />
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankName">Nome / Razão Social</Label>
            <Input
              id="bankName"
              value={bankName}
              readOnly
              placeholder="Preenchido automaticamente"
              className="bg-gray-100"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !bankName} className="bg-[#D40404] hover:bg-[#B30303]">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Banco
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function NcPipeline({ banks, addBank }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false); // Estado para o modal de cálculo
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.cnpj.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
  );

  const getRemunerationIcon = (type) => {
    if (type === 'volume') return <Percent className="w-4 h-4 mr-2" />;
    if (type === 'operation') return <Banknote className="w-4 h-4 mr-2" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Esteira de NC</h1>
          <p className="text-gray-600">Gerencie os contratos guarda-chuva e as operações de NC por banco.</p>
        </div>
        {/* --- BOTÕES ATUALIZADOS COM CÁLCULO DE CUSTOS --- */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsCalcModalOpen(true)}>
            <Calculator className="w-4 h-4 mr-2" />
            Calcular Custos
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#D40404] hover:bg-[#B30303]">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Banco
          </Button>
        </div>
      </div>

      {/* Filtro de Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar banco por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Bancos */}
      <div className="pipeline-grid">
        {filteredBanks.map((bank) => (
          <Card key={bank.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{bank.name}</CardTitle>
                <Badge variant="outline">{bank.cnpj}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contrato Guarda-Chuva</h4>
                {bank.contract ? (
                  <div className="flex items-center text-blue-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{bank.contract}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Não definido</span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Remuneração</h4>
                {bank.remunerationType ? (
                  <div className="flex items-center">
                    {getRemunerationIcon(bank.remunerationType)}
                    <span>{bank.remunerationValue} / {bank.remunerationType === 'volume' ? 'volume' : 'operação'}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Não definida</span>
                )}
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="w-full" onClick={() => navigate(`/nc-pipeline/${bank.id}`)}>
                  Ver Detalhes
                </Button>
                <Button className="w-full bg-[#D40404] hover:bg-[#B30303]" onClick={() => navigate(`/nc-pipeline/${bank.id}/new-operation`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Operação
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Modais */}
      <NewBankModal open={isModalOpen} onOpenChange={setIsModalOpen} addBank={addBank} />
      <CalculoCustosB3Modal open={isCalcModalOpen} onOpenChange={setIsCalcModalOpen} />
    </div>
  );
}
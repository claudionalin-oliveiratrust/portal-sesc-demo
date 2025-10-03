import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function NewNcOperation() {
  const { bankId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    issuerCnpj: '',
    issuerName: '',
    operationValue: '',
    maturityDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCnpjBlur = async () => {
    const onlyNumbers = formData.issuerCnpj.replace(/\D/g, '');
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
      setFormData(prev => ({ ...prev, issuerName: data.razao_social || '' }));
    } catch (err) {
      setError(err.message);
      setFormData(prev => ({ ...prev, issuerName: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // No futuro, aqui chamaremos a função para adicionar a operação de NC
    console.log('Nova Operação de Esteira:', { ...formData, bankId });
    alert('Operação de Esteira criada com sucesso! (Simulação)');
    navigate(`/nc-pipeline/${bankId}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate(`/nc-pipeline/${bankId}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Operação de Esteira</h1>
          <p className="text-gray-600">Cadastre uma nova Nota de Crédito para este banco.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Operação</CardTitle>
          <CardDescription>O banco investidor já está definido. Preencha os dados do emissor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="issuerCnpj">CNPJ do Emissor *</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="issuerCnpj"
                placeholder="Digite o CNPJ do emissor da NC"
                value={formData.issuerCnpj}
                onChange={(e) => handleInputChange('issuerCnpj', e.target.value)}
                onBlur={handleCnpjBlur}
              />
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuerName">Nome do Emissor</Label>
            <Input
              id="issuerName"
              value={formData.issuerName}
              readOnly
              placeholder="Preenchido automaticamente"
              className="bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operationValue">Valor da Operação *</Label>
              <Input
                id="operationValue"
                type="number"
                placeholder="Ex: 50000"
                value={formData.operationValue}
                onChange={(e) => handleInputChange('operationValue', e.target.value)}
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Salvar Operação
        </Button>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ArrowLeft, FileText, Banknote, Percent, Upload, Edit, Plus } from 'lucide-react';

export default function BankDetails({ banks }) {
  const { bankId } = useParams();
  const navigate = useNavigate();
  
  // Busca o banco certo pelo ID. Se não encontrar, mostra uma mensagem.
  const bank = banks.find(b => b.id.toString() === bankId);

  if (!bank) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Banco não encontrado</h1>
        <Button onClick={() => navigate('/nc-pipeline')} className="mt-4">Voltar para a Esteira</Button>
      </div>
    );
  }

  const getRemunerationIcon = (type) => {
    if (type === 'volume') return <Percent className="w-4 h-4 mr-2" />;
    if (type === 'operation') return <Banknote className="w-4 h-4 mr-2" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/nc-pipeline')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{bank.name}</h1>
            <p className="text-gray-600">Detalhes do Contrato Guarda-Chuva</p>
          </div>
        </div>
        <Badge variant="outline">{bank.cnpj}</Badge>
      </div>

      {/* Botão de Nova Operação */}
      <div className="flex justify-end">
        <Button 
          onClick={() => navigate(`/nc-pipeline/${bankId}/new-operation`)}
          className="bg-[#D40404] hover:bg-[#B30303]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Operação de Esteira
        </Button>
      </div>

      {/* Detalhes do Contrato */}
      <Card>
        <CardHeader>
          <CardTitle>Contrato Guarda-Chuva</CardTitle>
          <CardDescription>Gerencie o contrato e a forma de remuneração.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seção do Contrato */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Documento do Contrato</h3>
            {bank.contract ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-600 font-medium">
                  <FileText className="w-5 h-5 mr-2" />
                  <span>{bank.contract}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Substituir Contrato
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col gap-4 p-6 bg-gray-50 rounded-md">
                 <p className="text-gray-500">Nenhum contrato definido.</p>
                 <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Inserir Contrato
                 </Button>
              </div>
            )}
          </div>

          {/* Seção da Remuneração */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Remuneração</h3>
                <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                </Button>
            </div>
            {bank.remunerationType ? (
              <div className="flex items-center text-lg">
                {getRemunerationIcon(bank.remunerationType)}
                <span className="font-bold">{bank.remunerationValue}</span>
                <span className="text-gray-500 ml-2">/ {bank.remunerationType === 'volume' ? 'sobre o volume emitido' : 'por operação'}</span>
              </div>
            ) : (
              <p className="text-gray-500">Forma de remuneração não definida.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

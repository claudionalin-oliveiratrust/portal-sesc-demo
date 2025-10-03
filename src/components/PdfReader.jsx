import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx'; // Importar Textarea
import { Upload, FileText, Wand2, Loader2 } from 'lucide-react';

// Simula a extração de dados de um PDF, agora com os novos campos
const fakeExtraction = (fileName) => {
  return {
    emissao: '1ª (Primeira) Emissão de Notas Comerciais Escriturais',
    serie: 'Série Única',
    emissor: 'MK BR S.A.',
    dataEmissao: '2025-10-15',
    dataVencimento: '2028-10-15',
    valorTotal: '800.000.000,00',
    garantidores: 'MK NE LTDA., ALBERTO BAGGIANI, GIOVANNI MARINS CARDOSO',
    // --- NOVOS CAMPOS ---
    valorNominalUnitario: '1.000,00',
    destinacaoRecursos: 'Reforço de caixa da Emitente e gestão de passivos da Emitente.',
    agenteLiquidacao: 'Oliveira Trust Distribuidora de Títulos e Valores Mobiliários S.A.',
    formaTitularidade: 'Escritural, comprovada por extrato emitido pelo Escriturador.',
  };
};

export default function PdfReader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setExtractedData(null);
    } else {
      alert('Por favor, selecione um arquivo PDF.');
      setSelectedFile(null);
    }
  };

  const handleExtract = () => {
    if (!selectedFile) {
      alert('Por favor, suba um arquivo PDF primeiro.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const data = fakeExtraction(selectedFile.name);
      setExtractedData(data);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leitor Inteligente de Documentos</CardTitle>
          <CardDescription>
            Suba um Termo de Emissão em PDF para extrair as informações chave automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="pdf-upload"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center space-y-2 text-gray-500"
            >
              <Upload className="w-10 h-10" />
              <span>
                {selectedFile ? `Arquivo selecionado: ${selectedFile.name}` : 'Clique para selecionar um arquivo PDF'}
              </span>
            </label>
          </div>
          <Button onClick={handleExtract} disabled={!selectedFile || isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Extraindo Informações...' : 'Extrair Informações'}
          </Button>
        </CardContent>
      </Card>

      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Extraídos</CardTitle>
            <CardDescription>Revise as informações e corrija se necessário.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Emissão</Label>
              <Input value={extractedData.emissao} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Série</Label>
              <Input value={extractedData.serie} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Nome do Emissor</Label>
              <Input value={extractedData.emissor} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Valor Total da Emissão</Label>
              <Input value={extractedData.valorTotal} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Data de Emissão</Label>
              <Input type="date" value={extractedData.dataEmissao} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Input type="date" value={extractedData.dataVencimento} readOnly />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Garantidores</Label>
              <Input value={extractedData.garantidores} readOnly />
            </div>
            
            {/* --- INÍCIO DOS NOVOS CAMPOS --- */}
            <div className="space-y-2">
              <Label>Valor Nominal Unitário</Label>
              <Input value={extractedData.valorNominalUnitario} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Agente de Liquidação e Escriturador</Label>
              <Input value={extractedData.agenteLiquidacao} readOnly />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Destinação dos Recursos</Label>
              <Textarea value={extractedData.destinacaoRecursos} readOnly rows={3} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Forma, Tipo e Comprovação de Titularidade</Label>
              <Textarea value={extractedData.formaTitularidade} readOnly rows={3} />
            </div>
            {/* --- FIM DOS NOVOS CAMPOS --- */}

          </CardContent>
        </Card>
      )}
    </div>
  );
}

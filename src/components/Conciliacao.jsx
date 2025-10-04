import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Upload, FileDown, AlertCircle, CheckCircle, Calculator } from 'lucide-react';
import * as XLSX from 'xlsx';

// Funções auxiliares da conciliação
const formatCurrency = (value) => {
  if (typeof value !== 'number') return value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const normalizeName = (name) => {
  if (!name) return '';
  return name
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, ''); // Remove caracteres especiais
};

export default function Conciliacao() {
  const [eventFile, setEventFile] = useState(null);
  const [accountFile, setAccountFile] = useState(null);
  const [diffData, setDiffData] = useState([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setError('');
      setInfo('');
    }
  };

  const consolidateData = async () => {
    if (!eventFile || !accountFile) {
      setError("Por favor, carregue ambos os arquivos de eventos e de contas.");
      return;
    }
    setError(''); setInfo(''); setDiffData([]);

    try {
      const readFile = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
      });

      let eventData = await readFile(eventFile);
      let accountData = await readFile(accountFile);

      const tiposIgnorados = ['FII', 'FIDC', 'FIP', 'FIC FIM', 'FIM', 'FIAGRO', 'FIC FIDC', 'FIA', 'FIRF', 'FI INFRA'];
      eventData = eventData.filter(row => !tiposIgnorados.includes(String(row['Tipo']).toUpperCase()));

      const consolidatedEvent = eventData.reduce((acc, row) => { const valor = parseFloat(row['Valor liquido']); if (!isNaN(valor)) { const normName = normalizeName(row['Emissor']); if (!acc[normName]) { acc[normName] = { Emissor: row['Emissor'], VALOR: 0 }; } acc[normName].VALOR += valor; } return acc; }, {});
      const consolidatedAccount = accountData.reduce((acc, row) => { const saldo = parseFloat(row['Saldo Disponivel']); if (!isNaN(saldo)) { const normName = normalizeName(row['Nome']); if (!acc[normName]) { acc[normName] = { BALANCE: 0 }; } acc[normName].BALANCE += saldo; } return acc; }, {});
      const reconciliation = Object.keys(consolidatedEvent).map(normName => { const event = consolidatedEvent[normName]; const account = consolidatedAccount[normName] || { BALANCE: 0 }; const diferenca = event.VALOR - account.BALANCE; return { Emissor: event.Emissor, VALOR: event.VALOR, BALANCE: account.BALANCE, Diferença: diferenca, }; });
      const finalDiffData = reconciliation.filter(row => row.Diferença > 0);

      if (finalDiffData.length > 0) {
        setDiffData(finalDiffData);
      } else {
        setInfo("Nenhum emissor com saldo insuficiente encontrado.");
      }
    } catch (e) {
      console.error(e);
      setError(`Ocorreu um erro ao processar os arquivos: ${e.message}. Verifique se as colunas estão corretas.`);
    }
  };

  const exportToExcel = () => {
    if (diffData.length === 0) return;
    const formattedData = diffData.map(row => ({ 'Emissor': row.Emissor, 'Valor Necessário (Eventos)': formatCurrency(row.VALOR), 'Saldo Disponível (Contas)': formatCurrency(row.BALANCE), 'Diferença (Falta)': formatCurrency(row.Diferença), }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Diferencas");
    const colWidths = Object.keys(formattedData[0]).map(key => ({ wch: Math.max(key.length, ...formattedData.map(item => String(item[key]).length)) + 2 }));
    worksheet["!cols"] = colWidths;
    XLSX.writeFile(workbook, "relatorio_conciliacao.xlsx");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator />
            <span>Conciliação de Recursos</span>
          </CardTitle>
          <CardDescription>
            Compare arquivos de eventos e saldos para encontrar emissores com saldo insuficiente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="event-file">1. Arquivo de Eventos</Label>
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline"><label htmlFor="event-file" className="cursor-pointer"><Upload className="w-4 h-4 mr-2" />Carregar Arquivo</label></Button>
                <input id="event-file" type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => handleFileChange(e, setEventFile)} />
                {eventFile && <span className="text-sm text-gray-600 truncate">{eventFile.name}</span>}
              </div>
              <p className="text-xs text-gray-500">Colunas esperadas: 'Emissor', 'Valor liquido', 'Tipo'</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-file">2. Arquivo de Contas</Label>
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline"><label htmlFor="account-file" className="cursor-pointer"><Upload className="w-4 h-4 mr-2" />Carregar Arquivo</label></Button>
                <input id="account-file" type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => handleFileChange(e, setAccountFile)} />
                {accountFile && <span className="text-sm text-gray-600 truncate">{accountFile.name}</span>}
              </div>
              <p className="text-xs text-gray-500">Colunas esperadas: 'Nome', 'Saldo Disponivel'</p>
            </div>
          </div>
          <Button onClick={consolidateData} disabled={!eventFile || !accountFile} className="w-full bg-[#D40404] hover:bg-[#B30303]">
            <Calculator className="w-4 h-4 mr-2" />
            Conciliar Arquivos
          </Button>
          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {info && <Alert><CheckCircle className="h-4 w-4" /><AlertTitle>Informação</AlertTitle><AlertDescription>{info}</AlertDescription></Alert>}
        </CardContent>
      </Card>
      {diffData.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Resultados da Conciliação</CardTitle><CardDescription>Emissores com saldo insuficiente.</CardDescription></div>
            <Button onClick={exportToExcel} variant="outline"><FileDown className="w-4 h-4 mr-2" />Exportar para Excel</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Emissor</TableHead><TableHead className="text-right">Valor Necessário</TableHead><TableHead className="text-right">Saldo Disponível</TableHead><TableHead className="text-right text-red-600">Diferença (Falta)</TableHead></TableRow></TableHeader>
              <TableBody>
                {diffData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.Emissor}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.VALOR)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.BALANCE)}</TableCell>
                    <TableCell className="text-right font-bold text-red-600">{formatCurrency(row.Diferença)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

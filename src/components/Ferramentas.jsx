// src/components/Ferramentas.jsx

import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Upload, Download, FileText, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';

// --- LÓGICA DE CONVERSÃO ---

const EVENT_TYPE_MAP = {
    "PAGAMENTO DE JUROS": "083", "AMORTIZAÇÃO DO PRINCIPAL": "084", "RESGATE TOTAL": "052",
    "Resgate Antecipado Parcial": "053", "Retenção Declarada Vencimento Antecipado": "057",
    "Opção de Venda": "058", "Não Repactuação": "059", "Prêmio de Permanência": "060",
    "Participação": "061", "Resgate no Vencimento": "085", "Incorporação de Juros": "089",
    "PRÊMIO": "091", "EVENTO GENÉRICO": "096", "AMORTIZAÇÃO EXTRAORDINÁRIA": "097",
};

const ASSET_TYPE_MAP = {
    "CFF": "00", "DEB": "01", "NC": "02", "OBR": "04", "LF": "05",
    "CIAV": "06", "CRI": "07", "CRA": "08", "CDCA": "09",
};

// Função para formatar uma linha com tamanhos fixos
function formatLine(fields, sizes) {
    return fields.map((field, i) => {
        const fieldStr = String(field || '').padEnd(sizes[i], ' ');
        return fieldStr.substring(0, sizes[i]);
    }).join('');
}

// Função para formatar números decimais para o formato DEB
function formatDebNumber(value, totalWidth, decimalPlaces) {
    if (value === null || value === undefined || value === '') return ''.padStart(totalWidth, ' ');
    try {
        const num = parseFloat(value);
        if (isNaN(num) || num === 0) return ''.padStart(totalWidth, ' ');
        const multiplier = Math.pow(10, decimalPlaces);
        const fixedNum = Math.round(num * multiplier);
        return String(fixedNum).padStart(totalWidth, '0');
    } catch {
        return ''.padStart(totalWidth, ' ');
    }
}

// Função para formatar números para o formato MDA
function formatMdaNumber(value, integerDigits, decimalDigits = 0) {
    const width = integerDigits + decimalDigits;
    if (value === null || value === undefined || value === '') return '0'.padStart(width, '0');
    try {
        const num = new Number(value).toFixed(decimalDigits);
        const [integerPart, fractionalPart] = num.split('.');
        const finalInteger = integerPart.padStart(integerDigits, '0');
        const finalFractional = (fractionalPart || '').padEnd(decimalDigits, '0');
        return `${finalInteger}${finalFractional}`;
    } catch {
        return '0'.padStart(width, '0');
    }
}

// Processador do arquivo DEB
function processDebFile(data) {
    const participante = "oliveiratrustdtvm";
    const versao_layout = "00002";
    const dataAtual = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    const header = formatLine(["DEB", "0", "PUEV", participante, dataAtual, versao_layout, ""], [5, 1, 4, 20, 8, 5, 32]);
    let lines = [header];

    const debData = data.filter(row => row['Tipo ativo'] === 'DEB');
    if (debData.length === 0) return [];

    const groupedByTicker = debData.reduce((acc, row) => {
        const ticker = row['Ticker'];
        if (!acc[ticker]) acc[ticker] = [];
        acc[ticker].push(row);
        return acc;
    }, {});

    for (const ticker in groupedByTicker) {
        const group = groupedByTicker[ticker];
        const countLine = formatLine(["DEB", "1", "PUEV", ticker, String(group.length).padStart(4, '0')], [5, 1, 4, 14, 4]);
        lines.push(countLine);

        group.forEach(row => {
            const tipoEvento = EVENT_TYPE_MAP[String(row['Tipo']).trim()] || "000";
            const valorUnitario = formatDebNumber(row['Valor unitário'], 18, 8);
            
            let dataEventoStr = '        ';
            try {
                // Tenta converter a data do Excel (que pode ser um número)
                const excelDate = row['Data original'] || row['Data base'];
                if (excelDate) {
                    const date = XLSX.SSF.parse_date_code(excelDate);
                    dataEventoStr = `${date.y}${String(date.m).padStart(2, '0')}${String(date.d).padStart(2, '0')}`;
                }
            } catch {}

            const dataLine = formatLine(
                ["DEB", "2", "PUEV", dataEventoStr, tipoEvento, valorUnitario, ''.padStart(18, ' '), ''.padStart(18, ' '), ''.padStart(18, ' '), ''.padStart(18, ' ')],
                [5, 1, 4, 8, 3, 18, 18, 18, 18, 18]
            );
            lines.push(dataLine);
        });
    }
    return lines;
}

// Processador do arquivo MDA
function processMdaFile(data) {
    const dataAtual = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const header = `MDA  00401${dataAtual}`;
    let lines = [header];

    data.forEach((row, index) => {
        const meuNumero = String(index + 1).padStart(10, '0');
        const tipoAtivo = ASSET_TYPE_MAP[String(row["Tipo do Ativo (CFF, DEB, NC, OBR, LF, CIAV, CRI, CRA, CDCA)"]).trim()] || "00";
        const codigoAtivo = String(row["Código do Ativo"]).padEnd(11, ' ').substring(0, 11);
        const contaPropria = formatMdaNumber(row["Conta Própria"], 8);
        const emissorConta = formatMdaNumber(row["Emissor (Conta)"], 8);
        const quantidade = formatMdaNumber(row["Quantidade depositada"], 12, 8);
        const pu = formatMdaNumber(row["PU (Preço Unitário)"], 10, 8);
        const modalidade = formatMdaNumber(row["Modalidade de liquidação (00=bruta, 01=sem modalidade)"], 2);
        const papel = "02";

        const linha = `MDA  10401${meuNumero}${tipoAtivo}${codigoAtivo}${contaPropria}${emissorConta}${quantidade}${pu}${modalidade}${papel}`;
        lines.push(linha);
    });

    return lines;
}


export default function Ferramentas() {
    const [debContent, setDebContent] = useState('');
    const [mdaContent, setMdaContent] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e, processor, setContent) => {
        setError('');
        setContent('');
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const bstr = event.target.result;
                const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                
                const lines = processor(data);
                if (lines.length > 1) {
                    setContent(lines.join('\n'));
                } else {
                    setError('Nenhum dado válido encontrado no arquivo para este tipo de conversão.');
                }
            } catch (err) {
                console.error(err);
                setError(`Erro ao processar o arquivo: ${err.message}`);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleSave = (content, defaultFileName) => {
        if (!content) return;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = defaultFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><FileText className="mr-2" />Conversores de Arquivo</CardTitle>
                    <CardDescription>Faça o upload de planilhas Excel para convertê-las para o formato de texto (.txt) exigido.</CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="deb" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deb">Eventos DEB</TabsTrigger>
                    <TabsTrigger value="mda">Depósito MDA</TabsTrigger>
                </TabsList>
                
                {/* Aba DEB */}
                <TabsContent value="deb">
                    <Card>
                        <CardHeader>
                            <Label htmlFor="deb-file" className="flex items-center cursor-pointer">
                                <Upload className="mr-2" />
                                1. Selecionar Planilha de Eventos DEB
                            </Label>
                            <Input id="deb-file" type="file" accept=".xlsx, .xls" className="mt-2" onChange={(e) => handleFileChange(e, processDebFile, setDebContent)} />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Label>2. Pré-visualização do Arquivo .txt</Label>
                            <Textarea value={debContent} readOnly rows={15} placeholder="O conteúdo do arquivo convertido aparecerá aqui..." className="font-mono text-xs" />
                            <Button onClick={() => handleSave(debContent, 'Manutencao_Eventos.txt')} disabled={!debContent}>
                                <Download className="mr-2" />
                                3. Salvar Arquivo DEB
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Aba MDA */}
                <TabsContent value="mda">
                    <Card>
                        <CardHeader>
                            <Label htmlFor="mda-file" className="flex items-center cursor-pointer">
                                <Upload className="mr-2" />
                                1. Selecionar Planilha de Depósito MDA
                            </Label>
                            <Input id="mda-file" type="file" accept=".xlsx, .xls" className="mt-2" onChange={(e) => handleFileChange(e, processMdaFile, setMdaContent)} />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Label>2. Pré-visualização do Arquivo .txt</Label>
                            <Textarea value={mdaContent} readOnly rows={15} placeholder="O conteúdo do arquivo convertido aparecerá aqui..." className="font-mono text-xs" />
                            <Button onClick={() => handleSave(mdaContent, 'Deposito_MDA.txt')} disabled={!mdaContent}>
                                <Download className="mr-2" />
                                3. Salvar Arquivo MDA
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {error && (
                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <AlertTriangle className="text-red-500" />
                        <CardTitle className="text-red-700">Ocorreu um Erro</CardTitle>
                    </CardHeader>
                    <CardContent className="text-red-600">
                        {error}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

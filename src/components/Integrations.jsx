// src/components/Integrations.jsx

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Copy, RefreshCw, Send } from 'lucide-react';

// Simula uma chave de API gerada
const API_KEY = "w4TbERtyS8kBCHAzEqXdaPu";
// URL do endpoint (mesmo que simulado, é importante exibi-lo)
const WEBHOOK_URL = "https://portal-sesc.oliveiratrust.com.br/api/v1/operations/webhook";

export default function Integrations({ logs, onTestWebhook } ) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integração via Webhook</CardTitle>
          <CardDescription>
            Use o endpoint e a chave de API abaixo para criar operações automaticamente a partir de sistemas externos como o SCAF (via Zapier).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do Webhook</label>
            <div className="flex items-center gap-2">
              <Input value={WEBHOOK_URL} readOnly />
              <Button variant="outline" size="icon" onClick={() => handleCopy(WEBHOOK_URL, 'url')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copiedUrl && <p className="text-xs text-green-600">URL copiada para a área de transferência!</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Chave de API (X-API-Key)</label>
            <div className="flex items-center gap-2">
              <Input type="password" value={API_KEY} readOnly />
              <Button variant="outline" size="icon" onClick={() => handleCopy(API_KEY, 'key')}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {copiedKey && <p className="text-xs text-green-600">Chave de API copiada para a área de transferência!</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Logs de Requisições</CardTitle>
            <CardDescription>Histórico das últimas chamadas recebidas pelo webhook.</CardDescription>
          </div>
          <Button onClick={onTestWebhook}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Requisição de Teste
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mensagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">Nenhuma requisição recebida ainda.</TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'Sucesso' ? 'default' : 'destructive'} className={log.status === 'Sucesso' ? 'bg-green-100 text-green-800' : ''}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

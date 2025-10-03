import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import {
  Settings as SettingsIcon, Save, Bell, Shield, Database, Mail, Users, FileText,
  Globe, Lock, AlertTriangle, CheckCircle, Copy, RefreshCw, Send
} from 'lucide-react';

// --- CONSTANTES PARA A API ---
const API_KEY = "w4TbERtyS8kBCHAzEqXdaPu";
const WEBHOOK_URL = "https://portal-sesc.oliveiratrust.com.br/api/v1/operations/webhook";

export default function Settings({ logs, onTestWebhook } ) {
  const [settings, setSettings] = useState({
    systemName: 'Portal SESC',
    systemDescription: 'Sistema de Controle de Operações Financeiras',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    operationAlerts: true,
    deadlineReminders: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    twoFactorAuth: false,
    auditLog: true,
    apiEnabled: true,
    webhookUrl: '',
    backupFrequency: 'daily',
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'sistema@sesc.com.br',
    smtpPassword: '',
    maxFileSize: '50',
    allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    documentRetention: '7'
  });

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

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Configurações salvas:', settings);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      console.log('Configurações resetadas');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>Restaurar Padrão</Button>
          <Button onClick={handleSave} className="bg-[#D40404] hover:bg-[#B30303]"><Save className="w-4 h-4 mr-2" />Salvar Alterações</Button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-lg">Categorias</CardTitle></CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {[
                  { id: 'general', name: 'Geral', icon: SettingsIcon },
                  { id: 'notifications', name: 'Notificações', icon: Bell },
                  { id: 'security', name: 'Segurança', icon: Shield },
                  { id: 'integration', name: 'Integração', icon: Database },
                  { id: 'email', name: 'Email', icon: Mail },
                  { id: 'documents', name: 'Documentos', icon: FileText }
                ].map(item => (
                  <a key={item.id} href={`#${item.id}`} className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D40404] transition-colors">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <Card id="general">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><SettingsIcon className="w-5 h-5" /><span>Configurações Gerais</span></CardTitle>
              <CardDescription>Configurações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input id="systemName" value={settings.systemName} onChange={(e) => handleSettingChange('systemName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemDescription">Descrição do Sistema</Label>
                <Textarea id="systemDescription" value={settings.systemDescription} onChange={(e) => handleSettingChange('systemDescription', e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card id="notifications">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Bell className="w-5 h-5" /><span>Notificações</span></CardTitle>
              <CardDescription>Configure como e quando receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><Label htmlFor="emailNotifications">Notificações por Email</Label><p className="text-sm text-gray-500">Receber alertas por email</p></div>
                  <Switch id="emailNotifications" checked={settings.emailNotifications} onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div><Label htmlFor="pushNotifications">Notificações Push</Label><p className="text-sm text-gray-500">Notificações no navegador</p></div>
                  <Switch id="pushNotifications" checked={settings.pushNotifications} onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div><Label htmlFor="operationAlerts">Alertas de Operação</Label><p className="text-sm text-gray-500">Notificar sobre mudanças nas operações</p></div>
                  <Switch id="operationAlerts" checked={settings.operationAlerts} onCheckedChange={(checked) => handleSettingChange('operationAlerts', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div><Label htmlFor="deadlineReminders">Lembretes de Prazo</Label><p className="text-sm text-gray-500">Alertas sobre vencimentos</p></div>
                  <Switch id="deadlineReminders" checked={settings.deadlineReminders} onCheckedChange={(checked) => handleSettingChange('deadlineReminders', checked)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Shield className="w-5 h-5" /><span>Segurança</span></CardTitle>
              <CardDescription>Configurações de segurança e acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input id="sessionTimeout" type="number" value={settings.sessionTimeout} onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Expiração de Senha (dias)</Label>
                  <Input id="passwordExpiry" type="number" value={settings.passwordExpiry} onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><Label htmlFor="twoFactorAuth">Autenticação de Dois Fatores</Label><p className="text-sm text-gray-500">Requer verificação adicional no login</p></div>
                  <Switch id="twoFactorAuth" checked={settings.twoFactorAuth} onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div><Label htmlFor="auditLog">Log de Auditoria</Label><p className="text-sm text-gray-500">Registrar todas as ações do sistema</p></div>
                  <Switch id="auditLog" checked={settings.auditLog} onCheckedChange={(checked) => handleSettingChange('auditLog', checked)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="integration">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Database className="w-5 h-5" /><span>Integração e Webhooks</span></CardTitle>
              <CardDescription>Use o endpoint abaixo para criar operações automaticamente a partir de sistemas externos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>URL do Webhook</Label>
                <div className="flex items-center gap-2">
                  <Input value={WEBHOOK_URL} readOnly />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(WEBHOOK_URL, 'url')}><Copy className="h-4 w-4" /></Button>
                </div>
                {copiedUrl && <p className="text-xs text-green-600 mt-1">URL copiada!</p>}
              </div>
              <div className="space-y-2">
                <Label>Chave de API (X-API-Key)</Label>
                <div className="flex items-center gap-2">
                  <Input type="password" value={API_KEY} readOnly />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(API_KEY, 'key')}><Copy className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" title="Gerar nova chave (funcionalidade futura)"><RefreshCw className="h-4 w-4" /></Button>
                </div>
                {copiedKey && <p className="text-xs text-green-600 mt-1">Chave de API copiada!</p>}
              </div>
            </CardContent>
            <Separator className="my-4" />
            <CardHeader className="flex flex-row items-center justify-between pt-0">
              <div>
                <h3 className="text-base font-semibold">Logs de Requisições</h3>
                <p className="text-sm text-gray-500">Histórico das últimas chamadas recebidas.</p>
              </div>
              <Button onClick={onTestWebhook} className="bg-gray-800 text-white hover:bg-gray-900">
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
                  {logs && logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === 'Sucesso' ? 'default' : 'destructive'} className={log.status === 'Sucesso' ? 'bg-green-100 text-green-800' : ''}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.message}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center py-6">Nenhuma requisição recebida ainda.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card id="email">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Mail className="w-5 h-5" /><span>Configurações de Email</span></CardTitle>
              <CardDescription>Configure o servidor SMTP para envio de emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">Servidor SMTP</Label>
                  <Input id="smtpServer" value={settings.smtpServer} onChange={(e) => handleSettingChange('smtpServer', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input id="smtpPort" value={settings.smtpPort} onChange={(e) => handleSettingChange('smtpPort', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUser">Usuário SMTP</Label>
                <Input id="smtpUser" type="email" value={settings.smtpUser} onChange={(e) => handleSettingChange('smtpUser', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Senha SMTP</Label>
                <Input id="smtpPassword" type="password" value={settings.smtpPassword} onChange={(e) => handleSettingChange('smtpPassword', e.target.value)} placeholder="••••••••" />
              </div>
              <Button variant="outline" size="sm"><CheckCircle className="w-4 h-4 mr-2" />Testar Conexão</Button>
            </CardContent>
          </Card>

          <Card id="documents">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><FileText className="w-5 h-5" /><span>Documentos</span></CardTitle>
              <CardDescription>Configure o gerenciamento de documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Tamanho Máximo (MB)</Label>
                  <Input id="maxFileSize" type="number" value={settings.maxFileSize} onChange={(e) => handleSettingChange('maxFileSize', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentRetention">Retenção (anos)</Label>
                  <Input id="documentRetention" type="number" value={settings.documentRetention} onChange={(e) => handleSettingChange('documentRetention', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Formatos Permitidos</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.allowedFormats.map(format => (<Badge key={format} variant="secondary">{format.toUpperCase()}</Badge>))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Globe className="w-5 h-5" /><span>Status do Sistema</span></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div><p className="font-medium text-green-900">Sistema Online</p><p className="text-sm text-green-600">Funcionando normalmente</p></div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Database className="w-8 h-8 text-blue-600" />
                  <div><p className="font-medium text-blue-900">Banco de Dados</p><p className="text-sm text-blue-600">Conectado</p></div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                  <Mail className="w-8 h-8 text-orange-600" />
                  <div><p className="font-medium text-orange-900">Servidor Email</p><p className="text-sm text-orange-600">Configuração pendente</p></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
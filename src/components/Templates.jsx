// src/components/Templates.jsx

import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Mail, Copy, ClipboardCheck, Users, Download } from 'lucide-react';

// Funções que geram o HTML dos templates (sem alterações)
const getExtratoTemplate = (destinatario, masterName, masterEmail) => `
<div style="font-family: Arial, sans-serif; color: #333; border: 1px solid #d40404; border-radius: 10px; padding: 20px; max-width: 650px;">
  <h2 style="color: #d40404; border-bottom: 2px solid #d40404; padding-bottom: 5px;">📑 Consulta de Extratos de Ativos</h2>
  <p>Boa tarde ${destinatario || ''},</p>
  <p>Os <strong>extratos referentes aos ativos</strong> podem ser consultados diretamente no <strong>Portal da Oliveira Trust</strong>, acessando o menu lateral de <em>Conta Corrente</em>.</p>
  <p style="margin: 10px 0; text-align: center;"><a href="https://portalot.oliveiratrust.com.br/" target="_blank" style="background-color: #d40404; color: #fff; text-decoration: none; padding: 10px 15px; border-radius: 5px; font-weight: bold;">🔗 Acessar Portal OT</a></p>
  <p>O usuário <strong>master</strong> cadastrado para sua empresa é:</p>
  <div style="background: #fff5f5; border: 1px solid #d40404; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead><tr style="background-color: #d40404; color: #fff;"><th style="padding: 8px; text-align: left;">Nome</th><th style="padding: 8px; text-align: left;">E-mail</th><th style="padding: 8px; text-align: center;">Master</th></tr></thead>
      <tbody><tr style="background-color: #fff;"><td style="padding: 8px;">${masterName || '(Nome do Master )'}</td><td style="padding: 8px;">${masterEmail || '(Email do Master)'}</td><td style="padding: 8px; text-align: center;">✔️</td></tr></tbody>
    </table>
  </div>
  <p>O usuário master terá acesso à consulta e poderá autorizar outros usuários, conforme descrito no <strong>manual em anexo</strong>.</p>
  <p>Caso o usuário master não esteja visualizando o menu, solicitamos que nos informe para que possamos comunicar o time responsável e realizar a liberação necessária.</p>
  <p>Ademais, caso haja alteração no usuário master da empresa, a solicitação de atualização deve ser enviada para <strong>@Sqcadastro</strong>.</p>
  <p style="margin-top: 15px; font-size: 14px; color: #555;">⚠️ Informamos ainda que, em conformidade com nossas políticas de <strong>compliance</strong>, o envio dessas informações via e-mail é restrito.</p>
  <p>Atenciosamente,  
<strong>Equipe Oliveira Trust</strong></p>
</div>`;

const getPassivoTemplate = (masterUsers) => `
<div style="font-family: Arial, sans-serif; color: #333; border: 1px solid #d40404; border-radius: 10px; padding: 20px; max-width: 650px;">
  <h2 style="color: #d40404; border-bottom: 2px solid #d40404; padding-bottom: 5px;">📑 Solicitação de Relatório de Passivo</h2>
  <p>Boa tarde,</p>
  <p>Em cumprimento às diretrizes de <strong>compliance</strong>, informamos que a consulta de posição deve ser realizada diretamente no <strong>Portal da Oliveira Trust</strong>, disponível no link:</p>
  <p style="margin: 10px 0; text-align: center;"><a href="https://portalot.oliveiratrust.com.br/" target="_blank" style="background-color: #d40404; color: #fff; text-decoration: none; padding: 10px 15px; border-radius: 5px; font-weight: bold;">🔗 Acessar Portal OT</a></p>
  <p>O(s ) usuário(s) <strong>master</strong> cadastrado(s), com acesso ativo, é(são) o(s) responsável(is) por gerenciar e liberar acessos aos usuários filhos, conforme as permissões necessárias:</p>
  <div style="background: #fff5f5; border: 1px solid #d40404; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead><tr style="background-color: #d40404; color: #fff;"><th style="padding: 8px; text-align: left;">Nome</th><th style="padding: 8px; text-align: left;">E-mail</th><th style="padding: 8px; text-align: center;">Master</th></tr></thead>
      <tbody>
        ${masterUsers.length > 0 && masterUsers[0].name ? masterUsers.map(user => `<tr style="background-color: #fff;"><td style="padding: 8px;">${user.name}</td><td style="padding: 8px;">${user.email}</td><td style="padding: 8px; text-align: center;">✔️</td></tr>`).join('') : '<tr style="background-color: #fff;"><td colspan="3" style="padding: 8px; text-align: center;">Nenhum usuário master informado.</td></tr>'}
      </tbody>
    </table>
  </div>
  <p>Para apoio, segue em anexo o <strong>manual do portal</strong> para consulta e gerenciamento de permissões.</p>
  <p>Atenciosamente,  
<strong>Equipe Oliveira Trust</strong></p>
</div>`;


export default function Templates() {
  const [templateType, setTemplateType] = useState('extrato');
  const [formData, setFormData] = useState({ destinatario: '' });
  const [masterUsers, setMasterUsers] = useState([{ name: '', email: '' }]);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleAddUser = () => {
    setMasterUsers([...masterUsers, { name: '', email: '' }]);
  };

  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...masterUsers];
    updatedUsers[index][field] = value;
    setMasterUsers(updatedUsers);
  };

  const handleGenerate = () => {
    let html = '';
    if (templateType === 'extrato') {
      html = getExtratoTemplate(formData.destinatario, masterUsers[0].name, masterUsers[0].email);
    } else {
      html = getPassivoTemplate(masterUsers);
    }
    setGeneratedHtml(html);
    setIsCopied(false);
  };

  const handleCopyToClipboard = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });
    navigator.clipboard.write([clipboardItem]).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Falha ao copiar HTML: ', err);
      navigator.clipboard.writeText(generatedHtml).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerador de Emails Padrão</h1>
        <p className="text-gray-600">Crie respostas rápidas para solicitações comuns de clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna do Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>1. Preencha os Dados</CardTitle>
            <CardDescription>Selecione o template e informe os dados do cliente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-type">Tipo de Solicitação</Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger id="template-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="extrato">Consulta de Extratos de Ativos</SelectItem>
                  <SelectItem value="passivo">Solicitação de Relatório de Passivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {templateType === 'extrato' && (
              <div className="space-y-2">
                <Label htmlFor="destinatario">Nome do Destinatário (Ex: Fabiana)</Label>
                <Input id="destinatario" value={formData.destinatario} onChange={(e) => setFormData({ ...formData, destinatario: e.target.value })} />
              </div>
            )}

            <div className="space-y-3">
              <Label>Usuário(s) Master</Label>
              {masterUsers.map((user, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 p-2 border rounded-md">
                  <Input placeholder="Nome do usuário master" value={user.name} onChange={(e) => handleUserChange(index, 'name', e.target.value)} />
                  <Input placeholder="Email do usuário master" value={user.email} onChange={(e) => handleUserChange(index, 'email', e.target.value)} />
                </div>
              ))}
              {templateType === 'passivo' && (
                <Button variant="outline" size="sm" onClick={handleAddUser}><Users className="w-4 h-4 mr-2" />Adicionar Outro Master</Button>
              )}
            </div>
            
            <Button onClick={handleGenerate} className="w-full bg-[#D40404] hover:bg-[#B30303]">Gerar Email</Button>
          </CardContent>
        </Card>

        {/* Coluna da Visualização e Ações */}
        <Card>
          <CardHeader>
            <CardTitle>2. Visualize e Aja</CardTitle>
            <CardDescription>O email formatado aparecerá abaixo. Use os botões para copiar ou baixar o manual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full h-64 border rounded-md p-2 bg-gray-50 overflow-auto" dangerouslySetInnerHTML={{ __html: generatedHtml || '<p class="text-gray-400 text-center p-10">A pré-visualização do email aparecerá aqui...</p>' }} />
            
            {/* --- BOTÕES DE AÇÃO INTEGRADOS --- */}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleCopyToClipboard} disabled={!generatedHtml}>
                {isCopied ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {isCopied ? 'Copiado!' : 'Copiar Email'}
              </Button>

              <a 
                href="/Manual-Portal-Cadastro.pdf" 
                download="Manual-Portal-Cadastro.pdf"
                className={!generatedHtml ? 'pointer-events-none' : ''}
>
  <Button variant="outline" className="w-full" disabled={!generatedHtml} tabIndex={-1}>
    <Download className="w-4 h-4 mr-2" />
    Baixar Manual (PDF)
  </Button>
</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

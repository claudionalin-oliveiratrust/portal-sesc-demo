// src/components/DocumentosChecklist.jsx

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { 
  FileText, Upload, Download, Send, MessageSquare, History, Plus, CheckCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

// Componente para uma única versão de documento
function DocumentVersion({ version, onDownload }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
      <div className="flex items-center space-x-3">
        <Badge variant={version.status === 'atual' ? 'default' : 'secondary'}>v{version.version}</Badge>
        <span className="font-medium">{version.file}</span>
        <span className="text-sm text-gray-500">{version.uploadDate} por {version.uploadedBy}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onDownload(version.file)}>
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Componente para um único item do checklist integrado ao documento
function ChecklistItem({ item, document, onFileUpload, onAssign, onToggle, onAddMinute, onDownload }) {
  const [isExpanded, setIsExpanded] = useState(true); // Começa expandido por padrão
  const [newMinute, setNewMinute] = useState('');
  const hasDocuments = document && document.versions.length > 0;

  const triggerFileInput = () => {
    document.getElementById(`file-upload-${document.id}`).click();
  };

  const handleAddMinute = () => {
    if (newMinute.trim()) {
      onAddMinute(document.id, newMinute);
      setNewMinute('');
    }
  };

  return (
    <Card className={`transition-all duration-300 ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <input 
              type="checkbox" 
              checked={item.completed} 
              onChange={() => onToggle(item.id)} 
              className="mt-1 h-5 w-5 text-[#D40404] focus:ring-[#D40404] border-gray-300 rounded"
            />
            <div className="flex-1">
              <h4 className={`font-semibold text-lg ${item.completed ? 'text-green-800' : 'text-gray-900'}`}>
                {item.name}
              </h4>
              <p className="text-sm text-gray-600">{item.description}</p>
              {item.completed && (
                <p className="text-xs text-green-700 mt-1">
                  Concluído por {item.completedBy} em {item.completedDate}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {item.completed && <Badge className="bg-green-100 text-green-800">Concluído</Badge>}
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0 space-y-6">
          {/* Área de Upload e Versões */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium flex items-center"><History className="w-4 h-4 mr-2" />Versões do Documento</h5>
              <div className="flex items-center space-x-2">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  id={`file-upload-${document.id}`} 
                  className="hidden" 
                  onChange={(e) => onFileUpload(document.id, e)} 
                />
                <Button variant="outline" size="sm" onClick={triggerFileInput}>
                  <Upload className="w-4 h-4 mr-2" />
                  {hasDocuments ? 'Nova Versão' : 'Enviar Documento'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onAssign(document.id)} disabled={!hasDocuments}>
                  <Send className="w-4 h-4 mr-2" />
                  Atribuir
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {hasDocuments ? (
                document.versions.map(version => (
                  <DocumentVersion key={version.id} version={version} onDownload={onDownload} />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum documento enviado para este item.</p>
              )}
            </div>
          </div>

          {/* Área de Minutos e Observações */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-medium mb-3 flex items-center"><MessageSquare className="w-4 h-4 mr-2" />Minutos e Observações</h5>
            <div className="space-y-3 mb-4">
              {document.minutes.map(minute => (
                <div key={minute.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{minute.author}</span>
                    <span className="text-xs text-gray-500">{minute.date}</span>
                  </div>
                  <p className="text-gray-700">{minute.content}</p>
                </div>
              ))}
              {document.minutes.length === 0 && <p className="text-sm text-gray-500">Sem observações.</p>}
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Adicionar nova observação..." 
                value={newMinute} 
                onChange={(e) => setNewMinute(e.target.value)} 
              />
              <Button size="sm" onClick={handleAddMinute} disabled={!newMinute.trim()} className="bg-[#D40404] hover:bg-[#B30303]">
                <Plus className="w-4 h-4 mr-2" />Adicionar Observação
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Componente principal que junta tudo
export default function DocumentosChecklist({ documents, setDocuments, checklist, setChecklist, handleFileUpload, assignToLegal, toggleChecklistItem, addMinute, handleDownload }) {
  
  // Associa cada item do checklist ao seu documento correspondente
  const checklistWithDocuments = checklist.map(item => {
    // A associação é feita pelo 'documentId' no item do checklist
    const associatedDocument = documents.find(doc => doc.id === item.documentId);
    return { ...item, document: associatedDocument };
  });

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-gray-800" />
          <span>Checklist e Documentos da Operação</span>
        </CardTitle>
        <CardDescription>
          Acompanhe os itens obrigatórios e gerencie os documentos associados.
        </CardDescription>
        {/* Barra de Progresso Geral */}
        <div className="pt-4">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-900">Progresso: {completedCount} de {totalCount} itens concluídos</span>
                <span className="text-sm font-semibold text-blue-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {checklistWithDocuments.map(item => (
          item.document ? (
            <ChecklistItem 
              key={item.id}
              item={item}
              document={item.document}
              onFileUpload={handleFileUpload}
              onAssign={assignToLegal}
              onToggle={toggleChecklistItem}
              onAddMinute={(docId, content) => addMinute(docId, content)}
              onDownload={handleDownload}
            />
          ) : null // Não renderiza o item se o documento associado não for encontrado
        ))}
      </CardContent>
    </Card>
  );
}

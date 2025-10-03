import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { FileText, Calendar, Clock, Upload, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import PdfReader from './PdfReader.jsx'; // Importa o novo componente

// Componente para uma única tarefa
function LegalTask({ task, onUpdateDeadline, onUploadVersion }) {
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState(task.deadline || '');
  const fileInputRef = useState(null);

  const handleSetDeadline = () => {
    onUpdateDeadline(task.id, newDeadline);
    setIsEditingDeadline(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadVersion(task.documentId, file);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Em análise': return 'bg-blue-100 text-blue-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="task-card-grid">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#D40404] rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{task.operationName}</h3>
                <p className="text-sm text-gray-600">Documento: {task.documentName}</p>
                <p className="text-xs text-gray-500">Atribuído por: {task.assignedBy} em {new Date(task.assignedDate).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
          </div>
          <div className="flex flex-col items-start sm:items-end justify-between space-y-3">
            {isEditingDeadline ? (
              <div className="flex items-center gap-2">
                <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
                <Button size="sm" onClick={handleSetDeadline}>Salvar</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingDeadline(false)}>Cancelar</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4" />
                {task.deadline ? (
                  <span>Prazo: {new Date(task.deadline).toLocaleDateString()}</span>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingDeadline(true)}>
                    <Clock className="w-4 h-4 mr-2" />
                    Definir Prazo
                  </Button>
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Subir Versão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente principal do Jurídico
export default function Legal({ legalTasks, setLegalTasks, documents, setDocuments }) {
  const handleUpdateDeadline = (taskId, newDeadline) => {
    setLegalTasks(tasks => tasks.map(task => task.id === taskId ? { ...task, deadline: newDeadline, status: 'Em análise' } : task));
  };

  const handleUploadVersion = (documentId, file) => {
    setDocuments(docs => docs.map(doc => {
      if (doc.id === documentId) {
        const newVersionNumber = (Math.max(...doc.versions.map(v => parseFloat(v.version)), 0) + 0.1).toFixed(1);
        const newVersion = {
          id: Math.random(),
          version: newVersionNumber,
          file: file.name,
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: 'Jurídico',
          status: 'atual',
        };
        return { ...doc, versions: [...doc.versions, newVersion] };
      }
      return doc;
    }));
    setLegalTasks(tasks => tasks.map(task => task.documentId === documentId ? { ...task, status: 'Concluído' } : task));
    alert(`Nova versão do documento foi enviada para a operação.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Módulo Jurídico</h1>
        <p className="text-gray-600">Gerencie as tarefas e extraia dados de documentos.</p>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Painel de Tarefas</TabsTrigger>
          <TabsTrigger value="reader">Leitor de PDF</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4 mt-4">
          {legalTasks.map(task => (
            <LegalTask
              key={task.id}
              task={task}
              onUpdateDeadline={handleUpdateDeadline}
              onUploadVersion={handleUploadVersion}
            />
          ))}
        </TabsContent>

        <TabsContent value="reader" className="mt-4">
          <PdfReader />
        </TabsContent>
      </Tabs>
    </div>
  );
}

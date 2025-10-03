import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { FileText, Calendar, Clock, Upload, Eye, Search as SearchIcon } from 'lucide-react'; // Ícones adicionados
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import PdfReader from './PdfReader.jsx'; // Importamos o leitor de volta

// Componente para uma única tarefa
function LegalTask({ task, onUpdateDeadline, onUploadVersion, onViewDocument, onOpenInReader }) {
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState(task.deadline || '');
  const fileInputRef = useRef(null);

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
          <div className="flex flex-col items-start sm:items-end justify-between space-y-2">
            {/* --- BOTÃO 1: DOWNLOAD DIRETO --- */}
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              onClick={() => onViewDocument(task.fileName)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar Documento
            </Button>
            
            {/* --- BOTÃO 2: ABRIR NO LEITOR --- */}
            <Button 
              size="sm" 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenInReader(task)}
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              Analisar no Leitor
            </Button>

            {isEditingDeadline ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
                <Button size="sm" onClick={handleSetDeadline}>Salvar</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingDeadline(false)}>X</Button>
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
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => fileInputRef.current.click()}>
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
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState(null);

  // Função para o download direto
  const handleViewDocument = (fileName) => {
    if (!fileName) {
      alert("Erro: Esta tarefa não tem um arquivo associado.");
      return;
    }
    alert(`Iniciando o download de: ${fileName}`);
    const element = document.createElement("a");
    const fileContent = `Simulação de conteúdo para: ${fileName}`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Função para abrir no leitor
  const handleOpenInReader = (task) => {
    setSelectedTask(task);
    setActiveTab('reader');
  };

  // Função para obter a URL do arquivo para o leitor
  const getFileUrlForTask = (task) => {
    if (!task) return null;
    // Simulação com PDF de exemplo
    return task.fileName ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : null;
  };

  const handleUpdateDeadline = (taskId, newDeadline ) => {
    setLegalTasks(tasks => tasks.map(task => task.id === taskId ? { ...task, deadline: newDeadline, status: 'Em análise' } : task));
  };

  const handleUploadVersion = (documentId, file) => {
    // ... sua lógica de upload ...
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Módulo Jurídico</h1>
        <p className="text-gray-600">Gerencie as tarefas e extraia dados de documentos.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              onViewDocument={handleViewDocument} // Prop para download
              onOpenInReader={handleOpenInReader} // Prop para abrir no leitor
            />
          ))}
           {legalTasks.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Nenhuma tarefa jurídica encontrada.</h3>
                <p>As tarefas atribuídas ao jurídico aparecerão aqui.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reader" className="mt-4">
          <div style={{ height: '800px' }}>
            <PdfReader fileUrl={getFileUrlForTask(selectedTask)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

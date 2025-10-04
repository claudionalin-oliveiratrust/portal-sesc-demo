import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  DollarSign,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  MessageSquare,
  History,
  Send,
  Save,
  UserPlus,
} from "lucide-react";
import PendingTasks from "./PendingTasks.jsx";

const ANALYSTS_LIST = [
  { id: "Ana Silva", name: "Ana Silva" },
  { id: "Carlos Santos", name: "Carlos Santos" },
  { id: "Maria Oliveira", name: "Maria Oliveira" },
  { id: "João Pereira", name: "João Pereira" },
  { id: "Fernanda Costa", name: "Fernanda Costa" },
  { id: "A definir", name: "A definir" },
];

function StatusBadge({ status }) {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
  const statusClasses = {
    ativa: "bg-green-100 text-green-800",
    concluida: "bg-blue-100 text-blue-800",
    pendente: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

export default function OperationDetails({
  operations,
  setOperations,
  documents,
  setDocuments,
  legalTasks,
  setLegalTasks,
  addNotification,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const operation = operations.find((op) => op.id.toString() === id);
  const [editableData, setEditableData] = useState(operation);

  const [isAssigningAnalyst, setIsAssigningAnalyst] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(
    operation?.analyst || "A definir"
  );

  const [newMinute, setNewMinute] = useState({ documentId: null, content: "" });
  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      date: "2024-01-25",
      author: "Ana Silva",
      priority: "alta",
      content: "Aguardando assinatura do contrato pela emissora",
      status: "pendente",
    },
    {
      id: 2,
      date: "2024-01-20",
      author: "João Pereira",
      priority: "media",
      content: "Documentação compliance aprovada",
      status: "concluido",
    },
  ]);
  const [newFollowUp, setNewFollowUp] = useState({
    content: "",
    priority: "media",
  });
  const [checklist, setChecklist] = useState([
    {
      id: "cadastro_emissor",
      name: "Cadastro do Emissor",
      description:
        "Verificar se o cadastro do emissor está completo e atualizado",
      completed: true,
      completedBy: "Ana Silva",
      completedDate: "2024-01-15",
    },
    {
      id: "contrato_prestacao",
      name: "Contrato de Prestação de Serviço",
      description: "Confirmar assinatura e vigência do contrato",
      completed: false,
      completedBy: null,
      completedDate: null,
    },
    {
      id: "termo_emissao",
      name: "Termo de Emissão",
      description: "Validar todas as informações do termo de emissão",
      completed: true,
      completedBy: "João Pereira",
      completedDate: "2024-01-18",
    },
    {
      id: "boletim_subscricao",
      name: "Boletim de Subscrição (Facultativo)",
      description: "Se aplicável, verificar boletim de subscrição",
      completed: false,
      completedBy: null,
      completedDate: null,
    },
    {
      id: "comprovante_integralizacao",
      name: "Comprovante de Integralização",
      description: "Confirmar integralização dos recursos",
      completed: false,
      completedBy: null,
      completedDate: null,
    },
  ]);
  const [operationLog, setOperationLog] = useState([
    {
      id: 1,
      date: "2024-01-10",
      time: "09:30",
      user: "Ana Silva",
      action: "Operação criada",
      details: "Nova operação CDB Banco XYZ 2024 criada no sistema",
    },
    {
      id: 2,
      date: "2024-01-12",
      time: "14:15",
      user: "Fernanda Costa",
      action: "Documento adicionado",
      details: "Contrato de Prestação de Serviços v1.0 adicionado",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "10:45",
      user: "Ana Silva",
      action: "Checklist atualizado",
      details: 'Item "Cadastro do Emissor" marcado como concluído',
    },
  ]);
  const [assignModal, setAssignModal] = useState({
    open: false,
    documentId: null,
    documentName: "",
  });
  const [selectedLegalUser, setSelectedLegalUser] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const legalUsers = [
    {
      id: "fernanda.costa",
      name: "Fernanda Costa",
      email: "fernanda.costa@sesc.com.br",
    },
    {
      id: "ricardo.silva",
      name: "Ricardo Silva",
      email: "ricardo.silva@sesc.com.br",
    },
    {
      id: "patricia.santos",
      name: "Patrícia Santos",
      email: "patricia.santos@sesc.com.br",
    },
  ];

  useEffect(() => {
    setEditableData(operation);
    if (operation) {
      setSelectedAnalyst(operation.analyst || "A definir");
    }
  }, [operation]);

  useEffect(() => {
    if (operation && checklist.length > 0) {
      const completedItems = checklist.filter((item) => item.completed).length;
      const totalItems = checklist.length;
      const newProgress = Math.round((completedItems / totalItems) * 100);

      if (operation.progress !== newProgress) {
        const updatedOperation = { ...operation, progress: newProgress };
        setOperations((prevOps) =>
          prevOps.map((op) => (op.id.toString() === id ? updatedOperation : op))
        );
      }
    }
  }, [checklist, operation, setOperations, id]);

  const handleInputChange = (field, value) =>
    setEditableData((prev) => ({ ...prev, [field]: value }));

  const handleSaveChanges = () => {
    setOperations((prevOps) =>
      prevOps.map((op) => (op.id.toString() === id ? editableData : op))
    );
    setIsEditing(false);
    addNotification({
      type: "success",
      title: "Operação Salva",
      message: `As alterações na operação "${editableData.name}" foram salvas.`,
    });
  };

  const handleAssignAnalyst = () => {
    if (selectedAnalyst && selectedAnalyst !== "A definir") {
      const updatedOperation = { ...operation, analyst: selectedAnalyst };
      setOperations((prevOps) =>
        prevOps.map((op) => (op.id.toString() === id ? updatedOperation : op))
      );
      addNotification({
        type: "success",
        title: "Analista Atribuído",
        message: `A operação foi atribuída a ${selectedAnalyst}.`,
      });
      setIsAssigningAnalyst(false);
    } else {
      addNotification({
        type: "error",
        title: "Seleção Inválida",
        message: "Por favor, selecione um analista válido.",
      });
    }
  };

  const triggerFileInput = (documentId) =>
    document.getElementById(`file-upload-${documentId}`).click();

  const handleDownload = (fileName) => {
    const element = document.createElement("a");
    const file = new Blob(
      [`Conteúdo de simulação para o arquivo: ${fileName}`],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const handleFileUpload = (documentId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const docName =
      documents.find((d) => d.id === documentId)?.name || "Documento";
    setDocuments((prevDocuments) => {
      return prevDocuments.map((doc) => {
        if (doc.id === documentId) {
          const lastVersion =
            doc.versions.length > 0
              ? doc.versions[doc.versions.length - 1]
              : { version: "0.9" };
          const newVersionNumber = (
            parseFloat(lastVersion.version) + 0.1
          ).toFixed(1);
          const newVersion = {
            id: Date.now(),
            version: newVersionNumber,
            file: file.name,
            uploadDate: new Date().toISOString().split("T")[0],
            uploadedBy: "Claudio Nalin",
            status: "atual",
          };
          const updatedVersions = doc.versions.map((v) => ({
            ...v,
            status: "obsoleto",
          }));
          return { ...doc, versions: [...updatedVersions, newVersion] };
        }
        return doc;
      });
    });
    addNotification({
      type: "success",
      title: "Upload Concluído",
      message: `Nova versão de "${docName}" foi adicionada.`,
    });
  };
  const addMinute = (documentId) => {
    if (newMinute.content.trim()) {
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === documentId) {
          return {
            ...doc,
            minutes: [
              ...doc.minutes,
              {
                id: Date.now(),
                date: new Date().toISOString().split("T")[0],
                author: "Claudio Nalin",
                content: newMinute.content,
              },
            ],
          };
        }
        return doc;
      });
      setDocuments(updatedDocuments);
      setNewMinute({ documentId: null, content: "" });
    }
  };
  const addFollowUp = () => {
    if (newFollowUp.content.trim()) {
      const followUp = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        author: "Claudio Nalin",
        priority: newFollowUp.priority,
        content: newFollowUp.content,
        status: "pendente",
      };
      setFollowUps([followUp, ...followUps]);
      setNewFollowUp({ content: "", priority: "media" });
    }
  };
  const toggleFollowUpStatus = (followUpId) => {
    setFollowUps(
      followUps.map((fu) =>
        fu.id === followUpId
          ? {
              ...fu,
              status: fu.status === "pendente" ? "concluido" : "pendente",
            }
          : fu
      )
    );
  };
  const assignToLegal = (documentId) => {
    const document = documents.find((doc) => doc.id === documentId);
    if (!document || document.versions.length === 0) {
      addNotification({
        type: "error",
        title: "Ação Bloqueada",
        message:
          "Não é possível atribuir um documento sem versões. Por favor, suba uma versão primeiro.",
      });
      return;
    }
    setAssignModal({
      open: true,
      documentId: documentId,
      documentName: document.name,
    });
    setSelectedLegalUser("");
    setAssignmentNote("");
  };
  const toggleChecklistItem = (itemId) => {
    const updatedChecklist = checklist.map((item) => {
      if (item.id === itemId) {
        const isCompleting = !item.completed;
        const updatedItem = {
          ...item,
          completed: isCompleting,
          completedBy: isCompleting ? "Claudio Nalin" : null,
          completedDate: isCompleting
            ? new Date().toISOString().split("T")[0]
            : null,
        };
        const logEntry = {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          user: "Claudio Nalin",
          action: "Checklist atualizado",
          details: `Item "${item.name}" ${
            isCompleting ? "marcado como concluído" : "desmarcado"
          }`,
        };
        setOperationLog([logEntry, ...operationLog]);
        return updatedItem;
      }
      return item;
    });
    setChecklist(updatedChecklist);
  };
  const confirmAssignment = () => {
    if (selectedLegalUser && assignModal.documentId) {
      const selectedUser = legalUsers.find(
        (user) => user.id === selectedLegalUser
      );
      const document = documents.find(
        (doc) => doc.id === assignModal.documentId
      );
      const latestVersion = document.versions[document.versions.length - 1];
      const newTask = {
        id: Date.now(),
        operationId: parseInt(id),
        documentId: assignModal.documentId,
        operationName: operation.name,
        documentName: `${document.name} v${latestVersion.version}`,
        fileName: latestVersion.file,
        assignedBy: "Claudio Nalin",
        assignedDate: new Date().toISOString().split("T")[0],
        status: "Pendente",
        deadline: null,
      };
      setLegalTasks((prevTasks) => [newTask, ...prevTasks]);
      setAssignModal({ open: false, documentId: null, documentName: "" });
      addNotification({
        type: "success",
        title: "Documento Atribuído",
        message: `"${newTask.documentName}" foi atribuído para ${selectedUser.name}.`,
      });
    }
  };

  if (!operation) {
    return (
      <div className="text-center p-12">
        {" "}
        <h1 className="text-2xl font-bold">Operação não encontrada</h1>{" "}
        <p className="text-gray-600 mt-2">
          A operação com o ID "{id}" não existe ou não foi carregada.
        </p>{" "}
        <Button onClick={() => navigate("/operations")} className="mt-4">
          Voltar para Operações
        </Button>{" "}
      </div>
    );
  }

  const operationDocuments = documents.filter(
    (doc) => doc.operationId === parseInt(id)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/operations")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {operation.name}
            </h1>
            <p className="text-gray-600">
              {operation.type} - {operation.issuer}
            </p>
          </div>
        </div>
        <StatusBadge status={operation.status} />
      </div>

      <PendingTasks operation={operation} />

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Valor</p>
                <p className="font-semibold text-base">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(operation.value)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Analista</p>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-base">
                    {operation.analyst || "A definir"}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsAssigningAnalyst(true)}
                  >
                    <UserPlus className="w-4 h-4 text-gray-500 hover:text-gray-800" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Vencimento</p>
                <p className="font-semibold text-base">
                  {operation.maturity
                    ? new Date(operation.maturity).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })
                    : "A definir"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-gray-500">Progresso</p>
                <div className="flex items-center space-x-2">
                  <Progress value={operation.progress} className="w-20 h-2" />
                  <span className="font-semibold text-base">
                    {operation.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="followup">Follow-up</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="space-y-4">
          {operationDocuments.map((document) => (
            <Card key={document.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>{document.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      id={`file-upload-${document.id}`}
                      className="hidden"
                      onChange={(e) => handleFileUpload(document.id, e)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => triggerFileInput(document.id)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Nova Versão
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => assignToLegal(document.id)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Atribuir ao Jurídico
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    Versões
                  </h4>
                  <div className="space-y-2">
                    {document.versions.map((version) => (
                      <div
                        key={version.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={
                              version.status === "atual"
                                ? "default"
                                : "secondary"
                            }
                          >
                            v{version.version}
                          </Badge>
                          <span className="font-medium">{version.file}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(version.uploadDate).toLocaleDateString(
                              "pt-BR"
                            )}{" "}
                            por {version.uploadedBy}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(version.file)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {document.versions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center p-4">
                        Nenhuma versão foi enviada.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Minutos e Observações
                  </h4>
                  <div className="space-y-3">
                    {document.minutes.map((minute) => (
                      <div
                        key={minute.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {minute.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(minute.date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {minute.content}
                        </p>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Adicionar nova observação..."
                        value={
                          newMinute.documentId === document.id
                            ? newMinute.content
                            : ""
                        }
                        onChange={(e) =>
                          setNewMinute({
                            documentId: document.id,
                            content: e.target.value,
                          })
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => addMinute(document.id)}
                        disabled={
                          !newMinute.content.trim() ||
                          newMinute.documentId !== document.id
                        }
                        className="bg-[#D40404] hover:bg-[#B30303]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Observação
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="followup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Textarea
                    placeholder="Descreva o follow-up..."
                    value={newFollowUp.content}
                    onChange={(e) =>
                      setNewFollowUp({
                        ...newFollowUp,
                        content: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Select
                    value={newFollowUp.priority}
                    onValueChange={(value) =>
                      setNewFollowUp({ ...newFollowUp, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={addFollowUp}
                    disabled={!newFollowUp.content.trim()}
                    className="w-full bg-[#D40404] hover:bg-[#B30303]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {followUps.map((followUp) => (
              <Card key={followUp.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          variant={
                            followUp.priority === "alta"
                              ? "destructive"
                              : followUp.priority === "media"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {followUp.priority}
                        </Badge>
                        <Badge
                          variant={
                            followUp.status === "concluido"
                              ? "default"
                              : "outline"
                          }
                        >
                          {followUp.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(followUp.date).toLocaleDateString("pt-BR")}{" "}
                          - {followUp.author}
                        </span>
                      </div>
                      <p className="text-gray-700">{followUp.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFollowUpStatus(followUp.id)}
                    >
                      {followUp.status === "pendente" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Checklist da Operação</span>
              </CardTitle>
              <CardDescription>
                Itens obrigatórios para conclusão da operação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="mt-1 h-4 w-4 text-[#D40404] focus:ring-[#D40404] border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-medium ${
                          item.completed
                            ? "text-green-700 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </h4>
                      {item.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          Concluído
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                    {item.completed && (
                      <p className="text-xs text-green-600 mt-2">
                        Concluído por {item.completedBy} em{" "}
                        {item.completedDate
                          ? new Date(item.completedDate).toLocaleDateString(
                              "pt-BR"
                            )
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Progresso:{" "}
                    {checklist.filter((item) => item.completed).length} de{" "}
                    {checklist.length} itens concluídos
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (checklist.filter((item) => item.completed).length /
                            checklist.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>Log da Operação</span>
              </CardTitle>
              <CardDescription>
                Histórico completo de todas as ações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operationLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start space-x-4 p-4 border-l-4 border-[#D40404] bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#D40404] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {entry.action}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString("pt-BR")} às{" "}
                          {entry.time}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {entry.details}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Por: {entry.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Detalhes da Operação</h2>
              <p className="text-sm text-muted-foreground">
                Visualize e edite as informações da operação.
              </p>
            </div>
            {isEditing ? (
              <Button onClick={handleSaveChanges}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>

          {/* Seção 1: Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <Label>Nome da Operação</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">{operation.name}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.type}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">{operation.type}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Regime</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.regime}
                      onChange={(e) =>
                        handleInputChange("regime", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.regime || "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Analista Responsável</Label>
                  {isEditing ? (
                    <Select
                      value={editableData.analyst}
                      onValueChange={(value) =>
                        handleInputChange("analyst", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ANALYSTS_LIST.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold">
                      {operation.analyst || "A definir"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>ID da Proposta</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.idProposta}
                      onChange={(e) =>
                        handleInputChange("idProposta", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.idProposta || "Não informado"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2: Dados da Emissora */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Emissora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="space-y-1 md:col-span-2">
                  <Label>Nome da Emissora</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.issuer}
                      onChange={(e) =>
                        handleInputChange("issuer", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">{operation.issuer}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>CNPJ</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.cnpj}
                      onChange={(e) =>
                        handleInputChange("cnpj", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.cnpj || "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Endereço</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.issuerAddress}
                      onChange={(e) =>
                        handleInputChange("issuerAddress", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.issuerAddress || "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>CEP</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.issuerZipCode}
                      onChange={(e) =>
                        handleInputChange("issuerZipCode", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.issuerZipCode || "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1 md:col-span-3">
                  <Label>Atividade</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.issuerActivity}
                      onChange={(e) =>
                        handleInputChange("issuerActivity", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.issuerActivity || "Não informado"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 3: Valores e Datas */}
          <Card>
            <CardHeader>
              <CardTitle>Valores e Datas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <Label>Valor</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editableData.value}
                      onChange={(e) =>
                        handleInputChange("value", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(operation.value)}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Data de Vencimento</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editableData.maturity || ""}
                      onChange={(e) =>
                        handleInputChange("maturity", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.maturity
                        ? new Date(operation.maturity).toLocaleDateString(
                            "pt-BR",
                            { timeZone: "UTC" }
                          )
                        : "A definir"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Data de Emissão</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editableData.issueDate || ""}
                      onChange={(e) =>
                        handleInputChange("issueDate", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.issueDate
                        ? new Date(operation.issueDate).toLocaleDateString(
                            "pt-BR",
                            { timeZone: "UTC" }
                          )
                        : "Não definida"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 4: Detalhes do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <Label>Serviço Contratado</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.servico}
                      onChange={(e) =>
                        handleInputChange("servico", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.servico || "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>WGL</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.WGL}
                      onChange={(e) => handleInputChange("WGL", e.target.value)}
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.WGL || "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Agente Fiduciário O.T.</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.agenteFiduciarioOT}
                      onChange={(e) =>
                        handleInputChange("agenteFiduciarioOT", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.agenteFiduciarioOT || "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Remuneração</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editableData.remuneracao}
                      onChange={(e) =>
                        handleInputChange("remuneracao", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.remuneracao
                        ? new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(operation.remuneracao)
                        : "Não informado"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Periodicidade</Label>
                  {isEditing ? (
                    <Input
                      value={editableData.periodicidade}
                      onChange={(e) =>
                        handleInputChange("periodicidade", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-semibold">
                      {operation.periodicidade || "Não informado"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAssigningAnalyst && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Atribuir Analista</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAssigningAnalyst(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Operação</Label>
                <p className="text-lg font-semibold">{operation.name}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="analyst-select">Selecione o Analista *</Label>
                <Select
                  value={selectedAnalyst}
                  onValueChange={setSelectedAnalyst}
                >
                  <SelectTrigger id="analyst-select">
                    <SelectValue placeholder="Selecione um analista..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ANALYSTS_LIST.filter((a) => a.id !== "A definir").map(
                      (analyst) => (
                        <SelectItem key={analyst.id} value={analyst.id}>
                          {analyst.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsAssigningAnalyst(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAssignAnalyst}
                disabled={!selectedAnalyst || selectedAnalyst === "A definir"}
                className="bg-[#D40404] hover:bg-[#B30303]"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Atribuir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- CÓDIGO CORRIGIDO PARA O MODAL assignModal --- */}
      {assignModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Atribuir ao Jurídico</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAssignModal({
                    open: false,
                    documentId: null,
                    documentName: "",
                  })
                }
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Documento</Label>
                <p className="text-lg font-semibold">
                  {assignModal.documentName}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Atribuir para *</Label>
                <Select
                  value={selectedLegalUser}
                  onValueChange={setSelectedLegalUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário do jurídico" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Observação (opcional)</Label>
                <Textarea
                  placeholder="Adicione uma observação..."
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() =>
                  setAssignModal({
                    open: false,
                    documentId: null,
                    documentName: "",
                  })
                }
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmAssignment}
                disabled={!selectedLegalUser}
                className="bg-[#D40404] hover:bg-[#B30303]"
              >
                <Send className="w-4 h-4 mr-2" />
                Atribuir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

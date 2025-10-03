// src/components/PendingTasks.jsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { CheckCircle2, XCircle, Loader } from 'lucide-react';

const TaskItem = ({ title, description, isCompleted }) => {
  return (
    <div className="flex items-start space-x-4">
      <div>
        {isCompleted === null ? (
          <Loader className="w-5 h-5 text-gray-400 animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default function PendingTasks({ operation }) {
  if (operation.status !== 'pendente') {
    return null; // Não mostra nada se a operação não estiver pendente
  }

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-lg text-yellow-800">Pendências da Operação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaskItem
          title="Regularização do Cadastro da Emissora"
          description="Verificação automática do status do cadastro do emissor na API da OT."
          isCompleted={operation.cadastroRegularizado}
        />
        <TaskItem
          title="Definição do Analista Responsável"
          description="Um analista precisa ser atribuído manualmente a esta operação."
          isCompleted={operation.analyst !== 'A definir'}
        />
        <TaskItem
          title="Preenchimento de Dados Completos"
          description="Todos os campos da operação precisam ser preenchidos."
          isCompleted={false} // Lógica a ser implementada
        />
      </CardContent>
    </Card>
  );
}

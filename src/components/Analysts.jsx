import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { 
  User, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  Edit, 
  Trash2,
  UserPlus,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ANALYSTS = [
  { id: 1, name: 'Ana Silva', email: 'ana.silva@sesc.com.br', department: 'Renda Fixa', phone: '(11) 99999-1111', status: 'Ativo', operations: 12, initials: 'AS' },
  { id: 2, name: 'Carlos Santos', email: 'carlos.santos@sesc.com.br', department: 'Securitização', phone: '(11) 99999-2222', status: 'Ativo', operations: 8, initials: 'CS' },
  { id: 3, name: 'Maria Oliveira', email: 'maria.oliveira@sesc.com.br', department: 'Estruturação', phone: '(11) 99999-3333', status: 'Ativo', operations: 15, initials: 'MO' },
  { id: 4, name: 'João Pereira', email: 'joao.pereira@sesc.com.br', department: 'Compliance', phone: '(11) 99999-4444', status: 'Inativo', operations: 3, initials: 'JP' },
  { id: 5, name: 'Fernanda Costa', email: 'fernanda.costa@sesc.com.br', department: 'Jurídico', phone: '(11) 99999-5555', status: 'Ativo', operations: 7, initials: 'FC' }
]

const DEPARTMENTS = ['Renda Fixa', 'Securitização', 'Estruturação', 'Compliance', 'Jurídico', 'Comercial', 'Operações']

export default function Analysts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isNewAnalystOpen, setIsNewAnalystOpen] = useState(false)
  const [newAnalyst, setNewAnalyst] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    status: 'Ativo'
  })

  const filteredAnalysts = ANALYSTS.filter(analyst => {
    const matchesSearch = analyst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analyst.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analyst.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === 'all' || analyst.department === departmentFilter
    const matchesStatus = statusFilter === 'all' || analyst.status === statusFilter
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleNewAnalyst = () => {
    console.log('Novo analista:', newAnalyst)
    setIsNewAnalystOpen(false)
    setNewAnalyst({ name: '', email: '', department: '', phone: '', status: 'Ativo' })
  }

  const getStatusColor = (status) => {
    return status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getDepartmentColor = (department) => {
    const colors = {
      'Renda Fixa': 'bg-blue-100 text-blue-800',
      'Securitização': 'bg-purple-100 text-purple-800',
      'Estruturação': 'bg-orange-100 text-orange-800',
      'Compliance': 'bg-red-100 text-red-800',
      'Jurídico': 'bg-green-100 text-green-800',
      'Comercial': 'bg-yellow-100 text-yellow-800',
      'Operações': 'bg-indigo-100 text-indigo-800'
    }
    return colors[department] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analistas</h1>
          <p className="text-gray-600">Gerencie a equipe de analistas do sistema</p>
        </div>
        
        <Dialog open={isNewAnalystOpen} onOpenChange={setIsNewAnalystOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D40404] hover:bg-[#B30303]">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Analista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Analista</DialogTitle>
              <DialogDescription>Preencha as informações do novo analista</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Nome Completo</Label><Input id="name" value={newAnalyst.name} onChange={(e) => setNewAnalyst(prev => ({ ...prev, name: e.target.value }))} placeholder="Ex: João Silva" /></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={newAnalyst.email} onChange={(e) => setNewAnalyst(prev => ({ ...prev, email: e.target.value }))} placeholder="joao.silva@sesc.com.br" /></div>
              <div className="space-y-2"><Label htmlFor="phone">Telefone</Label><Input id="phone" value={newAnalyst.phone} onChange={(e) => setNewAnalyst(prev => ({ ...prev, phone: e.target.value }))} placeholder="(11) 99999-9999" /></div>
              <div className="space-y-2"><Label>Departamento</Label><Select value={newAnalyst.department} onValueChange={(value) => setNewAnalyst(prev => ({ ...prev, department: value }))}><SelectTrigger><SelectValue placeholder="Selecione o departamento" /></SelectTrigger><SelectContent>{DEPARTMENTS.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent></Select></div>
              <div className="flex justify-end space-x-2 pt-4"><Button variant="outline" onClick={() => setIsNewAnalystOpen(false)}>Cancelar</Button><Button onClick={handleNewAnalyst} className="bg-[#D40404] hover:bg-[#B30303]">Adicionar Analista</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="filters-grid">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar analistas por nome, email ou departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Todos os departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {DEPARTMENTS.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="stats-grid">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total de Analistas</p><p className="text-2xl font-bold text-gray-900">{ANALYSTS.length}</p></div><User className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Analistas Ativos</p><p className="text-2xl font-bold text-gray-900">{ANALYSTS.filter(a => a.status === 'Ativo').length}</p></div><User className="w-8 h-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Departamentos</p><p className="text-2xl font-bold text-gray-900">{new Set(ANALYSTS.map(a => a.department)).size}</p></div><Building2 className="w-8 h-8 text-purple-600" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Operações Ativas</p><p className="text-2xl font-bold text-gray-900">{ANALYSTS.reduce((sum, a) => sum + a.operations, 0)}</p></div><Building2 className="w-8 h-8 text-orange-600" /></div></CardContent></Card>
      </div>

      {/* Analysts Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Analista</TableHead>
                <TableHead className="hidden md:table-cell">Departamento</TableHead>
                <TableHead className="hidden md:table-cell">Operações</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnalysts.length > 0 ? (
                filteredAnalysts.map(analyst => (
                  <TableRow key={analyst.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#D40404] text-white">{analyst.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{analyst.name}</div>
                          <div className="text-sm text-muted-foreground hidden md:inline">{analyst.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={getDepartmentColor(analyst.department)}>{analyst.department}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium">{analyst.operations}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(analyst.status)}>{analyst.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Deletar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum analista encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

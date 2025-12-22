import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  Users,
  Layers,
  Tag,
  Target,
  Grid3X3,
  Palette,
  Edit,
  Trash2,
} from 'lucide-react';

interface ConfigItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order_index?: number;
  is_active: boolean;
}

const defaultPipelineStages: ConfigItem[] = [
  { id: '1', name: 'Lead', color: '#6B7280', order_index: 1, is_active: true },
  { id: '2', name: 'Qualificado', color: '#3B82F6', order_index: 2, is_active: true },
  { id: '3', name: 'Proposta', color: '#EAB308', order_index: 3, is_active: true },
  { id: '4', name: 'Negociacao', color: '#F97316', order_index: 4, is_active: true },
  { id: '5', name: 'Ganho', color: '#22C55E', order_index: 5, is_active: true },
  { id: '6', name: 'Perdido', color: '#EF4444', order_index: 6, is_active: true },
];

const defaultAccountCategories: ConfigItem[] = [
  { id: '1', name: 'A', description: 'Contas de alta prioridade', is_active: true },
  { id: '2', name: 'B', description: 'Contas de media prioridade', is_active: true },
  { id: '3', name: 'C', description: 'Contas de baixa prioridade', is_active: true },
  { id: '4', name: 'Estrategica', description: 'Contas estrategicas', is_active: true },
];

const defaultValueZones: ConfigItem[] = [
  { id: '1', name: 'Imbativel', color: '#22C55E', description: 'Importancia >= 4 e Desempenho >= 4', is_active: true },
  { id: '2', name: 'Competitivo', color: '#3B82F6', description: 'Importancia >= 3 e Desempenho >= 3', is_active: true },
  { id: '3', name: 'Vulneravel', color: '#EF4444', description: 'Importancia >= 4 e Desempenho <= 2', is_active: true },
  { id: '4', name: 'Irrelevante', color: '#6B7280', description: 'Importancia <= 2', is_active: true },
];

const defaultActivityTypes: ConfigItem[] = [
  { id: '1', name: 'Ligacao', is_active: true },
  { id: '2', name: 'Reuniao', is_active: true },
  { id: '3', name: 'E-mail', is_active: true },
  { id: '4', name: 'Tarefa', is_active: true },
  { id: '5', name: 'Visita', is_active: true },
];

export const Admin: React.FC = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(section || 'users');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administracao</h1>
        <p className="text-muted-foreground">
          Configure o sistema de acordo com as necessidades da sua empresa
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:w-auto lg:grid-cols-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Categorias</span>
          </TabsTrigger>
          <TabsTrigger value="value-zones" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Zonas de Valor</span>
          </TabsTrigger>
          <TabsTrigger value="prioritization" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Priorizacao</span>
          </TabsTrigger>
          <TabsTrigger value="activity-types" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Atividades</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UsersSection />
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <ConfigSection
            title="Etapas do Pipeline"
            description="Configure as etapas do funil de vendas"
            items={defaultPipelineStages}
            showColor
            showOrder
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <ConfigSection
            title="Categorias de Conta"
            description="Configure as categorias para classificacao de contas (A/B/C, Estrategica, etc.)"
            items={defaultAccountCategories}
            showDescription
          />
        </TabsContent>

        <TabsContent value="value-zones" className="mt-6">
          <ConfigSection
            title="Zonas de Valor"
            description="Configure os tipos de zona de valor (Imbativel, Vulneravel, etc.) com suas regras de calculo"
            items={defaultValueZones}
            showColor
            showDescription
          />
        </TabsContent>

        <TabsContent value="prioritization" className="mt-6">
          <PrioritizationSection />
        </TabsContent>

        <TabsContent value="activity-types" className="mt-6">
          <ConfigSection
            title="Tipos de Atividade"
            description="Configure os tipos de atividade disponiveis no sistema"
            items={defaultActivityTypes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UsersSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const users = [
    { id: '1', name: 'Admin', email: 'admin@empresa.com', role: 'admin', is_active: true },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Gerencie os usuarios do sistema</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Usuario</DialogTitle>
              <DialogDescription>Adicione um novo usuario ao sistema</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome completo" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="email@empresa.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Perfil</Label>
                <Input id="role" placeholder="admin, kam, gestor" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={user.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface ConfigSectionProps {
  title: string;
  description: string;
  items: ConfigItem[];
  showColor?: boolean;
  showDescription?: boolean;
  showOrder?: boolean;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({
  title,
  description,
  items,
  showColor = false,
  showDescription = false,
  showOrder = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Item</DialogTitle>
              <DialogDescription>Adicione um novo item a configuracao</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome do item" />
              </div>
              {showDescription && (
                <div className="grid gap-2">
                  <Label htmlFor="description">Descricao</Label>
                  <Input id="description" placeholder="Descricao do item" />
                </div>
              )}
              {showColor && (
                <div className="grid gap-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input id="color" type="color" />
                </div>
              )}
              {showOrder && (
                <div className="grid gap-2">
                  <Label htmlFor="order">Ordem</Label>
                  <Input id="order" type="number" placeholder="1" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {showOrder && <TableHead className="w-16">Ordem</TableHead>}
              {showColor && <TableHead className="w-16">Cor</TableHead>}
              <TableHead>Nome</TableHead>
              {showDescription && <TableHead>Descricao</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {showOrder && <TableCell>{item.order_index}</TableCell>}
                {showColor && (
                  <TableCell>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">{item.name}</TableCell>
                {showDescription && (
                  <TableCell className="text-muted-foreground">
                    {item.description || '-'}
                  </TableCell>
                )}
                <TableCell>
                  <Badge className={item.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                    {item.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const PrioritizationSection: React.FC = () => {
  const criteria = [
    { id: '1', name: 'Potencial de Receita', weight: 25, is_active: true },
    { id: '2', name: 'Alinhamento Estrategico', weight: 20, is_active: true },
    { id: '3', name: 'Complexidade de Relacionamento', weight: 15, is_active: true },
    { id: '4', name: 'Engajamento Atual', weight: 15, is_active: true },
    { id: '5', name: 'Oportunidade de Expansao', weight: 15, is_active: true },
    { id: '6', name: 'Patrocinio Executivo', weight: 10, is_active: true },
  ];

  const thresholds = {
    a_min: 80,
    b_min: 50,
    c_min: 0,
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Criterios de Priorizacao</CardTitle>
            <CardDescription>
              Configure os criterios e pesos para a Matriz de Priorizacao
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Criterio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Criterio</DialogTitle>
                <DialogDescription>
                  Adicione um novo criterio de priorizacao
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Nome do criterio" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">Peso (%)</Label>
                  <Input id="weight" type="number" placeholder="10" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterio</TableHead>
                <TableHead>Peso (%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.weight}%</TableCell>
                  <TableCell>
                    <Badge className={item.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                      {item.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Faixas de Classificacao ABC</CardTitle>
          <CardDescription>
            Configure as faixas de score para classificacao automatica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Categoria A (minimo)</Label>
              <Input type="number" value={thresholds.a_min} />
              <p className="text-xs text-muted-foreground">Score {'>='} {thresholds.a_min}</p>
            </div>
            <div className="space-y-2">
              <Label>Categoria B (minimo)</Label>
              <Input type="number" value={thresholds.b_min} />
              <p className="text-xs text-muted-foreground">
                Score {'>='} {thresholds.b_min} e {'<'} {thresholds.a_min}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Categoria C</Label>
              <Input type="number" value={thresholds.c_min} disabled />
              <p className="text-xs text-muted-foreground">Score &lt; {thresholds.b_min}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button>Salvar Configuracoes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

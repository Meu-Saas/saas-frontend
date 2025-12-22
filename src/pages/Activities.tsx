import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
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
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus, Search, Calendar, Clock, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  type_id: string;
  type_name?: string;
  account_id: string;
  account_name?: string;
  opportunity_id: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

const activityTypes = [
  { id: '1', name: 'Ligacao', icon: '📞' },
  { id: '2', name: 'Reuniao', icon: '👥' },
  { id: '3', name: 'E-mail', icon: '📧' },
  { id: '4', name: 'Tarefa', icon: '📋' },
  { id: '5', name: 'Visita', icon: '🏢' },
];

export const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(false);
      setActivities([]);
    } catch (error) {
      console.error('Error loading activities:', error);
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.account_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || activity.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const todayActivities = filteredActivities.filter((a) => {
    const today = new Date().toISOString().split('T')[0];
    return a.scheduled_date === today && a.status === 'pending';
  });

  const overdueActivities = filteredActivities.filter((a) => {
    const today = new Date().toISOString().split('T')[0];
    return a.scheduled_date < today && a.status === 'pending';
  });

  const upcomingActivities = filteredActivities.filter((a) => {
    const today = new Date().toISOString().split('T')[0];
    return a.scheduled_date > today && a.status === 'pending';
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atividades</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas e compromissos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Atividade</DialogTitle>
              <DialogDescription>
                Adicione uma nova atividade ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titulo</Label>
                <Input id="title" placeholder="Titulo da atividade" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descricao</Label>
                <Input id="description" placeholder="Descricao da atividade" />
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
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayActivities.length}</div>
            <p className="text-xs text-muted-foreground">atividades para hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {overdueActivities.length}
            </div>
            <p className="text-xs text-muted-foreground">atividades atrasadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proximas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingActivities.length}</div>
            <p className="text-xs text-muted-foreground">atividades futuras</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar atividades..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="completed">Concluidas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">
            Hoje ({todayActivities.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-red-500">
            Atrasadas ({overdueActivities.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Proximas ({upcomingActivities.length})
          </TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          <ActivityList
            activities={todayActivities}
            emptyMessage="Nenhuma atividade para hoje"
            onAddClick={() => setIsDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="overdue" className="mt-4">
          <ActivityList
            activities={overdueActivities}
            emptyMessage="Nenhuma atividade atrasada"
            onAddClick={() => setIsDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <ActivityList
            activities={upcomingActivities}
            emptyMessage="Nenhuma atividade futura"
            onAddClick={() => setIsDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <ActivityList
            activities={filteredActivities}
            emptyMessage="Nenhuma atividade encontrada"
            onAddClick={() => setIsDialogOpen(true)}
            showStatus
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ActivityListProps {
  activities: Activity[];
  emptyMessage: string;
  onAddClick: () => void;
  showStatus?: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  emptyMessage,
  onAddClick,
  showStatus = false,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluida</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>{emptyMessage}</p>
          <Button variant="outline" className="mt-4" onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Atividade
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atividade</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Data/Hora</TableHead>
              {showStatus && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type_name || 'Tarefa'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {activity.account_name || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(activity.scheduled_date).toLocaleDateString('pt-BR')}
                    {activity.scheduled_time && (
                      <span className="text-muted-foreground">
                        {activity.scheduled_time}
                      </span>
                    )}
                  </div>
                </TableCell>
                {showStatus && <TableCell>{getStatusBadge(activity.status)}</TableCell>}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="h-4 w-4" />
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

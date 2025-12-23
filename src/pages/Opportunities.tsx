import React, { useEffect, useState } from 'react';
import { opportunitiesAPI, adminAPI, accountsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
import { Plus, Search, DollarSign, Calendar, Building2 } from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  description: string | null;
  value: number | null;
  stage_id: number | null;
  stage_name?: string;
  stage_color?: string;
  account_id: number;
  account_name?: string;
  expected_close_date: string | null;
  probability: number;
  created_at: string;
}

interface PipelineStage {
  id: number;
  name: string;
  color: string;
  sort_order: number;
}

interface Account {
  id: number;
  name: string;
}

interface KanbanColumn {
  stage: PipelineStage;
  opportunities: Opportunity[];
  total_value: number;
  count: number;
}

interface KanbanBoard {
  columns: KanbanColumn[];
  total_value: number;
  total_count: number;
}

export const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [kanbanBoard, setKanbanBoard] = useState<KanbanBoard | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    expected_close_date: '',
    description: '',
    account_id: '',
    stage_id: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [kanbanData, stagesData, accountsData] = await Promise.all([
        opportunitiesAPI.getKanban(),
        adminAPI.getPipelineStages(),
        accountsAPI.getAll(),
      ]);
      setKanbanBoard(kanbanData);
      setStages(stagesData);
      setAccounts(accountsData as unknown as Account[]);
      
      const allOpps: Opportunity[] = [];
      kanbanData.columns?.forEach((col: KanbanColumn) => {
        allOpps.push(...col.opportunities);
      });
      setOpportunities(allOpps);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpportunity = async () => {
    if (!formData.title || !formData.account_id) return;
    
    setSaving(true);
    try {
      await opportunitiesAPI.create({
        title: formData.title,
        account_id: parseInt(formData.account_id),
        value: formData.value ? parseFloat(formData.value) : undefined,
        expected_close_date: formData.expected_close_date || undefined,
        description: formData.description || undefined,
        stage_id: formData.stage_id ? parseInt(formData.stage_id) : undefined,
      } as any);
      setIsDialogOpen(false);
      setFormData({ title: '', value: '', expected_close_date: '', description: '', account_id: '', stage_id: '' });
      loadData();
    } catch (error) {
      console.error('Error creating opportunity:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredOpportunities = opportunities.filter(
    (opp) =>
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.account_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalPipelineValue = kanbanBoard?.total_value || opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);

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
          <h1 className="text-2xl font-bold tracking-tight">Oportunidades</h1>
          <p className="text-muted-foreground">
            Pipeline total: {formatCurrency(totalPipelineValue)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Oportunidade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Oportunidade</DialogTitle>
                <DialogDescription>
                  Adicione uma nova oportunidade ao pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titulo *</Label>
                  <Input 
                    id="title" 
                    placeholder="Titulo da oportunidade" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account">Conta *</Label>
                  <Select value={formData.account_id} onValueChange={(value) => setFormData({ ...formData, account_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={String(account.id)}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stage">Etapa</Label>
                  <Select value={formData.stage_id} onValueChange={(value) => setFormData({ ...formData, stage_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={String(stage.id)}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Valor</Label>
                  <Input 
                    id="value" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="close_date">Data Prevista de Fechamento</Label>
                  <Input 
                    id="close_date" 
                    type="date" 
                    value={formData.expected_close_date}
                    onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descricao</Label>
                  <Input 
                    id="description" 
                    placeholder="Descricao da oportunidade" 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateOpportunity} disabled={saving || !formData.title || !formData.account_id}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar oportunidades..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'kanban' | 'list')}>
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanBoard?.columns?.map((column) => (
              <div key={column.stage.id} className="flex-shrink-0 w-72">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: column.stage.color || '#6B7280' }}
                        />
                        <CardTitle className="text-sm font-medium">
                          {column.stage.name}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {column.count}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {formatCurrency(column.total_value)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {column.opportunities.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Nenhuma oportunidade
                      </div>
                    ) : (
                      column.opportunities.map((opp) => (
                        <Card
                          key={opp.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm mb-1">{opp.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Building2 className="h-3 w-3" />
                              {opp.account_name || 'Sem conta'}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {formatCurrency(opp.value)}
                              </span>
                              {opp.expected_close_date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(opp.expected_close_date).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma oportunidade encontrada</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeira Oportunidade
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data Prevista</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpportunities.map((opp) => (
                      <TableRow key={opp.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{opp.title}</TableCell>
                        <TableCell>{opp.account_name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{opp.stage_name || '-'}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(opp.value)}</TableCell>
                        <TableCell>
                          {opp.expected_close_date
                            ? new Date(opp.expected_close_date).toLocaleDateString('pt-BR')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

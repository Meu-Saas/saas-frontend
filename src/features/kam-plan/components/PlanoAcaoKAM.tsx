import React, { useState, useEffect } from 'react';
import { kamPlanAPI } from '../../../services/api';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Plus, Edit, Target, CheckCircle2, Clock, X } from 'lucide-react';
import type { KAMAction } from '../types';

interface PlanoAcaoKAMProps {
  accountId: string;
}

export const PlanoAcaoKAM: React.FC<PlanoAcaoKAMProps> = ({ accountId }) => {
  const [actions, setActions] = useState<KAMAction[]>([]);
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newAction, setNewAction] = useState<Partial<KAMAction>>({
    strategic_objective: '',
    action: '',
    action_type: 'meeting',
    responsible: '',
    planned_start_date: '',
    planned_end_date: '',
    status: 'planned',
    result: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const actionTypes = [
    { value: 'meeting', label: 'Reuniao C-level' },
    { value: 'poc', label: 'POC' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'qbr', label: 'QBR' },
    { value: 'presentation', label: 'Apresentacao' },
    { value: 'visit', label: 'Visita' },
    { value: 'other', label: 'Outro' },
  ];

  useEffect(() => {
    loadActions();
  }, [accountId]);

  const loadActions = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await kamPlanAPI.getActions(accountId);
      if (Array.isArray(data)) {
        setActions(data.map((a: { id: number; strategic_objective?: string; action: string; action_type?: string; main_stakeholder_id?: number | null; main_stakeholder_name?: string | null; responsible?: string; planned_start_date?: string; planned_end_date?: string; status?: string; result?: string }) => ({
          id: String(a.id),
          strategic_objective: a.strategic_objective || '',
          action: a.action || '',
          action_type: a.action_type || 'meeting',
          main_stakeholder_id: a.main_stakeholder_id || null,
          main_stakeholder_name: a.main_stakeholder_name || null,
          responsible: a.responsible || '',
          planned_start_date: a.planned_start_date || '',
          planned_end_date: a.planned_end_date || '',
          status: (a.status || 'planned') as 'planned' | 'in_progress' | 'completed' | 'cancelled',
          result: a.result || '',
        })));
      }
    } catch (error) {
      console.error('Error loading actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAction = async () => {
    if (!newAction.action || !accountId) return;
    setSaving(true);
    try {
      const created = await kamPlanAPI.createAction(accountId, {
        strategic_objective: newAction.strategic_objective || '',
        action: newAction.action,
        action_type: newAction.action_type || 'meeting',
        responsible: newAction.responsible || '',
        planned_start_date: newAction.planned_start_date || undefined,
        planned_end_date: newAction.planned_end_date || undefined,
        status: newAction.status || 'planned',
      });
      const action: KAMAction = {
        id: String(created.id),
        strategic_objective: created.strategic_objective || '',
        action: created.action || '',
        action_type: created.action_type || 'meeting',
        main_stakeholder_id: created.main_stakeholder_id || null,
        main_stakeholder_name: created.main_stakeholder_name || null,
        responsible: created.responsible || '',
        planned_start_date: created.planned_start_date || '',
        planned_end_date: created.planned_end_date || '',
        status: (created.status || 'planned') as 'planned' | 'in_progress' | 'completed' | 'cancelled',
        result: created.result || '',
      };
      setActions([...actions, action]);
      setNewAction({
        strategic_objective: '',
        action: '',
        action_type: 'meeting',
        responsible: '',
        planned_start_date: '',
        planned_end_date: '',
        status: 'planned',
        result: '',
      });
      setIsAddingAction(false);
    } catch (error) {
      console.error('Error creating action:', error);
      alert('Erro ao adicionar acao. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAction = async (id: string) => {
    if (!accountId) return;
    setSaving(true);
    try {
      await kamPlanAPI.deleteAction(accountId, Number(id));
      setActions(actions.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting action:', error);
      alert('Erro ao remover acao. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando acoes...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluida';
      case 'in_progress': return 'Em Execucao';
      case 'cancelled': return 'Cancelada';
      default: return 'Planejada';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gerencie as acoes estrategicas do plano KAM.
        </p>
        <Button onClick={() => setIsAddingAction(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Acao KAM
        </Button>
      </div>

      {actions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma acao cadastrada</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Objetivo</TableHead>
              <TableHead>Acao</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Responsavel</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="max-w-[150px] truncate">{action.strategic_objective}</TableCell>
                <TableCell className="font-medium">{action.action}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {actionTypes.find(t => t.value === action.action_type)?.label || action.action_type}
                  </Badge>
                </TableCell>
                <TableCell>{action.responsible}</TableCell>
                <TableCell>
                  {action.planned_start_date ? new Date(action.planned_start_date).toLocaleDateString('pt-BR') : '-'}
                </TableCell>
                <TableCell>
                  {action.planned_end_date ? new Date(action.planned_end_date).toLocaleDateString('pt-BR') : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(action.status)}
                    <span className="text-sm">{getStatusLabel(action.status)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isAddingAction} onOpenChange={setIsAddingAction}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Acao KAM</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Objetivo Estrategico</Label>
              <Input
                value={newAction.strategic_objective}
                onChange={(e) => setNewAction({ ...newAction, strategic_objective: e.target.value })}
                placeholder="Qual o objetivo desta acao?"
              />
            </div>
            <div className="space-y-2">
              <Label>Acao</Label>
              <Textarea
                value={newAction.action}
                onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                placeholder="Descreva a acao..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Acao</Label>
                <Select
                  value={newAction.action_type}
                  onValueChange={(value) => setNewAction({ ...newAction, action_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Responsavel</Label>
                <Input
                  value={newAction.responsible}
                  onChange={(e) => setNewAction({ ...newAction, responsible: e.target.value })}
                  placeholder="Nome do responsavel"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Inicio</Label>
                <Input
                  type="date"
                  value={newAction.planned_start_date}
                  onChange={(e) => setNewAction({ ...newAction, planned_start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={newAction.planned_end_date}
                  onChange={(e) => setNewAction({ ...newAction, planned_end_date: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAction(false)}>Cancelar</Button>
            <Button onClick={handleAddAction}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

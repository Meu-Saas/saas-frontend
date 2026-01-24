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
import { Slider } from '../../../components/ui/slider';
import { Plus, Edit, Users } from 'lucide-react';
import type { Stakeholder } from '../types';

interface MapaStakeholdersProps {
  accountId: string;
}

export const MapaStakeholders: React.FC<MapaStakeholdersProps> = ({ accountId }) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [isAddingStakeholder, setIsAddingStakeholder] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({
    contact_name: '',
    role: '',
    area: '',
    power_level: 3,
    support_level: 'neutral',
    relationship_level: 'neutral',
    objective: '',
    engagement_strategy: '',
    show_in_orgchart: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStakeholders();
  }, [accountId]);

  const loadStakeholders = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await kamPlanAPI.getStakeholders(accountId);
      if (Array.isArray(data)) {
        setStakeholders(data.map((s: { id: number; contact_name: string; role?: string; area?: string; power_level?: number; support_level?: string; relationship_level?: string; objective?: string; engagement_strategy?: string; show_in_orgchart?: boolean; superior_id?: number | null }) => ({
          id: String(s.id),
          contact_id: '',
          contact_name: s.contact_name || '',
          role: s.role || '',
          area: s.area || '',
          power_level: s.power_level || 3,
          support_level: (s.support_level || 'neutral') as 'supporter' | 'neutral' | 'opponent',
          relationship_level: (s.relationship_level || 'neutral') as 'cold' | 'neutral' | 'good' | 'sponsor',
          objective: s.objective || '',
          engagement_strategy: s.engagement_strategy || '',
          show_in_orgchart: s.show_in_orgchart ?? true,
          superior_id: s.superior_id || null,
        })));
      }
    } catch (error) {
      console.error('Error loading stakeholders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStakeholder = async () => {
    if (!newStakeholder.contact_name || !accountId) return;
    setSaving(true);
    try {
      const created = await kamPlanAPI.createStakeholder(accountId, {
        contact_name: newStakeholder.contact_name,
        role: newStakeholder.role || '',
        area: newStakeholder.area || '',
        power_level: newStakeholder.power_level || 3,
        support_level: newStakeholder.support_level || 'neutral',
        relationship_level: newStakeholder.relationship_level || 'neutral',
        objective: newStakeholder.objective || '',
        engagement_strategy: newStakeholder.engagement_strategy || '',
        show_in_orgchart: newStakeholder.show_in_orgchart ?? true,
      });
      const stakeholder: Stakeholder = {
        id: String(created.id),
        contact_id: '',
        contact_name: created.contact_name || '',
        role: created.role || '',
        area: created.area || '',
        power_level: created.power_level || 3,
        support_level: (created.support_level || 'neutral') as 'supporter' | 'neutral' | 'opponent',
        relationship_level: (created.relationship_level || 'neutral') as 'cold' | 'neutral' | 'good' | 'sponsor',
        objective: created.objective || '',
        engagement_strategy: created.engagement_strategy || '',
        show_in_orgchart: created.show_in_orgchart ?? true,
        superior_id: null,
      };
      setStakeholders([...stakeholders, stakeholder]);
      setNewStakeholder({
        contact_name: '',
        role: '',
        area: '',
        power_level: 3,
        support_level: 'neutral',
        relationship_level: 'neutral',
        objective: '',
        engagement_strategy: '',
        show_in_orgchart: true,
      });
      setIsAddingStakeholder(false);
    } catch (error) {
      console.error('Error creating stakeholder:', error);
      alert('Erro ao adicionar stakeholder. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStakeholder = async (id: string) => {
    if (!accountId) return;
    setSaving(true);
    try {
      await kamPlanAPI.deleteStakeholder(accountId, Number(id));
      setStakeholders(stakeholders.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
      alert('Erro ao remover stakeholder. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando stakeholders...</div>
      </div>
    );
  }

  const getSupportColor = (support: string) => {
    switch (support) {
      case 'supporter': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'opponent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'sponsor': return 'bg-purple-100 text-purple-800';
      case 'good': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mapeie os stakeholders com nivel de poder, apoio e relacionamento.
        </p>
        <Button onClick={() => setIsAddingStakeholder(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Stakeholder
        </Button>
      </div>

      {stakeholders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum stakeholder mapeado</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Poder</TableHead>
              <TableHead>Apoio</TableHead>
              <TableHead>Relacionamento</TableHead>
              <TableHead>Objetivo</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakeholders.map((stakeholder) => (
              <TableRow key={stakeholder.id}>
                <TableCell className="font-medium">{stakeholder.contact_name}</TableCell>
                <TableCell>{stakeholder.role}</TableCell>
                <TableCell>{stakeholder.area}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`w-2 h-2 rounded-full ${n <= stakeholder.power_level ? 'bg-primary' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getSupportColor(stakeholder.support_level)}>
                    {stakeholder.support_level === 'supporter' ? 'Apoiador' :
                     stakeholder.support_level === 'neutral' ? 'Neutro' : 'Opositor'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getRelationshipColor(stakeholder.relationship_level)}>
                    {stakeholder.relationship_level === 'sponsor' ? 'Patrocinador' :
                     stakeholder.relationship_level === 'good' ? 'Bom' :
                     stakeholder.relationship_level === 'neutral' ? 'Neutro' : 'Frio'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{stakeholder.objective}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isAddingStakeholder} onOpenChange={setIsAddingStakeholder}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Stakeholder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={newStakeholder.contact_name}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, contact_name: e.target.value })}
                  placeholder="Nome do contato"
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={newStakeholder.role}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
                  placeholder="Ex: Diretor de TI"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Input
                value={newStakeholder.area}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, area: e.target.value })}
                placeholder="Ex: Tecnologia"
              />
            </div>
            <div className="space-y-2">
              <Label>Nivel de Poder (1-5)</Label>
              <Slider
                value={[newStakeholder.power_level || 3]}
                onValueChange={(value) => setNewStakeholder({ ...newStakeholder, power_level: value[0] })}
                min={1}
                max={5}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Baixo</span>
                <span>Alto</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nivel de Apoio</Label>
                <Select
                  value={newStakeholder.support_level}
                  onValueChange={(value) => setNewStakeholder({ ...newStakeholder, support_level: value as 'supporter' | 'neutral' | 'opponent' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supporter">Apoiador</SelectItem>
                    <SelectItem value="neutral">Neutro</SelectItem>
                    <SelectItem value="opponent">Opositor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nivel de Relacionamento</Label>
                <Select
                  value={newStakeholder.relationship_level}
                  onValueChange={(value) => setNewStakeholder({ ...newStakeholder, relationship_level: value as 'cold' | 'neutral' | 'good' | 'sponsor' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold">Frio</SelectItem>
                    <SelectItem value="neutral">Neutro</SelectItem>
                    <SelectItem value="good">Bom</SelectItem>
                    <SelectItem value="sponsor">Patrocinador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Objetivo com este Stakeholder</Label>
              <Textarea
                value={newStakeholder.objective}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, objective: e.target.value })}
                placeholder="O que queremos alcancar com este stakeholder?"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Estrategia de Engajamento</Label>
              <Textarea
                value={newStakeholder.engagement_strategy}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, engagement_strategy: e.target.value })}
                placeholder="Como vamos engajar este stakeholder?"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingStakeholder(false)}>Cancelar</Button>
            <Button onClick={handleAddStakeholder}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

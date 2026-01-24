import React, { useState, useEffect } from 'react';
import { kamPlanAPI } from '../../../services/api';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
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
import { Plus, AlertTriangle, Users } from 'lucide-react';
import type { Risk, Competitor } from '../types';

interface RiscosConcorrenciaProps {
  accountId: string;
}

export const RiscosConcorrencia: React.FC<RiscosConcorrenciaProps> = ({ accountId }) => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    description: '',
    type: 'operational',
    probability: 3,
    impact: 3,
    mitigation_plan: '',
  });
  const [newCompetitor, setNewCompetitor] = useState<Partial<Competitor>>({
    name: '',
    area: '',
    perceived_strength: 3,
    strong_points: '',
    weak_points: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const riskTypes = [
    { value: 'financial', label: 'Financeiro' },
    { value: 'political', label: 'Politico' },
    { value: 'technical', label: 'Tecnico' },
    { value: 'operational', label: 'Operacional' },
  ];

  useEffect(() => {
    loadData();
  }, [accountId]);

  const loadData = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const [risksData, competitorsData] = await Promise.all([
        kamPlanAPI.getRisks(accountId).catch(() => []),
        kamPlanAPI.getCompetitors(accountId).catch(() => []),
      ]);

      if (Array.isArray(risksData)) {
        setRisks(risksData.map((r: { id: number; description: string; type?: string; probability?: number; impact?: number; exposure?: number; mitigation_plan?: string }) => ({
          id: String(r.id),
          description: r.description || '',
          type: (r.type || 'operational') as 'financial' | 'political' | 'technical' | 'operational',
          probability: r.probability || 3,
          impact: r.impact || 3,
          exposure: r.exposure || (r.probability || 3) * (r.impact || 3),
          mitigation_plan: r.mitigation_plan || '',
        })));
      }

      if (Array.isArray(competitorsData)) {
        setCompetitors(competitorsData.map((c: { id: number; name: string; area?: string; perceived_strength?: number; strong_points?: string; weak_points?: string }) => ({
          id: String(c.id),
          name: c.name || '',
          area: c.area || '',
          perceived_strength: c.perceived_strength || 3,
          strong_points: c.strong_points || '',
          weak_points: c.weak_points || '',
        })));
      }
    } catch (error) {
      console.error('Error loading risks and competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRisk = async () => {
    if (!newRisk.description || !accountId) return;
    setSaving(true);
    try {
      const prob = newRisk.probability || 3;
      const imp = newRisk.impact || 3;
      const created = await kamPlanAPI.createRisk(accountId, {
        description: newRisk.description,
        type: newRisk.type || 'operational',
        probability: prob,
        impact: imp,
        mitigation_plan: newRisk.mitigation_plan || '',
      });
      const risk: Risk = {
        id: String(created.id),
        description: created.description || '',
        type: (created.type || 'operational') as 'financial' | 'political' | 'technical' | 'operational',
        probability: created.probability || prob,
        impact: created.impact || imp,
        exposure: created.exposure || prob * imp,
        mitigation_plan: created.mitigation_plan || '',
      };
      setRisks([...risks, risk]);
      setNewRisk({ description: '', type: 'operational', probability: 3, impact: 3, mitigation_plan: '' });
      setIsAddingRisk(false);
    } catch (error) {
      console.error('Error creating risk:', error);
      alert('Erro ao adicionar risco. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRisk = async (id: string) => {
    if (!accountId) return;
    setSaving(true);
    try {
      await kamPlanAPI.deleteRisk(accountId, Number(id));
      setRisks(risks.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting risk:', error);
      alert('Erro ao remover risco. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompetitor = async () => {
    if (!newCompetitor.name || !accountId) return;
    setSaving(true);
    try {
      const created = await kamPlanAPI.createCompetitor(accountId, {
        name: newCompetitor.name,
        area: newCompetitor.area || '',
        perceived_strength: newCompetitor.perceived_strength || 3,
        strong_points: newCompetitor.strong_points || '',
        weak_points: newCompetitor.weak_points || '',
      });
      const competitor: Competitor = {
        id: String(created.id),
        name: created.name || '',
        area: created.area || '',
        perceived_strength: created.perceived_strength || 3,
        strong_points: created.strong_points || '',
        weak_points: created.weak_points || '',
      };
      setCompetitors([...competitors, competitor]);
      setNewCompetitor({ name: '', area: '', perceived_strength: 3, strong_points: '', weak_points: '' });
      setIsAddingCompetitor(false);
    } catch (error) {
      console.error('Error creating competitor:', error);
      alert('Erro ao adicionar concorrente. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (!accountId) return;
    setSaving(true);
    try {
      await kamPlanAPI.deleteCompetitor(accountId, Number(id));
      setCompetitors(competitors.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting competitor:', error);
      alert('Erro ao remover concorrente. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando riscos e concorrentes...</div>
      </div>
    );
  }

  const getExposureColor = (exposure: number) => {
    if (exposure >= 16) return 'bg-red-500 text-white';
    if (exposure >= 9) return 'bg-orange-500 text-white';
    if (exposure >= 4) return 'bg-yellow-500';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Riscos
            </CardTitle>
            <CardDescription>Identifique e gerencie os riscos da conta</CardDescription>
          </div>
          <Button onClick={() => setIsAddingRisk(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Risco
          </Button>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">Nenhum risco cadastrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risco</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Prob.</TableHead>
                  <TableHead className="text-center">Impacto</TableHead>
                  <TableHead className="text-center">Exposicao</TableHead>
                  <TableHead>Mitigacao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="font-medium">{risk.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {riskTypes.find(t => t.value === risk.type)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{risk.probability}</TableCell>
                    <TableCell className="text-center">{risk.impact}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getExposureColor(risk.exposure)}>{risk.exposure}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{risk.mitigation_plan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Concorrencia
            </CardTitle>
            <CardDescription>Analise os concorrentes na conta</CardDescription>
          </div>
          <Button onClick={() => setIsAddingCompetitor(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Concorrente
          </Button>
        </CardHeader>
        <CardContent>
          {competitors.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">Nenhum concorrente cadastrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concorrente</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Forca</TableHead>
                  <TableHead>Pontos Fortes</TableHead>
                  <TableHead>Pontos Fracos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors.map((competitor) => (
                  <TableRow key={competitor.id}>
                    <TableCell className="font-medium">{competitor.name}</TableCell>
                    <TableCell>{competitor.area}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div
                            key={n}
                            className={`w-2 h-2 rounded-full ${n <= competitor.perceived_strength ? 'bg-red-500' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{competitor.strong_points}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{competitor.weak_points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddingRisk} onOpenChange={setIsAddingRisk}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Risco</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descricao do Risco</Label>
              <Textarea
                value={newRisk.description}
                onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                placeholder="Descreva o risco..."
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={newRisk.type}
                onValueChange={(value) => setNewRisk({ ...newRisk, type: value as 'financial' | 'political' | 'technical' | 'operational' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {riskTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Probabilidade (1-5)</Label>
                <Slider
                  value={[newRisk.probability || 3]}
                  onValueChange={(value) => setNewRisk({ ...newRisk, probability: value[0] })}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Impacto (1-5)</Label>
                <Slider
                  value={[newRisk.impact || 3]}
                  onValueChange={(value) => setNewRisk({ ...newRisk, impact: value[0] })}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Plano de Mitigacao</Label>
              <Textarea
                value={newRisk.mitigation_plan}
                onChange={(e) => setNewRisk({ ...newRisk, mitigation_plan: e.target.value })}
                placeholder="Como mitigar este risco?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingRisk(false)}>Cancelar</Button>
            <Button onClick={handleAddRisk}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingCompetitor} onOpenChange={setIsAddingCompetitor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Concorrente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Concorrente</Label>
                <Input
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label>Area de Atuacao</Label>
                <Input
                  value={newCompetitor.area}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, area: e.target.value })}
                  placeholder="Ex: Cloud, Consultoria..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Forca Percebida (1-5)</Label>
              <Slider
                value={[newCompetitor.perceived_strength || 3]}
                onValueChange={(value) => setNewCompetitor({ ...newCompetitor, perceived_strength: value[0] })}
                min={1}
                max={5}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Pontos Fortes</Label>
              <Textarea
                value={newCompetitor.strong_points}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, strong_points: e.target.value })}
                placeholder="Quais os pontos fortes deste concorrente?"
              />
            </div>
            <div className="space-y-2">
              <Label>Pontos Fracos</Label>
              <Textarea
                value={newCompetitor.weak_points}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, weak_points: e.target.value })}
                placeholder="Quais os pontos fracos deste concorrente?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCompetitor(false)}>Cancelar</Button>
            <Button onClick={handleAddCompetitor}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

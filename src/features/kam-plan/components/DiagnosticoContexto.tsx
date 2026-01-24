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
import { Plus, Trash2 } from 'lucide-react';
import type { DiagnosticData, Pain } from '../types';

interface DiagnosticoContextoProps {
  accountId: string;
}

export const DiagnosticoContexto: React.FC<DiagnosticoContextoProps> = ({ accountId }) => {
  const [diagnostic, setDiagnostic] = useState<DiagnosticData>({
    current_situation: '',
    strategic_objectives: '',
    main_initiatives: '',
    pains: [],
    swot: {
      strengths: '',
      weaknesses: '',
      opportunities: '',
      threats: '',
    },
  });
  const [isAddingPain, setIsAddingPain] = useState(false);
  const [newPain, setNewPain] = useState<Partial<Pain>>({
    description: '',
    impact: 'medium',
    priority: 'medium',
    affected_area: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDiagnostic();
  }, [accountId]);

  const loadDiagnostic = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const [diagnosticData, painsData] = await Promise.all([
        kamPlanAPI.getDiagnostic(accountId).catch(() => null),
        kamPlanAPI.getPains(accountId).catch(() => []),
      ]);

      if (diagnosticData) {
        setDiagnostic({
          current_situation: diagnosticData.current_situation || '',
          strategic_objectives: diagnosticData.strategic_objectives || '',
          main_initiatives: diagnosticData.main_initiatives || '',
          pains: Array.isArray(painsData) ? painsData.map((p: { id: number; description: string; impact: string; priority: string; affected_area?: string }) => ({
            id: String(p.id),
            description: p.description,
            impact: p.impact as 'low' | 'medium' | 'high',
            priority: p.priority as 'low' | 'medium' | 'high',
            affected_area: p.affected_area || '',
          })) : [],
          swot: {
            strengths: diagnosticData.swot_strengths || '',
            weaknesses: diagnosticData.swot_weaknesses || '',
            opportunities: diagnosticData.swot_opportunities || '',
            threats: diagnosticData.swot_threats || '',
          },
        });
      }
    } catch (error) {
      console.error('Error loading diagnostic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDiagnostic = async () => {
    if (!accountId) return;
    setSaving(true);
    try {
      await kamPlanAPI.updateDiagnostic(accountId, {
        current_situation: diagnostic.current_situation,
        strategic_objectives: diagnostic.strategic_objectives,
        initiatives: diagnostic.main_initiatives,
        swot: {
          swot_strengths: diagnostic.swot.strengths,
          swot_weaknesses: diagnostic.swot.weaknesses,
          swot_opportunities: diagnostic.swot.opportunities,
          swot_threats: diagnostic.swot.threats,
        },
      });
      alert('Diagnostico salvo com sucesso!');
    } catch (error) {
      console.error('Error saving diagnostic:', error);
      alert('Erro ao salvar diagnostico. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPain = async () => {
    if (!newPain.description || !accountId) return;
    setSaving(true);
    try {
      const createdPain = await kamPlanAPI.createPain(accountId, {
        description: newPain.description,
        impact: newPain.impact || 'medium',
        priority: newPain.priority || 'medium',
      });
      const pain: Pain = {
        id: String(createdPain.id),
        description: createdPain.description,
        impact: createdPain.impact as 'low' | 'medium' | 'high',
        priority: createdPain.priority as 'low' | 'medium' | 'high',
        affected_area: createdPain.affected_area || '',
      };
      setDiagnostic({ ...diagnostic, pains: [...diagnostic.pains, pain] });
      setNewPain({ description: '', impact: 'medium', priority: 'medium', affected_area: '' });
      setIsAddingPain(false);
    } catch (error) {
      console.error('Error creating pain:', error);
      alert('Erro ao adicionar dor. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePain = async (id: string) => {
    if (!accountId) return;
    setSaving(true);
    try {
      await kamPlanAPI.deletePain(accountId, Number(id));
      setDiagnostic({ ...diagnostic, pains: diagnostic.pains.filter(p => p.id !== id) });
    } catch (error) {
      console.error('Error deleting pain:', error);
      alert('Erro ao remover dor. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando diagnostico...</div>
      </div>
    );
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contexto da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Situacao Atual</Label>
            <Textarea
              value={diagnostic.current_situation}
              onChange={(e) => setDiagnostic({ ...diagnostic, current_situation: e.target.value })}
              placeholder="Descreva a situacao atual do cliente..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Objetivos Estrategicos do Cliente</Label>
            <Textarea
              value={diagnostic.strategic_objectives}
              onChange={(e) => setDiagnostic({ ...diagnostic, strategic_objectives: e.target.value })}
              placeholder="Quais sao os objetivos estrategicos do cliente?"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Principais Iniciativas em Andamento</Label>
            <Textarea
              value={diagnostic.main_initiatives}
              onChange={(e) => setDiagnostic({ ...diagnostic, main_initiatives: e.target.value })}
              placeholder="Quais iniciativas o cliente esta conduzindo?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dores e Desafios</CardTitle>
            <CardDescription>Identifique as principais dores do cliente</CardDescription>
          </div>
          <Button onClick={() => setIsAddingPain(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Dor
          </Button>
        </CardHeader>
        <CardContent>
          {diagnostic.pains.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Nenhuma dor cadastrada
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dor / Problema</TableHead>
                  <TableHead>Impacto</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Area Impactada</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnostic.pains.map((pain) => (
                  <TableRow key={pain.id}>
                    <TableCell>{pain.description}</TableCell>
                    <TableCell>
                      <Badge className={getImpactColor(pain.impact)}>
                        {pain.impact === 'high' ? 'Alto' : pain.impact === 'medium' ? 'Medio' : 'Baixo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {pain.priority === 'high' ? 'Alta' : pain.priority === 'medium' ? 'Media' : 'Baixa'}
                      </Badge>
                    </TableCell>
                    <TableCell>{pain.affected_area}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemovePain(pain.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Dialog open={isAddingPain} onOpenChange={setIsAddingPain}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Dor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Descricao</Label>
                  <Textarea
                    value={newPain.description}
                    onChange={(e) => setNewPain({ ...newPain, description: e.target.value })}
                    placeholder="Descreva a dor ou problema..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Impacto</Label>
                    <Select
                      value={newPain.impact}
                      onValueChange={(value) => setNewPain({ ...newPain, impact: value as 'low' | 'medium' | 'high' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixo</SelectItem>
                        <SelectItem value="medium">Medio</SelectItem>
                        <SelectItem value="high">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select
                      value={newPain.priority}
                      onValueChange={(value) => setNewPain({ ...newPain, priority: value as 'low' | 'medium' | 'high' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Area Impactada</Label>
                  <Input
                    value={newPain.affected_area}
                    onChange={(e) => setNewPain({ ...newPain, affected_area: e.target.value })}
                    placeholder="Ex: TI, Financeiro, Operacoes..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPain(false)}>Cancelar</Button>
                <Button onClick={handleAddPain}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analise SWOT</CardTitle>
          <CardDescription>Forcas, Fraquezas, Oportunidades e Ameacas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-green-700">Forcas (Strengths)</Label>
              <Textarea
                value={diagnostic.swot.strengths}
                onChange={(e) => setDiagnostic({
                  ...diagnostic,
                  swot: { ...diagnostic.swot, strengths: e.target.value }
                })}
                placeholder="Pontos fortes do relacionamento..."
                rows={4}
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-red-700">Fraquezas (Weaknesses)</Label>
              <Textarea
                value={diagnostic.swot.weaknesses}
                onChange={(e) => setDiagnostic({
                  ...diagnostic,
                  swot: { ...diagnostic.swot, weaknesses: e.target.value }
                })}
                placeholder="Pontos fracos a melhorar..."
                rows={4}
                className="border-red-200 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-700">Oportunidades (Opportunities)</Label>
              <Textarea
                value={diagnostic.swot.opportunities}
                onChange={(e) => setDiagnostic({
                  ...diagnostic,
                  swot: { ...diagnostic.swot, opportunities: e.target.value }
                })}
                placeholder="Oportunidades identificadas..."
                rows={4}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-yellow-700">Ameacas (Threats)</Label>
              <Textarea
                value={diagnostic.swot.threats}
                onChange={(e) => setDiagnostic({
                  ...diagnostic,
                  swot: { ...diagnostic.swot, threats: e.target.value }
                })}
                placeholder="Ameacas e riscos externos..."
                rows={4}
                className="border-yellow-200 focus:border-yellow-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveDiagnostic} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Diagnostico'}
        </Button>
      </div>
    </div>
  );
};

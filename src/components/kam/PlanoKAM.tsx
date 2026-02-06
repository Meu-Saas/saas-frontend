import React, { useState, useEffect } from 'react';
import { kamPlanAPI } from '../../services/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { MaskedInput } from '../ui/masked-input';
import { unmaskCurrency } from '../../utils/masks';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import {
  Plus,
  Edit,
  Trash2,
  Target,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface KAMPillar {
  id: string;
  name: string;
  description: string;
  tactical_description: string;
  strategic_description: string;
  maturity_items: MaturityItem[];
  current_level: 'tactical' | 'transition' | 'strategic';
  kam_analysis: string;
}

interface MaturityItem {
  id: string;
  description: string;
  is_checked: boolean;
  score: number;
}

interface DiagnosticData {
  current_situation: string;
  strategic_objectives: string;
  main_initiatives: string;
  pains: Pain[];
  swot: SWOT;
}

interface Pain {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
  affected_area: string;
}

interface SWOT {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

interface Stakeholder {
  id: string;
  contact_id: string;
  contact_name: string;
  role: string;
  area: string;
  power_level: number;
  support_level: 'supporter' | 'neutral' | 'opponent';
  relationship_level: 'cold' | 'neutral' | 'good' | 'sponsor';
  objective: string;
  engagement_strategy: string;
  show_in_orgchart: boolean;
  superior_id: string | null;
}

interface WalletShareLine {
  id: string;
  business_line: string;
  annual_potential: number;
  current_revenue: number;
  participation_percentage: number;
  gap: number;
  priority: 'low' | 'medium' | 'high';
}

interface KAMAction {
  id: string;
  strategic_objective: string;
  action: string;
  action_type: string;
  main_stakeholder_id: string | null;
  main_stakeholder_name: string | null;
  responsible: string;
  planned_start_date: string;
  planned_end_date: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  result: string;
}

interface Risk {
  id: string;
  description: string;
  type: 'financial' | 'political' | 'technical' | 'operational';
  probability: number;
  impact: number;
  exposure: number;
  mitigation_plan: string;
}

interface Competitor {
  id: string;
  name: string;
  area: string;
  perceived_strength: number;
  strong_points: string;
  weak_points: string;
}

const defaultPillars: KAMPillar[] = [
  {
    id: '1',
    name: 'Estrategia',
    description: 'Alinhamento estrategico com o cliente',
    tactical_description: 'Foco em vendas transacionais',
    strategic_description: 'Parceria estrategica de longo prazo',
    maturity_items: [
      { id: '1', description: 'Conhece a estrategia do cliente', is_checked: false, score: 0 },
      { id: '2', description: 'Participa do planejamento estrategico', is_checked: false, score: 0 },
      { id: '3', description: 'Co-cria solucoes com o cliente', is_checked: false, score: 0 },
    ],
    current_level: 'tactical',
    kam_analysis: '',
  },
  {
    id: '2',
    name: 'Criacao de Valor',
    description: 'Geracao de valor para o cliente',
    tactical_description: 'Valor baseado em preco',
    strategic_description: 'Valor baseado em resultados de negocio',
    maturity_items: [
      { id: '1', description: 'Entende as dores do cliente', is_checked: false, score: 0 },
      { id: '2', description: 'Propoe solucoes customizadas', is_checked: false, score: 0 },
      { id: '3', description: 'Mede ROI das solucoes', is_checked: false, score: 0 },
    ],
    current_level: 'tactical',
    kam_analysis: '',
  },
  {
    id: '3',
    name: 'Relacionamento Executivo',
    description: 'Nivel de relacionamento com executivos',
    tactical_description: 'Contato apenas com compradores',
    strategic_description: 'Acesso ao C-level e board',
    maturity_items: [
      { id: '1', description: 'Conhece os decisores', is_checked: false, score: 0 },
      { id: '2', description: 'Tem reunioes regulares com executivos', is_checked: false, score: 0 },
      { id: '3', description: 'Participa de eventos estrategicos', is_checked: false, score: 0 },
    ],
    current_level: 'tactical',
    kam_analysis: '',
  },
  {
    id: '4',
    name: 'Governanca',
    description: 'Estrutura de governanca da conta',
    tactical_description: 'Sem estrutura formal',
    strategic_description: 'Comites e QBRs estabelecidos',
    maturity_items: [
      { id: '1', description: 'Tem reunioes de acompanhamento', is_checked: false, score: 0 },
      { id: '2', description: 'Realiza QBRs', is_checked: false, score: 0 },
      { id: '3', description: 'Tem comite executivo', is_checked: false, score: 0 },
    ],
    current_level: 'tactical',
    kam_analysis: '',
  },
  {
    id: '5',
    name: 'Entregas',
    description: 'Qualidade e consistencia das entregas',
    tactical_description: 'Entregas reativas',
    strategic_description: 'Entregas proativas e inovadoras',
    maturity_items: [
      { id: '1', description: 'Cumpre SLAs', is_checked: false, score: 0 },
      { id: '2', description: 'Antecipa necessidades', is_checked: false, score: 0 },
      { id: '3', description: 'Inova nas entregas', is_checked: false, score: 0 },
    ],
    current_level: 'tactical',
    kam_analysis: '',
  },
  {
    id: '6',
    name: 'KPIs',
    description: 'Indicadores de performance',
    tactical_description: 'Metricas basicas de vendas',
    strategic_description: 'KPIs de valor e satisfacao',
    maturity_items: [
      { id: '1', description: 'Acompanha metricas de vendas', is_checked: false, score: 0 },
      { id: '2', description: 'Mede satisfacao do cliente', is_checked: false, score: 0 },
      { id: '3', description: 'Acompanha valor gerado', is_checked: false, score: 0 },
    ],
    current_level: 'tactical',
    kam_analysis: '',
  },
];

export const AnatomiaKAM: React.FC<{ accountId: string }> = ({ accountId }) => {
  const [pillars, setPillars] = useState<KAMPillar[]>(defaultPillars);
  const [selectedPillar, setSelectedPillar] = useState<KAMPillar | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);

  useEffect(() => {
    loadPillars();
  }, [accountId]);

  const loadPillars = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await kamPlanAPI.getPillars(accountId);
      if (Array.isArray(data) && data.length > 0) {
        // Map database pillars by name for easy lookup
        const dbPillarsMap = new Map<string, KAMPillar>();
        data.forEach((p: { id: number; name: string; description?: string; tactical_description?: string; strategic_description?: string; maturity_items?: { id: string; description: string; is_checked: boolean; score: number }[]; current_level?: string; kam_analysis?: string }) => {
          dbPillarsMap.set(p.name, {
            id: String(p.id),
            name: p.name || '',
            description: p.description || '',
            tactical_description: p.tactical_description || '',
            strategic_description: p.strategic_description || '',
            maturity_items: p.maturity_items || [],
            current_level: (p.current_level || 'tactical') as 'tactical' | 'transition' | 'strategic',
            kam_analysis: p.kam_analysis || '',
          });
        });
        
        // Merge: use DB pillar if exists, otherwise use default
        const mergedPillars = defaultPillars.map(defaultPillar => {
          const dbPillar = dbPillarsMap.get(defaultPillar.name);
          return dbPillar || defaultPillar;
        });
        
        setPillars(mergedPillars);
      }
    } catch (error) {
      console.error('Error loading pillars:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'tactical':
        return 'bg-red-100 text-red-800';
      case 'transition':
        return 'bg-yellow-100 text-yellow-800';
      case 'strategic':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'tactical':
        return 'Tatico';
      case 'transition':
        return 'Em Transicao';
      case 'strategic':
        return 'Estrategico';
      default:
        return level;
    }
  };

  const handlePillarClick = (pillar: KAMPillar) => {
    setSelectedPillar(pillar);
    setIsDialogOpen(true);
  };

  const handleSavePillar = async () => {
    if (!selectedPillar || !accountId) return;
    setSaving(true);
    try {
      const isFromDB = !isNaN(Number(selectedPillar.id)) && Number(selectedPillar.id) > 6;
      
      if (isFromDB) {
        await kamPlanAPI.updatePillar(accountId, Number(selectedPillar.id), {
          current_level: selectedPillar.current_level,
          kam_analysis: selectedPillar.kam_analysis,
          maturity_items: selectedPillar.maturity_items,
        });
        setPillars(prev => prev.map(p => p.id === selectedPillar.id ? { ...selectedPillar } : p));
      } else {
        const savedPillar = await kamPlanAPI.createPillar(accountId, {
          name: selectedPillar.name,
          description: selectedPillar.description,
          tactical_description: selectedPillar.tactical_description,
          strategic_description: selectedPillar.strategic_description,
          current_level: selectedPillar.current_level,
          kam_analysis: selectedPillar.kam_analysis,
          maturity_items: selectedPillar.maturity_items,
        });
        const updatedPillar = savedPillar?.id
          ? { ...selectedPillar, id: String(savedPillar.id) }
          : { ...selectedPillar };
        setPillars(prev => prev.map(p => p.name === selectedPillar.name ? updatedPillar : p));
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving pillar:', error);
      alert('Erro ao salvar pilar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando pilares...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Avalie os pilares KAM da conta para identificar o nivel de maturidade do relacionamento.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <Card
            key={pillar.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handlePillarClick(pillar)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pillar.name}</CardTitle>
                <Badge className={getLevelColor(pillar.current_level)}>
                  {getLevelLabel(pillar.current_level)}
                </Badge>
              </div>
              <CardDescription>{pillar.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Itens avaliados:</span>
                  <span>
                    {pillar.maturity_items.filter(i => i.is_checked).length} / {pillar.maturity_items.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(pillar.maturity_items.filter(i => i.is_checked).length / pillar.maturity_items.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedPillar && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPillar.name}</DialogTitle>
                <DialogDescription>{selectedPillar.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Tatico</p>
                    <p className="text-xs text-red-600">{selectedPillar.tactical_description}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Estrategico</p>
                    <p className="text-xs text-green-600">{selectedPillar.strategic_description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Checklist de Maturidade</Label>
                  {selectedPillar.maturity_items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={item.is_checked}
                          onCheckedChange={(checked) => {
                            const newItems = [...selectedPillar.maturity_items];
                            newItems[index] = { ...item, is_checked: checked as boolean };
                            setSelectedPillar({ ...selectedPillar, maturity_items: newItems });
                          }}
                        />
                        <span className="text-sm">{item.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Nota:</span>
                        <Select
                          value={item.score.toString()}
                          onValueChange={(value) => {
                            const newItems = [...selectedPillar.maturity_items];
                            newItems[index] = { ...item, score: parseInt(value) };
                            setSelectedPillar({ ...selectedPillar, maturity_items: newItems });
                          }}
                        >
                          <SelectTrigger className="w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Nivel Atual</Label>
                  <Select
                    value={selectedPillar.current_level}
                    onValueChange={(value: 'tactical' | 'transition' | 'strategic') => {
                      setSelectedPillar({ ...selectedPillar, current_level: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tactical">Tatico</SelectItem>
                      <SelectItem value="transition">Em Transicao</SelectItem>
                      <SelectItem value="strategic">Estrategico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Analise do KAM</Label>
                  <Textarea
                    value={selectedPillar.kam_analysis}
                    onChange={(e) => setSelectedPillar({ ...selectedPillar, kam_analysis: e.target.value })}
                    placeholder="Descreva sua analise sobre este pilar..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePillar}>Salvar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const DiagnosticoContexto: React.FC<{ accountId: string }> = ({ accountId }) => {
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

      const loadedPains = Array.isArray(painsData) ? painsData.map((p: { id: number; description: string; impact: string; priority: string; affected_area?: string }) => ({
        id: String(p.id),
        description: p.description,
        impact: p.impact as 'low' | 'medium' | 'high',
        priority: p.priority as 'low' | 'medium' | 'high',
        affected_area: p.affected_area || '',
      })) : [];

      setDiagnostic({
        current_situation: diagnosticData?.current_situation || '',
        strategic_objectives: diagnosticData?.strategic_objectives || '',
        main_initiatives: diagnosticData?.main_initiatives || '',
        pains: loadedPains,
        swot: {
          strengths: diagnosticData?.swot_strengths || '',
          weaknesses: diagnosticData?.swot_weaknesses || '',
          opportunities: diagnosticData?.swot_opportunities || '',
          threats: diagnosticData?.swot_threats || '',
        },
      });
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

export const MapaStakeholders: React.FC<{ accountId: string }> = ({ accountId }) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [isAddingStakeholder, setIsAddingStakeholder] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
  const [_saving, setSaving] = useState(false);

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
          superior_id: s.superior_id ? String(s.superior_id) : null,
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
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingStakeholder({ ...stakeholder });
                    setIsEditDialogOpen(true);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Stakeholder</DialogTitle>
          </DialogHeader>
          {editingStakeholder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={editingStakeholder.contact_name}
                    onChange={(e) => setEditingStakeholder({ ...editingStakeholder, contact_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input
                    value={editingStakeholder.role}
                    onChange={(e) => setEditingStakeholder({ ...editingStakeholder, role: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Area</Label>
                <Input
                  value={editingStakeholder.area}
                  onChange={(e) => setEditingStakeholder({ ...editingStakeholder, area: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nivel de Poder (1-5)</Label>
                <Slider
                  value={[editingStakeholder.power_level]}
                  onValueChange={(value) => setEditingStakeholder({ ...editingStakeholder, power_level: value[0] })}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nivel de Apoio</Label>
                  <Select
                    value={editingStakeholder.support_level}
                    onValueChange={(value) => setEditingStakeholder({ ...editingStakeholder, support_level: value as 'supporter' | 'neutral' | 'opponent' })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                    value={editingStakeholder.relationship_level}
                    onValueChange={(value) => setEditingStakeholder({ ...editingStakeholder, relationship_level: value as 'cold' | 'neutral' | 'good' | 'sponsor' })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Label>Objetivo</Label>
                <Textarea
                  value={editingStakeholder.objective}
                  onChange={(e) => setEditingStakeholder({ ...editingStakeholder, objective: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Estrategia de Engajamento</Label>
                <Textarea
                  value={editingStakeholder.engagement_strategy}
                  onChange={(e) => setEditingStakeholder({ ...editingStakeholder, engagement_strategy: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={async () => {
              if (!editingStakeholder || !accountId) return;
              setSaving(true);
              try {
                await kamPlanAPI.updateStakeholder(accountId, Number(editingStakeholder.id), {
                  contact_name: editingStakeholder.contact_name,
                  role: editingStakeholder.role,
                  area: editingStakeholder.area,
                  power_level: editingStakeholder.power_level,
                  support_level: editingStakeholder.support_level,
                  relationship_level: editingStakeholder.relationship_level,
                  objective: editingStakeholder.objective,
                  engagement_strategy: editingStakeholder.engagement_strategy,
                });
                setStakeholders(prev => prev.map(s => s.id === editingStakeholder.id ? { ...editingStakeholder } : s));
                setIsEditDialogOpen(false);
              } catch (error) {
                console.error('Error updating stakeholder:', error);
                alert('Erro ao atualizar stakeholder.');
              } finally {
                setSaving(false);
              }
            }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                placeholder="O que queremos alcançar com este stakeholder?"
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

export const WalletShare: React.FC<{ accountId: string }> = ({ accountId }) => {
  const [lines, setLines] = useState<WalletShareLine[]>([]);
  const [isAddingLine, setIsAddingLine] = useState(false);
  const [newLine, setNewLine] = useState<Partial<WalletShareLine>>({
    business_line: '',
    annual_potential: 0,
    current_revenue: 0,
    priority: 'medium',
  });
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);

  useEffect(() => {
    loadWalletShare();
  }, [accountId]);

  const loadWalletShare = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await kamPlanAPI.getWalletShare(accountId);
      if (Array.isArray(data)) {
        setLines(data.map((item: { id: number; business_line: string; annual_potential?: number; current_revenue?: number; participation_percentage?: number; gap?: number; priority?: string }) => ({
          id: String(item.id),
          business_line: item.business_line || '',
          annual_potential: item.annual_potential || 0,
          current_revenue: item.current_revenue || 0,
          participation_percentage: item.participation_percentage || 0,
          gap: item.gap || 0,
          priority: (item.priority || 'medium') as 'low' | 'medium' | 'high',
        })));
      }
    } catch (error) {
      console.error('Error loading wallet share:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLine = async () => {
    if (!newLine.business_line || !accountId) return;
    setSaving(true);
    try {
      const potential = newLine.annual_potential || 0;
      const current = newLine.current_revenue || 0;
      const created = await kamPlanAPI.createWalletShareItem(accountId, {
        business_line: newLine.business_line,
        annual_potential: potential,
        current_revenue: current,
      });
      const line: WalletShareLine = {
        id: String(created.id),
        business_line: created.business_line || '',
        annual_potential: created.annual_potential || 0,
        current_revenue: created.current_revenue || 0,
        participation_percentage: created.participation_percentage || (potential > 0 ? (current / potential) * 100 : 0),
        gap: created.gap || (potential - current),
        priority: (created.priority || 'medium') as 'low' | 'medium' | 'high',
      };
      setLines([...lines, line]);
      setNewLine({ business_line: '', annual_potential: 0, current_revenue: 0, priority: 'medium' });
      setIsAddingLine(false);
    } catch (error) {
      console.error('Error creating wallet share item:', error);
      alert('Erro ao adicionar linha. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency= (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando wallet share...</div>
      </div>
    );
  }

  const totalPotential = lines.reduce((sum, l) => sum + l.annual_potential, 0);
  const totalCurrent = lines.reduce((sum, l) => sum + l.current_revenue, 0);
  const totalGap = totalPotential - totalCurrent;
  const totalParticipation = totalPotential > 0 ? (totalCurrent / totalPotential) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Analise o potencial vs participacao por linha de negocio.
        </p>
        <Button onClick={() => setIsAddingLine(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Linha
        </Button>
      </div>

      {lines.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Potencial Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPotential)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Receita Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalCurrent)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{formatCurrency(totalGap)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Participacao</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipation.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {lines.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma linha de negocio cadastrada</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Linha de Negocio</TableHead>
              <TableHead className="text-right">Potencial Anual</TableHead>
              <TableHead className="text-right">Receita Atual</TableHead>
              <TableHead className="text-right">Participacao</TableHead>
              <TableHead className="text-right">Gap</TableHead>
              <TableHead>Prioridade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell className="font-medium">{line.business_line}</TableCell>
                <TableCell className="text-right">{formatCurrency(line.annual_potential)}</TableCell>
                <TableCell className="text-right">{formatCurrency(line.current_revenue)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min(line.participation_percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm">{line.participation_percentage.toFixed(1)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-orange-500">{formatCurrency(line.gap)}</TableCell>
                <TableCell>
                  <Badge variant={line.priority === 'high' ? 'destructive' : line.priority === 'medium' ? 'default' : 'secondary'}>
                    {line.priority === 'high' ? 'Alta' : line.priority === 'medium' ? 'Media' : 'Baixa'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isAddingLine} onOpenChange={setIsAddingLine}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Linha de Negocio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Linha de Negocio / Solucao</Label>
              <Input
                value={newLine.business_line}
                onChange={(e) => setNewLine({ ...newLine, business_line: e.target.value })}
                placeholder="Ex: Cloud Services, Consultoria..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Potencial Anual (R$)</Label>
                <MaskedInput
                  maskType="currency"
                  value={newLine.annual_potential ? newLine.annual_potential.toString() : ''}
                  onChange={(maskedValue) => setNewLine({ ...newLine, annual_potential: unmaskCurrency(maskedValue) })}
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="space-y-2">
                <Label>Receita Atual (R$)</Label>
                <MaskedInput
                  maskType="currency"
                  value={newLine.current_revenue ? newLine.current_revenue.toString() : ''}
                  onChange={(maskedValue) => setNewLine({ ...newLine, current_revenue: unmaskCurrency(maskedValue) })}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={newLine.priority}
                onValueChange={(value) => setNewLine({ ...newLine, priority: value as 'low' | 'medium' | 'high' })}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingLine(false)}>Cancelar</Button>
            <Button onClick={handleAddLine}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const PlanoAcaoKAM: React.FC<{ accountId: string }> = ({ accountId }) => {
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
  const [_saving, setSaving] = useState(false);

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
          main_stakeholder_id: a.main_stakeholder_id ? String(a.main_stakeholder_id) : null,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando acoes...</div>
      </div>
    );
  }

  const getStatusIcon= (status: string) => {
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

export const RiscosConcorrencia: React.FC<{ accountId: string }> = ({ accountId }) => {
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
  const [_saving, setSaving] = useState(false);

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

  const handleAddCompetitor= async () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando riscos e concorrentes...</div>
      </div>
    );
  }

  const getExposureColor= (exposure: number) => {
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

const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

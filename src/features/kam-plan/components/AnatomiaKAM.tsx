import React, { useState, useEffect } from 'react';
import { kamPlanAPI } from '../../../services/api';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import type { KAMPillar } from '../types';

interface AnatomiaKAMProps {
  accountId: string;
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

export const AnatomiaKAM: React.FC<AnatomiaKAMProps> = ({ accountId }) => {
  const [pillars, setPillars] = useState<KAMPillar[]>(defaultPillars);
  const [selectedPillar, setSelectedPillar] = useState<KAMPillar | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPillars();
  }, [accountId]);

  const loadPillars = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await kamPlanAPI.getPillars(accountId);
      if (Array.isArray(data) && data.length > 0) {
        setPillars(data.map((p: { id: number; name: string; description?: string; tactical_description?: string; strategic_description?: string; maturity_items?: { id: string; description: string; is_checked: boolean; score: number }[]; current_level?: string; kam_analysis?: string }) => ({
          id: String(p.id),
          name: p.name || '',
          description: p.description || '',
          tactical_description: p.tactical_description || '',
          strategic_description: p.strategic_description || '',
          maturity_items: p.maturity_items || [],
          current_level: (p.current_level || 'tactical') as 'tactical' | 'transition' | 'strategic',
          kam_analysis: p.kam_analysis || '',
        })));
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
      await kamPlanAPI.updatePillar(accountId, Number(selectedPillar.id), {
        current_level: selectedPillar.current_level,
        kam_analysis: selectedPillar.kam_analysis,
        maturity_items: selectedPillar.maturity_items,
      });
      setPillars(pillars.map(p => p.id === selectedPillar.id ? selectedPillar : p));
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

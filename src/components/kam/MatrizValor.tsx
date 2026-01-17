import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  Plus,
  Edit,
  Trash2,
  Target,
  Users,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronRight,
  User,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { valueMatrixAPI, contactsAPI } from '../../services/api';

interface ValueAttribute {
  id: number;
  name: string;
  importance: number;
  performance: number;
  gap: number;
  zone: string;
  zone_color: string;
  recommended_action: string;
}

interface Stakeholder {
  id: number;
  name: string;
  role: string;
  department: string;
  power_level: number;
  support_level: string;
  relationship_level: string;
  superior_id: number | null;
  show_in_orgchart: boolean;
  related_attributes: number[];
}

interface ValueZone {
  id: number;
  name: string;
  color: string;
  min_importance: number;
  min_performance: number;
  max_performance: number;
}

interface MatrizValorProps {
  accountId: string;
}

const defaultZones: ValueZone[] = [
  { id: 1, name: 'Imbativel', color: '#22C55E', min_importance: 4, min_performance: 4, max_performance: 5 },
  { id: 2, name: 'Competitivo', color: '#3B82F6', min_importance: 3, min_performance: 3, max_performance: 4 },
  { id: 3, name: 'Vulneravel', color: '#EF4444', min_importance: 4, min_performance: 1, max_performance: 2 },
  { id: 4, name: 'Irrelevante', color: '#9CA3AF', min_importance: 1, min_performance: 1, max_performance: 5 },
];

export const MatrizValor: React.FC<MatrizValorProps> = ({ accountId }) => {
  const [attributes, setAttributes] = useState<ValueAttribute[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [zones] = useState<ValueZone[]>(defaultZones);
  const [selectedAttribute, setSelectedAttribute] = useState<ValueAttribute | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [isStakeholderPanelOpen, setIsStakeholderPanelOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newAttribute, setNewAttribute] = useState({
    name: '',
    importance: 3,
    performance: 3,
    recommended_action: '',
  });

  useEffect(() => {
    loadData();
  }, [accountId]);

  const loadData = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      // Load value attributes from API
      const attributesData = await valueMatrixAPI.getAttributes(accountId);
      if (Array.isArray(attributesData)) {
        setAttributes(attributesData);
      }

      // Load contacts as stakeholders (contacts can be used as stakeholders)
      try {
        const contactsData = await contactsAPI.getByAccount(accountId);
        if (Array.isArray(contactsData)) {
          const stakeholdersList: Stakeholder[] = contactsData.map((contact) => ({
            id: parseInt(String(contact.id), 10),
            name: contact.name,
            role: contact.role || 'Contato',
            department: '',
            power_level: 3,
            support_level: 'Neutro',
            relationship_level: 'Neutro',
            superior_id: null,
            show_in_orgchart: true,
            related_attributes: [],
          }));
          setStakeholders(stakeholdersList);
          // Expand first level nodes
          const rootIds = stakeholdersList.filter(s => s.superior_id === null).map(s => s.id);
          setExpandedNodes(new Set(rootIds));
        }
      } catch (contactError) {
        console.error('Error loading contacts as stakeholders:', contactError);
        setStakeholders([]);
      }
    } catch (error) {
      console.error('Error loading value matrix data:', error);
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateZone = (importance: number, performance: number): { zone: string; color: string } => {
    if (importance >= 4 && performance >= 4) {
      return { zone: 'Imbativel', color: '#22C55E' };
    } else if (importance >= 4 && performance <= 2) {
      return { zone: 'Vulneravel', color: '#EF4444' };
    } else if (importance >= 3 && performance >= 3) {
      return { zone: 'Competitivo', color: '#3B82F6' };
    } else {
      return { zone: 'Irrelevante', color: '#9CA3AF' };
    }
  };

  const handleAddAttribute = async () => {
    if (!accountId) return;
    setSaving(true);
    try {
      const newAttr = await valueMatrixAPI.createAttribute(accountId, {
        name: newAttribute.name,
        importance: newAttribute.importance,
        performance: newAttribute.performance,
        recommended_action: newAttribute.recommended_action || undefined,
      });
      setAttributes([...attributes, newAttr]);
      setNewAttribute({ name: '', importance: 3, performance: 3, recommended_action: '' });
      setIsAttributeDialogOpen(false);
    } catch (error) {
      console.error('Error creating attribute:', error);
      alert('Erro ao criar atributo. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAttribute = async (id: number) => {
    if (!accountId) return;
    setSaving(true);
    try {
      await valueMatrixAPI.deleteAttribute(accountId, id);
      setAttributes(attributes.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting attribute:', error);
      alert('Erro ao excluir atributo. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleStakeholderClick = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setIsStakeholderPanelOpen(true);
  };

  const toggleNodeExpansion = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getSupportColor = (support: string): string => {
    switch (support) {
      case 'Apoiador':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'Neutro':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'Opositor':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getRelatedZones = (stakeholder: Stakeholder): ValueAttribute[] => {
    return attributes.filter(a => stakeholder.related_attributes.includes(a.id));
  };

  const renderOrgNode = (stakeholder: Stakeholder, level: number = 0) => {
    const children = stakeholders.filter(s => s.superior_id === stakeholder.id && s.show_in_orgchart);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(stakeholder.id);
    const relatedZones = getRelatedZones(stakeholder);

    return (
      <div key={stakeholder.id} className="flex flex-col items-center">
        <div
          className={`
            relative p-3 rounded-lg border-2 cursor-pointer transition-all
            hover:shadow-lg min-w-[180px]
            ${getSupportColor(stakeholder.support_level)}
            ${selectedStakeholder?.id === stakeholder.id ? 'ring-2 ring-primary' : ''}
          `}
          style={{ transform: `scale(${zoomLevel / 100})` }}
          onClick={() => handleStakeholderClick(stakeholder)}
        >
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4" />
            <span className="font-semibold text-sm">{stakeholder.name}</span>
          </div>
          <div className="text-xs opacity-80">{stakeholder.role}</div>
          <div className="text-xs opacity-60">{stakeholder.department}</div>
          
          <div className="flex items-center gap-1 mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full mr-0.5 ${
                          i < stakeholder.power_level ? 'bg-current' : 'bg-current opacity-20'
                        }`}
                      />
                    ))}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nivel de Poder: {stakeholder.power_level}/5</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {relatedZones.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {relatedZones.map(attr => (
                <Badge
                  key={attr.id}
                  variant="outline"
                  className="text-[10px] px-1 py-0"
                  style={{ borderColor: attr.zone_color, color: attr.zone_color }}
                >
                  {attr.zone}
                </Badge>
              ))}
            </div>
          )}

          {hasChildren && (
            <button
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-0.5 border shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(stakeholder.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex gap-8">
              {children.map((child, index) => (
                <div key={child.id} className="flex flex-col items-center">
                  {children.length > 1 && (
                    <div className="flex items-center">
                      {index === 0 && <div className="w-1/2" />}
                      <div
                        className={`h-px bg-gray-300 ${
                          index === 0
                            ? 'w-1/2 ml-auto'
                            : index === children.length - 1
                            ? 'w-1/2 mr-auto'
                            : 'w-full'
                        }`}
                      />
                      {index === children.length - 1 && <div className="w-1/2" />}
                    </div>
                  )}
                  <div className="w-px h-4 bg-gray-300" />
                  {renderOrgNode(child, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const rootStakeholders = stakeholders.filter(s => s.superior_id === null && s.show_in_orgchart);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {attributes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum atributo de valor cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Adicione atributos de valor para mapear a importancia e desempenho percebido pelo cliente.
            </p>
            <Button onClick={() => setIsAttributeDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Atributo
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Atributos de Valor
              </CardTitle>
              <CardDescription>
                Importancia vs Desempenho percebido
              </CardDescription>
            </div>
            <Dialog open={isAttributeDialogOpen} onOpenChange={setIsAttributeDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Atributo de Valor</DialogTitle>
                  <DialogDescription>
                    Adicione um novo atributo para avaliar o valor percebido
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Atributo</Label>
                    <Input
                      value={newAttribute.name}
                      onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                      placeholder="Ex: FinOps, Seguranca, Performance..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Importancia para o Cliente (1-5): {newAttribute.importance}</Label>
                    <Slider
                      value={[newAttribute.importance]}
                      onValueChange={(v) => setNewAttribute({ ...newAttribute, importance: v[0] })}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Desempenho Percebido (1-5): {newAttribute.performance}</Label>
                    <Slider
                      value={[newAttribute.performance]}
                      onValueChange={(v) => setNewAttribute({ ...newAttribute, performance: v[0] })}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Zona calculada:</span>
                      <Badge
                        style={{
                          backgroundColor: calculateZone(newAttribute.importance, newAttribute.performance).color,
                          color: 'white',
                        }}
                      >
                        {calculateZone(newAttribute.importance, newAttribute.performance).zone}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Acao Recomendada</Label>
                    <Textarea
                      value={newAttribute.recommended_action}
                      onChange={(e) => setNewAttribute({ ...newAttribute, recommended_action: e.target.value })}
                      placeholder="Descreva a acao recomendada..."
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAttributeDialogOpen(false)} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddAttribute} disabled={!newAttribute.name || saving}>
                    {saving ? 'Adicionando...' : 'Adicionar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {zones.map(zone => (
                <Badge
                  key={zone.id}
                  variant="outline"
                  style={{ borderColor: zone.color, color: zone.color }}
                >
                  {zone.name}: {attributes.filter(a => a.zone === zone.name).length}
                </Badge>
              ))}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atributo</TableHead>
                  <TableHead className="text-center">Imp.</TableHead>
                  <TableHead className="text-center">Desemp.</TableHead>
                  <TableHead className="text-center">Gap</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attributes.map((attr) => (
                  <TableRow
                    key={attr.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedAttribute(attr)}
                  >
                    <TableCell className="font-medium">{attr.name}</TableCell>
                    <TableCell className="text-center">{attr.importance}</TableCell>
                    <TableCell className="text-center">{attr.performance}</TableCell>
                    <TableCell className="text-center">
                      <span className={attr.gap > 0 ? 'text-red-500' : attr.gap < 0 ? 'text-green-500' : ''}>
                        {attr.gap > 0 ? `+${attr.gap}` : attr.gap}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge style={{ backgroundColor: attr.zone_color, color: 'white' }}>
                        {attr.zone}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAttribute(attr);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAttribute(attr.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedAttribute && (
              <Card className="mt-4 border-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {selectedAttribute.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-muted-foreground mb-2">
                    <strong>Acao Recomendada:</strong>
                  </p>
                  <p>{selectedAttribute.recommended_action || 'Nenhuma acao definida'}</p>
                  <Button size="sm" className="mt-3">
                    <Plus className="h-3 w-3 mr-1" />
                    Gerar Acao KAM
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organograma de Stakeholders
              </CardTitle>
              <CardDescription>
                Mapa politico da conta com zonas de valor
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center">{zoomLevel}%</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Badge variant="outline" className="bg-green-100 border-green-500 text-green-800">
                Apoiador
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 border-yellow-500 text-yellow-800">
                Neutro
              </Badge>
              <Badge variant="outline" className="bg-red-100 border-red-500 text-red-800">
                Opositor
              </Badge>
            </div>

            <div className="overflow-auto border rounded-lg p-6 bg-gray-50 min-h-[400px]">
              <div className="flex justify-center">
                {rootStakeholders.map(stakeholder => renderOrgNode(stakeholder))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isStakeholderPanelOpen && selectedStakeholder && (
        <Card className="border-primary">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {selectedStakeholder.name}
              </CardTitle>
              <CardDescription>
                {selectedStakeholder.role} - {selectedStakeholder.department}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsStakeholderPanelOpen(false)}>
              Fechar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Informacoes</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nivel de Poder:</span>
                    <span className="font-medium">{selectedStakeholder.power_level}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nivel de Apoio:</span>
                    <Badge
                      variant="outline"
                      className={getSupportColor(selectedStakeholder.support_level)}
                    >
                      {selectedStakeholder.support_level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Relacionamento:</span>
                    <span className="font-medium">{selectedStakeholder.relationship_level}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Atributos de Valor Relevantes</h4>
                <div className="space-y-2">
                  {getRelatedZones(selectedStakeholder).map(attr => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{attr.name}</span>
                      <Badge style={{ backgroundColor: attr.zone_color, color: 'white' }}>
                        {attr.zone}
                      </Badge>
                    </div>
                  ))}
                  {getRelatedZones(selectedStakeholder).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Nenhum atributo vinculado
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Acoes</h4>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Plus className="h-3 w-3 mr-1" />
                    Nova Acao KAM
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Historico de Interacoes
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Editar Stakeholder
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatrizValor;

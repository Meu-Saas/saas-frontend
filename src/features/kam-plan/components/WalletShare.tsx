import React, { useState, useEffect } from 'react';
import { kamPlanAPI } from '../../../services/api';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
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
import { Plus, TrendingUp } from 'lucide-react';
import type { WalletShareLine } from '../types';

interface WalletShareProps {
  accountId: string;
}

export const WalletShare: React.FC<WalletShareProps> = ({ accountId }) => {
  const [lines, setLines] = useState<WalletShareLine[]>([]);
  const [isAddingLine, setIsAddingLine] = useState(false);
  const [newLine, setNewLine] = useState<Partial<WalletShareLine>>({
    business_line: '',
    annual_potential: 0,
    current_revenue: 0,
    priority: 'medium',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        priority: newLine.priority || 'medium',
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

  const handleDeleteLine = async (id: string) => {
    if (!accountId) return;
    setSaving(true);
    try {
      await kamPlanAPI.deleteWalletShareItem(accountId, Number(id));
      setLines(lines.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting wallet share item:', error);
      alert('Erro ao remover linha. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
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
                <Input
                  type="number"
                  value={newLine.annual_potential}
                  onChange={(e) => setNewLine({ ...newLine, annual_potential: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Receita Atual (R$)</Label>
                <Input
                  type="number"
                  value={newLine.current_revenue}
                  onChange={(e) => setNewLine({ ...newLine, current_revenue: parseFloat(e.target.value) || 0 })}
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

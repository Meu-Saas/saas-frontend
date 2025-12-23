import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Slider } from '../components/ui/slider';
import {
  Target,
  Building2,
  TrendingUp,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PrioritizationCriteria {
  id: number;
  name: string;
  description: string;
  weight: number;
}

interface AccountScore {
  criteria_id: number;
  criteria_name: string;
  score: number;
  weighted_score: number;
}

interface AccountWithPrioritization {
  id: number;
  name: string;
  segment: string;
  category_name: string;
  category_color: string;
  kam_name: string;
  total_score: number;
  abc_category: string;
  scores: AccountScore[];
}

interface ABCThreshold {
  category: string;
  min_score: number;
  max_score: number;
  color: string;
}

const defaultCriteria: PrioritizationCriteria[] = [
  { id: 1, name: 'Potencial de Receita', description: 'Potencial de faturamento anual', weight: 25 },
  { id: 2, name: 'Alinhamento Estrategico', description: 'Alinhamento com a estrategia da empresa', weight: 20 },
  { id: 3, name: 'Complexidade de Relacionamento', description: 'Facilidade de relacionamento com a conta', weight: 15 },
  { id: 4, name: 'Engajamento Atual', description: 'Nivel de engajamento atual com a conta', weight: 15 },
  { id: 5, name: 'Oportunidade de Expansao', description: 'Potencial de expansao de negocios', weight: 15 },
  { id: 6, name: 'Patrocinio Executivo', description: 'Nivel de patrocinio executivo na conta', weight: 10 },
];

const defaultThresholds: ABCThreshold[] = [
  { category: 'A', min_score: 70, max_score: 100, color: '#22C55E' },
  { category: 'B', min_score: 40, max_score: 69, color: '#EAB308' },
  { category: 'C', min_score: 0, max_score: 39, color: '#EF4444' },
];

export const Prioritization: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AccountWithPrioritization[]>([]);
  const [criteria] = useState<PrioritizationCriteria[]>(defaultCriteria);
  const [thresholds] = useState<ABCThreshold[]>(defaultThresholds);
  const [selectedAccount, setSelectedAccount] = useState<AccountWithPrioritization | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScores, setEditingScores] = useState<{ [key: number]: number }>({});
  const [filters, setFilters] = useState({
    segment: '',
    category: '',
    kam: '',
    minScore: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const mockAccounts: AccountWithPrioritization[] = [
      {
        id: 1,
        name: 'Empresa ABC Ltda',
        segment: 'Tecnologia',
        category_name: 'Estrategica',
        category_color: '#8B5CF6',
        kam_name: 'Joao Silva',
        total_score: 78,
        abc_category: 'A',
        scores: defaultCriteria.map(c => ({
          criteria_id: c.id,
          criteria_name: c.name,
          score: Math.floor(Math.random() * 5) + 1,
          weighted_score: 0,
        })),
      },
      {
        id: 2,
        name: 'Tech Solutions SA',
        segment: 'Servicos',
        category_name: 'A',
        category_color: '#22C55E',
        kam_name: 'Maria Santos',
        total_score: 65,
        abc_category: 'B',
        scores: defaultCriteria.map(c => ({
          criteria_id: c.id,
          criteria_name: c.name,
          score: Math.floor(Math.random() * 5) + 1,
          weighted_score: 0,
        })),
      },
      {
        id: 3,
        name: 'Global Industries',
        segment: 'Industria',
        category_name: 'B',
        category_color: '#EAB308',
        kam_name: 'Pedro Costa',
        total_score: 45,
        abc_category: 'B',
        scores: defaultCriteria.map(c => ({
          criteria_id: c.id,
          criteria_name: c.name,
          score: Math.floor(Math.random() * 5) + 1,
          weighted_score: 0,
        })),
      },
      {
        id: 4,
        name: 'Startup Inovadora',
        segment: 'Tecnologia',
        category_name: 'C',
        category_color: '#EF4444',
        kam_name: 'Ana Oliveira',
        total_score: 32,
        abc_category: 'C',
        scores: defaultCriteria.map(c => ({
          criteria_id: c.id,
          criteria_name: c.name,
          score: Math.floor(Math.random() * 5) + 1,
          weighted_score: 0,
        })),
      },
    ];
    setAccounts(mockAccounts);
  };

  const handleAccountClick = (account: AccountWithPrioritization) => {
    setSelectedAccount(account);
    const scores: { [key: number]: number } = {};
    account.scores.forEach(s => {
      scores[s.criteria_id] = s.score;
    });
    setEditingScores(scores);
    setIsDialogOpen(true);
  };

  const handleSaveScores = () => {
    if (!selectedAccount) return;

    let totalWeightedScore = 0;
    const updatedScores = selectedAccount.scores.map(s => {
      const score = editingScores[s.criteria_id] || 0;
      const criterion = criteria.find(c => c.id === s.criteria_id);
      const weightedScore = criterion ? (score / 5) * criterion.weight : 0;
      totalWeightedScore += weightedScore;
      return {
        ...s,
        score,
        weighted_score: weightedScore,
      };
    });

    const abcCategory = getABCCategory(totalWeightedScore);

    const updatedAccount: AccountWithPrioritization = {
      ...selectedAccount,
      scores: updatedScores,
      total_score: Math.round(totalWeightedScore),
      abc_category: abcCategory,
    };

    setAccounts(accounts.map(a => a.id === selectedAccount.id ? updatedAccount : a));
    setIsDialogOpen(false);
  };

  const getABCCategory = (score: number): string => {
    for (const threshold of thresholds) {
      if (score >= threshold.min_score && score <= threshold.max_score) {
        return threshold.category;
      }
    }
    return 'C';
  };

  const getABCColor = (category: string): string => {
    const threshold = thresholds.find(t => t.category === category);
    return threshold?.color || '#6B7280';
  };

  const filteredAccounts = accounts.filter(account => {
    if (filters.segment && account.segment !== filters.segment) return false;
    if (filters.category && account.abc_category !== filters.category) return false;
    if (filters.minScore && account.total_score < parseInt(filters.minScore)) return false;
    return true;
  });

  const sortedAccounts = [...filteredAccounts].sort((a, b) => b.total_score - a.total_score);

  const uniqueSegments = [...new Set(accounts.map(a => a.segment))];

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Matriz de Priorizacao</h1>
            <p className="text-muted-foreground">
              Classifique suas contas com base em criterios estrategicos (Curva ABC)
            </p>
          </div>
          <Button variant="outline" onClick={loadAccounts}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categoria A</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {accounts.filter(a => a.abc_category === 'A').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categoria B</CardTitle>
              <Target className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {accounts.filter(a => a.abc_category === 'B').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categoria C</CardTitle>
              <Target className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {accounts.filter(a => a.abc_category === 'C').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Segmento</Label>
                <Select
                  value={filters.segment}
                  onValueChange={(value) => setFilters({ ...filters, segment: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {uniqueSegments.map(seg => (
                      <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoria ABC</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters({ ...filters, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Score Minimo</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minScore}
                  onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ segment: '', category: '', kam: '', minScore: '' })}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Contas Priorizadas
            </CardTitle>
            <CardDescription>
              Clique em uma conta para editar os criterios de priorizacao
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conta</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>KAM</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>ABC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAccounts.map((account) => (
                  <TableRow
                    key={account.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleAccountClick(account)}
                  >
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.segment}</TableCell>
                    <TableCell>
                      <Badge
                        style={{ backgroundColor: account.category_color }}
                        className="text-white"
                      >
                        {account.category_name}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.kam_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${account.total_score}%`,
                              backgroundColor: getABCColor(account.abc_category),
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{account.total_score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{ backgroundColor: getABCColor(account.abc_category) }}
                        className="text-white font-bold"
                      >
                        {account.abc_category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedAccount && (
              <>
                <DialogHeader>
                  <DialogTitle>Editar Criterios - {selectedAccount.name}</DialogTitle>
                  <DialogDescription>
                    Avalie cada criterio de 1 a 5 para calcular o score de priorizacao
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {criteria.map((criterion) => (
                    <div key={criterion.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">{criterion.name}</Label>
                          <p className="text-sm text-muted-foreground">{criterion.description}</p>
                        </div>
                        <Badge variant="outline">Peso: {criterion.weight}%</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[editingScores[criterion.id] || 1]}
                          onValueChange={(value) => {
                            setEditingScores({ ...editingScores, [criterion.id]: value[0] });
                          }}
                          min={1}
                          max={5}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-bold text-lg">
                          {editingScores[criterion.id] || 1}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">Score Calculado:</span>
                      <span className="text-2xl font-bold">
                        {Math.round(
                          criteria.reduce((total, c) => {
                            const score = editingScores[c.id] || 1;
                            return total + (score / 5) * c.weight;
                          }, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveScores}>Salvar</Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/accounts/${selectedAccount.id}`)}
                  >
                    Abrir Conta
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
};

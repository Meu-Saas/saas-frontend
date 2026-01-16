import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
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
import {
  BarChart3,
  TrendingUp,
  Activity,
  Heart,
  Users,
  Target,
  Download,
  Filter,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
}

interface ForecastData {
  month: string;
  projected: number;
  actual: number;
  confidence: number;
}

interface ActivityReport {
  kam_name: string;
  total_activities: number;
  completed: number;
  pending: number;
  overdue: number;
  by_type: { type: string; count: number }[];
}

interface AccountHealth {
  account_name: string;
  prioritization_score: number;
  abc_category: string;
  value_gap: number;
  risk_count: number;
  engagement_score: number;
  health_status: string;
}

interface ValueStakeholderReport {
  account_name: string;
  stakeholder_count: number;
  supporter_percentage: number;
  imbativel_count: number;
  vulneravel_count: number;
}

interface KamPlanExecution {
  account_name: string;
  total_actions: number;
  completed_actions: number;
  completion_rate: number;
  strategic_pillars: number;
}

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [dateRange, setDateRange] = useState('month');
  const [selectedKam, setSelectedKam] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [pipelineData, setPipelineData] = useState<PipelineStage[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [activityReports, setActivityReports] = useState<ActivityReport[]>([]);
  const [accountHealthData, setAccountHealthData] = useState<AccountHealth[]>([]);
  const [valueStakeholderData, setValueStakeholderData] = useState<ValueStakeholderReport[]>([]);
  const [kamPlanData, setKamPlanData] = useState<KamPlanExecution[]>([]);

  useEffect(() => {
    loadReportData();
  }, [dateRange, selectedKam, selectedSegment]);

  const loadReportData = () => {
    setPipelineData([
      { name: 'Prospeccao', count: 15, value: 450000, color: '#94A3B8' },
      { name: 'Qualificacao', count: 12, value: 380000, color: '#60A5FA' },
      { name: 'Proposta', count: 8, value: 520000, color: '#FBBF24' },
      { name: 'Negociacao', count: 5, value: 350000, color: '#F97316' },
      { name: 'Fechamento', count: 3, value: 280000, color: '#22C55E' },
    ]);

    setForecastData([
      { month: 'Jan', projected: 150000, actual: 145000, confidence: 95 },
      { month: 'Fev', projected: 180000, actual: 175000, confidence: 92 },
      { month: 'Mar', projected: 200000, actual: 210000, confidence: 88 },
      { month: 'Abr', projected: 220000, actual: 0, confidence: 75 },
      { month: 'Mai', projected: 250000, actual: 0, confidence: 60 },
      { month: 'Jun', projected: 280000, actual: 0, confidence: 45 },
    ]);

    setActivityReports([
      {
        kam_name: 'Carlos Silva',
        total_activities: 45,
        completed: 38,
        pending: 5,
        overdue: 2,
        by_type: [
          { type: 'Reuniao', count: 15 },
          { type: 'Ligacao', count: 12 },
          { type: 'Email', count: 10 },
          { type: 'Tarefa', count: 8 },
        ],
      },
      {
        kam_name: 'Ana Santos',
        total_activities: 52,
        completed: 48,
        pending: 3,
        overdue: 1,
        by_type: [
          { type: 'Reuniao', count: 20 },
          { type: 'Ligacao', count: 15 },
          { type: 'Email', count: 12 },
          { type: 'Tarefa', count: 5 },
        ],
      },
      {
        kam_name: 'Roberto Lima',
        total_activities: 38,
        completed: 30,
        pending: 4,
        overdue: 4,
        by_type: [
          { type: 'Reuniao', count: 12 },
          { type: 'Ligacao', count: 10 },
          { type: 'Email', count: 8 },
          { type: 'Tarefa', count: 8 },
        ],
      },
    ]);

    setAccountHealthData([
      {
        account_name: 'Empresa Alpha',
        prioritization_score: 85,
        abc_category: 'A',
        value_gap: 2,
        risk_count: 1,
        engagement_score: 90,
        health_status: 'Saudavel',
      },
      {
        account_name: 'Empresa Beta',
        prioritization_score: 72,
        abc_category: 'A',
        value_gap: 5,
        risk_count: 2,
        engagement_score: 75,
        health_status: 'Atencao',
      },
      {
        account_name: 'Empresa Gamma',
        prioritization_score: 55,
        abc_category: 'B',
        value_gap: 8,
        risk_count: 3,
        engagement_score: 45,
        health_status: 'Critico',
      },
      {
        account_name: 'Empresa Delta',
        prioritization_score: 68,
        abc_category: 'B',
        value_gap: 3,
        risk_count: 1,
        engagement_score: 80,
        health_status: 'Saudavel',
      },
    ]);

    setValueStakeholderData([
      {
        account_name: 'Empresa Alpha',
        stakeholder_count: 8,
        supporter_percentage: 75,
        imbativel_count: 3,
        vulneravel_count: 1,
      },
      {
        account_name: 'Empresa Beta',
        stakeholder_count: 6,
        supporter_percentage: 50,
        imbativel_count: 2,
        vulneravel_count: 2,
      },
      {
        account_name: 'Empresa Gamma',
        stakeholder_count: 5,
        supporter_percentage: 40,
        imbativel_count: 1,
        vulneravel_count: 3,
      },
      {
        account_name: 'Empresa Delta',
        stakeholder_count: 7,
        supporter_percentage: 85,
        imbativel_count: 4,
        vulneravel_count: 0,
      },
    ]);

    setKamPlanData([
      {
        account_name: 'Empresa Alpha',
        total_actions: 12,
        completed_actions: 10,
        completion_rate: 83,
        strategic_pillars: 4,
      },
      {
        account_name: 'Empresa Beta',
        total_actions: 8,
        completed_actions: 5,
        completion_rate: 62,
        strategic_pillars: 3,
      },
      {
        account_name: 'Empresa Gamma',
        total_actions: 10,
        completed_actions: 3,
        completion_rate: 30,
        strategic_pillars: 2,
      },
      {
        account_name: 'Empresa Delta',
        total_actions: 15,
        completed_actions: 14,
        completion_rate: 93,
        strategic_pillars: 5,
      },
    ]);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

    const getHealthColor = (status: string) => {
      switch (status) {
        case 'Saudavel':
          return 'bg-green-100 text-green-800';
        case 'Atencao':
          return 'bg-yellow-100 text-yellow-800';
        case 'Critico':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const handleExport = () => {
      const data = {
        pipeline: pipelineData,
        forecast: forecastData,
        activities: activityReports,
        health: accountHealthData,
        value: valueStakeholderData,
        kamPlan: kamPlanData,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-kam-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const handleSaveView = () => {
      const viewConfig = { dateRange, selectedKam, selectedSegment, selectedCategory, activeTab };
      localStorage.setItem('kam-report-view', JSON.stringify(viewConfig));
      alert('Visao salva com sucesso!');
    };

    const handleViewPlan = (accountName: string) => {
      navigate(`/accounts?search=${encodeURIComponent(accountName)}`);
    };

    const handleViewOrganogram = (accountName: string) => {
      navigate(`/accounts?search=${encodeURIComponent(accountName)}`);
    };

    const totalPipelineValue = pipelineData.reduce((sum, stage) => sum + stage.value, 0);
  const totalOpportunities = pipelineData.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatorios</h1>
          <p className="text-muted-foreground">
            Analise de performance e metricas do CRM KAM
          </p>
        </div>
        <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleSaveView}>
                      <Star className="h-4 w-4 mr-2" />
                      Salvar Visao
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Periodo</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Ultima Semana</SelectItem>
                  <SelectItem value="month">Ultimo Mes</SelectItem>
                  <SelectItem value="quarter">Ultimo Trimestre</SelectItem>
                  <SelectItem value="year">Ultimo Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>KAM</Label>
              <Select value={selectedKam} onValueChange={setSelectedKam}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="carlos">Carlos Silva</SelectItem>
                  <SelectItem value="ana">Ana Santos</SelectItem>
                  <SelectItem value="roberto">Roberto Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Segmento</Label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="tech">Tecnologia</SelectItem>
                  <SelectItem value="finance">Financeiro</SelectItem>
                  <SelectItem value="retail">Varejo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="a">Categoria A</SelectItem>
                  <SelectItem value="b">Categoria B</SelectItem>
                  <SelectItem value="c">Categoria C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto">
          <TabsTrigger value="pipeline" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden md:inline">Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Atividades</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="hidden md:inline">Saude</span>
          </TabsTrigger>
          <TabsTrigger value="value" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Valor</span>
          </TabsTrigger>
          <TabsTrigger value="kam-plan" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden md:inline">Plano KAM</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor Total do Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOpportunities}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ticket Medio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalPipelineValue / totalOpportunities)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline por Etapa</CardTitle>
              <CardDescription>Distribuicao de oportunidades e valores por etapa do funil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineData.map((stage) => (
                  <div key={stage.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stage.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {stage.count} oportunidades
                        </span>
                        <span className="font-semibold">{formatCurrency(stage.value)}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(stage.value / totalPipelineValue) * 100}%`,
                          backgroundColor: stage.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Previsao de Receita
              </CardTitle>
              <CardDescription>Projecao de receita por mes com nivel de confianca</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead className="text-right">Projetado</TableHead>
                    <TableHead className="text-right">Realizado</TableHead>
                    <TableHead className="text-right">Variacao</TableHead>
                    <TableHead className="text-right">Confianca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecastData.map((data) => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">{data.month}</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.projected)}</TableCell>
                      <TableCell className="text-right">
                        {data.actual > 0 ? formatCurrency(data.actual) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.actual > 0 ? (
                          <span
                            className={
                              data.actual >= data.projected ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {((data.actual - data.projected) / data.projected * 100).toFixed(1)}%
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            data.confidence >= 80
                              ? 'border-green-500 text-green-700'
                              : data.confidence >= 60
                              ? 'border-yellow-500 text-yellow-700'
                              : 'border-red-500 text-red-700'
                          }
                        >
                          {data.confidence}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Relatorio de Atividades por KAM
              </CardTitle>
              <CardDescription>Volume e status de atividades por responsavel</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KAM</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Concluidas
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Pendentes
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Atrasadas
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Taxa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityReports.map((report) => (
                    <TableRow key={report.kam_name}>
                      <TableCell className="font-medium">{report.kam_name}</TableCell>
                      <TableCell className="text-center">{report.total_activities}</TableCell>
                      <TableCell className="text-center text-green-600">{report.completed}</TableCell>
                      <TableCell className="text-center text-yellow-600">{report.pending}</TableCell>
                      <TableCell className="text-center text-red-600">{report.overdue}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            (report.completed / report.total_activities) >= 0.8
                              ? 'border-green-500 text-green-700'
                              : 'border-yellow-500 text-yellow-700'
                          }
                        >
                          {((report.completed / report.total_activities) * 100).toFixed(0)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Saude das Contas
              </CardTitle>
              <CardDescription>
                Analise combinada de priorizacao, valor, riscos e engajamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">ABC</TableHead>
                    <TableHead className="text-center">Gap Valor</TableHead>
                    <TableHead className="text-center">Riscos</TableHead>
                    <TableHead className="text-center">Engajamento</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountHealthData.map((account) => (
                    <TableRow key={account.account_name}>
                      <TableCell className="font-medium">{account.account_name}</TableCell>
                      <TableCell className="text-center">{account.prioritization_score}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{account.abc_category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={account.value_gap > 5 ? 'text-red-600' : ''}>
                          {account.value_gap}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={account.risk_count > 2 ? 'text-red-600' : ''}>
                          {account.risk_count}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{account.engagement_score}%</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getHealthColor(account.health_status)}>
                          {account.health_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="value" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mapa de Valor & Stakeholders
              </CardTitle>
              <CardDescription>
                Analise de stakeholders mapeados e atributos de valor por conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta</TableHead>
                    <TableHead className="text-center">Stakeholders</TableHead>
                    <TableHead className="text-center">% Apoiadores</TableHead>
                    <TableHead className="text-center">
                      <Badge className="bg-green-500">Imbativel</Badge>
                    </TableHead>
                    <TableHead className="text-center">
                      <Badge className="bg-red-500">Vulneravel</Badge>
                    </TableHead>
                    <TableHead className="text-center">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {valueStakeholderData.map((data) => (
                    <TableRow key={data.account_name}>
                      <TableCell className="font-medium">{data.account_name}</TableCell>
                      <TableCell className="text-center">{data.stakeholder_count}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={
                            data.supporter_percentage >= 70
                              ? 'text-green-600'
                              : data.supporter_percentage >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }
                        >
                          {data.supporter_percentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-green-600">
                        {data.imbativel_count}
                      </TableCell>
                      <TableCell className="text-center text-red-600">
                        {data.vulneravel_count}
                      </TableCell>
                      <TableCell className="text-center">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewOrganogram(data.account_name)}>
                                                  Ver Organograma
                                                </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kam-plan" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Execucao do Plano KAM
              </CardTitle>
              <CardDescription>
                Acompanhamento de acoes e pilares estrategicos por conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta</TableHead>
                    <TableHead className="text-center">Total Acoes</TableHead>
                    <TableHead className="text-center">Concluidas</TableHead>
                    <TableHead className="text-center">Taxa</TableHead>
                    <TableHead className="text-center">Pilares Estrategicos</TableHead>
                    <TableHead className="text-center">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kamPlanData.map((data) => (
                    <TableRow key={data.account_name}>
                      <TableCell className="font-medium">{data.account_name}</TableCell>
                      <TableCell className="text-center">{data.total_actions}</TableCell>
                      <TableCell className="text-center">{data.completed_actions}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            data.completion_rate >= 80
                              ? 'border-green-500 text-green-700'
                              : data.completion_rate >= 50
                              ? 'border-yellow-500 text-yellow-700'
                              : 'border-red-500 text-red-700'
                          }
                        >
                          {data.completion_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{data.strategic_pillars}/6</TableCell>
                      <TableCell className="text-center">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewPlan(data.account_name)}>
                                                  Ver Plano
                                                </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

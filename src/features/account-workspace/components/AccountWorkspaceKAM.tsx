import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { accountsAPI } from '../../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Building2,
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  BarChart3,
  Calendar,
  Lightbulb,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { KAMPlanTabs } from '../../kam-plan/components/KAMPlanTabs';

interface Account {
  id: number;
  name: string;
  segment?: string;
  status?: string;
  health_score?: number;
  kam_name?: string;
  main_contact?: string;
  annual_revenue?: number;
}

interface AccountWorkspaceKAMProps {
  accountId?: string;
}

export const AccountWorkspaceKAM: React.FC<AccountWorkspaceKAMProps> = ({ accountId: propAccountId }) => {
  const params = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const accountId = propAccountId || params.accountId || '';
  
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'kam-plan' | 'meetings' | 'insights' | 'actions'>('overview');

  useEffect(() => {
    if (accountId) {
      loadAccount();
    }
  }, [accountId]);

  const loadAccount = async () => {
    setLoading(true);
    try {
      const data = await accountsAPI.getAccount(Number(accountId));
      setAccount(data);
    } catch (error) {
      console.error('Error loading account:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      case 'churned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando workspace...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-lg text-muted-foreground">Conta nao encontrada</div>
        <Button variant="outline" onClick={() => navigate('/accounts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Contas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold">{account.name}</h1>
              <Badge className={getStatusColor(account.status)}>
                {account.status === 'active' ? 'Ativo' : 
                 account.status === 'prospect' ? 'Prospect' :
                 account.status === 'at_risk' ? 'Em Risco' :
                 account.status === 'churned' ? 'Churned' : account.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {account.segment} {account.kam_name && `| KAM: ${account.kam_name}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadAccount}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Saude da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={getHealthColor(account.health_score)}>
                {account.health_score || 0}%
              </Badge>
              <span className="text-sm text-muted-foreground">
                {account.health_score && account.health_score >= 80 ? 'Saudavel' :
                 account.health_score && account.health_score >= 60 ? 'Atencao' :
                 account.health_score && account.health_score >= 40 ? 'Alerta' : 'Critico'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Receita Anual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(account.annual_revenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contato Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{account.main_contact || 'Nao definido'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Segmento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{account.segment || 'Nao definido'}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as typeof activeSection)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden md:inline">Visao Geral</span>
          </TabsTrigger>
          <TabsTrigger value="kam-plan" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden md:inline">Plano KAM</span>
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Reunioes</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden md:inline">Insights IA</span>
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden md:inline">Proximas Acoes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Conta</CardTitle>
                <CardDescription>Informacoes principais e status atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{account.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Segmento:</span>
                  <span className="font-medium">{account.segment || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saude:</span>
                  <Badge className={getHealthColor(account.health_score)}>{account.health_score || 0}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KAM:</span>
                  <span className="font-medium">{account.kam_name || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acoes Rapidas</CardTitle>
                <CardDescription>Acoes frequentes para esta conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveSection('kam-plan')}>
                  <Target className="mr-2 h-4 w-4" />
                  Abrir Plano KAM
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveSection('meetings')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Registrar Reuniao
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveSection('insights')}>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Ver Insights IA
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setActiveSection('actions')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Gerenciar Acoes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kam-plan" className="mt-6">
          <KAMPlanTabs accountId={accountId} />
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reunioes
              </CardTitle>
              <CardDescription>Historico de reunioes e analises de IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Modulo de reunioes em desenvolvimento</p>
                <p className="text-sm mt-2">Em breve: Upload de reunioes, transcricao e analise por IA</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Insights IA
              </CardTitle>
              <CardDescription>Insights gerados automaticamente pela IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Modulo de insights em desenvolvimento</p>
                <p className="text-sm mt-2">Em breve: Analise de saude, oportunidades de crescimento, alertas de risco</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Proximas Acoes
              </CardTitle>
              <CardDescription>Acoes pendentes e recomendadas pela IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Modulo de acoes em desenvolvimento</p>
                <p className="text-sm mt-2">Em breve: Lista de acoes, prioridades, follow-ups automaticos</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

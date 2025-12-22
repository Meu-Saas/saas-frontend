import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Building2, Calendar, TrendingUp, AlertCircle, Plus, Users } from 'lucide-react';

interface DashboardStats {
  totalAccounts: number;
  strategicAccounts: number;
  totalOpportunities: number;
  pipelineValue: number;
  todayActivities: number;
  overdueActivities: number;
}

interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
}

interface TopAccount {
  id: string;
  name: string;
  category: string;
  potential: number;
  lastInteraction: string;
}

interface TodayActivity {
  id: string;
  title: string;
  type: string;
  accountName: string;
  time: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAccounts: 0,
    strategicAccounts: 0,
    totalOpportunities: 0,
    pipelineValue: 0,
    todayActivities: 0,
    overdueActivities: 0,
  });
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [topAccounts, setTopAccounts] = useState<TopAccount[]>([]);
  const [todayActivities, setTodayActivities] = useState<TodayActivity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setStats({
        totalAccounts: 0,
        strategicAccounts: 0,
        totalOpportunities: 0,
        pipelineValue: 0,
        todayActivities: 0,
        overdueActivities: 0,
      });
      setPipelineStages([
        { name: 'Lead', count: 0, value: 0, color: 'bg-gray-500' },
        { name: 'Qualificado', count: 0, value: 0, color: 'bg-blue-500' },
        { name: 'Proposta', count: 0, value: 0, color: 'bg-yellow-500' },
        { name: 'Negociacao', count: 0, value: 0, color: 'bg-orange-500' },
        { name: 'Ganho', count: 0, value: 0, color: 'bg-green-500' },
      ]);
      setTopAccounts([]);
      setTodayActivities([]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visao geral do seu portfolio de contas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Estrategicas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.strategicAccounts}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.totalAccounts} contas totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Pipeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pipelineValue)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalOpportunities} oportunidades abertas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayActivities}</div>
            <p className="text-xs text-muted-foreground">tarefas para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.overdueActivities}</div>
            <p className="text-xs text-muted-foreground">atividades atrasadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de Oportunidades</CardTitle>
            <CardDescription>Valor por etapa do funil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="text-sm">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{stage.count}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formatCurrency(stage.value)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/opportunities')}
            >
              Ver Pipeline Completo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contas em Destaque</CardTitle>
            <CardDescription>Top contas por potencial</CardDescription>
          </CardHeader>
          <CardContent>
            {topAccounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma conta cadastrada</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/accounts')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Conta
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {topAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-md -mx-2"
                    onClick={() => navigate(`/accounts/${account.id}`)}
                  >
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Categoria {account.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(account.potential)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {account.lastInteraction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Atividades do Dia</CardTitle>
            <CardDescription>Tarefas e compromissos para hoje</CardDescription>
          </div>
          <Button onClick={() => navigate('/activities')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Button>
        </CardHeader>
        <CardContent>
          {todayActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade para hoje</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.type} - {activity.accountName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                    <Button variant="outline" size="sm">
                      Concluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { accountsAPI, meetingsAPI, opportunitiesAPI } from '../services/api';
import { Account, Meeting, Opportunity, KAMStage, OpportunityStatus } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, FileText, TrendingUp, LogOut, Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [accountsData, meetingsData, opportunitiesData] = await Promise.all([
        accountsAPI.getAll(),
        meetingsAPI.getAll(),
        opportunitiesAPI.getAll(),
      ]);
      setAccounts(accountsData);
      setMeetings(meetingsData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const accountsByStage = {
    [KAMStage.DISCOVERY]: accounts.filter(a => a.kam_stage === KAMStage.DISCOVERY).length,
    [KAMStage.DEVELOPMENT]: accounts.filter(a => a.kam_stage === KAMStage.DEVELOPMENT).length,
    [KAMStage.EXPANSION]: accounts.filter(a => a.kam_stage === KAMStage.EXPANSION).length,
    [KAMStage.RETENTION]: accounts.filter(a => a.kam_stage === KAMStage.RETENTION).length,
  };

  const opportunitiesByStatus = {
    [OpportunityStatus.LEAD]: opportunities.filter(o => o.status === OpportunityStatus.LEAD).length,
    [OpportunityStatus.QUALIFIED]: opportunities.filter(o => o.status === OpportunityStatus.QUALIFIED).length,
    [OpportunityStatus.PROPOSAL]: opportunities.filter(o => o.status === OpportunityStatus.PROPOSAL).length,
    [OpportunityStatus.NEGOTIATION]: opportunities.filter(o => o.status === OpportunityStatus.NEGOTIATION).length,
    [OpportunityStatus.WON]: opportunities.filter(o => o.status === OpportunityStatus.WON).length,
    [OpportunityStatus.LOST]: opportunities.filter(o => o.status === OpportunityStatus.LOST).length,
  };

  const totalValue = opportunities
    .filter(o => o.status !== OpportunityStatus.LOST && o.value)
    .reduce((sum, o) => sum + (o.value || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">KAM CRM</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm text-gray-600">Bem-vindo, {user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">Contas-chave ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reuniões</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meetings.length}</div>
              <p className="text-xs text-muted-foreground">Total de reuniões registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor do Pipeline</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <p className="text-xs text-muted-foreground">{opportunities.length} oportunidades</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline KAM</CardTitle>
              <CardDescription>Contas por estágio do ciclo de vida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Descoberta</span>
                  </div>
                  <span className="text-sm font-medium">{accountsByStage[KAMStage.DISCOVERY]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Desenvolvimento</span>
                  </div>
                  <span className="text-sm font-medium">{accountsByStage[KAMStage.DEVELOPMENT]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Expansão</span>
                  </div>
                  <span className="text-sm font-medium">{accountsByStage[KAMStage.EXPANSION]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Retenção</span>
                  </div>
                  <span className="text-sm font-medium">{accountsByStage[KAMStage.RETENTION]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline de Oportunidades</CardTitle>
              <CardDescription>Oportunidades por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lead</span>
                  <span className="text-sm font-medium">{opportunitiesByStatus[OpportunityStatus.LEAD]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Qualificado</span>
                  <span className="text-sm font-medium">{opportunitiesByStatus[OpportunityStatus.QUALIFIED]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proposta</span>
                  <span className="text-sm font-medium">{opportunitiesByStatus[OpportunityStatus.PROPOSAL]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Negociação</span>
                  <span className="text-sm font-medium">{opportunitiesByStatus[OpportunityStatus.NEGOTIATION]}</span>
                </div>
                <div className="flex items-center justify-between text-green-600">
                  <span className="text-sm font-medium">Ganho</span>
                  <span className="text-sm font-medium">{opportunitiesByStatus[OpportunityStatus.WON]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button onClick={() => navigate('/accounts')} className="h-14 sm:h-20">
            <Users className="w-5 h-5 mr-2" />
            Gerenciar Contas
          </Button>
          <Button onClick={() => navigate('/meetings')} className="h-14 sm:h-20">
            <FileText className="w-5 h-5 mr-2" />
            Gerenciar Reuniões
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reuniões Recentes</CardTitle>
            <CardDescription>Atividade recente de reuniões</CardDescription>
          </CardHeader>
          <CardContent>
            {meetings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma reunião ainda</p>
                <Button onClick={() => navigate('/meetings')} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Reunião
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {meetings.slice(0, 5).map((meeting) => {
                  const account = accounts.find(a => a.id === meeting.account_id);
                  return (
                    <div key={meeting.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-gray-500">{account?.name || 'Conta Desconhecida'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm break-words">{new Date(meeting.meeting_date).toLocaleDateString('pt-BR')}</p>
                        {meeting.has_ai_analysis && (
                          <span className="text-xs text-green-600">Analisado por IA</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

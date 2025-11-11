import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { meetingsAPI, accountsAPI } from '../services/api';
import { Meeting, Account, AIInsight } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';

export const Meetings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountFilter = searchParams.get('account');
  
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [formData, setFormData] = useState({
    account_id: accountFilter || '',
    title: '',
    meeting_date: new Date().toISOString().slice(0, 16),
    transcription: '',
    participants: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meetingsData, accountsData] = await Promise.all([
        meetingsAPI.getAll(),
        accountsAPI.getAll(),
      ]);
      setMeetings(meetingsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await meetingsAPI.create(formData);
      setShowDialog(false);
      setFormData({
        account_id: accountFilter || '',
        title: '',
        meeting_date: new Date().toISOString().slice(0, 16),
        transcription: '',
        participants: '',
      });
      loadData();
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const loadInsights = async (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setLoadingInsights(true);
    setInsights(null);
    
    try {
      const data = await meetingsAPI.getInsights(meeting.id);
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const filteredMeetings = accountFilter
    ? meetings.filter(m => m.account_id === accountFilter)
    : meetings;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Reuniões</h1>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Reunião
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nova Reunião</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Conta</Label>
                  <Select
                    value={formData.account_id}
                    onValueChange={(value) => setFormData({ ...formData, account_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Reunião</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data da Reunião</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.meeting_date}
                    onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Participantes</Label>
                  <Input
                    id="participants"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="João Silva, Maria Santos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transcription">Notas / Transcrição da Reunião</Label>
                  <Textarea
                    id="transcription"
                    value={formData.transcription}
                    onChange={(e) => setFormData({ ...formData, transcription: e.target.value })}
                    rows={8}
                    required
                    placeholder="Digite as notas ou transcrição da reunião..."
                  />
                </div>
                <Button type="submit" className="w-full">Criar Reunião</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Histórico de Reuniões</h2>
            {filteredMeetings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">Nenhuma reunião ainda</p>
                  <Button onClick={() => setShowDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Primeira Reunião
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredMeetings.map((meeting) => {
                  const account = accounts.find(a => a.id === meeting.account_id);
                  return (
                    <Card
                      key={meeting.id}
                      className={`cursor-pointer hover:shadow-lg transition-shadow ${
                        selectedMeeting?.id === meeting.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => loadInsights(meeting)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-base">{meeting.title}</span>
                          {meeting.has_ai_analysis && (
                            <Sparkles className="w-4 h-4 text-green-600" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{account?.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(meeting.meeting_date).toLocaleString('pt-BR')}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Insights de IA</h2>
            {!selectedMeeting ? (
              <Card>
                <CardContent className="text-center py-12 text-gray-500">
                  Selecione uma reunião para ver os insights de IA
                </CardContent>
              </Card>
            ) : loadingInsights ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Sparkles className="w-8 h-8 mx-auto mb-4 animate-pulse text-blue-600" />
                  <p>Analisando reunião...</p>
                </CardContent>
              </Card>
            ) : insights ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resumo Executivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{insights.executive_summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contexto da Reunião</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{insights.meeting_context}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pontos de Dor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {insights.pain_points.map((point, idx) => (
                        <li key={idx} className="text-sm">{point}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Soluções Sugeridas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {insights.suggested_solutions.map((solution, idx) => (
                        <li key={idx} className="text-sm">{solution}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Próximos Passos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {insights.next_steps.map((step, idx) => (
                        <li key={idx} className="text-sm">{step}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sugestão de Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded">
                      {insights.email_suggestion}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12 text-gray-500">
                  Insights de IA ainda não disponíveis. Eles serão gerados em breve após a criação da reunião.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/services/api';
import { ArrowLeft, Upload, FileText, Loader2, Copy, CheckCircle } from 'lucide-react';

interface Meeting {
  id: number;
  title: string;
  meeting_date: string;
  transcript_text: string;
  executive_summary?: string;
  context?: string;
  pain_points?: string;
  opportunities?: string;
  suggested_solutions?: string;
  next_steps?: string;
  email_suggestion?: string;
  analysis_status: string;
}

export default function MeetingAnalysis() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState<'text' | 'audio'>('text');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const response = await api.get('/meetings');
      setMeetings(response.data);
    } catch (err) {
      console.error('Error loading meetings:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024;
      
      if (file.size > maxSize) {
        setError('Arquivo muito grande. Tamanho máximo: 5MB');
        return;
      }

      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/x-m4a'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg)$/i)) {
        setError('Formato não suportado. Use: .mp3, .wav, .m4a, .ogg');
        return;
      }

      setAudioFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('meeting_date', meetingDate);

      if (uploadMode === 'audio' && audioFile) {
        formData.append('audio_file', audioFile);
      } else if (uploadMode === 'text' && transcriptText) {
        formData.append('transcript_text', transcriptText);
      } else {
        setError('Forneça uma transcrição ou arquivo de áudio');
        setLoading(false);
        return;
      }

      const response = await api.post('/meetings/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTitle('');
      setMeetingDate('');
      setTranscriptText('');
      setAudioFile(null);
      await loadMeetings();
      setSelectedMeeting(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao analisar reunião');
    } finally {
      setLoading(false);
    }
  };

  const copyEmailToClipboard = () => {
    if (selectedMeeting?.email_suggestion) {
      navigator.clipboard.writeText(selectedMeeting.email_suggestion);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  if (selectedMeeting) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setSelectedMeeting(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{selectedMeeting.title}</CardTitle>
              <CardDescription>
                {new Date(selectedMeeting.meeting_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardDescription>
            </CardHeader>
          </Card>

          {selectedMeeting.analysis_status === 'processing' && (
            <Alert className="mb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              <AlertDescription>
                Análise em andamento... Isso pode levar até 10 segundos.
              </AlertDescription>
            </Alert>
          )}

          {selectedMeeting.analysis_status === 'failed' && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                Erro ao processar análise. Tente novamente mais tarde.
              </AlertDescription>
            </Alert>
          )}

          {selectedMeeting.analysis_status === 'completed' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo Executivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedMeeting.executive_summary}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contexto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedMeeting.context}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pontos de Dor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMeeting.pain_points}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Oportunidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMeeting.opportunities}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Soluções Sugeridas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMeeting.suggested_solutions}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMeeting.next_steps}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Sugestão de Email</CardTitle>
                    <CardDescription>Email de follow-up gerado pela IA</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyEmailToClipboard}
                    className="ml-auto"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                    {selectedMeeting.email_suggestion}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Análise de Reunião</CardTitle>
              <CardDescription>
                Envie áudio ou texto para análise com IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Título da Reunião</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Reunião de Discovery - Cliente X"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingDate">Data e Hora</Label>
                  <Input
                    id="meetingDate"
                    type="datetime-local"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Modo de Upload</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={uploadMode === 'text' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('text')}
                      disabled={loading}
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Texto
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMode === 'audio' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('audio')}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Áudio
                    </Button>
                  </div>
                </div>

                {uploadMode === 'text' ? (
                  <div className="space-y-2">
                    <Label htmlFor="transcript">Transcrição</Label>
                    <Textarea
                      id="transcript"
                      value={transcriptText}
                      onChange={(e) => setTranscriptText(e.target.value)}
                      placeholder="Cole a transcrição da reunião aqui..."
                      rows={8}
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="audio">Arquivo de Áudio</Label>
                    <Input
                      id="audio"
                      type="file"
                      accept=".mp3,.wav,.m4a,.ogg,audio/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    {audioFile && (
                      <p className="text-sm text-gray-600">
                        {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Formatos aceitos: .mp3, .wav, .m4a, .ogg (máx. 5MB)
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Analisar Reunião'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reuniões Recentes</CardTitle>
              <CardDescription>
                Clique para ver a análise completa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {meetings.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Nenhuma reunião ainda. Crie sua primeira análise!
                  </p>
                ) : (
                  meetings.map((meeting) => (
                    <button
                      key={meeting.id}
                      onClick={() => setSelectedMeeting(meeting)}
                      className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(meeting.meeting_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="ml-4">
                          {meeting.analysis_status === 'completed' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completo
                            </span>
                          )}
                          {meeting.analysis_status === 'processing' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Processando
                            </span>
                          )}
                          {meeting.analysis_status === 'failed' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Erro
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

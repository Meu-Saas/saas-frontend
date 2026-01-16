import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import {
  ArrowLeft,
  Building2,
  Users,
  Target,
  Calendar,
  FileText,
  Edit,
  Save,
  X,
  Plus,
  DollarSign,
} from 'lucide-react';
import {
  AnatomiaKAM,
  DiagnosticoContexto,
  MapaStakeholders,
  WalletShare,
  PlanoAcaoKAM,
  RiscosConcorrencia,
  MatrizValor,
} from '../components/kam';
import { accountsAPI, contactsAPI, opportunitiesAPI, activitiesAPI } from '../services/api';

interface Account {
  id: string;
  name: string;
  cnpj: string | null;
  website: string | null;
  segment: string | null;
  region: string | null;
  city: string | null;
  state: string | null;
  estimated_revenue: number | null;
  employee_count: number | null;
  status: string;
  category_id: string | null;
  category_name?: string;
  kam_user_id: string | null;
  kam_user_name?: string;
  is_strategic: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_key_stakeholder: boolean;
}

interface Opportunity {
  id: string;
  title: string;
  value: number | null;
  stage_name: string;
  expected_close_date: string | null;
}

interface Activity {
  id: string;
  title: string;
  type_name: string;
  scheduled_date: string;
  status: string;
}

export const AccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('resumo');
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
    const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', role: '' });
    const [opportunityForm, setOpportunityForm] = useState({ title: '', value: '', expected_close_date: '' });
    const [activityForm, setActivityForm] = useState({ title: '', type: 'meeting', scheduled_at: '', description: '' });
    const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAccountData();
  }, [id]);

  const loadAccountData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const [accountData, contactsData, opportunitiesData, activitiesData] = await Promise.all([
        accountsAPI.getById(id),
        contactsAPI.getByAccount(id).catch(() => []),
        opportunitiesAPI.getByAccount(id).catch(() => []),
        activitiesAPI.getAll().then(activities => 
          activities.filter((a: { account_id?: number }) => a.account_id === Number(id))
        ).catch(() => []),
      ]);

      if (accountData) {
        setAccount({
          id: String(accountData.id),
          name: accountData.name,
          cnpj: accountData.cnpj || null,
          website: accountData.website || null,
          segment: accountData.segment || null,
          region: accountData.region || null,
          city: accountData.city || null,
          state: accountData.state || null,
          estimated_revenue: accountData.estimated_revenue || null,
          employee_count: accountData.employee_count || null,
          status: accountData.status || 'active',
          category_id: accountData.category_id ? String(accountData.category_id) : null,
          category_name: accountData.category_name || undefined,
          kam_user_id: accountData.kam_user_id ? String(accountData.kam_user_id) : null,
          kam_user_name: accountData.kam_user_name || undefined,
          is_strategic: accountData.is_strategic || false,
          notes: accountData.notes || null,
          created_at: accountData.created_at,
          updated_at: accountData.updated_at,
        });
      }

      if (contactsData && Array.isArray(contactsData)) {
        setContacts(contactsData.map((c: { id: number; name: string; email?: string; phone?: string; role?: string; is_key_stakeholder?: boolean }) => ({
          id: String(c.id),
          name: c.name,
          email: c.email || null,
          phone: c.phone || null,
          role: c.role || null,
          is_key_stakeholder: c.is_key_stakeholder || false,
        })));
      }

      if (opportunitiesData && Array.isArray(opportunitiesData)) {
        setOpportunities(opportunitiesData.map((o: { id: number; title: string; value?: number; stage_name?: string; expected_close_date?: string }) => ({
          id: String(o.id),
          title: o.title,
          value: o.value || null,
          stage_name: o.stage_name || '-',
          expected_close_date: o.expected_close_date || null,
        })));
      }

      if (activitiesData && Array.isArray(activitiesData)) {
        setActivities(activitiesData.map((a: { id: number; title: string; type_name?: string; scheduled_at?: string; status?: string }) => ({
          id: String(a.id),
          title: a.title,
          type_name: a.type_name || 'Tarefa',
          scheduled_date: a.scheduled_at || '',
          status: a.status || 'pending',
        })));
      }
    } catch (error) {
      console.error('Error loading account:', error);
    } finally {
      setLoading(false);
    }
  };

    const formatCurrency = (value: number | null) => {
      if (value === null) return '-';
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleCreateContact = async () => {
      if (!contactForm.name || !id) return;
      setSaving(true);
      try {
        await contactsAPI.create({ account_id: Number(id), name: contactForm.name, email: contactForm.email || undefined, phone: contactForm.phone || undefined, role: contactForm.role || undefined });
        setIsContactDialogOpen(false);
        setContactForm({ name: '', email: '', phone: '', role: '' });
        loadAccountData();
      } catch (error) {
        console.error('Error creating contact:', error);
      } finally {
        setSaving(false);
      }
    };

    const handleCreateOpportunity = async () => {
      if (!opportunityForm.title || !id) return;
      setSaving(true);
      try {
        await opportunitiesAPI.create({ account_id: Number(id), title: opportunityForm.title, value: opportunityForm.value ? Number(opportunityForm.value) : undefined, expected_close_date: opportunityForm.expected_close_date || undefined });
        setIsOpportunityDialogOpen(false);
        setOpportunityForm({ title: '', value: '', expected_close_date: '' });
        loadAccountData();
      } catch (error) {
        console.error('Error creating opportunity:', error);
      } finally {
        setSaving(false);
      }
    };

    const handleCreateActivity = async () => {
      if (!activityForm.title || !id) return;
      setSaving(true);
      try {
        await activitiesAPI.create({ account_id: Number(id), title: activityForm.title, type: activityForm.type, scheduled_at: activityForm.scheduled_at || new Date().toISOString(), description: activityForm.description || undefined });
        setIsActivityDialogOpen(false);
        setActivityForm({ title: '', type: 'meeting', scheduled_at: '', description: '' });
        loadAccountData();
      } catch (error) {
        console.error('Error creating activity:', error);
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">Conta nao encontrada</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/accounts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Contas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{account.name}</h1>
              {account.is_strategic && (
                <Badge className="bg-purple-500">Estrategica</Badge>
              )}
              <Badge variant="outline">{account.category_name || 'Sem categoria'}</Badge>
            </div>
            <p className="text-muted-foreground">
              {account.segment} | {account.city}, {account.state}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="plano-kam">Plano KAM</TabsTrigger>
          <TabsTrigger value="matriz-valor">Matriz de Valor</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informacoes da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Nome da Conta</Label>
                  <Input value={account.name} disabled={!isEditing} />
                </div>
                <div className="grid gap-2">
                  <Label>CNPJ</Label>
                  <Input value={account.cnpj || ''} disabled={!isEditing} />
                </div>
                <div className="grid gap-2">
                  <Label>Website</Label>
                  <Input value={account.website || ''} disabled={!isEditing} />
                </div>
                <div className="grid gap-2">
                  <Label>Segmento</Label>
                  <Input value={account.segment || ''} disabled={!isEditing} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Cidade</Label>
                    <Input value={account.city || ''} disabled={!isEditing} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <Input value={account.state || ''} disabled={!isEditing} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Classificacao
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Faturamento Estimado</Label>
                  <Input
                    value={formatCurrency(account.estimated_revenue)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Numero de Colaboradores</Label>
                  <Input
                    value={account.employee_count?.toString() || ''}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select disabled={!isEditing} value={account.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="at_risk">Em Risco</SelectItem>
                      <SelectItem value="churned">Perdida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select disabled={!isEditing} value={account.category_id || ''}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">A</SelectItem>
                      <SelectItem value="2">B</SelectItem>
                      <SelectItem value="3">C</SelectItem>
                      <SelectItem value="4">Estrategica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Conta Estrategica KAM</Label>
                  <Switch checked={account.is_strategic} disabled={!isEditing} />
                </div>
                <div className="grid gap-2">
                  <Label>KAM Responsavel</Label>
                  <Input value={account.kam_user_name || ''} disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observacoes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={account.notes || ''}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Adicione observacoes sobre a conta..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plano-kam" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano KAM</CardTitle>
              <CardDescription>
                Gerencie o plano estrategico para esta conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {account.is_strategic ? (
                <Tabs defaultValue="anatomia">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto">
                    <TabsTrigger value="anatomia">Anatomia</TabsTrigger>
                    <TabsTrigger value="diagnostico">Diagnostico</TabsTrigger>
                    <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
                    <TabsTrigger value="wallet">Wallet Share</TabsTrigger>
                    <TabsTrigger value="acoes">Plano de Acao</TabsTrigger>
                    <TabsTrigger value="riscos">Riscos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="anatomia" className="mt-4">
                    <AnatomiaKAM accountId={account.id} />
                  </TabsContent>
                  <TabsContent value="diagnostico" className="mt-4">
                    <DiagnosticoContexto accountId={account.id} />
                  </TabsContent>
                  <TabsContent value="stakeholders" className="mt-4">
                    <MapaStakeholders accountId={account.id} />
                  </TabsContent>
                  <TabsContent value="wallet" className="mt-4">
                    <WalletShare accountId={account.id} />
                  </TabsContent>
                  <TabsContent value="acoes" className="mt-4">
                    <PlanoAcaoKAM accountId={account.id} />
                  </TabsContent>
                  <TabsContent value="riscos" className="mt-4">
                    <RiscosConcorrencia accountId={account.id} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Esta conta nao esta marcada como estrategica.
                  </p>
                  <Button>Criar Plano KAM</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matriz-valor" className="mt-6">
          <MatrizValor accountId={account.id} />
        </TabsContent>

        <TabsContent value="contatos" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contatos
                </CardTitle>
                <CardDescription>
                  {contacts.length} contatos vinculados a esta conta
                </CardDescription>
              </div>
                          <Button onClick={() => setIsContactDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Contato
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {contacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum contato cadastrado para esta conta</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Stakeholder</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.role || '-'}</TableCell>
                        <TableCell>{contact.email || '-'}</TableCell>
                        <TableCell>{contact.phone || '-'}</TableCell>
                        <TableCell>
                          {contact.is_key_stakeholder && (
                            <Badge variant="secondary">Chave</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oportunidades" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Oportunidades
                </CardTitle>
                <CardDescription>
                  {opportunities.length} oportunidades vinculadas a esta conta
                </CardDescription>
              </div>
                          <Button onClick={() => setIsOpportunityDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Oportunidade
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {opportunities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma oportunidade cadastrada para esta conta</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead>Data Prevista</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => (
                      <TableRow key={opp.id}>
                        <TableCell className="font-medium">{opp.title}</TableCell>
                        <TableCell>{formatCurrency(opp.value)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{opp.stage_name}</Badge>
                        </TableCell>
                        <TableCell>
                          {opp.expected_close_date
                            ? new Date(opp.expected_close_date).toLocaleDateString('pt-BR')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atividades" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Atividades
                </CardTitle>
                <CardDescription>
                  {activities.length} atividades vinculadas a esta conta
                </CardDescription>
              </div>
                          <Button onClick={() => setIsActivityDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Atividade
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma atividade cadastrada para esta conta</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.title}</TableCell>
                        <TableCell>{activity.type_name}</TableCell>
                        <TableCell>
                          {new Date(activity.scheduled_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={activity.status === 'completed' ? 'default' : 'outline'}
                          >
                            {activity.status === 'completed' ? 'Concluida' : 'Pendente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
            <DialogDescription>Adicione um novo contato a esta conta</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome *</Label>
              <Input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Nome do contato" />
            </div>
            <div className="grid gap-2">
              <Label>E-mail</Label>
              <Input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="email@empresa.com" />
            </div>
            <div className="grid gap-2">
              <Label>Telefone</Label>
              <Input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div className="grid gap-2">
              <Label>Cargo</Label>
              <Input value={contactForm.role} onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })} placeholder="Diretor, Gerente, etc." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateContact} disabled={saving || !contactForm.name}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpportunityDialogOpen} onOpenChange={setIsOpportunityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
            <DialogDescription>Adicione uma nova oportunidade a esta conta</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Titulo *</Label>
              <Input value={opportunityForm.title} onChange={(e) => setOpportunityForm({ ...opportunityForm, title: e.target.value })} placeholder="Titulo da oportunidade" />
            </div>
            <div className="grid gap-2">
              <Label>Valor</Label>
              <Input type="number" value={opportunityForm.value} onChange={(e) => setOpportunityForm({ ...opportunityForm, value: e.target.value })} placeholder="10000" />
            </div>
            <div className="grid gap-2">
              <Label>Data Prevista de Fechamento</Label>
              <Input type="date" value={opportunityForm.expected_close_date} onChange={(e) => setOpportunityForm({ ...opportunityForm, expected_close_date: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpportunityDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateOpportunity} disabled={saving || !opportunityForm.title}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Atividade</DialogTitle>
            <DialogDescription>Adicione uma nova atividade a esta conta</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Titulo *</Label>
              <Input value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} placeholder="Titulo da atividade" />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={activityForm.type} onValueChange={(value) => setActivityForm({ ...activityForm, type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Reuniao</SelectItem>
                  <SelectItem value="call">Ligacao</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="task">Tarefa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Data Agendada</Label>
              <Input type="datetime-local" value={activityForm.scheduled_at} onChange={(e) => setActivityForm({ ...activityForm, scheduled_at: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Descricao</Label>
              <Textarea value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} placeholder="Descricao da atividade" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActivityDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateActivity} disabled={saving || !activityForm.title}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

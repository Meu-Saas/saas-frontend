import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Plus,
  Users,
  Layers,
  Tag,
  Target,
  Grid3X3,
  Palette,
  Edit,
  Trash2,
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(section || 'users');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administracao</h1>
        <p className="text-muted-foreground">
          Configure o sistema de acordo com as necessidades da sua empresa
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:w-auto lg:grid-cols-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Categorias</span>
          </TabsTrigger>
          <TabsTrigger value="value-zones" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Zonas de Valor</span>
          </TabsTrigger>
          <TabsTrigger value="prioritization" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Priorizacao</span>
          </TabsTrigger>
          <TabsTrigger value="activity-types" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Atividades</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UsersSection />
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <PipelineSection />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoriesSection />
        </TabsContent>

        <TabsContent value="value-zones" className="mt-6">
          <ValueZonesSection />
        </TabsContent>

        <TabsContent value="prioritization" className="mt-6">
          <PrioritizationSection />
        </TabsContent>

        <TabsContent value="activity-types" className="mt-6">
          <ActivityTypesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

const UsersSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'kam' });
  const [editFormData, setEditFormData] = useState({ full_name: '', role: '', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.full_name || !formData.email || !formData.password) return;
    setSaving(true);
    try {
      await adminAPI.createUser(formData);
      setIsDialogOpen(false);
      setFormData({ full_name: '', email: '', password: '', role: 'kam' });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({ full_name: user.full_name, role: user.role, is_active: user.is_active });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await adminAPI.updateUser(selectedUser.id, editFormData);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await adminAPI.deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Gerencie os usuarios do sistema</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo Usuario</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                  <TableCell><Badge className={user.is_active ? 'bg-green-500' : 'bg-gray-500'}>{user.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuario</DialogTitle>
            <DialogDescription>Adicione um novo usuario ao sistema</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome *</Label>
              <Input placeholder="Nome completo" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>E-mail *</Label>
              <Input type="email" placeholder="email@empresa.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Senha *</Label>
              <Input type="password" placeholder="Senha" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Perfil</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger><SelectValue placeholder="Selecione o perfil" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="kam">KAM</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateUser} disabled={saving || !formData.full_name || !formData.email || !formData.password}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Atualize as informacoes do usuario</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input value={editFormData.full_name} onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Perfil</Label>
              <Select value={editFormData.role} onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="kam">KAM</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={editFormData.is_active ? 'active' : 'inactive'} onValueChange={(value) => setEditFormData({ ...editFormData, is_active: value === 'active' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateUser} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir o usuario {selectedUser?.full_name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface PipelineStage {
  id: number;
  name: string;
  color?: string;
  probability?: number;
  sort_order?: number;
  is_active: boolean;
}

const PipelineSection: React.FC = () => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PipelineStage | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#6B7280', probability: 0, sort_order: 1 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await adminAPI.getPipelineStages();
      setStages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading pipeline stages:', error);
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      await adminAPI.createPipelineStage(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', color: '#6B7280', probability: 0, sort_order: 1 });
      loadData();
    } catch (error) {
      console.error('Error creating pipeline stage:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item: PipelineStage) => {
    setSelectedItem(item);
    setFormData({ name: item.name, color: item.color || '#6B7280', probability: item.probability || 0, sort_order: item.sort_order || 1 });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      await adminAPI.updatePipelineStage(selectedItem.id, formData);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error updating pipeline stage:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (item: PipelineStage) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await adminAPI.deletePipelineStage(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error deleting pipeline stage:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Etapas do Pipeline</CardTitle>
            <CardDescription>Configure as etapas do funil de vendas</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Ordem</TableHead>
                <TableHead className="w-16">Cor</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.sort_order}</TableCell>
                  <TableCell><div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color || '#6B7280' }} /></TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.probability || 0}%</TableCell>
                  <TableCell><Badge className={item.is_active ? 'bg-green-500' : 'bg-gray-500'}>{item.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Etapa</DialogTitle>
            <DialogDescription>Adicione uma nova etapa ao pipeline</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Cor</Label><Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Probabilidade (%)</Label><Input type="number" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })} /></div>
            <div className="grid gap-2"><Label>Ordem</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !formData.name}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Etapa</DialogTitle>
            <DialogDescription>Atualize as informacoes da etapa</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Cor</Label><Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Probabilidade (%)</Label><Input type="number" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })} /></div>
            <div className="grid gap-2"><Label>Ordem</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir a etapa {selectedItem?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface AccountCategory {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<AccountCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AccountCategory | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#6B7280' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await adminAPI.getAccountCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      await adminAPI.createAccountCategory(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', description: '', color: '#6B7280' });
      loadData();
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item: AccountCategory) => {
    setSelectedItem(item);
    setFormData({ name: item.name, description: item.description || '', color: item.color || '#6B7280' });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      await adminAPI.updateAccountCategory(selectedItem.id, formData);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (item: AccountCategory) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await adminAPI.deleteAccountCategory(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Categorias de Conta</CardTitle>
            <CardDescription>Configure as categorias para classificacao de contas</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descricao</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description || '-'}</TableCell>
                  <TableCell><Badge className={item.is_active ? 'bg-green-500' : 'bg-gray-500'}>{item.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>Adicione uma nova categoria de conta</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !formData.name}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>Atualize as informacoes da categoria</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir a categoria {selectedItem?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface ValueZone {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
}

const ValueZonesSection: React.FC = () => {
  const [zones, setZones] = useState<ValueZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ValueZone | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#6B7280' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await adminAPI.getValueZones();
      setZones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading value zones:', error);
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      await adminAPI.createValueZone(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', description: '', color: '#6B7280' });
      loadData();
    } catch (error) {
      console.error('Error creating value zone:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item: ValueZone) => {
    setSelectedItem(item);
    setFormData({ name: item.name, description: item.description || '', color: item.color || '#6B7280' });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      await adminAPI.updateValueZone(selectedItem.id, formData);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error updating value zone:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (item: ValueZone) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await adminAPI.deleteValueZone(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error deleting value zone:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Zonas de Valor</CardTitle>
            <CardDescription>Configure os tipos de zona de valor</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Cor</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descricao</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color || '#6B7280' }} /></TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description || '-'}</TableCell>
                  <TableCell><Badge className={item.is_active ? 'bg-green-500' : 'bg-gray-500'}>{item.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Zona de Valor</DialogTitle>
            <DialogDescription>Adicione uma nova zona de valor</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Cor</Label><Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !formData.name}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Zona de Valor</DialogTitle>
            <DialogDescription>Atualize as informacoes da zona de valor</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Cor</Label><Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir a zona de valor {selectedItem?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface ActivityType {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
}

const ActivityTypesSection: React.FC = () => {
  const [types, setTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ActivityType | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#6B7280' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await adminAPI.getActivityTypes();
      setTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading activity types:', error);
      setTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      await adminAPI.createActivityType(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', description: '', color: '#6B7280' });
      loadData();
    } catch (error) {
      console.error('Error creating activity type:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item: ActivityType) => {
    setSelectedItem(item);
    setFormData({ name: item.name, description: item.description || '', color: item.color || '#6B7280' });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      await adminAPI.updateActivityType(selectedItem.id, formData);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error updating activity type:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (item: ActivityType) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await adminAPI.deleteActivityType(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error deleting activity type:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tipos de Atividade</CardTitle>
            <CardDescription>Configure os tipos de atividade disponiveis</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Cor</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descricao</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color || '#6B7280' }} /></TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description || '-'}</TableCell>
                  <TableCell><Badge className={item.is_active ? 'bg-green-500' : 'bg-gray-500'}>{item.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Tipo de Atividade</DialogTitle>
            <DialogDescription>Adicione um novo tipo de atividade</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Cor</Label><Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !formData.name}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Atividade</DialogTitle>
            <DialogDescription>Atualize as informacoes do tipo de atividade</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Cor</Label><Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir o tipo de atividade {selectedItem?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface PrioritizationCriteria {
  id: number;
  name: string;
  description?: string;
  weight?: number;
  threshold_a?: number;
  threshold_b?: number;
  is_active: boolean;
}

const PrioritizationSection: React.FC = () => {
  const [criteria, setCriteria] = useState<PrioritizationCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PrioritizationCriteria | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', weight: 1, threshold_a: 80, threshold_b: 50 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await adminAPI.getPrioritizationCriteria();
      setCriteria(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading prioritization criteria:', error);
      setCriteria([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      await adminAPI.createPrioritizationCriteria(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', description: '', weight: 1, threshold_a: 80, threshold_b: 50 });
      loadData();
    } catch (error) {
      console.error('Error creating prioritization criteria:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item: PrioritizationCriteria) => {
    setSelectedItem(item);
    setFormData({ name: item.name, description: item.description || '', weight: item.weight || 1, threshold_a: item.threshold_a || 80, threshold_b: item.threshold_b || 50 });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      await adminAPI.updatePrioritizationCriteria(selectedItem.id, formData);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error updating prioritization criteria:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (item: PrioritizationCriteria) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await adminAPI.deletePrioritizationCriteria(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error deleting prioritization criteria:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Criterios de Priorizacao</CardTitle>
            <CardDescription>Configure os criterios para priorizacao de contas (ABC)</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo Criterio</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descricao</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Limite A</TableHead>
                <TableHead>Limite B</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description || '-'}</TableCell>
                  <TableCell>{item.weight || 1}</TableCell>
                  <TableCell>{item.threshold_a || 80}%</TableCell>
                  <TableCell>{item.threshold_b || 50}%</TableCell>
                  <TableCell><Badge className={item.is_active ? 'bg-green-500' : 'bg-gray-500'}>{item.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Criterio de Priorizacao</DialogTitle>
            <DialogDescription>Adicione um novo criterio para priorizacao ABC</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Peso</Label><Input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })} /></div>
            <div className="grid gap-2"><Label>Limite A (%)</Label><Input type="number" value={formData.threshold_a} onChange={(e) => setFormData({ ...formData, threshold_a: Number(e.target.value) })} /></div>
            <div className="grid gap-2"><Label>Limite B (%)</Label><Input type="number" value={formData.threshold_b} onChange={(e) => setFormData({ ...formData, threshold_b: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !formData.name}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Criterio de Priorizacao</DialogTitle>
            <DialogDescription>Atualize as informacoes do criterio</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nome</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descricao</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Peso</Label><Input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })} /></div>
            <div className="grid gap-2"><Label>Limite A (%)</Label><Input type="number" value={formData.threshold_a} onChange={(e) => setFormData({ ...formData, threshold_a: Number(e.target.value) })} /></div>
            <div className="grid gap-2"><Label>Limite B (%)</Label><Input type="number" value={formData.threshold_b} onChange={(e) => setFormData({ ...formData, threshold_b: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir o criterio {selectedItem?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Admin;

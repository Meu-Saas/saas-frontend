import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountsAPI } from '../services/api';
import { Account, KAMStage } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ArrowLeft, Plus } from 'lucide-react';

export const Accounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    kam_stage: KAMStage.DISCOVERY,
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await accountsAPI.getAll();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await accountsAPI.create(formData);
      setShowDialog(false);
      setFormData({ name: '', industry: '', description: '', kam_stage: KAMStage.DISCOVERY });
      loadAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const getStageColor = (stage: KAMStage) => {
    switch (stage) {
      case KAMStage.DISCOVERY: return 'bg-blue-100 text-blue-800';
      case KAMStage.DEVELOPMENT: return 'bg-yellow-100 text-yellow-800';
      case KAMStage.EXPANSION: return 'bg-green-100 text-green-800';
      case KAMStage.RETENTION: return 'bg-purple-100 text-purple-800';
    }
  };

  const getStageName = (stage: KAMStage) => {
    switch (stage) {
      case KAMStage.DISCOVERY: return 'Descoberta';
      case KAMStage.DEVELOPMENT: return 'Desenvolvimento';
      case KAMStage.EXPANSION: return 'Expansão';
      case KAMStage.RETENTION: return 'Retenção';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Contas</h1>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-full sm:max-w-lg md:max-w-2xl p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Criar Nova Conta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Conta</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Setor</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Estágio KAM</Label>
                  <Select
                    value={formData.kam_stage}
                    onValueChange={(value) => setFormData({ ...formData, kam_stage: value as KAMStage })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={KAMStage.DISCOVERY}>Descoberta</SelectItem>
                      <SelectItem value={KAMStage.DEVELOPMENT}>Desenvolvimento</SelectItem>
                      <SelectItem value={KAMStage.EXPANSION}>Expansão</SelectItem>
                      <SelectItem value={KAMStage.RETENTION}>Retenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Criar Conta</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {accounts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma conta ainda</p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Conta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span className="break-words">{account.name}</span>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStageColor(account.kam_stage)}`}>
                      {getStageName(account.kam_stage)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {account.industry && (
                    <p className="text-sm text-gray-600 mb-2 break-words">Setor: {account.industry}</p>
                  )}
                  {account.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-3 break-words">{account.description}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/meetings?account=${account.id}`)}
                    >
                      Reuniões
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

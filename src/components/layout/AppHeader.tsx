import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Bell, HelpCircle, LogOut, Settings, User, Mail, Phone, FileText } from 'lucide-react';
import { Separator } from '../ui/separator';

export const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    setShowNotifications(true);
  };

  const handleHelpClick = () => {
    setShowHelp(true);
  };

  return (
    <>
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNotificationsClick}>
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificacoes</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleHelpClick}>
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Ajuda</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden text-sm font-medium md:inline-block">
                {user?.full_name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificacoes
          </DialogTitle>
          <DialogDescription>
            Suas notificacoes recentes
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-center text-muted-foreground py-8">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma notificacao no momento</p>
            <p className="text-sm mt-2">Voce sera notificado sobre atividades importantes</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Central de Ajuda
          </DialogTitle>
          <DialogDescription>
            Precisa de ajuda? Estamos aqui para voce
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
            <FileText className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Documentacao</p>
              <p className="text-sm text-muted-foreground">Acesse guias e tutoriais completos</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
            <Mail className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Suporte por E-mail</p>
              <p className="text-sm text-muted-foreground">suporte@kamcrm.com.br</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
            <Phone className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Telefone</p>
              <p className="text-sm text-muted-foreground">(11) 9999-9999</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

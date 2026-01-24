import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  BarChart3 
} from 'lucide-react';
import { DiagnosticoContexto } from './DiagnosticoContexto';
import { MapaStakeholders } from './MapaStakeholders';
import { WalletShare } from './WalletShare';
import { PlanoAcaoKAM } from './PlanoAcaoKAM';
import { RiscosConcorrencia } from './RiscosConcorrencia';
import { AnatomiaKAM } from './AnatomiaKAM';
import type { KAMPlanTab } from '../types';

interface KAMPlanTabsProps {
  accountId: string;
  defaultTab?: KAMPlanTab;
}

export const KAMPlanTabs: React.FC<KAMPlanTabsProps> = ({ 
  accountId, 
  defaultTab = 'diagnostico' 
}) => {
  const [activeTab, setActiveTab] = useState<KAMPlanTab>(defaultTab);

  const tabs = [
    { 
      id: 'diagnostico' as KAMPlanTab, 
      label: 'Diagnostico', 
      icon: Target,
      description: 'Contexto e analise da conta'
    },
    { 
      id: 'stakeholders' as KAMPlanTab, 
      label: 'Stakeholders', 
      icon: Users,
      description: 'Mapa de stakeholders'
    },
    { 
      id: 'wallet-share' as KAMPlanTab, 
      label: 'Wallet Share', 
      icon: TrendingUp,
      description: 'Participacao na carteira'
    },
    { 
      id: 'plano-acao' as KAMPlanTab, 
      label: 'Plano de Acao', 
      icon: CheckCircle2,
      description: 'Acoes estrategicas'
    },
    { 
      id: 'riscos' as KAMPlanTab, 
      label: 'Riscos', 
      icon: AlertTriangle,
      description: 'Riscos e concorrencia'
    },
    { 
      id: 'anatomia' as KAMPlanTab, 
      label: 'Anatomia KAM', 
      icon: BarChart3,
      description: 'Maturidade do relacionamento'
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as KAMPlanTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden md:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="diagnostico" className="mt-6">
        <DiagnosticoContexto accountId={accountId} />
      </TabsContent>

      <TabsContent value="stakeholders" className="mt-6">
        <MapaStakeholders accountId={accountId} />
      </TabsContent>

      <TabsContent value="wallet-share" className="mt-6">
        <WalletShare accountId={accountId} />
      </TabsContent>

      <TabsContent value="plano-acao" className="mt-6">
        <PlanoAcaoKAM accountId={accountId} />
      </TabsContent>

      <TabsContent value="riscos" className="mt-6">
        <RiscosConcorrencia accountId={accountId} />
      </TabsContent>

      <TabsContent value="anatomia" className="mt-6">
        <AnatomiaKAM accountId={accountId} />
      </TabsContent>
    </Tabs>
  );
};

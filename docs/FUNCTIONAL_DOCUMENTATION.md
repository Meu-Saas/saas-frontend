# KAM CRM - Documentacao Funcional

## Visao Geral do Sistema

O KAM CRM e uma plataforma SaaS multi-tenant para gestao de Key Account Management (KAM). O sistema permite gerenciar contas estrategicas, contatos, oportunidades, atividades e planos de KAM de forma integrada.

### Stack Tecnologico

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
**Backend:** FastAPI, Python 3.12, PostgreSQL, asyncpg
**Autenticacao:** JWT com refresh token
**Deploy:** Railway (backend), Devin Apps (frontend)

---

## 1. Autenticacao

### 1.1 Login

**Objetivo de Negocio:** Permitir que usuarios autenticados acessem o sistema de forma segura.

**Componentes Principais:**
- Formulario de login com email e senha
- Botao de "Esqueci minha senha"
- Link para registro de nova organizacao

**APIs Utilizadas:**
- `POST /api/v1/auth/login` - Autenticacao do usuario

**Fluxo do Usuario:**
1. Usuario acessa a pagina de login
2. Insere email e senha
3. Sistema valida credenciais
4. Em caso de sucesso, redireciona para o Dashboard
5. Em caso de erro, exibe mensagem de erro

**Regras de Negocio:**
- Email deve ser valido e cadastrado no sistema
- Senha deve corresponder ao usuario
- Token JWT e gerado com expiracao de 30 minutos
- Refresh token permite renovacao automatica

**Estados:**
- Loading: Spinner durante autenticacao
- Erro: Mensagem "Credenciais invalidas"
- Sucesso: Redirecionamento para Dashboard

### 1.2 Registro

**Objetivo de Negocio:** Permitir criacao de novas organizacoes e usuarios administradores.

**Componentes Principais:**
- Formulario com nome completo, email, senha e slug da organizacao
- Validacao de campos obrigatorios
- Verificacao de unicidade do slug

**APIs Utilizadas:**
- `POST /api/v1/auth/register` - Registro de novo usuario e organizacao

**Fluxo do Usuario:**
1. Usuario acessa pagina de registro
2. Preenche dados pessoais e da organizacao
3. Sistema valida unicidade do email e slug
4. Cria organizacao e usuario administrador
5. Redireciona para login

### 1.3 Recuperacao de Senha

**Objetivo de Negocio:** Permitir que usuarios recuperem acesso em caso de esquecimento de senha.

**Status:** Funcionalidade planejada (botao presente, fluxo nao implementado)

---

## 2. Dashboard

**Objetivo de Negocio:** Fornecer visao geral do desempenho de vendas e atividades pendentes.

**Componentes Principais:**
- Cards de metricas (Total de Contas, Oportunidades Abertas, Valor do Pipeline, Atividades Pendentes)
- Grafico de pipeline por estagio
- Lista de atividades recentes
- Lista de oportunidades proximas do fechamento

**APIs Utilizadas:**
- `GET /api/v1/dashboard/metrics` - Metricas gerais
- `GET /api/v1/dashboard/pipeline` - Dados do pipeline
- `GET /api/v1/dashboard/activities` - Atividades recentes
- `GET /api/v1/dashboard/opportunities` - Oportunidades proximas

**Fluxo do Usuario:**
1. Usuario acessa o Dashboard apos login
2. Sistema carrega metricas em tempo real
3. Usuario pode clicar em cards para navegar para secoes especificas
4. Graficos sao interativos e mostram detalhes ao passar o mouse

**Regras de Negocio:**
- Dados sao filtrados pela organizacao do usuario
- Metricas sao calculadas em tempo real
- Atividades mostram apenas as pendentes dos proximos 7 dias

**Estados:**
- Loading: Skeleton loaders em cada card
- Vazio: Mensagem "Nenhum dado encontrado"
- Erro: Toast com mensagem de erro

---

## 3. Contas

### 3.1 Lista de Contas

**Objetivo de Negocio:** Gerenciar todas as contas/clientes da organizacao.

**Componentes Principais:**
- Tabela com colunas: Nome, CNPJ, Segmento, Categoria, KAM Responsavel, Status
- Filtros por segmento, categoria e status
- Botao "Nova Conta"
- Acoes: Editar, Excluir, Ver Detalhes

**APIs Utilizadas:**
- `GET /api/v1/accounts` - Lista de contas com paginacao
- `POST /api/v1/accounts` - Criar nova conta
- `PUT /api/v1/accounts/{id}` - Atualizar conta
- `DELETE /api/v1/accounts/{id}` - Excluir conta

**Fluxo do Usuario:**
1. Usuario acessa lista de contas
2. Pode filtrar por segmento, categoria ou status
3. Clica em "Nova Conta" para criar
4. Preenche formulario com dados da conta
5. Sistema valida CNPJ (mascara XX.XXX.XXX/XXXX-XX)
6. Conta e criada e aparece na lista

**Regras de Negocio:**
- CNPJ deve seguir formato brasileiro
- Nome da conta e obrigatorio
- Categoria e KAM podem ser atribuidos posteriormente

### 3.2 Detalhes da Conta

**Objetivo de Negocio:** Visualizar e gerenciar todas as informacoes de uma conta especifica.

**Componentes Principais:**
- Cabecalho com nome, categoria e status
- Abas: Informacoes, Contatos, Oportunidades, Atividades, Timeline
- Botoes de acao: Novo Contato, Nova Oportunidade, Nova Atividade

**APIs Utilizadas:**
- `GET /api/v1/accounts/{id}` - Detalhes da conta
- `GET /api/v1/accounts/{id}/contacts` - Contatos da conta
- `GET /api/v1/accounts/{id}/opportunities` - Oportunidades da conta
- `GET /api/v1/activities?account_id={id}` - Atividades da conta

**Fluxo do Usuario:**
1. Usuario clica em uma conta na lista
2. Sistema carrega todos os dados relacionados
3. Usuario navega entre abas para ver diferentes informacoes
4. Pode criar novos contatos, oportunidades ou atividades diretamente

---

## 4. Contatos

**Objetivo de Negocio:** Gerenciar contatos associados as contas.

**Componentes Principais:**
- Tabela com colunas: Nome, Email, Telefone, Cargo, Conta, Stakeholder Chave
- Filtro por conta
- Botao "Novo Contato"
- Acoes: Editar, Excluir

**APIs Utilizadas:**
- `GET /api/v1/contacts` - Lista de contatos
- `POST /api/v1/contacts` - Criar contato
- `PUT /api/v1/contacts/{id}` - Atualizar contato
- `DELETE /api/v1/contacts/{id}` - Excluir contato

**Regras de Negocio:**
- Contato deve estar associado a uma conta
- Flag "Stakeholder Chave" identifica contatos estrategicos
- Email e telefone sao opcionais

---

## 5. Oportunidades

**Objetivo de Negocio:** Gerenciar pipeline de vendas com visao Kanban.

**Componentes Principais:**
- Visao Kanban com colunas por estagio do pipeline
- Cards de oportunidade com valor e data prevista
- Drag-and-drop para mover entre estagios
- Botao "Nova Oportunidade"

**APIs Utilizadas:**
- `GET /api/v1/opportunities` - Lista de oportunidades
- `GET /api/v1/opportunities/kanban` - Dados para visao Kanban
- `POST /api/v1/opportunities` - Criar oportunidade
- `PUT /api/v1/opportunities/{id}` - Atualizar oportunidade
- `PUT /api/v1/opportunities/{id}/stage` - Mover para outro estagio

**Fluxo do Usuario:**
1. Usuario visualiza pipeline em formato Kanban
2. Arrasta cards entre colunas para atualizar estagio
3. Clica em card para ver detalhes
4. Cria nova oportunidade associada a uma conta

**Regras de Negocio:**
- Oportunidade deve ter titulo e conta associada
- Valor e data de fechamento sao opcionais
- Estagios sao configurados na area de Administracao

---

## 6. Atividades

**Objetivo de Negocio:** Gerenciar tarefas e compromissos relacionados as contas.

**Componentes Principais:**
- Lista de atividades com filtros por status
- Filtros: Todas, Pendentes, Concluidas, Canceladas
- Botao "Nova Atividade"
- Acoes: Marcar como concluida, Editar, Excluir

**APIs Utilizadas:**
- `GET /api/v1/activities` - Lista de atividades
- `POST /api/v1/activities` - Criar atividade
- `PUT /api/v1/activities/{id}` - Atualizar atividade
- `PUT /api/v1/activities/{id}/status` - Alterar status

**Fluxo do Usuario:**
1. Usuario visualiza lista de atividades
2. Filtra por status (pendentes, concluidas, etc.)
3. Cria nova atividade com titulo, tipo e data
4. Marca atividades como concluidas

**Regras de Negocio:**
- Atividade deve ter titulo e data agendada
- Tipos de atividade sao configurados na Administracao
- Status: pending, completed, cancelled

---

## 7. Relatorios

**Objetivo de Negocio:** Fornecer analises e insights sobre o desempenho de vendas e KAM.

### 7.1 Aba Pipeline

**Componentes:** Grafico de barras com valor por estagio, tabela detalhada

**APIs Utilizadas:**
- `GET /api/v1/reports/pipeline` - Relatorio de pipeline

**Metricas:**
- Valor total por estagio
- Quantidade de oportunidades por estagio
- Taxa de conversao entre estagios

### 7.2 Aba Forecast

**Componentes:** Projecao de fechamento por periodo

**APIs Utilizadas:**
- `GET /api/v1/reports/forecast` - Previsao de vendas

**Metricas:**
- Valor previsto por mes
- Probabilidade de fechamento
- Comparativo com meta

### 7.3 Aba Atividades

**Componentes:** Relatorio de atividades por KAM

**APIs Utilizadas:**
- `GET /api/v1/reports/activities` - Relatorio de atividades

**Metricas:**
- Total de atividades
- Atividades concluidas
- Atividades pendentes
- Atividades atrasadas
- Taxa de execucao

### 7.4 Aba Saude

**Componentes:** Indicadores de saude das contas

**APIs Utilizadas:**
- `GET /api/v1/reports/account-health` - Saude das contas

**Metricas:**
- Score de priorizacao
- Categoria ABC
- Gap de valor
- Quantidade de riscos
- Score de engajamento

### 7.5 Aba Valor

**Componentes:** Analise de stakeholders e matriz de valor

**APIs Utilizadas:**
- `GET /api/v1/reports/value-stakeholders` - Relatorio de valor

**Metricas:**
- Quantidade de stakeholders
- Percentual de apoiadores
- Contas imbativeis vs vulneraveis

### 7.6 Aba Plano KAM

**Componentes:** Execucao dos planos de KAM

**APIs Utilizadas:**
- `GET /api/v1/reports/kam-plan-execution` - Execucao de planos

**Metricas:**
- Total de acoes
- Acoes concluidas
- Taxa de conclusao
- Pilares estrategicos

**Filtros Disponiveis (todas as abas):**
- Periodo: Semana, Mes, Trimestre, Ano
- KAM: Filtro por usuario responsavel
- Segmento: Tecnologia, Financeiro, Varejo, etc.
- Categoria: A, B, C

**Botoes de Acao:**
- Exportar: Baixa dados em formato JSON
- Salvar Visao: Salva configuracao de filtros no localStorage
- Ver Plano: Navega para detalhes do Plano KAM
- Ver Organograma: Navega para Matriz de Valor

---

## 8. Plano KAM

**Objetivo de Negocio:** Gerenciar planos estrategicos para contas-chave.

### 8.1 Pilares Estrategicos

**Componentes:** Lista de pilares com objetivos e metricas

**APIs Utilizadas:**
- `GET /api/v1/kam-plan/{account_id}/pillars` - Lista pilares
- `POST /api/v1/kam-plan/{account_id}/pillars` - Criar pilar

### 8.2 Diagnosticos

**Componentes:** Analise SWOT e diagnosticos da conta

**APIs Utilizadas:**
- `GET /api/v1/kam-plan/{account_id}/diagnostics` - Lista diagnosticos
- `POST /api/v1/kam-plan/{account_id}/diagnostics` - Criar diagnostico

### 8.3 Stakeholders

**Componentes:** Mapa de stakeholders com influencia e posicionamento

**APIs Utilizadas:**
- `GET /api/v1/kam-plan/{account_id}/stakeholders` - Lista stakeholders
- `POST /api/v1/kam-plan/{account_id}/stakeholders` - Criar stakeholder

### 8.4 Wallet Share

**Componentes:** Analise de participacao na carteira do cliente

**APIs Utilizadas:**
- `GET /api/v1/kam-plan/{account_id}/wallet-share` - Dados de wallet share
- `POST /api/v1/kam-plan/{account_id}/wallet-share` - Atualizar wallet share

### 8.5 Acoes

**Componentes:** Lista de acoes estrategicas com prazos e responsaveis

**APIs Utilizadas:**
- `GET /api/v1/kam-plan/{account_id}/actions` - Lista acoes
- `POST /api/v1/kam-plan/{account_id}/actions` - Criar acao

### 8.6 Riscos

**Componentes:** Matriz de riscos com probabilidade e impacto

**APIs Utilizadas:**
- `GET /api/v1/kam-plan/{account_id}/risks` - Lista riscos
- `POST /api/v1/kam-plan/{account_id}/risks` - Criar risco

### 8.7 Concorrentes

**Componentes:** Analise competitiva

**APIs Utilizadas:**
- `GET /api/v1/kam-plan/{account_id}/competitors` - Lista concorrentes
- `POST /api/v1/kam-plan/{account_id}/competitors` - Criar concorrente

---

## 9. Matriz de Priorizacao / Risco

**Objetivo de Negocio:** Classificar contas por importancia estrategica usando metodologia ABC.

**Componentes Principais:**
- Tabela de contas com scores
- Filtros por segmento e categoria
- Dialog para editar scores de criterios
- Visualizacao de categoria ABC (A: 70-100, B: 40-69, C: 0-39)

**APIs Utilizadas:**
- `GET /api/v1/prioritization/accounts` - Contas com scores
- `GET /api/v1/prioritization/criteria` - Criterios de avaliacao
- `GET /api/v1/prioritization/thresholds` - Limites ABC
- `GET /api/v1/prioritization/accounts/{id}/scores` - Scores de uma conta
- `PUT /api/v1/prioritization/accounts/{id}/scores` - Atualizar scores

**Fluxo do Usuario:**
1. Usuario visualiza lista de contas com scores
2. Clica em uma conta para editar scores
3. Atribui notas de 1-5 para cada criterio
4. Sistema calcula score total ponderado
5. Categoria ABC e atribuida automaticamente

**Regras de Negocio:**
- Criterios tem pesos configurados na Administracao
- Score total = soma(nota * peso) / soma(pesos) * 20
- Categoria A: score >= 70
- Categoria B: score >= 40 e < 70
- Categoria C: score < 40

**Estados:**
- Loading: Spinner durante carregamento
- Vazio: Mensagem "Nenhuma conta encontrada"
- Salvando: Botao desabilitado com spinner

---

## 10. Administracao

**Objetivo de Negocio:** Configurar parametros do sistema.

### 10.1 Usuarios

**Componentes:** CRUD de usuarios da organizacao

**APIs Utilizadas:**
- `GET /api/v1/admin/users` - Lista usuarios
- `POST /api/v1/admin/users` - Criar usuario
- `PUT /api/v1/admin/users/{id}` - Atualizar usuario
- `DELETE /api/v1/admin/users/{id}` - Excluir usuario

### 10.2 Estagios do Pipeline

**Componentes:** Configuracao dos estagios de oportunidades

**APIs Utilizadas:**
- `GET /api/v1/admin/pipeline-stages` - Lista estagios
- `POST /api/v1/admin/pipeline-stages` - Criar estagio
- `PUT /api/v1/admin/pipeline-stages/{id}` - Atualizar estagio
- `DELETE /api/v1/admin/pipeline-stages/{id}` - Excluir estagio

### 10.3 Categorias de Conta

**Componentes:** Configuracao das categorias de contas

**APIs Utilizadas:**
- `GET /api/v1/admin/account-categories` - Lista categorias
- `POST /api/v1/admin/account-categories` - Criar categoria
- `PUT /api/v1/admin/account-categories/{id}` - Atualizar categoria
- `DELETE /api/v1/admin/account-categories/{id}` - Excluir categoria

### 10.4 Zonas de Valor

**Componentes:** Configuracao das zonas para matriz de valor

**APIs Utilizadas:**
- `GET /api/v1/admin/value-zones` - Lista zonas
- `POST /api/v1/admin/value-zones` - Criar zona
- `PUT /api/v1/admin/value-zones/{id}` - Atualizar zona
- `DELETE /api/v1/admin/value-zones/{id}` - Excluir zona

### 10.5 Tipos de Atividade

**Componentes:** Configuracao dos tipos de atividades

**APIs Utilizadas:**
- `GET /api/v1/admin/activity-types` - Lista tipos
- `POST /api/v1/admin/activity-types` - Criar tipo
- `PUT /api/v1/admin/activity-types/{id}` - Atualizar tipo
- `DELETE /api/v1/admin/activity-types/{id}` - Excluir tipo

### 10.6 Criterios de Priorizacao

**Componentes:** Configuracao dos criterios para matriz de priorizacao

**APIs Utilizadas:**
- `GET /api/v1/admin/prioritization-criteria` - Lista criterios
- `POST /api/v1/admin/prioritization-criteria` - Criar criterio
- `PUT /api/v1/admin/prioritization-criteria/{id}` - Atualizar criterio
- `DELETE /api/v1/admin/prioritization-criteria/{id}` - Excluir criterio

---

## 11. Configuracoes / Perfil / Notificacoes

### 11.1 Perfil

**Objetivo de Negocio:** Permitir que usuarios gerenciem suas informacoes pessoais.

**Componentes:** Formulario com nome, email e foto

**Status:** Botao presente no header, funcionalidade em desenvolvimento

### 11.2 Configuracoes

**Objetivo de Negocio:** Configuracoes gerais do sistema.

**Status:** Botao presente no header, funcionalidade em desenvolvimento

### 11.3 Notificacoes

**Objetivo de Negocio:** Alertas e notificacoes do sistema.

**Status:** Botao presente no header, funcionalidade em desenvolvimento

---

## Glossario

- **KAM (Key Account Management):** Gestao de Contas-Chave
- **ABC:** Metodologia de classificacao por importancia (A=alta, B=media, C=baixa)
- **Pipeline:** Funil de vendas com estagios
- **Stakeholder:** Pessoa influente na decisao de compra
- **Wallet Share:** Participacao na carteira do cliente
- **SWOT:** Analise de Forcas, Fraquezas, Oportunidades e Ameacas

---

## Changelog

### v1.0.1 (Janeiro 2026)
- Integracao da Matriz de Priorizacao com backend
- Remocao de dados mockados dos Relatorios
- Correcao de filtros em todas as abas de Relatorios
- Adicao de loading states
- Correcao de tipos TypeScript

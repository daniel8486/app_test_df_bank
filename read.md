# Guia Rápido - Projeto app_test_df_bank

## Requisitos
- Docker e Docker Compose (para banco de dados)
- Node.js 18+ (frontend)
- Laravel/PHP 8.1+ e Composer (backend)

---

## 1. Subindo o Banco de Dados (PostgreSQL)

```sh
docker-compose up -d
```
O banco ficará disponível em `localhost:5432` com:
- Banco: `app_test_df_bank`
- Usuário: `postgres`
- Senha: `postgres`

---

## 2. Backend (Laravel)

```sh
cd backend
cp .env.example .env # ou configure manualmente
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed # opcional
php artisan serve --host=0.0.0.0 --port=3001
```
A API estará em http://localhost:3001

### Testes

```sh
php artisan test
```

### Lint ( pint )

```sh 
cd backend/./vendor/bin/pint # corrije os lints
```

```sh
cd backend/./vendor/bin/pint --test # mostra os erros lints sem corrigir
```

### Comandos úteis
- `php artisan migrate:fresh` — recria o banco do zero
- `php artisan migrate:fresh --seed` - recria o banco do zero e roda o seed
- `php artisan route:list` — lista as rotas
- `composer dump-autoload` — atualiza autoload
- `php artisan optimize:clear` - limpa todos os caches do laravel
- `php artisan tinker` - interagir com o console do laravel
## Endpoints e exemplos

backend/POSTMAN_COLLECTION.json

---

## 3. Frontend (Next.js)

```sh
cd frontend
npm install
npm run dev
```
Acesse http://localhost:3000

---

## 4. Testes com PostgreSQL (opcional)

Configure o arquivo `.env.testing` em backend:
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=app_test_df_bank
DB_USERNAME=postgres
DB_PASSWORD=postgres
```
Rode:
```sh
php artisan migrate --env=testing
php artisan test --env=testing
```

---

## 5. Integração Contínua (CI)

O projeto utiliza GitHub Actions para garantir qualidade e estabilidade do backend a cada push ou pull request nas branches main e dev. O workflow principal executa:

- **Checkout do código**
- **Configuração do ambiente de testes**: Cria o arquivo `.env.testing` e prepara variáveis de ambiente.
- **Banco de dados PostgreSQL**: Sobe um container dedicado para os testes.
- **Instalação de dependências**: Usa Composer para instalar as libs PHP/Laravel.
- **Migrations**: Executa as migrations para garantir o schema atualizado.
- **Lint (Pint)**: Valida o padrão de código automaticamente.
- **Testes automatizados**: Executa todos os testes de unidade e feature do Laravel.

Se qualquer etapa falhar, o pipeline é interrompido, evitando que código com problemas chegue à branch principal.

Há também um workflow experimental (ci-cascata.yml) para automação de merges entre test → dev → main, encadeando validações e deploys.

---

## Conceitos Arquiteturais

- **Separação de Camadas**: Cada camada (Controller, Service, Repository, DTO) tem responsabilidade única, facilitando manutenção, testes e evolução do sistema.
- **RESTful API**: O backend segue o padrão REST, usando métodos HTTP (GET, POST, PUT, DELETE) e URLs semânticas para manipulação de recursos.
- **DTO (Data Transfer Object)**: Objetos usados para transportar dados entre camadas, evitando exposição direta de entidades do banco e padronizando a comunicação interna.
- **Validação Centralizada**: Toda entrada de dados é validada por Form Requests e Rules customizadas, garantindo integridade e segurança.
- **Tratamento de Erros**: Uso de Exceptions customizadas para respostas padronizadas e controle de fluxos de erro.
- **Idempotência**: Operações críticas (como cadastro/edição) são projetadas para evitar efeitos colaterais em requisições repetidas.
- **ACID**: As operações de banco seguem os princípios de Atomicidade, Consistência, Isolamento e Durabilidade, garantindo confiabilidade dos dados.
- **Testes Automatizados**: Cobertura de testes de unidade e feature para garantir que regras de negócio e integrações funcionem como esperado.
- **Desacoplamento**: O frontend não depende de detalhes internos do backend, apenas dos contratos (endpoints e formatos JSON), permitindo evolução independente.
- **Feedback ao Usuário**: O frontend fornece respostas visuais claras (loading, erros, sucesso), melhorando a experiência do usuário.
- **Boas Práticas de Código**: Uso de linters, formatadores e padrões de projeto para manter o código limpo, legível e sustentável.

--- 
## Arquitetura do Projeto

### Backend (Laravel)
O backend é uma API REST desenvolvida em Laravel, estruturada em camadas:
- **Controllers**: Recebem as requisições HTTP e delegam para os serviços.
- **Services**: Contêm a lógica de negócio principal, orquestrando regras e validações.
- **Repositories**: Responsáveis pelo acesso ao banco de dados (PostgreSQL), centralizando queries e persistência.
- **DTOs**: Objetos de transferência de dados para padronizar a entrada/saída entre camadas.
- **Requests**: Validação de dados de entrada (Form Requests).
- **Rules**: Regras customizadas de validação (ex: CPF).
- **Exceptions**: Tratamento centralizado de erros de domínio e API.

O backend expõe endpoints RESTful para cadastro, consulta, edição, deleção e busca avançada de clientes. Os testes automatizados cobrem cenários de sucesso, erro e validação.

### Frontend (Next.js)
O frontend é uma aplicação React usando Next.js (App Router), com as seguintes características:
- **Páginas**: Cada rota (ex: /clientes, /clientes/novo) é um arquivo em `src/app`.
- **Componentes**: Reutilizáveis, como tabelas, formulários, modais e loading.
- **Hooks**: Custom hooks para lógica de busca, CRUD e integração com a API.
- **Validação**: Feita com React Hook Form e Yup.
- **Serviços**: Camada de integração com a API usando Axios.

O frontend consome a API do backend, exibe dados em tabelas, permite buscas, cadastro e edição de clientes, com feedback visual (loading, mensagens de sucesso/erro).

### Integração
O frontend e backend comunicam-se via HTTP (JSON). O banco de dados é isolado em container Docker, facilitando o setup local e testes.

---




Pronto! Qualquer dúvida, consulte a documentação ou abra uma issue.

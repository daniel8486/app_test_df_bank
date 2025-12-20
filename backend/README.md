## Banco de dados para testes

Para rodar os testes com PostgreSQL ao invés de SQLite, utilize o Docker Compose:

```sh
docker-compose up -d
```

Configure o arquivo `.env.testing` com as credenciais abaixo:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=app_test_df_bank
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Depois, execute as migrations e os testes normalmente:

```sh
php artisan migrate --env=testing
php artisan test --env=testing --filter=ClienteFeatureTest
```
## Test Crud - DFBANK - API
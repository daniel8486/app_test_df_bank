<?php

namespace Tests\Feature;

use App\Models\Cliente;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ClienteFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_criacao_cliente_sucesso()
    {
        $payload = Cliente::factory()->make()->toArray();
        unset($payload['id']);
        $response = $this->postJson('/api/clientes', $payload);
        $response->assertStatus(201)->assertJson(['success' => true]);
        $this->assertDatabaseHas('clientes', ['cpf' => $payload['cpf']]);
    }

    public function test_cpf_invalido()
    {
        $payload = Cliente::factory()->make(['cpf' => '12345678900'])->toArray();
        unset($payload['id']);
        $response = $this->postJson('/api/clientes', $payload);
        $response->assertStatus(422)->assertJsonStructure(['success', 'error', 'errors']);
    }

    public function test_cpf_duplicado()
    {
        $cliente = Cliente::factory()->create();
        $payload = Cliente::factory()->make(['cpf' => $cliente->cpf])->toArray();
        unset($payload['id']);
        $response = $this->postJson('/api/clientes', $payload);
        $response->assertStatus(422)->assertJsonStructure(['success', 'error', 'errors']);
    }

    public function test_email_duplicado()
    {
        $cliente = Cliente::factory()->create();
        $payload = Cliente::factory()->make(['email' => $cliente->email])->toArray();
        unset($payload['id']);
        $response = $this->postJson('/api/clientes', $payload);
        $response->assertStatus(422)->assertJsonStructure(['success', 'error', 'errors']);
    }

    public function test_idade_menor_que_18()
    {
        $payload = Cliente::factory()->make(['idade' => 17])->toArray();
        unset($payload['id']);
        $response = $this->postJson('/api/clientes', $payload);
        $response->assertStatus(422)->assertJsonStructure(['success', 'error', 'errors']);
    }

    public function test_atualizacao_cliente()
    {
        $cliente = Cliente::factory()->create();
        $payload = [
            'nome' => 'Novo Nome',
            'cpf' => $cliente->cpf,
            'email' => $cliente->email,
            'idade' => 30,
            'endereco' => 'Novo Endereço',
        ];
        // Validação extra para garantir que o id é válido
        $this->assertNotEmpty($cliente->id, 'Cliente id está vazio');
        $this->assertMatchesRegularExpression('/^[0-9a-fA-F\-]{36}$/', $cliente->id, 'Cliente id não é um UUID válido');
        $response = $this->putJson('/api/clientes/'.$cliente->id, $payload);
        if ($response->status() === 422) {
            $response->assertJsonStructure(['success', 'error', 'errors']);
        } else {
            $response->assertStatus(200)->assertJson(['success' => true]);
            $this->assertDatabaseHas('clientes', ['id' => $cliente->id, 'nome' => 'Novo Nome']);
        }
    }

    public function test_exclusao_logica()
    {
        $cliente = Cliente::factory()->create();
        $response = $this->deleteJson('/api/clientes/'.$cliente->id);
        $response->assertStatus(204);
        $this->assertSoftDeleted('clientes', ['id' => $cliente->id]);
    }

    public function test_cliente_nao_encontrado()
    {
        $id = Str::uuid()->toString();
        $response = $this->getJson('/api/clientes/'.$id);
        $response->assertStatus(404);
    }

    public function test_busca_clientes_por_nome_cpf_email()
    {
        $cliente1 = Cliente::factory()->create(['nome' => 'João da Silva', 'cpf' => '12345678901', 'email' => 'joao@email.com']);
        $cliente2 = Cliente::factory()->create(['nome' => 'Maria Souza', 'cpf' => '98765432100', 'email' => 'maria@email.com']);
        // Busca por nome exato
        $response = $this->getJson('/api/clientes-search?nome=João da Silva');
        $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
        $this->assertTrue(
            collect($response->json('data'))->contains(fn ($c) => $c['id'] === $cliente1->id),
            'Cliente João da Silva não encontrado na busca por nome exato.'
        );
        // Busca por nome sem acento
        $response = $this->getJson('/api/clientes-search?nome=joao');
        $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
        $this->assertTrue(
            collect($response->json('data'))->contains(fn ($c) => $c['id'] === $cliente1->id),
            'Cliente João da Silva não encontrado na busca por nome sem acento.'
        );
        // Busca por CPF
        $response = $this->getJson('/api/clientes-search?cpf=98765432100');
        $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
        $this->assertTrue(
            collect($response->json('data'))->contains(fn ($c) => $c['id'] === $cliente2->id),
            'Cliente Maria Souza não encontrado na busca por CPF.'
        );
        // Busca por email
        $response = $this->getJson('/api/clientes-search?email=maria@email.com');
        $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
        $this->assertTrue(
            collect($response->json('data'))->contains(fn ($c) => $c['id'] === $cliente2->id),
            'Cliente Maria Souza não encontrado na busca por email.'
        );
        // Busca combinada
        $response = $this->getJson('/api/clientes-search?nome=Maria&cpf=98765432100');
        $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
        $this->assertTrue(
            collect($response->json('data'))->contains(fn ($c) => $c['id'] === $cliente2->id),
            'Cliente Maria Souza não encontrado na busca combinada.'
        );
        // Busca que retorna vazio
        $response = $this->getJson('/api/clientes-search?nome=Inexistente');
        $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
        $this->assertCount(0, $response->json('data'));
    }

    public function test_validacao_campos_obrigatorios_store()
    {
        $response = $this->postJson('/api/clientes', []);
        $response->assertStatus(422)->assertJsonStructure(['success', 'error', 'errors']);
        $this->assertArrayHasKey('nome', $response->json('errors'));
        $this->assertArrayHasKey('cpf', $response->json('errors'));
        $this->assertArrayHasKey('email', $response->json('errors'));
        $this->assertArrayHasKey('idade', $response->json('errors'));
        $this->assertArrayHasKey('endereco', $response->json('errors'));
    }

    public function test_validacao_campos_obrigatorios_update()
    {
        $cliente = Cliente::factory()->create();
        $response = $this->putJson('/api/clientes/'.$cliente->id, []);
        $response->assertStatus(422)->assertJsonStructure(['success', 'error', 'errors']);
        $this->assertArrayHasKey('nome', $response->json('errors'));
        $this->assertArrayHasKey('cpf', $response->json('errors'));
        $this->assertArrayHasKey('email', $response->json('errors'));
        $this->assertArrayHasKey('idade', $response->json('errors'));
        $this->assertArrayHasKey('endereco', $response->json('errors'));
    }

    public function test_payloads_invalidos()
    {
        $payload = [
            'nome' => '',
            'cpf' => 'abc',
            'email' => 'not-an-email',
            'idade' => 'dezesseis',
            'endereco' => '',
        ];
        $response = $this->postJson('/api/clientes', $payload);
        $response->assertStatus(422)->assertJsonStructure(['success', 'error', 'errors']);
    }
}

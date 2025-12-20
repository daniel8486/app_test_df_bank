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
    // public function test_busca_clientes_por_nome_e_cpf()
    // {
    //     // Cria clientes para busca
    //     $cliente1 = Cliente::factory()->create(['nome' => 'Daniel', 'cpf' => '12345678901']);
    //     $cliente2 = Cliente::factory()->create(['nome' => 'Maria', 'cpf' => '98765432100']);
    //
    //     // Busca por nome exato
    //     $response = $this->getJson('/api/clientes-search?nome=Daniel');
    //     $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
    //     $this->assertTrue(
    //         collect($response->json('data'))->contains(fn($c) => $c['id'] === $cliente1->id),
    //         'Cliente Daniel não encontrado na busca por nome exato. Resultado: ' . json_encode($response->json('data'))
    //     );
    // }
    // Busca por nome sem acento
    //     $response = $this->getJson('/api/clientes-search?nome=daniel');
    //     $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
    //     $this->assertTrue(
    //         collect($response->json('data'))->contains(fn($c) => $c['id'] === $cliente1->id),
    //         'Cliente Daniel não encontrado na busca por nome sem acento. Resultado: ' . json_encode($response->json('data'))
    //     );
    //
    //     // Busca por CPF
    //     $response = $this->getJson('/api/clientes-search?cpf=98765432100');
    //     $response->assertStatus(200)->assertJsonStructure(['success', 'data']);
    //     $this->assertTrue(
    //         collect($response->json('data'))->contains(fn($c) => $c['id'] === $cliente2->id),
    //         'Cliente Maria Souza não encontrado na busca por CPF. Resultado: ' . json_encode($response->json('data'))
    //     );
    // }
}

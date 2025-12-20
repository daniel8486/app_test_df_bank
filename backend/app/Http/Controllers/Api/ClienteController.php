<?php

namespace App\Http\Controllers\Api;

use App\DTOs\ClienteDTO;
use App\Exceptions\DomainException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClienteRequest;
use App\Http\Requests\Cliente\UpdateClienteRequest;
use App\Services\ClienteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Consulta clientes por nome e/ou CPF.
     */
    public function search(Request $request)
    {
        $nome = $request->input('nome');
        $cpf = $request->input('cpf');
        $email = $request->input('email');

        $query = \App\Models\Cliente::query();

        // Para SQLite, não usamos WHERE complexo - pegamos todos e filtramos depois
        $needsMemoryFilter = false;

        if ($nome && config('database.default') !== 'sqlite') {
            // MySQL/PostgreSQL: busca insensível a acentos
            $nomeNormalizado = $this->removerAcentos(strtolower($nome));
            $query->whereRaw(
                "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(nome, 'á', 'a'), 'à', 'a'), 'â', 'a'), 'ã', 'a'), 'é', 'e'), 'ê', 'e'), 'í', 'i'), 'ó', 'o'), 'ô', 'o'), 'õ', 'o'), 'ú', 'u'), 'ç', 'c'), 'Á', 'A'), 'É', 'E')) LIKE ?",
                ['%'.$nomeNormalizado.'%']
            );
        } elseif ($nome && config('database.default') === 'sqlite') {
            // SQLite: marcamos para filtrar em memória
            $needsMemoryFilter = true;
        }

        if ($cpf) {
            $query->where('cpf', $cpf);
        }

        if ($email) {
            $query->where('email', 'LIKE', '%'.$email.'%');
        }

        $clientes = $query->get();

        // Para SQLite com busca por nome, fazemos filtro em memória
        if ($needsMemoryFilter && $nome) {
            $nomeNormalizado = $this->removerAcentos(strtolower($nome));
            $clientes = $clientes->filter(function ($cliente) use ($nomeNormalizado) {
                $nomeCliente = $this->removerAcentos(strtolower($cliente->nome));

                return str_contains($nomeCliente, $nomeNormalizado);
            })->values();
        }

        return $this->successResponse($clientes);
    }

    /**
     * Remove acentos de uma string
     */
    private function removerAcentos(string $string): string
    {
        return strtr($string, [
            'á' => 'a', 'à' => 'a', 'â' => 'a', 'ã' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e',
            'í' => 'i', 'ì' => 'i', 'î' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ô' => 'o', 'õ' => 'o',
            'ú' => 'u', 'ù' => 'u', 'û' => 'u',
            'ç' => 'c',
            'Á' => 'A', 'À' => 'A', 'Â' => 'A', 'Ã' => 'A',
            'É' => 'E', 'È' => 'E', 'Ê' => 'E',
            'Í' => 'I', 'Ì' => 'I', 'Î' => 'I',
            'Ó' => 'O', 'Ò' => 'O', 'Ô' => 'O', 'Õ' => 'O',
            'Ú' => 'U', 'Ù' => 'U', 'Û' => 'U',
            'Ç' => 'C',
        ]);
    }

    public function __construct(protected ClienteService $service)
    {
        // Construtor vazio em múltiplas linhas
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clientes = $this->service->paginate(request('per_page', 15));

        return $this->successResponse($clientes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClienteRequest $request)
    {
        try {
            $dto = new ClienteDTO(
                null,
                $request->nome,
                $request->cpf,
                $request->email,
                $request->idade,
                $request->endereco
            );
            $cliente = $this->service->create($dto);

            return $this->successResponse($cliente, 201);
        } catch (DomainException $e) {
            $errors = method_exists($e, 'getErrors') ? $e->getErrors() : null;

            return $this->errorResponse($e->getMessage(), 422, $errors);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $cliente = $this->service->getById($id);

            return $this->successResponse($cliente);
        } catch (\Exception $e) {
            return $this->errorResponse('Cliente não encontrado', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClienteRequest $request, string $id)
    {
        try {
            $dto = new ClienteDTO(
                $id,
                $request->nome,
                $request->cpf,
                $request->email,
                $request->idade,
                $request->endereco
            );
            $cliente = $this->service->update($id, $dto);

            return $this->successResponse($cliente);
        } catch (DomainException $e) {
            \Log::error('Erro de domínio ao editar cliente', [
                'id' => $id,
                'payload' => $request->all(),
                'exception' => $e,
            ]);
            $errors = method_exists($e, 'getErrors') ? $e->getErrors() : null;

            return $this->errorResponse($e->getMessage(), 422, $errors);
        } catch (\Exception $e) {
            \Log::error('Exception ao editar cliente', [
                'id' => $id,
                'payload' => $request->all(),
                'exception' => $e,
            ]);

            return $this->errorResponse('Cliente não encontrado', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->service->delete($id);

            return response()->json([], 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Cliente não encontrado', 404);
        }
    }

    private function successResponse($data, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
        ], $status);
    }

    private function errorResponse($message, int $status = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'error' => $message,
        ];
        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }
}

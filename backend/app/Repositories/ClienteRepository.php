<?php

namespace App\Repositories;

use App\Models\Cliente;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClienteRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Cliente::query()->paginate($perPage);
    }

    public function findById(string $id): Cliente
    {
        return Cliente::query()->findOrFail($id);
    }

    public function findByCpf(string $cpf): ?Cliente
    {
        return Cliente::query()->where('cpf', $cpf)->first();
    }

    public function findByEmail(string $email): ?Cliente
    {
        return Cliente::query()->where('email', $email)->first();
    }

    public function create(array $data): Cliente
    {
        return Cliente::create($data);
    }

    public function update(Cliente $cliente, array $data): Cliente
    {
        $cliente->update($data);

        return $cliente->refresh();
    }

    public function delete(Cliente $cliente): void
    {
        $cliente->delete();
    }
}

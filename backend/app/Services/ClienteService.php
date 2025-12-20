<?php

namespace App\Services;

use App\DTOs\ClienteDTO;
use App\Models\Cliente;
use App\Repositories\ClienteRepository;
use App\Rules\ValidCpf;
use App\Exceptions\DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ClienteService
{
    public function __construct(
        protected ClienteRepository $repository
    ) {}

    public function create(ClienteDTO $dto): Cliente
    {
        $this->validateBusiness($dto);
        return DB::transaction(function () use ($dto) {
            return $this->repository->create($this->dtoToArray($dto));
        });
    }

    public function update(string $id, ClienteDTO $dto): Cliente
    {
        $cliente = $this->repository->findById($id);
        $this->validateBusiness($dto, $id);
        return DB::transaction(function () use ($cliente, $dto) {
            return $this->repository->update($cliente, $this->dtoToArray($dto));
        });
    }

    public function delete(string $id): void
    {
        $cliente = $this->repository->findById($id);
        $this->repository->delete($cliente);
    }

    public function getById(string $id): Cliente
    {
        return $this->repository->findById($id);
    }

    public function paginate(int $perPage = 15)
    {
        return $this->repository->paginate($perPage);
    }

    private function validateBusiness(ClienteDTO $dto, ?string $ignoreId = null): void
    {
        if (!(new ValidCpf())->passes('cpf', $dto->cpf)) {
            throw new DomainException('CPF inválido.');
        }
        $cpfExists = $this->repository->findByCpf($dto->cpf);
        if ($cpfExists && $cpfExists->id !== $ignoreId) {
            throw new DomainException('CPF já cadastrado.');
        }
        $emailExists = $this->repository->findByEmail($dto->email);
        if ($emailExists && $emailExists->id !== $ignoreId) {
            throw new DomainException('E-mail já cadastrado.');
        }
        if ($dto->idade < 18) {
            throw new DomainException('Idade mínima para cadastro é 18 anos.');
        }
    }

    private function dtoToArray(ClienteDTO $dto): array
    {
        return [
            'nome' => $dto->nome,
            'cpf' => $dto->cpf,
            'email' => $dto->email,
            'idade' => $dto->idade,
            'endereco' => $dto->endereco,
        ];
    }
}

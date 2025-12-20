<?php

namespace App\DTOs;

class ClienteDTO
{
    public function __construct(
        public readonly ?string $id,
        public readonly string $nome,
        public readonly string $cpf,
        public readonly string $email,
        public readonly int $idade,
        public readonly string $endereco,
        public readonly ?string $created_at = null,
        public readonly ?string $updated_at = null,
        public readonly ?string $deleted_at = null,
    ) {}
}

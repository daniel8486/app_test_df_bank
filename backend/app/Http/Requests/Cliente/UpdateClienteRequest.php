<?php

namespace App\Http\Requests\Cliente;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClienteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('cliente') ?? $this->route('id');

        // Validação manual do parâmetro de rota (UUID v4 padrão)
        if (empty($id) || ! preg_match('/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/', $id)) {
            abort(422, 'O parâmetro id da rota é obrigatório e deve ser um UUID válido.');
        }

        return [
            'nome' => ['required', 'string'],
            // Permite CPF e email iguais ao próprio cliente
            'cpf' => ['required', 'string', 'unique:clientes,cpf,'.$id.',id', new \App\Rules\ValidCpf],
            'email' => ['required', 'string', 'email', 'unique:clientes,email,'.$id.',id'],
            'idade' => ['required', 'integer', 'min:18'],
            'endereco' => ['required', 'string'],
        ];
    }
}

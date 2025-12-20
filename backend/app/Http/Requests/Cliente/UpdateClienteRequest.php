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
        $id = $this->route('id');

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

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cpfMask } from '../utils/cpfMask';

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório').length(14, 'CPF inválido'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  idade: yup.number().typeError('Idade deve ser um número').min(18, 'Idade mínima é 18').required('Idade é obrigatória'),
  endereco: yup.string().required('Endereço é obrigatório'),
});

export default function ClienteForm({ initialValues = {}, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  // Máscara de CPF
  const handleCpfChange = (e) => {
    setValue('cpf', cpfMask(e.target.value));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
      <div>
        <label htmlFor="nome" className="block mb-1 font-medium">Nome</label>
        <input
          id="nome"
          type="text"
          {...register('nome')}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Digite o nome completo"
          autoComplete="name"
          disabled={loading}
          aria-invalid={!!errors.nome}
        />
        {errors.nome && <span className="text-red-600 text-sm">{errors.nome.message}</span>}
      </div>
      <div>
        <label htmlFor="cpf" className="block mb-1 font-medium">CPF</label>
        <input
          id="cpf"
          type="text"
          {...register('cpf')}
          maxLength={14}
          onChange={handleCpfChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="000.000.000-00"
          autoComplete="off"
          disabled={loading}
          aria-invalid={!!errors.cpf}
        />
        {errors.cpf && <span className="text-red-600 text-sm">{errors.cpf.message}</span>}
      </div>
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="email@exemplo.com"
          autoComplete="email"
          disabled={loading}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="idade" className="block mb-1 font-medium">Idade</label>
        <input
          id="idade"
          type="number"
          {...register('idade')}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.idade ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Idade (mínimo 18)"
          autoComplete="off"
          min={18}
          disabled={loading}
          aria-invalid={!!errors.idade}
        />
        {errors.idade && <span className="text-red-600 text-sm">{errors.idade.message}</span>}
      </div>
      <div>
        <label htmlFor="endereco" className="block mb-1 font-medium">Endereço</label>
        <input
          id="endereco"
          type="text"
          {...register('endereco')}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endereco ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Rua, número, bairro, cidade"
          autoComplete="street-address"
          disabled={loading}
          aria-invalid={!!errors.endereco}
        />
        {errors.endereco && <span className="text-red-600 text-sm">{errors.endereco.message}</span>}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => reset()}
          disabled={loading || !isDirty}
        >
          Limpar
        </button>
      </div>
    </form>
  );
}

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="nome" className="block mb-2 font-semibold text-blue-900">Nome completo</label>
          <input
            id="nome"
            type="text"
            {...register('nome')}
            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg ${errors.nome ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="Digite o nome completo"
            autoComplete="name"
            disabled={loading}
            aria-invalid={!!errors.nome}
          />
          {errors.nome && <span className="text-red-600 text-sm mt-1 block">{errors.nome.message}</span>}
        </div>
        <div>
          <label htmlFor="cpf" className="block mb-2 font-semibold text-blue-900">CPF</label>
          <input
            id="cpf"
            type="text"
            {...register('cpf')}
            maxLength={14}
            onChange={handleCpfChange}
            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg ${errors.cpf ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="000.000.000-00"
            autoComplete="off"
            disabled={loading}
            aria-invalid={!!errors.cpf}
          />
          {errors.cpf && <span className="text-red-600 text-sm mt-1 block">{errors.cpf.message}</span>}
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold text-blue-900">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="email@exemplo.com"
            autoComplete="email"
            disabled={loading}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="text-red-600 text-sm mt-1 block">{errors.email.message}</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="idade" className="block mb-2 font-semibold text-blue-900">Idade</label>
            <input
              id="idade"
              type="number"
              {...register('idade')}
              className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg ${errors.idade ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Idade (mínimo 18)"
              autoComplete="off"
              min={18}
              disabled={loading}
              aria-invalid={!!errors.idade}
            />
            {errors.idade && <span className="text-red-600 text-sm mt-1 block">{errors.idade.message}</span>}
          </div>
          <div>
            <label htmlFor="endereco" className="block mb-2 font-semibold text-blue-900">Endereço</label>
            <input
              id="endereco"
              type="text"
              {...register('endereco')}
              className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg ${errors.endereco ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Rua, número, bairro, cidade"
              autoComplete="street-address"
              disabled={loading}
              aria-invalid={!!errors.endereco}
            />
            {errors.endereco && <span className="text-red-600 text-sm mt-1 block">{errors.endereco.message}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-8 justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-sm transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg shadow-sm transition disabled:opacity-50"
          onClick={() => reset()}
          disabled={loading || !isDirty}
        >
          Limpar
        </button>
      </div>
    </form>
  );
}

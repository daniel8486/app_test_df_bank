"use client";
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-xl font-bold">Cadastro de Clientes</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}

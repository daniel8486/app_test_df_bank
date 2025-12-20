import React from 'react';

export default function FormSection({ title, children }) {
  return (
    <section className="bg-blue-50 rounded-xl p-4 mb-4 shadow-sm">
      {title && <h2 className="text-blue-800 font-semibold mb-2 text-sm uppercase tracking-wider">{title}</h2>}
      {children}
    </section>
  );
}

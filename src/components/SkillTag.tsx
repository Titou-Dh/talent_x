import React from 'react';

export const SkillTag = ({ label, secondary = false }: { label: string, secondary?: boolean }) => (
  <span className={`inline-block border px-3 py-1 text-lg mr-2 mb-2 uppercase font-vt323 tracking-wide ${secondary ? 'border-gray-600 text-gray-400' : 'border-white text-white'}`}>
    {label}
  </span>
);

import React from 'react';
import { BadgeCheck } from 'lucide-react';

export const VerifiedBadge = () => (
  <div className="flex items-center space-x-1 text-white border border-white px-2 py-0.5 bg-black" title="Verified Talent">
    <BadgeCheck size={16} fill="white" className="text-black" />
    <span className="text-sm uppercase font-bold tracking-widest">Verified</span>
  </div>
);

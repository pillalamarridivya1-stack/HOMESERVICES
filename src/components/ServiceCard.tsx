import React from 'react';
import { ServiceItem } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  onBook: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
      <div className="h-48 bg-slate-100 relative overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span>{service.category}</span>
          <span aria-hidden="true">·</span>
          <span>{service.duration}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
        <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5">
          {service.description}
        </p>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Service Price</span>
            <span className="text-xl font-bold text-[#0F294A] tabular-nums">
              ₹{service.price}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onBook(service.id)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

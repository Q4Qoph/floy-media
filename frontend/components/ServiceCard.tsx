'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';
import type { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Camera className="text-muted-foreground/50" size={40} strokeWidth={1.25} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="text-xl font-bold mb-2 text-card-foreground">
            {service.title}
          </h3>
          <p className="text-sm text-foreground/70 leading-relaxed mb-4">
            {service.description}
          </p>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <ul className="space-y-2 mb-4">
              {service.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="text-xs text-foreground/60 flex items-start gap-2"
                >
                  <span className="inline-block w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          {service.price && (
            <span className="text-sm font-semibold text-primary">
              {service.price}
            </span>
          )}
          <button className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors group/btn">
            Learn More
            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

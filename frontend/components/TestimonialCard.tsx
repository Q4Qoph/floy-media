'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-6">
      {/* Stars */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className="fill-primary text-primary"
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">
        {`"${testimonial.text}"`}
      </p>

      {/* Client Info */}
      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
        {testimonial.image && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.clientName}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="text-left">
          <p className="font-semibold text-sm">{testimonial.clientName}</p>
          {testimonial.clientRole && (
            <p className="text-xs text-foreground/60">{testimonial.clientRole}</p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import type { TeamMember } from '@/types';

interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar */}
      <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden border-2 border-primary/20 group hover:border-primary/50 transition-colors">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
      <p className="text-sm font-medium text-primary mb-3">{member.role}</p>

      {member.bio && (
        <p className="text-sm text-foreground/70 mb-4 max-w-xs leading-relaxed">
          {member.bio}
        </p>
      )}

      {/* Contact Links */}
      <div className="flex gap-4">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-xs text-foreground/60 hover:text-primary transition-colors"
          >
            Email
          </a>
        )}
        {member.phone && (
          <a
            href={`tel:${member.phone}`}
            className="text-xs text-foreground/60 hover:text-primary transition-colors"
          >
            Call
          </a>
        )}
      </div>
    </div>
  );
}

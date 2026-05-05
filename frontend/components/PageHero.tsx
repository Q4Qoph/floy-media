'use client';

interface PageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
  variant?: 'blue' | 'indigo' | 'teal' | 'orange' | 'slate';
}

export default function PageHero({ title, description, eyebrow }: PageHeroProps) {

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        {eyebrow ? (
          <p className="text-sm font-semibold text-[#045be2] uppercase tracking-wider mb-3">{eyebrow}</p>
        ) : null}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">{title}</h1>
        {description ? (
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{description}</p>
        ) : null}
      </div>
    </section>
  );
}


import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon: Icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`feature-card ${className}`}>
      <div className="bg-background/20 p-3 rounded-full">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

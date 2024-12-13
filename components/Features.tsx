import React from 'react';
import { Users, Calendar, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Community Building',
    description: 'Connect with like-minded individuals and build lasting relationships'
  },
  {
    icon: Calendar,
    title: 'Event Management',
    description: 'Organize and participate in events with ease'
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Stay connected with instant messaging and group discussions'
  }
];

export function Features() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mt-16">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm">
            <Icon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
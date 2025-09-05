'use client';

import { Clock, BookOpen, CheckCircle, Play } from 'lucide-react';
import type { LearningModule } from '@/lib/types';

interface LearningModuleCardProps {
  module: LearningModule;
  onStart?: (moduleId: string) => void;
}

export function LearningModuleCard({ module, onStart }: LearningModuleCardProps) {
  const difficultyColors = {
    beginner: 'text-green-400 bg-green-500 bg-opacity-20',
    intermediate: 'text-yellow-400 bg-yellow-500 bg-opacity-20',
    advanced: 'text-red-400 bg-red-500 bg-opacity-20',
  };

  return (
    <div className="metric-card hover:scale-105 transform transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
            <BookOpen size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{module.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[module.difficulty]}`}>
                {module.difficulty}
              </span>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Clock size={12} />
                <span>{module.duration}min</span>
              </div>
            </div>
          </div>
        </div>
        {module.completed && (
          <CheckCircle size={20} className="text-green-400" />
        )}
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {module.content}
      </p>

      <button
        onClick={() => onStart?.(module.moduleId)}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
          module.completed
            ? 'bg-green-500 bg-opacity-20 text-green-400 hover:bg-opacity-30'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {module.completed ? (
          <>
            <CheckCircle size={16} />
            Completed
          </>
        ) : (
          <>
            <Play size={16} />
            Start Learning
          </>
        )}
      </button>
    </div>
  );
}

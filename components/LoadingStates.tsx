'use client';

import { Loader2, TrendingUp, BarChart3, DollarSign, Activity } from 'lucide-react';

// Generic loading spinner
export function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin text-blue-400 ${className}`} 
    />
  );
}

// Full page loading
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={48} className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Loading FlashTrade Sim</h2>
        <p className="text-gray-400">Preparing your trading environment...</p>
      </div>
    </div>
  );
}

// Card loading skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-6 animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-white bg-opacity-20 rounded w-24"></div>
        <div className="h-4 bg-white bg-opacity-20 rounded w-16"></div>
      </div>
      <div className="h-8 bg-white bg-opacity-20 rounded w-32 mb-2"></div>
      <div className="h-3 bg-white bg-opacity-20 rounded w-20"></div>
    </div>
  );
}

// Market data loading skeleton
export function MarketDataSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Chart loading skeleton
export function ChartSkeleton({ height = 320 }: { height?: number }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-white bg-opacity-20 rounded w-32 animate-pulse"></div>
        <div className="h-4 bg-white bg-opacity-20 rounded w-20 animate-pulse"></div>
      </div>
      <div 
        className="bg-white bg-opacity-10 rounded-lg animate-pulse flex items-center justify-center"
        style={{ height }}
      >
        <BarChart3 className="w-16 h-16 text-white text-opacity-30" />
      </div>
    </div>
  );
}

// Analytics loading skeleton
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-white bg-opacity-20 rounded w-20"></div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded"></div>
            </div>
            <div className="h-6 bg-white bg-opacity-20 rounded w-24 mb-2"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-16"></div>
          </div>
        ))}
      </div>
      
      <ChartSkeleton />
      
      <div className="glass-card p-6 animate-pulse">
        <div className="h-5 bg-white bg-opacity-20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded"></div>
                <div className="h-4 bg-white bg-opacity-20 rounded w-16"></div>
                <div className="h-3 bg-white bg-opacity-20 rounded w-24"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-white bg-opacity-20 rounded w-20 mb-1"></div>
                <div className="h-3 bg-white bg-opacity-20 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Trade form loading
export function TradeFormSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-white bg-opacity-20 rounded w-24"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-white bg-opacity-20 rounded w-16"></div>
          <div className="h-8 bg-white bg-opacity-20 rounded w-16"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-16 mb-2"></div>
          <div className="h-10 bg-white bg-opacity-20 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-20 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-white bg-opacity-20 rounded flex-1"></div>
            <div className="h-8 bg-white bg-opacity-20 rounded flex-1"></div>
          </div>
        </div>
        <div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-24 mb-2"></div>
          <div className="h-10 bg-white bg-opacity-20 rounded"></div>
        </div>
        
        <div className="bg-white bg-opacity-5 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-white bg-opacity-20 rounded w-20"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-16"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-white bg-opacity-20 rounded w-24"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-white bg-opacity-20 rounded w-28"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-24"></div>
          </div>
        </div>
        
        <div className="h-12 bg-white bg-opacity-20 rounded"></div>
      </div>
    </div>
  );
}

// Learning module loading
export function LearningModuleSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-white bg-opacity-20 rounded w-20"></div>
            <div className="h-6 bg-white bg-opacity-20 rounded w-16"></div>
          </div>
          <div className="h-5 bg-white bg-opacity-20 rounded w-32 mb-3"></div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-white bg-opacity-20 rounded w-full"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-4/5"></div>
            <div className="h-3 bg-white bg-opacity-20 rounded w-3/4"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-white bg-opacity-20 rounded w-16"></div>
            <div className="h-8 bg-white bg-opacity-20 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Inline loading for buttons
export function ButtonLoading({ children, loading, ...props }: any) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size={16} />
          {typeof children === 'string' ? 'Loading...' : children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Data loading with icon
export function DataLoading({ 
  icon: Icon = Activity, 
  message = 'Loading data...',
  className = '' 
}: { 
  icon?: any; 
  message?: string; 
  className?: string; 
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative mb-4">
        <Icon className="w-12 h-12 text-blue-400 animate-pulse" />
        <LoadingSpinner size={20} className="absolute -top-1 -right-1" />
      </div>
      <p className="text-gray-400 text-center">{message}</p>
    </div>
  );
}

// Shimmer effect for images
export function ImageSkeleton({ className = '', aspectRatio = 'aspect-video' }: { className?: string; aspectRatio?: string }) {
  return (
    <div className={`bg-white bg-opacity-10 rounded-lg animate-pulse ${aspectRatio} ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded"></div>
      </div>
    </div>
  );
}

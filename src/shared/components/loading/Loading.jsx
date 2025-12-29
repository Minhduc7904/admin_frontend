import { Loader2 } from 'lucide-react';

/**
 * Spinner component - Basic animated spinner
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 
      className={`animate-spin text-foreground-light ${sizeClasses[size]} ${className}`}
    />
  );
};

/**
 * Button Loading - Loading spinner cho button
 */
export const ButtonLoading = ({ message = 'Đang xử lý...' }) => {
  return (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <span>{message}</span>
    </div>
  );
};

/**
 * Page Loading - Full page loading với spinner ở giữa
 */
export const PageLoading = ({ message = 'Đang tải...' }) => {
  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-sm text-foreground-light">{message}</p>
      </div>
    </div>
  );
};

/**
 * Inline Loading - Loading nhỏ gọn cho inline content
 */
export const InlineLoading = ({ message }) => {
  return (
    <div className="flex items-center gap-2 py-4">
      <Spinner size="sm" />
      {message && <span className="text-sm text-foreground-light">{message}</span>}
    </div>
  );
};

/**
 * Skeleton Text - Loading skeleton cho text
 */
export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded-sm animate-pulse ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Skeleton Card - Loading skeleton cho card
 */
export const SkeletonCard = ({ count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-primary border border-border rounded-sm p-4 ${className}`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-sm animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded-sm animate-pulse w-1/3" />
              <div className="h-3 bg-gray-200 rounded-sm animate-pulse w-1/2" />
            </div>
          </div>
          {/* Content */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-sm animate-pulse w-full" />
            <div className="h-3 bg-gray-200 rounded-sm animate-pulse w-5/6" />
            <div className="h-3 bg-gray-200 rounded-sm animate-pulse w-4/6" />
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Skeleton Table - Loading skeleton cho table
 */
export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-primary border border-border rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-border p-3 flex gap-3">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-gray-200 rounded-sm animate-pulse flex-1"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="border-b border-border p-3 flex gap-3"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded-sm animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton Avatar - Loading skeleton cho avatar/image
 */
export const SkeletonAvatar = ({ size = 'md', shape = 'square' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-sm';

  return (
    <div
      className={`${sizeClasses[size]} ${shapeClass} bg-gray-200 animate-pulse`}
    />
  );
};

/**
 * Loading Overlay - Overlay loading trên content
 */
export const LoadingOverlay = ({ message = 'Đang xử lý...' }) => {
  return (
    <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-primary border border-border rounded-sm p-6 text-center shadow-lg">
        <Spinner size="lg" className="mx-auto mb-3" />
        <p className="text-sm text-foreground-light">{message}</p>
      </div>
    </div>
  );
};

/**
 * Dots Loading - Loading với dots animation
 */
export const DotsLoading = () => {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-2 h-2 bg-foreground-light rounded-full animate-bounce"
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Progress Bar Loading
 */
export const ProgressBar = ({ progress = 0, showPercentage = true, className = '' }) => {
  return (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-sm h-2 overflow-hidden">
        <div
          className="bg-foreground h-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-foreground-light text-center mt-2">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
};

// Default export
export const Loading = PageLoading;

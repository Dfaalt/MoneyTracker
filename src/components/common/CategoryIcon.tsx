import React from 'react';
import { ALL_CATEGORIES } from '../../lib/constants';

interface CategoryIconProps {
  category?: string;
  icon?: string;
  size?: number | string;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'in' | 'boomerang' | 'sequence';
  colors?: string;
  className?: string;
  fallbackEmoji?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  icon,
  size = 22,
  trigger = 'hover',
  colors,
  className = '',
  fallbackEmoji,
}) => {
  // Lookup category if not fully specified
  const matchedCategory = category
    ? ALL_CATEGORIES.find((c) => c.name.toLowerCase() === category.toLowerCase())
    : undefined;

  const targetIcon = icon || matchedCategory?.icon || 'https://cdn.lordicon.com/nocovwne.json';
  const targetEmoji = fallbackEmoji || matchedCategory?.emoji || '🏷️';

  const isLordIcon =
    typeof targetIcon === 'string' &&
    (targetIcon.startsWith('http') ||
      targetIcon.startsWith('/') ||
      targetIcon.startsWith('./') ||
      targetIcon.endsWith('.json') ||
      /^[a-z0-9]{8}$/.test(targetIcon));

  const lordIconSrc = isLordIcon
    ? targetIcon.startsWith('http') || targetIcon.startsWith('/') || targetIcon.startsWith('./')
      ? targetIcon
      : `https://cdn.lordicon.com/${targetIcon.replace(/\.json$/, '')}.json`
    : null;

  const dimension = typeof size === 'number' ? `${size}px` : size;

  if (lordIconSrc) {
    return (
      <span
        className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        <lord-icon
          src={lordIconSrc}
          trigger={trigger}
          colors={colors}
          style={{ width: dimension, height: dimension, display: 'block' }}
        />
      </span>
    );
  }

  // Fallback to text / emoji
  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ fontSize: typeof size === 'number' ? `${size * 0.8}px` : size }}
    >
      {targetIcon || targetEmoji}
    </span>
  );
};

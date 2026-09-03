import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'in' | 'boomerang' | 'sequence';
          delay?: string | number;
          colors?: string;
          state?: string;
          style?: React.CSSProperties;
          class?: string;
        },
        HTMLElement
      >;
    }
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'lord-icon': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            src?: string;
            trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'in' | 'boomerang' | 'sequence';
            delay?: string | number;
            colors?: string;
            state?: string;
            style?: React.CSSProperties;
            class?: string;
          },
          HTMLElement
        >;
      }
    }
  }
}

export {};

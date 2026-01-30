/**
 * Expose React's JSX namespace globally so libraries like react-markdown
 * (used by @uiw/react-md-editor) can resolve "JSX.IntrinsicElements" when
 * TypeScript uses "jsx": "react-jsx" (React 17+ transform).
 */
import type React from 'react';

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
    type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<
      C,
      P
    >;
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
    type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>;
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

export {};

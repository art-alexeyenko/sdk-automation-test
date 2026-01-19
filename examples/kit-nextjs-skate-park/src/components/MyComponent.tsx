import React from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

interface MyComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: MyComponentProps): React.JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <p>MyComponent Component</p>
      </div>
    </div>
  );
};

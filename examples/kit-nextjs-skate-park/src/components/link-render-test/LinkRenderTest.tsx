'use client';

import type React from 'react';
import { Link, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface LinkRenderTestFields {
  targetLink: LinkField;
}

interface LinkRenderTestProps extends ComponentProps {
  fields: LinkRenderTestFields;
}

/**
 * Test component for verifying renderChildrenWhenEmpty behavior on the Link component.
 * Register in Sitecore with a single Link field named "targetLink".
 * Leave the field empty to trigger TC-02 through TC-10.
 * Set the field to a valid URL to trigger TC-01 and TC-09.
 */
export const Default = ({ fields }: LinkRenderTestProps): React.JSX.Element => {
  if (!fields) {
    return <div style={{ border: '2px solid red', padding: '8px' }}>No fields provided</div>;
  }

  const { targetLink } = fields;

  return (
    <div
      style={{ fontFamily: 'monospace', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <h2>Link renderChildrenWhenEmpty — Test Panel</h2>

      {/* TC-01 / TC-02 — baseline: no renderChildrenWhenEmpty */}
      <section style={{ border: '1px solid #ccc', padding: '12px' }}>
        <h3>TC-01 / TC-02 — Baseline (no renderChildrenWhenEmpty)</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          TC-01 (field has value): normal link with href renders.<br />
          TC-02 (field empty): nothing on live; placeholder shown in Page Builder.
        </p>
        <div data-testid="tc-01-02">
          <Link field={targetLink}>
            <span>Baseline child content</span>
          </Link>
        </div>
      </section>

      {/* TC-03 — empty field, renderChildrenWhenEmpty true, children present */}
      <section style={{ border: '1px solid #0070f3', padding: '12px' }}>
        <h3>TC-03 — renderChildrenWhenEmpty=true, children present</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Field empty → empty anchor wrapping children renders. No Sitecore placeholder chrome in Page Builder.
        </p>
        <div data-testid="tc-03">
          <Link field={targetLink} renderChildrenWhenEmpty>
            <span>Child renders even when link field is empty</span>
          </Link>
        </div>
      </section>

      {/* TC-05 — renderChildrenWhenEmpty true, NO children */}
      <section style={{ border: '1px solid #f5a623', padding: '12px' }}>
        <h3>TC-05 — renderChildrenWhenEmpty=true, NO children</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Field empty, no children provided → nothing renders on live; placeholder shown in Page Builder.
        </p>
        <div data-testid="tc-05">
          <Link field={targetLink} renderChildrenWhenEmpty />
          <em style={{ color: '#999' }}>(nothing should render above this line when field is empty)</em>
        </div>
      </section>

      {/* TC-06 — renderChildrenWhenEmpty explicitly false */}
      <section style={{ border: '1px solid #e00', padding: '12px' }}>
        <h3>TC-06 — renderChildrenWhenEmpty=false</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Field empty, prop explicitly false → same as baseline. Children must NOT render.
        </p>
        <div data-testid="tc-06">
          <Link field={targetLink} renderChildrenWhenEmpty={false}>
            <span>This child should NOT render when field is empty</span>
          </Link>
        </div>
      </section>

      {/* TC-07 — extra HTML attributes preserved on the empty anchor */}
      <section style={{ border: '1px solid #7b00d4', padding: '12px' }}>
        <h3>TC-07 — Extra HTML attributes (id, className) preserved</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Inspect element: the empty anchor must have id=&quot;tc-07-anchor&quot; and class=&quot;tc07-class&quot;.
        </p>
        <div data-testid="tc-07">
          <Link field={targetLink} renderChildrenWhenEmpty id="tc-07-anchor" className="tc07-class">
            <span>Inspect the anchor tag attributes in DevTools</span>
          </Link>
        </div>
      </section>

      {/* TC-08 — Next.js-specific props must NOT leak to the DOM anchor */}
      <section style={{ border: '1px solid #00a800', padding: '12px' }}>
        <h3>TC-08 — Next.js props NOT leaked to empty anchor DOM</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Inspect element: prefetch, replace, scroll must NOT appear as attributes on the &lt;a&gt; tag.
        </p>
        <div data-testid="tc-08">
          <Link field={targetLink} renderChildrenWhenEmpty prefetch={false} replace scroll={false}>
            <span>Inspect: no next.js props on empty anchor</span>
          </Link>
        </div>
      </section>

      {/* TC-09 — field has value, renderChildrenWhenEmpty=true (no interference) */}
      <section style={{ border: '1px solid #555', padding: '12px' }}>
        <h3>TC-09 — Field has value + renderChildrenWhenEmpty=true (no interference)</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Set field to a valid URL. Normal link with href must render — prop must not interfere.
        </p>
        <div data-testid="tc-09">
          <Link field={targetLink} renderChildrenWhenEmpty>
            <span>Normal link child — renders inside a proper href when field has a value</span>
          </Link>
        </div>
      </section>

      {/* TC-10 — complex nested children inside empty anchor */}
      <section style={{ border: '1px solid #ff6b6b', padding: '12px' }}>
        <h3>TC-10 — Nested complex children inside empty anchor</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Field empty → full nested structure (icon + bold + small) renders inside a single empty &lt;a&gt;.
        </p>
        <div data-testid="tc-10">
          <Link field={targetLink} renderChildrenWhenEmpty>
            <span aria-hidden="true">→ </span>
            <strong>Bold label</strong>
            <small style={{ marginLeft: '4px' }}>subtitle text</small>
          </Link>
        </div>
      </section>
    </div>
  );
};

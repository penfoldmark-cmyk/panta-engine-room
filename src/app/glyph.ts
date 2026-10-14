import { Component, input } from '@angular/core';
import { GlyphKind } from './data';

/** Small status glyph used in rows, the detail header and outcomes. */
@Component({
  selector: 'er-glyph',
  host: { class: 'glyph', '[attr.aria-label]': 'label[kind()]', role: 'img' },
  template: `
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      @switch (kind()) {
        @case ('urgent') {
          <circle cx="7" cy="7" r="6.3" fill="var(--crit)" />
          <rect x="6.1" y="3.2" width="1.8" height="5.2" rx=".9" fill="#fff" />
          <circle cx="7" cy="10.4" r="1" fill="#fff" />
        }
        @case ('decide') {
          <circle cx="7" cy="7" r="5.75" fill="none" stroke="var(--warn)" stroke-width="1.5" />
          <path d="M7 7 L7 3.25 A3.75 3.75 0 0 1 7 10.75 Z" fill="var(--warn)" />
        }
        @case ('suggest') {
          <circle cx="7" cy="7" r="5.75" fill="none" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="2.2 1.8" />
          <path d="M7 4v6M4 7h6" stroke="var(--brand)" stroke-width="1.5" stroke-linecap="round" />
        }
        @case ('done') {
          <circle cx="7" cy="7" r="6.3" fill="var(--ok)" />
          <path d="M4 7l2 2l4-4.2" stroke="#0d1a13" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('auto') {
          <circle cx="7" cy="7" r="5.75" fill="none" stroke="var(--faint)" stroke-width="1.5" />
          <path d="M4 7l2 2l4-4.2" stroke="var(--faint)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('rejected') {
          <circle cx="7" cy="7" r="5.75" fill="none" stroke="var(--faint)" stroke-width="1.5" />
          <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="var(--faint)" stroke-width="1.5" stroke-linecap="round" />
        }
      }
    </svg>
  `,
})
export class Glyph {
  kind = input.required<GlyphKind>();
  protected label: Record<GlyphKind, string> = {
    urgent: 'Urgent', decide: 'Needs decision', suggest: 'Suggestion',
    done: 'Approved', auto: 'Handled by Engine', rejected: 'Rejected',
  };
}

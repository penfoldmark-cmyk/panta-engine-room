import { Component, input, output } from '@angular/core';

/** Portal navigation with the Engine Room section expanded. */
@Component({
  selector: 'er-sidebar',
  host: { class: 'side', '[class.open]': 'open()', role: 'navigation', 'aria-label': 'Main' },
  template: `
    <div class="ws">
      <svg width="22" height="26" viewBox="0 0 34 40" aria-hidden="true">
        <polygon points="2,4 22,4 14,16 2,16" fill="#3a86e8" />
        <polygon points="14,16 26,10 26,26 14,32" fill="#3fd18b" />
        <polygon points="14,32 26,26 20,38 14,38" fill="#1fb3a3" />
      </svg>
      <div>PANTA<small>Production</small></div>
    </div>
    @for (n of top; track n.label) {
      <button class="nav-i">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="n.icon" /></svg>
        {{ n.label }}
      </button>
      @if (n.label === 'Engine Room') {
        <div class="nav-sub">
          @for (s of sub; track s.label) {
            <button class="nav-i" [class.on]="s.on" (click)="navigate.emit()">
              {{ s.label }}@if (s.count) {<span class="n">{{ s.count }}</span>}
            </button>
          }
        </div>
      }
    }
    <div class="side-foot"><span class="av">MP</span>Mark Penfold</div>
  `,
})
export class Sidebar {
  open = input(false);
  navigate = output<void>();
  protected top = [
    { label: 'Dashboards', icon: 'M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z' },
    { label: 'Lab', icon: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3' },
    { label: 'Engine Room', icon: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z' },
    { label: 'Data', icon: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3' },
    { label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.4z' },
  ];
  protected sub = [
    { label: 'Brief', on: true }, { label: 'Inbox', count: 4 }, { label: 'Runs' }, { label: 'Data feeds' },
    { label: 'Exceptions' }, { label: 'Corporate actions' }, { label: 'Restatements' }, { label: 'Audit' },
  ] as { label: string; on?: boolean; count?: number }[];
}

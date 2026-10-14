import { Component, computed, HostListener, signal } from '@angular/core';
import { AskPalette } from './ask-palette';
import { BriefItem, Decision, GROUPS, ITEMS } from './data';
import { DayTrack } from './day-track';
import { Glyph } from './glyph';
import { ItemDetail } from './item-detail';
import { Sidebar } from './sidebar';

/** Engine Room / Brief: day track, triage list and detail pane. */
@Component({
  selector: 'app-root',
  imports: [Sidebar, DayTrack, Glyph, ItemDetail, AskPalette],
  template: `
    <div class="shell">
      <er-sidebar [open]="nav()" (navigate)="nav.set(false)" />
      <div class="main">
        <header class="bar">
          <button class="menu" aria-label="Open navigation" (click)="nav.set(true)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <div class="crumb"><span>Engine Room</span><span class="sep">/</span><b>Brief</b><span class="proto">Prototype</span></div>
          <button class="search" (click)="palette.set(true)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14zM20 20l-4-4" /></svg>
            <span>Ask Engine</span><kbd>Ctrl K</kbd>
          </button>
          <div class="mode">Autonomy <b>Suggest and approve</b></div>
        </header>

        <er-day-track />

        <div class="split">
          <div class="list" role="listbox" aria-label="Brief items">
            <div class="summary">
              <p>{{ headline() }} Tokyo close prices are late, so 6 Japan indices are held and need a decision by 11:00. A vendor restated Euro high-yield history overnight, and the 11 affected blends are recalculated and ready to publish. Engine handled 4 issues on its own this morning.</p>
              <small>Written by Engine at 07:05, updated 10:28. Example data.</small>
            </div>
            @for (g of groups; track g[0]) {
              <div class="grp">{{ g[1] }}<span class="c">{{ byGroup(g[0]).length }}</span></div>
              @for (it of byGroup(g[0]); track it.id) {
                <button class="row" role="option" [class.decided]="!!decisions()[it.id]"
                        [attr.aria-selected]="it.id === selected()" (click)="open(it.id)">
                  <er-glyph [kind]="rowGlyph(it)" />
                  <span class="id">{{ it.id }}</span>
                  <span class="t">{{ it.title }}</span>
                  <span class="r">
                    @if (decisions()[it.id]; as d) {
                      <span>{{ d.kind === 'rejected' ? 'Rejected' : 'Approved' }}</span>
                    } @else if (it.due) {
                      <span class="due">{{ it.due }}</span>
                    }
                    <span class="scope">{{ it.scope }}</span>
                    <span>{{ it.age }}</span>
                  </span>
                </button>
              }
            }
          </div>
          <er-item-detail [item]="item()" [decision]="decisions()[item().id]" [sheet]="sheet()"
                          (decide)="decide(item().id, $event)" (back)="sheet.set(false)" />
        </div>
      </div>
    </div>
    @if (palette()) { <er-ask-palette (close)="palette.set(false)" /> }
    @if (toast()) { <div class="toast" role="status">{{ toast() }}</div> }
  `,
})
export class App {
  protected readonly groups = GROUPS;
  protected selected = signal('ENG-142');
  protected decisions = signal<Record<string, Decision | null>>({});
  protected palette = signal(false);
  protected sheet = signal(false);
  protected nav = signal(false);
  protected toast = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  private readonly order = GROUPS.flatMap(([g]) => ITEMS.filter(i => i.group === g)).map(i => i.id);
  protected item = computed(() => ITEMS.find(i => i.id === this.selected())!);
  protected openCount = computed(() => ITEMS.filter(i => i.group === 'decide' && !this.decisions()[i.id]).length);
  protected headline = computed(() => {
    const n = this.openCount();
    return n === 0 ? 'Nothing needs you right now.' : `${n} ${n === 1 ? 'thing needs' : 'things need'} you today.`;
  });

  protected byGroup = (g: string) => ITEMS.filter(i => i.group === g);
  protected rowGlyph(it: BriefItem) {
    const d = this.decisions()[it.id];
    return d ? (d.kind === 'rejected' ? 'rejected' : 'done') : it.glyph;
  }
  protected open(id: string) { this.selected.set(id); this.sheet.set(true); }

  protected decide(id: string, d: Decision | null) {
    this.decisions.update(all => ({ ...all, [id]: d }));
    if (!d) return;
    const it = ITEMS.find(i => i.id === id)!;
    this.say(d.kind === 'rejected' ? `${id} rejected and moved to Exceptions.` : it.isRule ? 'Check added.' : `${id} approved.`);
    const next = this.order.find(o => o !== id && !this.decisions()[o] && !ITEMS.find(i => i.id === o)!.handled);
    if (next) this.selected.set(next);
  }

  private say(msg: string) {
    this.toast.set(msg);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 2800);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.palette.update(p => !p); return; }
    if (e.key === 'Escape') { this.palette.set(false); this.sheet.set(false); this.nav.set(false); return; }
    const tag = (document.activeElement?.tagName ?? '').toLowerCase();
    if (this.palette() || tag === 'input' || tag === 'textarea') return;
    const idx = this.order.indexOf(this.selected());
    if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); this.selected.set(this.order[Math.min(this.order.length - 1, idx + 1)]); }
    if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); this.selected.set(this.order[Math.max(0, idx - 1)]); }
    const it = this.item();
    if (!it.handled && !this.decisions()[it.id]) {
      if (e.key === 'a') this.decide(it.id, { kind: 'approved', text: it.done });
      if (e.key === 'r') this.decide(it.id, { kind: 'rejected' });
    }
  }
}

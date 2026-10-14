import { Component, computed, effect, input, output, signal } from '@angular/core';
import { BriefItem, Decision } from './data';
import { Glyph } from './glyph';

/** Right-hand pane: the selected proposal, how Engine reached it, and the decision controls. */
@Component({
  selector: 'er-item-detail',
  imports: [Glyph],
  host: { class: 'detail', '[class.sheet]': 'sheet()', role: 'region', 'aria-label': 'Selected item' },
  template: `
    @let it = item();
    <div class="d-in">
      <div class="d-top">
        <button class="back" (click)="back.emit()">Back to Brief</button>
        <div class="d-meta">
          <span class="state"><er-glyph [kind]="glyph()" />{{ stateLabel() }}</span>
          <span>{{ it.id }}</span><span>{{ it.raised }}</span>
        </div>
        <h2>{{ it.title }}</h2>
      </div>

      @if (decision(); as d) {
        <div class="outcome" [class.no]="d.kind === 'rejected'">
          <er-glyph [kind]="d.kind === 'rejected' ? 'rejected' : 'done'" />
          <div>
            <b>{{ d.kind === 'rejected' ? 'Rejected by you at 10:31' : 'Approved by you at 10:31' }}</b>
            <span>{{ d.kind === 'rejected' ? 'Moved to Exceptions for manual handling.' : d.text }}</span>
          </div>
          <button class="btn link" (click)="decide.emit(null)">Undo</button>
        </div>
      }

      <dl class="props">
        @for (p of it.props; track p[0]) { <dt>{{ p[0] }}</dt><dd>{{ p[1] }}</dd> }
      </dl>

      <div class="sec">
        <h3>{{ it.handled ? 'What happened' : it.isRule ? 'Why this check' : 'Proposal' }}</h3>
        <div [class.proposal]="!it.handled">
          <p>{{ it.proposal }}</p>
          @if (it.note) { <p>{{ it.note }}</p> }
        </div>
      </div>

      @if (it.rule) {
        <div class="sec"><h3>Check</h3><div class="code">{{ it.rule }}</div></div>
      }

      <div class="sec">
        <h3>{{ it.handled ? 'Steps taken' : 'How Engine got here' }}</h3>
        <ol class="steps">
          @for (s of it.steps; track s[0]) { <li><div><b>{{ s[0] }}.</b> <span>{{ s[1] }}</span></div></li> }
        </ol>
      </div>

      @if (it.evidence) {
        <div class="sec">
          <h3>Evidence</h3>
          <table class="tbl"><tbody>
            @for (e of it.evidence; track e[0]) { <tr><td>{{ e[0] }}</td><td>{{ e[1] }}</td></tr> }
          </tbody></table>
        </div>
      }
    </div>

    @if (!it.handled && !decision()) {
      <div class="actions">
        <button class="btn primary" (click)="decide.emit({ kind: 'approved', text: it.done })">
          {{ it.isRule ? 'Add check' : 'Approve' }} <kbd>A</kbd>
        </button>
        <button class="btn" (click)="decide.emit({ kind: 'rejected' })">Reject <kbd>R</kbd></button>
        <div class="opts">
          <button class="btn link" [attr.aria-expanded]="menu()" (click)="menu.set(!menu())">Other options</button>
          @if (menu()) {
            <div class="opts-m" role="menu">
              @for (o of it.options ?? []; track o) {
                <button role="menuitem" (click)="pick(o)">{{ o }}</button>
              }
            </div>
          }
        </div>
      </div>
    }
    @if (it.handled) {
      <div class="actions">
        <span class="muted">Engine handled this under the act-and-report setting.</span>
        <button class="btn link push">Change setting</button>
      </div>
    }
  `,
})
export class ItemDetail {
  item = input.required<BriefItem>();
  decision = input<Decision | null | undefined>(null);
  sheet = input(false);
  decide = output<Decision | null>();
  back = output<void>();

  protected menu = signal(false);
  constructor() { effect(() => { this.item(); this.menu.set(false); }); }

  protected glyph = computed(() => {
    const d = this.decision();
    return d ? (d.kind === 'rejected' ? 'rejected' : 'done') : this.item().glyph;
  });
  protected stateLabel = computed(() => {
    const d = this.decision();
    return d ? (d.kind === 'rejected' ? 'Rejected' : 'Approved') : this.item().state;
  });
  protected pick(o: string) {
    this.menu.set(false);
    this.decide.emit({ kind: 'approved', text: `Going with: ${o}.` });
  }
}

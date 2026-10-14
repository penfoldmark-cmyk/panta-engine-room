import { AfterViewInit, Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { Answer, ANSWERS } from './data';

/** Command palette (Cmd/Ctrl+K): ask Engine about any index, run, feed or number. */
@Component({
  selector: 'er-ask-palette',
  template: `
    <div class="scrim" (mousedown)="$event.target === $event.currentTarget && close.emit()">
      <div class="pal" role="dialog" aria-label="Ask Engine">
        <form (submit)="$event.preventDefault(); submit()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" class="faint">
            <path d="M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14zM20 20l-4-4" />
          </svg>
          <input #q id="pal-input" [value]="query()" (input)="onInput($event)" placeholder="Ask about an index, run, feed or number" />
          <kbd>esc</kbd>
        </form>
        @if (answer(); as a) {
          <div class="ans">
            <p>{{ a.text }}</p>
            @if (a.steps.length) {
              <ol class="steps">
                @for (s of a.steps; track s[0]) { <li><div><b>{{ s[0] }}.</b> <span>{{ s[1] }}</span></div></li> }
              </ol>
            }
          </div>
        } @else {
          <div class="sugs">
            <p>Try asking</p>
            @for (s of suggestions; track s) { <button (click)="ask(s)">{{ s }}</button> }
          </div>
        }
      </div>
    </div>
  `,
})
export class AskPalette implements AfterViewInit {
  close = output<void>();
  protected readonly suggestions = Object.keys(ANSWERS);
  protected query = signal('');
  protected answer = signal<Answer | null>(null);
  private input = viewChild.required<ElementRef<HTMLInputElement>>('q');

  ngAfterViewInit() { this.input().nativeElement.focus(); }

  protected onInput(e: Event) {
    this.query.set((e.target as HTMLInputElement).value);
    this.answer.set(null);
  }
  protected submit() { const q = this.query().trim(); if (q) this.ask(q); }
  protected ask(q: string) {
    this.query.set(q);
    this.answer.set(ANSWERS[q] ?? {
      text: 'This prototype answers the three example questions. The live version traces any index, run or number back to its inputs.',
      steps: [],
    });
  }
}

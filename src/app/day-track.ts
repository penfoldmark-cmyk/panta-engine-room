import { Component } from '@angular/core';
import { CLOSES, NOW, T, TICKS } from './data';

/** The calculation day: every run plotted against the market closes it depends on. */
@Component({
  selector: 'er-day-track',
  template: `
    <section class="day" aria-label="Today's calculation day">
      <div class="day-h">
        <h1>Wednesday 14 October</h1>
        <p>
          <b>52 runs today.</b> 6 published, 6 held, 40 still to come.
          <span class="key"><i class="pub"></i>Published</span>
          <span class="key"><i class="held"></i>Held</span>
          <span class="key"><i class="todo"></i>Due later</span>
        </p>
      </div>
      <div class="track-wrap">
        <div class="track">
          <div class="lane"></div>
          @for (h of gridHours; track h) {
            <div class="grid-l" [style.left]="pct(T(h))"></div>
          }
          @for (h of labelHours; track h) {
            <span class="hr" [class.first]="h === 0" [class.last]="h === 24" [style.left]="pct(T(h))">{{ pad(h) }}:00</span>
          }
          @for (c of closes; track c.city) {
            <div class="close" [style.left]="pct(c.t)"><span><b>{{ c.city }}</b> {{ c.label }}</span></div>
          }
          <div class="late" [style.left]="pct(T(8, 15))" [style.width]="pct(now - T(8, 15))"
               title="EDI Tokyo end-of-day file due 08:15, not received"></div>
          @for (k of ticks; track $index) {
            <i class="tick" [class]="'tick ' + k.s" [style.left]="pct(k.t)" [title]="k.n"></i>
          }
          <div class="deadline" [style.left]="pct(T(11))" title="Decide on Japan indices by 11:00"></div>
          <div class="now" [style.left]="pct(now)"><span>10:30</span></div>
        </div>
      </div>
    </section>
  `,
})
export class DayTrack {
  protected readonly T = T;
  protected readonly now = NOW;
  protected readonly ticks = TICKS;
  protected readonly closes = CLOSES;
  protected readonly gridHours = [3, 6, 9, 12, 15, 18, 21];
  protected readonly labelHours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  protected pct = (m: number) => (m / 1440) * 100 + '%';
  protected pad = (h: number) => String(h).padStart(2, '0');
}

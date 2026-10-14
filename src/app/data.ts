// Example data for the Engine Room Brief prototype. Replace with API calls.

export type GlyphKind = 'urgent' | 'decide' | 'suggest' | 'done' | 'auto' | 'rejected';
export type Group = 'decide' | 'suggest' | 'auto';

export interface BriefItem {
  id: string;
  group: Group;
  glyph: GlyphKind;
  title: string;
  scope: string;
  due?: string;
  age: string;
  raised: string;
  state: string;
  props: [string, string][];
  proposal: string;
  note?: string;
  rule?: string;
  steps: [string, string][];
  evidence?: [string, string][];
  options?: string[];
  done?: string;
  handled?: boolean;
  isRule?: boolean;
}

export interface Decision {
  kind: 'approved' | 'rejected';
  text?: string;
}

export const GROUPS: [Group, string][] = [
  ['decide', 'Needs your decision'],
  ['suggest', 'Suggested checks'],
  ['auto', 'Handled by Engine'],
];

export const ITEMS: BriefItem[] = [
  {
    id: 'ENG-142', group: 'decide', glyph: 'urgent', title: 'Tokyo close prices are late',
    scope: '6 indices held', due: 'Decide by 11:00', age: '2h', raised: 'Raised 08:17', state: 'Needs approval',
    props: [
      ['Impact', '6 indices held: Japan Primary MV, Asia ex-China Tech, Global Robotics Leaders and 3 more'],
      ['Source', 'EDI end-of-day prices, XTKS'],
      ['Policy', 'Optimistic: carry forward and mark Estimated'],
      ['Approval', 'Required to publish estimated values'],
    ],
    proposal: "Wait until 11:00. If the file still has not arrived, publish the 6 indices using the previous close, mark today's values Estimated, and recalculate automatically when the file lands.",
    note: 'In the last 30 days this file was late 3 times and always arrived by 10:40.',
    steps: [
      ['Run held', 'Japan Primary MV stopped at validation: 1,284 securities have no price for today.'],
      ['Traced the input', 'All 1,284 come from one file, EDI XTKS end of day, due 08:15.'],
      ['Checked the feed', 'No file received. The other 9 EDI files arrived on time.'],
      ['Checked history', 'Late 3 times in 30 days, latest arrival 10:40.'],
      ['Applied policy', 'These indices use the optimistic missing-price policy.'],
    ],
    evidence: [['Expected arrival', '08:15'], ['Last file received', 'Tue 13 Oct, 08:11'], ['Securities without a price', '1,284'], ['Indices held', '6']],
    options: ['Hold until the file arrives', 'Publish now as Estimated'],
    done: 'Engine will wait until 11:00, then publish as Estimated if needed.',
  },
  {
    id: 'ENG-141', group: 'decide', glyph: 'decide', title: 'Euro high-yield history restated for 9–11 Oct',
    scope: '11 blends', due: 'Before 17:30', age: '4h', raised: 'Raised 06:52', state: 'Needs approval',
    props: [
      ['Impact', '11 blends recalculated, 2 of them nested'],
      ['Source', 'ICE BofA Euro High Yield, revision notice 06:40'],
      ['Policy', 'Automatic recalculation within 5 days'],
      ['Approval', 'Required to publish restated history'],
    ],
    proposal: 'Publish the restated history for all 11 blends. The largest change is +1.8 bp on Euro HY / SBI 60/40 on 11 Oct; the median is +0.3 bp.',
    note: 'Recalculation is already done because the revision is inside the 5-day window. Publishing restated values always needs a person.',
    steps: [
      ['Notice received', 'Vendor revised levels for 9, 10 and 11 Oct.'],
      ['Found dependents', '11 blends use this index, including 2 blends of blends.'],
      ['Recalculated', 'Earliest affected date first, then parent blends. Version 3 became version 4.'],
      ['Compared', 'Largest change +1.8 bp, median +0.3 bp. No change above the 5 bp review threshold.'],
    ],
    evidence: [['Revised dates', '9, 10 and 11 Oct'], ['Blends recalculated', '11'], ['Largest change', '+1.8 bp, Euro HY / SBI 60/40'], ['Median change', '+0.3 bp']],
    options: ['Publish selected blends', 'Hold for review'],
    done: 'Restated history for 11 blends will publish in the 17:30 window.',
  },
  {
    id: 'ENG-139', group: 'decide', glyph: 'decide', title: 'Spin-off on Fri 16 Oct has no child price yet',
    scope: '3 indices', due: 'Before 16 Oct', age: '3h', raised: 'Raised 07:05', state: 'Needs approval',
    props: [
      ['Impact', '3 indices hold the parent'],
      ['Source', 'EDI corporate actions, 1 child share per 4 parent shares'],
      ['Rulebook', 'Standard 2-day'],
      ['Approval', 'Required for corporate action treatment'],
    ],
    proposal: 'Add the child on the ex-date at its theoretical price and remove it after 2 trading days, as the Standard 2-day rulebook says.',
    note: 'Pro-forma, the parent weight moves from 4.12% to 3.30% and the child holds 0.82% for two days. Index levels do not change on the ex-date.',
    steps: [
      ['Found the event', 'Spin-off announced, ex-date Fri 16 Oct.'],
      ['Checked prices', 'No listing price for the child on the ex-date yet.'],
      ['Matched rulebook', 'All 3 indices use Standard 2-day.'],
      ['Ran pro-forma', 'Computed weights and levels for 16 and 19 Oct.'],
    ],
    evidence: [['Parent weight before', '4.12%'], ['Parent weight after', '3.30%'], ['Child weight on ex-date', '0.82%'], ['Child removed', 'Tue 20 Oct']],
    options: ['Add child at zero price', 'Use another rulebook'],
    done: 'Standard 2-day treatment will apply on 16 Oct.',
  },
  {
    id: 'ENG-138', group: 'decide', glyph: 'decide', title: 'Trial backtest stopped on missing USD market cap',
    scope: '1 backtest', age: '1h', raised: 'Raised 09:31', state: 'Needs approval',
    props: [
      ['Impact', 'Backtest Japan Primary MV in the trial workspace. No live index affected.'],
      ['Source', 'EDI global equity universe'],
      ['Step', 'Weighting by float market value'],
      ['Approval', 'Required to change a methodology rule'],
    ],
    proposal: 'Exclude securities with no market value at each rebalance, and list them in the rebalance report so the exclusions stay visible.',
    note: 'The excluded names are 0.6% of universe market value. 288 of the 312 have a local-currency value, so filling from local value times FX is the alternative.',
    steps: [
      ['Run failed', 'Weighting step returned no weight for 312 securities on 30 Sep 2025.'],
      ['Checked the data', '312 of 3,906 securities have no USD market value on that date.'],
      ['Measured impact', 'Together they are 0.6% of universe market value.'],
      ['Found an alternative', '288 have a local-currency market value and an FX rate.'],
    ],
    evidence: [['Rebalance date', '30 Sep 2025'], ['Missing USD market cap', '312 of 3,906'], ['Share of universe value', '0.6%'], ['Have a local-currency value', '288']],
    options: ['Fill from local value times FX', 'Open the rule in Lab'],
    done: 'The rule now excludes missing values and lists them at each rebalance.',
  },
  {
    id: 'ENG-143', group: 'suggest', glyph: 'suggest', title: 'Fail runs at once when a connector loses permission',
    scope: 'All connectors', age: '40m', raised: 'Suggested 09:50', state: 'Suggested check', isRule: true,
    props: [
      ['Learned from', 'ENG-137, the connector failure at 09:20'],
      ['Applies to', 'All data connectors'],
      ['Effect', 'Dependent runs fail immediately and ops are alerted'],
    ],
    proposal: 'This morning a permission error on the EDI connector left a run stuck for 25 minutes before anyone noticed. Add this check so the same error fails dependent runs straight away.',
    rule: 'when connector.error in [auth, permission]\n  fail dependent runs\n  alert ops with connector name and error',
    steps: [
      ['Read the incident', 'Run 8812 waited 25 minutes in context creation after the connector failed.'],
      ['Looked for a check', 'No validation covers connector errors today.'],
      ['Drafted the check', 'Fail fast and alert, scoped to auth and permission errors only.'],
    ],
    options: ['Apply to EDI only', 'Alert without failing runs'],
    done: 'Check added. It applies to all connectors from the next run.',
  },
  {
    id: 'ENG-140', group: 'auto', glyph: 'auto', title: 'Cancelled and requeued a stuck run',
    scope: 'Global Drone Leaders', age: '10:07', raised: 'Handled 10:07', state: 'Handled by Engine', handled: true,
    props: [['Run', '8812, Global Drone Leaders'], ['Autonomy', 'Act and report'], ['Result', 'Published 10:07']],
    proposal: 'Run 8812 sat in context creation for 45 minutes with no progress after the connector failure. Engine cancelled it, requeued it, and it published at 10:07.',
    steps: [
      ['Detected', 'No progress for 45 minutes, above the 20-minute timeout.'],
      ['Cancelled', 'Run 8812 stopped and its partial outputs discarded.'],
      ['Requeued', 'New run published at 10:07 with all inputs present.'],
    ],
  },
  {
    id: 'ENG-137', group: 'auto', glyph: 'auto', title: 'Caught a connector permission error',
    scope: '4 runs', age: '09:34', raised: 'Handled 09:34', state: 'Handled by Engine', handled: true,
    props: [['Connector', 'EDI'], ['Autonomy', 'Act and report'], ['Result', 'Fixed by dev 09:34, runs replayed']],
    proposal: 'At 09:20 the EDI connector returned a database permission error. Engine failed the 4 dependent runs, alerted dev, and replayed them once dev fixed the permission at 09:34.',
    steps: [
      ['Detected', 'Connector returned a permission error at 09:20.'],
      ['Contained', 'Failed 4 dependent runs and alerted dev.'],
      ['Recovered', 'Replayed the 4 runs after the fix at 09:34. All published.'],
    ],
  },
  {
    id: 'ENG-136', group: 'auto', glyph: 'auto', title: 'Retried 3 lakehouse timeouts',
    scope: '3 runs', age: '07:30', raised: 'Handled 07:30', state: 'Handled by Engine', handled: true,
    props: [['Autonomy', 'Act and report'], ['Result', 'All 3 published on time']],
    proposal: 'Three runs hit a read timeout on the lakehouse. Engine retried each once and all three published on time.',
    steps: [
      ['Detected', '3 read timeouts between 07:24 and 07:27.'],
      ['Retried', 'One retry each after 60 seconds.'],
      ['Confirmed', 'All 3 published before 07:40.'],
    ],
  },
  {
    id: 'ENG-135', group: 'auto', glyph: 'auto', title: 'Checked corporate actions for the next 5 days',
    scope: '18 events', age: '07:05', raised: 'Handled 07:05', state: 'Handled by Engine', handled: true,
    props: [['Autonomy', 'Act and report'], ['Result', '17 covered by rulebooks, 1 raised as ENG-139']],
    proposal: 'Engine checked the 18 corporate actions due in the next 5 days against each index rulebook. 17 are covered. The spin-off on 16 Oct needs a decision.',
    steps: [
      ['Collected', '18 events due by Tue 20 Oct across live indices.'],
      ['Matched', 'Each event checked against its index rulebook and price availability.'],
      ['Raised', '1 event with a missing child price became ENG-139.'],
    ],
  },
];

export interface Answer { text: string; steps: [string, string][]; }

export const ANSWERS: Record<string, Answer> = {
  'Why is Japan Primary MV held?': {
    text: 'It is held because 1,284 of its securities have no price for today. All of them come from the EDI Tokyo end-of-day file, which was due at 08:15 and has not arrived.',
    steps: [['Index', 'Japan Primary MV, due 09:00'], ['Held at', 'Validation, check "price present"'], ['Input', 'EDI XTKS end of day, due 08:15'], ['Feed', 'No file; last received Tue 13 Oct 08:11'], ['Open item', 'ENG-142, waiting for your decision']],
  },
  'What changed in Euro HY / SBI 60/40 since yesterday?': {
    text: 'The vendor restated Euro high-yield levels for 9 to 11 Oct. The blend was recalculated and moves by up to +1.8 bp on 11 Oct. The restated values are not published yet.',
    steps: [['Notice', 'ICE BofA Euro HY revision, 06:40'], ['Recalculated', '9 to 11 Oct, version 3 to version 4'], ['Largest change', '+1.8 bp on 11 Oct'], ['Open item', 'ENG-141, waiting for sign-off']],
  },
  'Which indices hold the spin-off parent?': {
    text: 'Three: Global Robotics Leaders at 4.12%, Europe Industrials Select at 2.71% and Global Drone Exposure 10% at 1.95%.',
    steps: [['Event', 'Spin-off, ex-date Fri 16 Oct'], ['Holdings', 'Live constituents at 13 Oct close'], ['Rulebooks', 'All 3 use Standard 2-day'], ['Open item', 'ENG-139']],
  },
};

/** Minutes after midnight, London time. */
export const T = (h: number, m = 0) => h * 60 + m;
export const NOW = T(10, 30);

export interface Tick { t: number; s: 'pub' | 'held' | 'todo'; n: string; }

export const TICKS: Tick[] = [
  ...[T(7, 25), T(7, 38), T(7, 52)].map(t => ({ t, s: 'pub' as const, n: 'Asia run published' })),
  ...[T(9, 36), T(9, 38)].map(t => ({ t, s: 'pub' as const, n: 'Replayed after connector fix' })),
  { t: T(10, 7), s: 'pub', n: 'Run 8812 requeued and published' },
  ...[0, 1, 2, 3, 4, 5].map(i => ({ t: T(9, 0) + i * 2, s: 'held' as const, n: 'Held: Tokyo prices missing' })),
  ...Array.from({ length: 26 }, (_, i) => ({ t: T(16, 45) + i * 1.1, s: 'todo' as const, n: 'Europe close run, due 16:45' })),
  ...Array.from({ length: 14 }, (_, i) => ({ t: T(21, 15) + i * 1.2, s: 'todo' as const, n: 'US close run, due 21:15' })),
];

export const CLOSES = [
  { t: T(7), city: 'Tokyo', label: 'close 07:00' },
  { t: T(16, 30), city: 'London', label: 'close 16:30' },
  { t: T(21), city: 'New York', label: 'close 21:00' },
];

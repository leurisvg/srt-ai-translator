import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ],
  template: `
      <span
        [class]="type === 'outline' ? 'outline-badge' : 'default'"
      >
        {{ text }}
      </span>
  `,
  styles: [`
    .default {
      @apply bg-blue-900 text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full;
    }
    
    .outline-badge {
      @apply bg-gray-700 text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-400;
    }
  `]
})
export class BadgeComponent {
  @Input() type: 'outline' | 'default' = 'default';
  @Input({ required: true }) text!: string;
}

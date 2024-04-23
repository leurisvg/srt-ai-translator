import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subtitle } from '../../interfaces/subtitle.interface';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-subtitle-segment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    BadgeComponent,
    JsonPipe,
  ],
  templateUrl: './subtitle-segment.component.html',
  styleUrl: './subtitle-segment.component.scss'
})
export class SubtitleSegmentComponent {
  @Input({ required: true }) subtitle!: Subtitle[];
  @Input() allowEditSub = false;
}

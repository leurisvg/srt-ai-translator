import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import FileSaver from 'file-saver';
import { initFlowbite } from 'flowbite';
import { forkJoin } from 'rxjs';
import srtParser2 from 'srt-parser-2';
import { BadgeComponent } from './components/badge/badge.component';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';
import { SubtitleSegmentComponent } from './components/subtitle-segment/subtitle-segment.component';
import { Subtitle } from './interfaces/subtitle.interface';
import { GeminiService } from './services/gemini.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, DragAndDropComponent, BadgeComponent, SubtitleSegmentComponent, DropdownComponent, LoadingComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  apiService = inject(GeminiService);
  subtitle = signal<Subtitle[]>([]);
  translatedSubtitle = signal<Subtitle[]>([]);
  fileName = signal<string>('');
  btnDisabled = signal(true);
  showLoading = signal(false);
  error = signal<{ error: string; description: string } | null>(null);
  from = '';
  to = '';
  
  ngOnInit(): void {
    initFlowbite();
  }
  
  handleFile(file: File | null) {
    if (!file) return;
    
    this.fileName.set(file.name);
    const reader = new FileReader();
    
    reader.onload = this.parseStr.bind(this);
    reader.readAsText(file);
  }
  
  parseStr(event: ProgressEvent<FileReader>) {
    const text = event.target?.result;
    if (!text) return;
    
    const parser = new srtParser2();
    const subtitle = parser.fromSrt(text as string) as Subtitle[];
    this.subtitle.set(subtitle);
  }
  
  fromLanguageChange(language: string) {
    this.from = language;
    this.btnDisabled.set(this.from === '' || this.to === '');
  }
  
  toLanguageChange(language: string) {
    this.to = language;
    this.btnDisabled.set(this.from === '' || this.to === '');
  }
  
  translate() {
    if (!this.from || !this.to) return;
    
    this.showLoading.set(true);
    
    const subtitleText = this.subtitle().map(sub => sub.text);
    
    const translations$ = this.splitSubtitle(subtitleText).map(subs => {
      return this.apiService.translate(subs, this.from, this.to);
    });
    
    forkJoin(translations$)
    .subscribe({
      next: res => {
        this.showLoading.set(false);
        const translations = res.flatMap(({ translation }) => translation);
        
        this.translatedSubtitle.set(
          this.subtitle().map((sub, i) => {
            return {
              ...sub,
              text: translations[i],
            };
          }),
        );
      },
      error: err => {
        this.showLoading.set(false);
        this.error.set({ error: err.error, description: err.description });
      },
    });
  }
  
  export() {
    const parser = new srtParser2();
    const srt = parser.toSrt(this.translatedSubtitle());
    
    const splitName = this.fileName().split('.');
    
    const blob = new Blob([...srt], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `${ splitName.slice(0, splitName.length - 1).join('.') }.(${ this.to }).srt`);
  }
  
  splitSubtitle(sub: string[], splitedSub: string[][] = []): string[][] {
    const splitLength = 80;
    
    splitedSub = [...splitedSub, sub.slice(splitedSub.length * splitLength, (splitedSub.length * splitLength) + splitLength)];
    
    if (splitedSub.flatMap(str => str).length < sub.length) {
      return this.splitSubtitle(sub, splitedSub);
    } else {
      return splitedSub;
    }
  }
  
  clear() {
    this.subtitle.set([]);
    this.translatedSubtitle.set([]);
    this.fileName.set('');
    this.btnDisabled.set(true);
    this.from = '';
    this.to = '';
  }
}

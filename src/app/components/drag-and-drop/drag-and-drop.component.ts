import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.scss',
})
export class DragAndDropComponent {
  @Output() file = new EventEmitter<File | null>();
  
  onFileDrop(event: DragEvent) {
    const fileList = event.dataTransfer?.files ?? null;
    this.validateFile(fileList);
  }
  
  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    
    this.validateFile(fileList);
  }
  
  validateFile(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0];
    const format = file.name.split('.').pop();
    const isSrtFile = format === 'srt';
    
    this.file.emit(isSrtFile ? file : null);
  }
}

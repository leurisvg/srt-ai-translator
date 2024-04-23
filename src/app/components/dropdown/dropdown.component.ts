import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { Dropdown, DropdownInterface, DropdownOptions, InstanceOptions } from 'flowbite';
import { languages } from '../../data/languages';
import { Language } from '../../interfaces/language.interface';

@Component({
  selector: 'app-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  template: `
    <button
      #trigger
      [id]="identifier"
      [attr.data-dropdown-toggle]="identifier"
      class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg
      text-xs px-4 py-2 text-center inline-flex items-center"
      type="button"
    >
      {{ selectedLanguage() }}
      <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      #menu
      [id]="identifier"
      class="z-10 hidden bg-background-400 divide-y divide-gray-100 rounded-lg shadow w-44"
    >
      <ul class="py-2 text-sm text-gray-100 overflow-y-auto" aria-labelledby="dropdownDefaultButton">

        @for (language of languages; track language.name) {
          <li>
            <a
              href="#"
              class="block px-4 py-2 hover:bg-background-800/50"
              (click)="languagechange(language)"
            >{{ language.icon }} {{ language.name }}</a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [``]
})
export class DropdownComponent implements AfterViewInit {
  @ViewChildren('trigger') trigger!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('menu') menu!: QueryList<ElementRef<HTMLButtonElement>>;
  @Input({ required: true }) identifier!: string;
  @Output() languageChange: EventEmitter<string> = new EventEmitter<string>();
  protected readonly languages = languages;
  selectedLanguage = signal<string>('Language');
  dropdown!: DropdownInterface;
  
  ngAfterViewInit(): void {
    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,
    };
    
    const instanceOptions: InstanceOptions = {
      id: this.identifier,
      override: true
    };
    
    const trigger = this.trigger.find(el => el.nativeElement.id === this.identifier)!;
    const menu = this.menu.find(el => el.nativeElement.id === this.identifier)!;
    
    this.dropdown = new Dropdown(
      menu.nativeElement,
      trigger.nativeElement,
      options,
      instanceOptions
    );
  }
  
  languagechange(language: Language) {
    this.selectedLanguage.set(`${ language.icon } ${ language.name }`);
    this.languageChange.emit(this.selectedLanguage());
    this.dropdown.hide();
  }
}

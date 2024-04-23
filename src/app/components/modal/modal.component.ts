import { AfterViewInit, Component, effect, ElementRef, Input, ViewChild, WritableSignal } from '@angular/core';
import { InstanceOptions, Modal, ModalInterface, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template: `
    <div
      #modalRef
      id="modal"
      tabindex="-1"
      aria-hidden="true"
      class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <div class="relative bg-background-400 rounded-lg shadow">
          <!-- Modal header -->
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-100">
            <h3 class="text-xl font-semibold text-gray-100">
              {{ error()?.error }}
            </h3>
              <button
                type="button"
                class="text-gray-100 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                (click)="close()"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                  <span class="sr-only">Close modal</span>
              </button>
          </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
              <p class="text-base leading-relaxed text-gray-100">
                {{ error()?.description }}
              </p>
            </div>
            <!-- Modal footer -->
            <div class="flex justify-end p-4 md:p-5 border-t rounded-b border-gray-100">
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                (click)="close()"
              >
                Close
              </button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) error!: WritableSignal<{ error: string; description: string } | null>;
  modal!: ModalInterface;
  
  constructor() {
    effect(() => {
      this.error() ? this.modal.show() : this.modal.hide();
    });
  }
  
  ngAfterViewInit(): void {
    const modalOptions: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    };
    
    const instanceOptions: InstanceOptions = {
      id: 'modal',
      override: true
    };
    
    this.modal = new Modal(
      this.modalRef.nativeElement,
      modalOptions,
      instanceOptions
    );
  }
  
  close() {
    this.modal.hide();
    this.error.set(null);
  }
}

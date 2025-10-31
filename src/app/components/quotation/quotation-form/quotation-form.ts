import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { QuotationService } from '../../../services/quotationService.service';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { Divider, DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ValidateAllFormFields } from '../../../shared/helpers/helpers';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-quotation-form',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    FileUploadModule,
    TextareaModule,
    DividerModule,
    SidebarComponent,
  ],
  template: ` <div
    class="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
    style="background-image: url('assets/background.png');"
  >
    <div class="absolute inset-0 backdrop-blur-sm bg-black/40 z-10"></div>
    <div
      class="relative z-20 border border-gray-400/30 p-4 rounded-3xl bg-black/20 
          w-[98%] min-h-[98vh] shadow-xl
          shadow-[0_0_40px_rgba(173,216,230,0.5)] text-white backdrop-filter backdrop-blur-xl
          flex flex-col"
    >
      <div
        class="text-lg font-semibold tracking-widest mb-2 text-shadow-lg"
      ></div>
      <div class="flex flex-row w-full">
        <app-sidebar *ngIf="!isMobile"></app-sidebar>

        <div class="w-full">
          <div class="h-[90%] pb-20 pt-12">
            <div
              class="bg-black/30 p-4 rounded-xl border border-gray-700/50 shadow-md flex flex-col"
            >
              <h3
                class="text-lg font-semibold mb-3 text-blue-400 tracking-wider"
              >
                Add New Quotation
              </h3>

              <div class="mb-2 font-medium tracking-wide text-sm/6">
                Upload Quotation PDF
              </div>
              <div>
                <p-fileupload
                  [multiple]="true"
                  accept="image/*"
                  maxFileSize="1000000"
                  styleClass="!bg-white/10 !border-none"
                >
                  <ng-template
                    #header
                    let-files
                    let-chooseCallback="chooseCallback"
                    let-clearCallback="clearCallback"
                    let-uploadCallback="uploadCallback"
                  >
                  </ng-template>
                  <ng-template
                    #content
                    let-files
                    let-uploadedFiles="uploadedFiles"
                    let-removeFileCallback="removeFileCallback"
                    let-removeUploadedFileCallback="removeUploadedFileCallback"
                  >
                    <div class="flex flex-col gap-8">
                      <div *ngIf="files?.length > 0">
                        <div class="flex flex-wrap gap-4">
                          <div
                            *ngFor="let file of files; let i = index"
                            class="p-8 rounded-border flex flex-col items-center gap-4"
                          >
                            <div>
                              <img
                                role="presentation"
                                [alt]="file.name"
                                [src]="file.objectURL"
                                width="100"
                                height="50"
                              />
                            </div>
                            <span
                              class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                              >{{ file.name }}</span
                            >
                            <p-button
                              icon="pi pi-times"
                              [outlined]="true"
                              [rounded]="true"
                              severity="danger"
                            />
                          </div>
                        </div>
                      </div>
                      <div *ngIf="uploadedFiles?.length > 0">
                        <div class="flex flex-wrap gap-4">
                          <div
                            *ngFor="let file of uploadedFiles; let i = index"
                            class="m-0 px-12 flex flex-col items-center gap-4"
                          >
                            <div>
                              <img
                                role="presentation"
                                [alt]="file.name"
                                [src]="file.objectURL"
                                width="100"
                                height="50"
                              />
                            </div>
                            <span
                              class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                              >{{ file.name }}</span
                            >

                            <p-button
                              icon="pi pi-times"
                              [outlined]="true"
                              [rounded]="true"
                              severity="danger"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </ng-template>
                  <ng-template #file></ng-template>
                  <ng-template #empty>
                    <div
                      class="flex items-center justify-center flex-col text-white"
                    >
                      <p-button
                        label="Upload File"
                        icon="pi pi-upload"
                        styleClass="!text-sm [&_.p-button-icon]:!text-xs !tracking-wider"
                        (onClick)="fileInput.click()"
                      ></p-button>

                      <input
                        type="file"
                        #fileInput
                        accept="application/pdf"
                        hidden
                        (change)="onFileSelected($event)"
                      />

                      <div class="flex items-center w-full mt-3">
                        <div class="flex-grow border-t border-white/30"></div>
                        <span
                          class="mx-4 text-sm tracking-wider font-thin text-white"
                          >OR</span
                        >
                        <div class="flex-grow border-t border-white/30"></div>
                      </div>

                      <p class="mt-2 text-center text-xs tracking-wider mb-5">
                        Drag and drop quotation file to here to upload.
                      </p>
                    </div>
                  </ng-template>
                </p-fileupload>
              </div>
              <div class="mt-4 flex justify-center mb-3">
                <p-button
                  label="Auto Read from PDF"
                  icon="pi pi-file-import"
                  styleClass="px-5 !text-xs !tracking-wider [&_.p-button-icon]:!text-sm"
                ></p-button>
              </div>
              <div class="flex items-center gap-2 my-2">
                <div class="flex-1 border-t border-gray-300"></div>
                <div class="px-3 text-sm text-white/80">Or Add Manually</div>
                <div class="flex-1 border-t border-gray-300"></div>
              </div>

              <div [formGroup]="FG">
                <div
                  class="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-6"
                >
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="first-name"
                      class="tracking-wider block text-sm/6 font-medium text-white"
                      >Quotation No <span class="text-red-500">*</span></label
                    >
                    <div class="mt-2">
                      <input
                        id="first-name"
                        type="text"
                        formControlName="quotationNo"
                        name="first-name"
                        autocomplete="given-name"
                        class="block w-full rounded-md bg-white/20 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="last-name"
                      class="tracking-wider block text-sm/6 font-medium text-white"
                      >Vendor Name</label
                    >
                    <div class="mt-2">
                      <input
                        id="last-name"
                        type="text"
                        name="last-name"
                        formControlName="vendorName"
                        autocomplete="family-name"
                        class="block w-full rounded-md bg-white/20 px-3 py-1.5 text-base tetx-white placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="last-name"
                      class="tracking-wider block text-sm/6 font-medium text-white"
                      >Received Date</label
                    >
                    <div class="mt-2">
                      <p-datepicker
                        formControlName="receivedDate"
                        showIcon="true"
                        class="w-full"
                        styleClass="!w-full"
                        appendTo="body"
                        dateFormat="dd/mm/yy"
                        inputStyleClass="!w-full !border-none !rounded-l-md !bg-white/20 !px-3 !py-1.5 !text-base !text-white placeholder:!text-gray-400 focus:!outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:!text-sm/6"
                      ></p-datepicker>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="last-name"
                      class="tracking-wider block text-sm/6 font-medium text-white"
                      >Amount <span class="text-red-500">*</span></label
                    >
                    <div class="mt-2">
                      <p-inputnumber
                        formControlName="quotationAmount"
                        class="w-full"
                        styleClass="!w-full"
                        mode="decimal"
                        [minFractionDigits]="2"
                        [maxFractionDigits]="2"
                        mode="currency"
                        inputId="currency-malaysia"
                        currency="MYR"
                        currencyDisplay="code"
                        locale="ms-MY"
                        inputStyleClass="!w-full !border-none !rounded-l-md !bg-white/20 !px-3 !py-1.5 !text-base !text-white placeholder:!text-gray-400 focus:!outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:!text-sm/6"
                      ></p-inputnumber>
                    </div>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="last-name"
                      class="tracking-wider block text-sm/6 font-medium text-white"
                      >Remark
                      <span class="italic !font-thin text-xs"
                        >(optional)</span
                      ></label
                    >
                    <div class="mt-2">
                      <textarea
                        rows="5"
                        cols="30"
                        formControlName="remarks"
                        class="!w-full !border-none !rounded-l-md !bg-white/20 !px-3 !py-1.5 !text-base !text-white placeholder:!text-gray-400 focus:!outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:!text-sm/6"
                        pTextarea
                        [autoResize]="true"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex flex-row items-center justify-end gap-3">
                <p-button
                  (onClick)="CancelClick()"
                  label="Cancel"
                  severity="secondary"
                  styleClass="!text-sm !px-5"
                ></p-button>
                <p-button
                  (onClick)="SubmitClick()"
                  label="Submit"
                  severity="info"
                  styleClass="!text-sm !px-5"
                ></p-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './quotation-form.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotationForm implements OnDestroy {
  isMobile = window.innerWidth < 770;
  private readonly quotationService = inject(QuotationService);
  private readonly messageService = inject(MessageService);
  private readonly location = inject(Location);

  FG!: FormGroup;

  constructor() {
    this.FG = new FormGroup({
      id: new FormControl<string | null>({ value: null, disabled: true }),
      quotationNo: new FormControl<string | null>(null, Validators.required),
      vendorName: new FormControl<string | null>(null),
      receivedDate: new FormControl<Date | null>(new Date()),
      description: new FormControl<string | null>(null),
      quotationAmount: new FormControl<number | null>(0),
      fileUrl: new FormControl<string | null>(null, Validators.required),
      remarks: new FormControl<string | null>(null),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
      // TODO: Send file to backend or process it (e.g., read quotation PDF)
    }
  }

  CancelClick() {
    this.location.back();
  }

  SubmitClick() {
    if (!this.FG.valid) {
      return;
    }

    this.quotationService.Create(this.FG.value).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully Created',
        });
      },
      error: (err) => {},
      complete: () => {},
    });

    ValidateAllFormFields(this.FG);
  }

  ngOnDestroy(): void {}
}

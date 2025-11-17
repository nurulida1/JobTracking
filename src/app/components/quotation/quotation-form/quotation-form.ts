import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { QuotationService } from '../../../services/quotationService.service';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ValidateAllFormFields } from '../../../shared/helpers/helpers';
import { LoadingService } from '../../../services/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

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
  ],
  template: ` <div
    class="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center bg-white/70 md:px-4 md:py-2"
  >
    <div
      class="relative w-full min-h-[98vh] flex flex-col border border-gray-300 rounded-xl bg-white/80"
    >
      <div
        class="text-lg font-semibold tracking-widest mb-2 text-shadow-lg"
      ></div>
      <div class="w-full pb-10 md:pb-0">
        <div class="h-[90%] pb-20 pt-12 md:pt-0 md:pb-0">
          <div class="p-4 flex flex-col">
            <h3 class="text-lg font-semibold mb-3 text-blue-400 tracking-wider">
              {{ Title }}
            </h3>

            <div class="mb-2 font-medium text-gray-600 tracking-wide text-sm/6">
              Upload Quotation PDF <span class="text-xs text-red-500">*</span>
            </div>
            <div>
              <p-fileupload
                [multiple]="true"
                accept="image/*"
                maxFileSize="1000000"
                styleClass="!bg-gray-100 !inset-shadow-sm !inset-shadow-black/20"
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
                    <div *ngIf="FG.get('fileUrl')?.value" class="pb-2">
                      <div
                        class="px-4 flex flex-row items-center justify-between p-2 bg-white/80 rounded-md shadow-md"
                      >
                        <div
                          class="text-blue-400 cursor-pointer underline text-xs"
                          (click)="downloadFile(FG.get('fileUrl')?.value)"
                        >
                          {{ fileName }}
                        </div>

                        <div
                          (click)="RemoveFile()"
                          class="pi pi-trash !text-red-500 !text-sm cursor-pointer"
                        ></div>
                      </div>
                    </div>
                  </div>
                </ng-template>
                <ng-template #file></ng-template>
                <ng-template #empty>
                  <div
                    class="flex items-center justify-center flex-col text-gray-500"
                  >
                    <p-button
                      label="Upload File"
                      icon="pi pi-upload"
                      severity="info"
                      styleClass="!text-sm !shadow-md [&_.p-button-icon]:!text-xs !tracking-wider"
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
                      <div class="flex-grow border-t border-gray-300"></div>
                      <span
                        class="mx-4 text-sm tracking-wider font-thin text-gray-500"
                        >OR</span
                      >
                      <div class="flex-grow border-t border-gray-300"></div>
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
                severity="info"
                styleClass="!px-5 !pt-3 !text-xs !tracking-wider [&_.p-button-icon]:!text-sm"
              ></p-button>
            </div>
            <div class="flex items-center gap-2 my-2">
              <div class="flex-1 border-t border-gray-300"></div>
              <div class="px-3 text-sm text-gray-500">Or Add Manually</div>
              <div class="flex-1 border-t border-gray-300"></div>
            </div>

            <div [formGroup]="FG">
              <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="first-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >Quotation No <span class="text-red-500">*</span></label
                  >
                  <div class="mt-2">
                    <input
                      id="first-name"
                      type="text"
                      formControlName="quotationNo"
                      name="first-name"
                      autocomplete="given-name"
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base !tracking-wider focus:outline-2 focus:-outline-offset-1 focus:outline-cyan-500 sm:text-sm/6"
                    />
                    <div
                      *ngIf="
                        FG.get('quotationNo')?.touched &&
                        FG.get('quotationNo')?.invalid
                      "
                      class="pt-1 text-red-500 text-xs"
                    >
                      <div *ngIf="FG.get('quotationNo')?.errors?.['required']">
                        Quotation is required.
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >Vendor Name</label
                  >
                  <div class="mt-2">
                    <input
                      id="last-name"
                      type="text"
                      name="last-name"
                      formControlName="vendorName"
                      autocomplete="family-name"
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 !tracking-wider text-base focus:outline-2 focus:-outline-offset-1 focus:outline-cyan-500 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
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
                      inputStyleClass="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:!outline-2 focus:!-outline-offset-1 focus:!outline-cyan-500 sm:!text-sm/6"
                    ></p-datepicker>
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
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
                      inputStyleClass="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:!outline-2 focus:!-outline-offset-1 focus:!outline-cyan-500 sm:!text-sm/6"
                    ></p-inputnumber>
                    <div
                      *ngIf="
                        FG.get('quotationAmount')?.touched &&
                        FG.get('quotationAmount')?.invalid
                      "
                      class="text-red-500 text-xs"
                    >
                      <div
                        *ngIf="FG.get('quotationAmount')?.errors?.['required']"
                      >
                        Amount is required.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >Description
                    <span class="italic !font-thin text-xs"
                      >(optional)</span
                    ></label
                  >
                  <div class="mt-2">
                    <textarea
                      rows="5"
                      cols="30"
                      formControlName="description"
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:!outline-2 focus:!-outline-offset-1 focus:!outline-cyan-500 sm:!text-sm/6"
                      pTextarea
                      [autoResize]="true"
                    ></textarea>
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
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
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:!outline-2 focus:!-outline-offset-1 focus:!outline-cyan-500 sm:!text-sm/6"
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
                styleClass="!text-sm !px-5 !bg-gray-300"
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
  </div>`,
  styleUrl: './quotation-form.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotationForm implements OnDestroy, OnInit {
  private readonly quotationService = inject(QuotationService);
  private readonly messageService = inject(MessageService);
  private readonly loadingService = inject(LoadingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  FG!: FormGroup;
  currentId: number | null = null;
  Title: string = '';
  fileName: string = '';
  isMobile = window.innerWidth < 770;

  constructor() {
    this.currentId = this.activatedRoute.snapshot.queryParams['id'];

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

  ngOnInit(): void {
    if (this.currentId) {
      this.FG.get('id')?.enable();
      this.FG.get('id')?.patchValue(this.currentId);
      this.LoadForm();
      this.Title = 'Update Quotation';
    } else {
      this.Title = 'Add New Quotation';
    }
  }

  LoadForm() {
    this.loadingService.start();
    this.quotationService
      .GetOne({
        Page: 1,
        PageSize: 1,
        Select: null,
        Filter: `Id=${this.currentId}`,
        OrderBy: null,
        Includes: null,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          if (res) {
            this.FG.patchValue(res);
            this.FG.get('receivedDate')?.patchValue(new Date(res.receivedDate));
            const fullPath = this.FG.get('fileUrl')?.value;
            if (fullPath) {
              const parts = fullPath.split('quotations\\');
              this.fileName = parts.length > 1 ? parts[1] : fullPath;
            }
          }
        },
        error: (err) => {
          this.loadingService.stop();
        },
        complete: () => {
          this.loadingService.stop();
        },
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fileName = file.name;
        this.FG.get('fileUrl')?.patchValue(reader.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  RemoveFile() {
    this.FG.get('fileUrl')?.setValue(null);
  }

  CancelClick() {
    this.location.back();
  }

  downloadFile(filePath: string) {
    if (!filePath) return;

    const url = `${environment.ApiBaseUrl.replace(
      /\/api$/,
      ''
    )}/${filePath.replace(/\\\\/g, '/')}`;

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = url.split('/').pop()!;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      });
  }

  SubmitClick() {
    if (this.FG.valid) {
      this.loadingService.start();

      if (this.currentId) {
        // Update existing quotation
        this.quotationService.Update(this.FG.value).subscribe({
          next: (res) => {
            this.router.navigate(['/quotation']);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Successfully Updated: #${
                this.FG.get('quotationNo')?.value
              }`,
            });
          },
          error: (err) => {
            this.loadingService.stop();
          },
          complete: () => {
            this.loadingService.stop();
          },
        });
      } else {
        // Create new quotation
        this.quotationService.Create(this.FG.value).subscribe({
          next: (res) => {
            this.router.navigate(['/quotation']);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully Created',
            });
          },
          error: (err) => {
            this.loadingService.stop();
          },
          complete: () => {
            this.loadingService.stop();
          },
        });
      }
    } else {
      ValidateAllFormFields(this.FG);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }
}

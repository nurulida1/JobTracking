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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PurchaseOrderService } from '../../../services/purchaseOrderService.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '../../../services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ValidateAllFormFields } from '../../../shared/helpers/helpers';

@Component({
  selector: 'app-purchase-order-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
  ],
  template: `<div
    class="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center bg-white/70 md:px-4 md:py-2"
  >
    <div
      class="relative w-full min-h-[98vh] flex flex-col border-gray-300 rounded-xl bg-white/80"
    >
      <div class="w-full">
        <div class="h-[90%] pb-20 pt-12 md:pt-0 md:pb-0">
          <div class="p-4 flex flex-col">
            <h3 class="text-lg font-semibold mb-3 text-blue-400 tracking-wider">
              {{ Title }}
            </h3>

            <div [formGroup]="FG">
              <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div class="col-span-6">
                  <label
                    for="first-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >PO <span class="text-red-500">*</span></label
                  >
                  <div class="mt-2">
                    <input
                      id="first-name"
                      type="text"
                      formControlName="po"
                      name="first-name"
                      autocomplete="given-name"
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base !tracking-wider focus:outline-2 focus:-outline-offset-1 focus:outline-cyan-500 sm:text-sm/6"
                    />
                    <div
                      *ngIf="FG.get('po')?.touched && FG.get('po')?.invalid"
                      class="pt-1 text-red-500 text-xs"
                    >
                      <div *ngIf="FG.get('po')?.errors?.['required']">
                        PO is required.
                      </div>
                    </div>
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
                      formControlName="poReceivedDate"
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
                    >PO Date <span class="text-red-500">*</span></label
                  >
                  <div class="mt-2">
                    <p-datepicker
                      formControlName="poDate"
                      showIcon="true"
                      class="w-full"
                      styleClass="!w-full"
                      appendTo="body"
                      dateFormat="dd/mm/yy"
                      inputStyleClass="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:!outline-2 focus:!-outline-offset-1 focus:!outline-cyan-500 sm:!text-sm/6"
                    ></p-datepicker>
                    <div
                      *ngIf="
                        FG.get('poDate')?.touched && FG.get('poDate')?.invalid
                      "
                      class="text-red-500 text-xs"
                    >
                      <div *ngIf="FG.get('poDate')?.errors?.['required']">
                        PO Date is required.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >Amount</label
                  >
                  <div class="mt-2">
                    <p-inputnumber
                      formControlName="poAmount"
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
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="first-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >Site
                  </label>
                  <div class="mt-2">
                    <input
                      id="first-name"
                      type="text"
                      formControlName="site"
                      name="first-name"
                      autocomplete="given-name"
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base !tracking-wider focus:outline-2 focus:-outline-offset-1 focus:outline-cyan-500 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="first-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >Project
                  </label>
                  <div class="mt-2">
                    <input
                      id="first-name"
                      type="text"
                      formControlName="project"
                      name="first-name"
                      autocomplete="given-name"
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base !tracking-wider focus:outline-2 focus:-outline-offset-1 focus:outline-cyan-500 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="first-name"
                    class="tracking-wider block text-sm/6 font-medium text-gray-600"
                    >Client
                  </label>
                  <div class="mt-2">
                    <input
                      id="first-name"
                      type="text"
                      formControlName="client"
                      name="first-name"
                      autocomplete="given-name"
                      class="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-base !tracking-wider focus:outline-2 focus:-outline-offset-1 focus:outline-cyan-500 sm:text-sm/6"
                    />
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
  styleUrl: './purchase-order-form.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrderForm implements OnDestroy, OnInit {
  private readonly purchaseOrderService = inject(PurchaseOrderService);
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
  isMobile = window.innerWidth < 770;

  constructor() {
    this.currentId = this.activatedRoute.snapshot.queryParams['id'];

    this.FG = new FormGroup({
      id: new FormControl<number | null>({ value: null, disabled: true }),
      po: new FormControl<string | null>(null, Validators.required),
      poDate: new FormControl<Date | null>(null, Validators.required),
      poReceivedDate: new FormControl<Date | null>(null),
      poAmount: new FormControl<number | null>(null),
      site: new FormControl<string | null>(null),
      project: new FormControl<string | null>(null),
      client: new FormControl<string | null>(null),
      description: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  ngOnInit(): void {
    if (this.currentId) {
      this.FG.get('id')?.enable();
      this.FG.get('id')?.patchValue(this.currentId);
      this.LoadForm();
      this.Title = 'Update Purchase Order';
    } else {
      this.Title = 'Add new Purchase Order';
    }
  }

  LoadForm() {
    this.loadingService.start();
    this.purchaseOrderService
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
            this.FG.get('poDate')?.patchValue(new Date(res.poDate));
            this.FG.get('poReceivedDate')?.patchValue(
              new Date(res.poReceivedDate)
            );
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

  CancelClick() {
    this.location.back();
  }

  SubmitClick() {
    if (this.FG.valid) {
      this.loadingService.start();

      if (this.currentId) {
        // Update existing purchase order
        this.purchaseOrderService.Update(this.FG.value).subscribe({
          next: (res) => {
            this.router.navigate(['/purchase-order']);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Successfully Updated: #${this.FG.get('PO')?.value}`,
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
        // Create new purchase order
        this.purchaseOrderService.Create(this.FG.value).subscribe({
          next: (res) => {
            this.router.navigate(['/purchase-order']);
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

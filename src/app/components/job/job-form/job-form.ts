import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { LoadingService } from '../../../services/loading.service';
import { JobService } from '../../../services/jobService.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    RouterLink,
  ],
  template: `<div class="w-full min-h-[91.5vh] px-6 py-5 bg-white">
    <div class="flex flex-col">
      <div
        class="flex flex-row items-center gap-2 font-semibold text-lg tracking-wider text-gray-600"
      >
        <i class="pi pi-briefcase"></i>
        <div>Update Job: #{{ jobNo }}</div>
      </div>
      <div [formGroup]="FG">
        <div class="grid grid-cols-2 gap-4 pt-5">
          <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-700 tracking-wider">Due Date</div>
            <p-datepicker
              showIcon="true"
              formControlName="dueDate"
              appendTo="body"
              styleClass="!text-sm !w-full"
              inputStyleClass="!py-2 !text-sm"
              dateFormat="dd/mm/yy"
            ></p-datepicker>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-700 tracking-wider">Priority</div>
            <p-select
              formControlName="priority"
              inputStyleClass="!text-sm !w-full !py-1.5"
              styleClass="!text-sm"
              [options]="[
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
                { label: 'Critical', value: 'Critical' }
              ]"
            ></p-select>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-700 tracking-wider">Description</div>
            <textarea
              rows="5"
              cols="30"
              pTextarea
              class="!text-sm"
              formControlName="description"
              [autoResize]="true"
            ></textarea>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-700 tracking-wider">
              Remarks
              <span class="text-xs italic text-gray-500">(Optional)</span>
            </div>
            <textarea
              rows="5"
              cols="30"
              class="!text-sm"
              pTextarea
              formControlName="remarks"
              [autoResize]="true"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-200 mt-7 mb-5"></div>
      <div class="flex flex-row justify-end gap-2 items-center">
        <p-button
          [routerLink]="'/job'"
          severity="secondary"
          label="Cancel"
          styleClass="!text-sm !px-5 !tracking-wider"
        ></p-button>
        <p-button
          (onClick)="SubmitClick()"
          severity="info"
          label="Save Changes"
          styleClass="!text-sm !px-5 !tracking-wider"
        ></p-button>
      </div>
    </div>
  </div>`,
  styleUrl: './job-form.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobForm implements OnInit, OnDestroy {
  private readonly loadingService = inject(LoadingService);
  private readonly messageService = inject(MessageService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly jobService = inject(JobService);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  FG!: FormGroup;
  currentId: string = '';
  jobNo: string = '';

  constructor() {
    this.currentId = this.activatedRoute.snapshot.queryParams['id'];

    this.FG = new FormGroup({
      id: new FormControl<string | null>(this.currentId, Validators.required),
      description: new FormControl<string | null>(null),
      priority: new FormControl<string | null>(null),
      dueDate: new FormControl<Date | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  ngOnInit(): void {
    this.loadingService.start();
    this.jobService
      .GetOne({
        Page: 1,
        PageSize: 1,
        OrderBy: null,
        Select: null,
        Filter: `Id=${this.currentId}`,
        Includes: null,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          if (res) {
            this.FG.patchValue(res);
            this.FG.get('dueDate')?.setValue(
              res.dueDate ? new Date(res.dueDate) : null
            );
            this.jobNo = res?.jobNo;
          }
          this.loadingService.stop();
        },
        error: (err) => {
          console.log(err);
          this.loadingService.stop();
        },
      });
  }

  SubmitClick() {
    if (this.FG.valid) {
      this.loadingService.start();
      this.jobService
        .Update(this.FG.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.loadingService.stop();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `#${this.jobNo} updated successfully.`,
            });
          },
          error: (err) => {
            console.log(err);
            this.loadingService.stop();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update job.',
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }
}

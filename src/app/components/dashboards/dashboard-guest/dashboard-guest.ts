import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { UserService } from '../../../services/userService.service';
import { ValidateAllFormFields } from '../../../shared/helpers/helpers';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dashboard-guest',
  imports: [
    CommonModule,
    SelectModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  template: `
    <div class="flex justify-center items-center">
      <div
        class="pt-15 flex flex-col items-center justify-center md:border md:border-gray-300 md:bg-white/80 md:shadow-md rounded-lg md:py-10 md:w-fit md:px-7"
      >
        <div class="pb-3"><i class="pi pi-lock !text-3xl"></i></div>
        <div class="font-semibold tracking-wider text-2xl text-shadow-lg">
          Account Activation Required
        </div>
        <div class="tracking-wider font-semibold text-gray-800 pt-7">
          Welcome! Your current access is limited.
        </div>
        <div class="tracking-wider text-xs px-3 pt-1 text-gray-500">
          Please submit request for your designated position to unlock all
          features.
        </div>

        <form [formGroup]="FG" class="w-full pt-10">
          <div class="text-left pb-2 text-sm tracking-wider">
            Select Position to Request <span class="text-red-500">*</span>
          </div>
          <p-select
            placeholder="Select a role"
            appendTo="body"
            [options]="[
              { label: 'Approver', value: 'Approver' },
              { label: 'Technician', value: 'Technician' }
            ]"
            formControlName="requestedRole"
            styleClass="!w-full"
          ></p-select>

          <div
            *ngIf="
              FG.get('requestedRole')?.touched &&
              FG.get('requestedRole')?.invalid
            "
            class="text-red-500 text-xs pt-1"
          >
            Position is required.
          </div>

          <div class="pt-4 text-left">
            <div class="pb-2 text-sm tracking-wider">
              Justification
              <span class="text-gray-500 italic text-xs">(Optional)</span>
            </div>
            <input
              type="text"
              pInputText
              class="w-full"
              formControlName="justification"
            />
          </div>
          <div class="w-full pt-6">
            <p-button
              (onClick)="RequestRole()"
              label="Submit Position Request"
              severity="info"
              styleClass="w-full !py-3 !tracking-wide !shadow-md"
            ></p-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './dashboard-guest.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardGuest {
  @Input() FG!: FormGroup;
  @Output() onRequest = new EventEmitter<void>();

  private readonly userService = inject(UserService);

  constructor() {
    this.FG = new FormGroup({
      userId: new FormControl<number | null>(
        this.userService.currentUser?.id ?? null,
        Validators.required
      ),
      requestedRole: new FormControl<string | null>(null, Validators.required),
      justification: new FormControl<string | null>(null),
      status: new FormControl<string>('Pending'),
      createdAt: new FormControl<Date>(new Date()),
      updatedAt: new FormControl<Date | null>(null),
    });
  }

  RequestRole(): void {
    if (this.FG.valid) {
      this.onRequest.emit();
    }
    ValidateAllFormFields(this.FG);
  }
}

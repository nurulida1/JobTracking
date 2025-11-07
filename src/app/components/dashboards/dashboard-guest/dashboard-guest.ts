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
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { UserService } from '../../../services/userService.service';
import { ValidateAllFormFields } from '../../../shared/helpers/helpers';

@Component({
  selector: 'app-dashboard-guest',
  imports: [CommonModule, SelectModule, ReactiveFormsModule, ButtonModule],
  template: `<div
    class="pt-8 flex flex-col items-center justify-center text-center"
  >
    <div class="pb-3"><i class="pi pi-lock !text-3xl"></i></div>
    <div class="font-semibold tracking-wider text-xl text-shadow-lg">
      Account Activation Required
    </div>
    <div class="tracking-wider text-sm text-white/70 pt-2">
      Welcome! Your current access is limited.
    </div>
    <div class="tracking-wider text-xs px-3 pt-1 text-white/70">
      Please submit request for your designated position to unlock all features.
    </div>

    <form [formGroup]="FG" class="w-full pt-5">
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
        styleClass="!bg-white/20 !border-none !text-white"
      ></p-select>

      <div
        *ngIf="
          FG.get('requestedRole')?.touched && FG.get('requestedRole')?.invalid
        "
        class="text-red-500 text-xs pt-1"
      >
        Position is required.
      </div>

      <div class="pt-4 text-left">
        <div class="pb-2 text-sm tracking-wider">
          Justification
          <span class="text-white/80 italic text-xs">(Optional)</span>
        </div>
        <input
          formControlName="justification"
          type="text"
          pInputText
          class="w-full !bg-white/20 !border-none !text-white"
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
  </div> `,
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

import { CommonModule } from '@angular/common';
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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { UserService } from '../../services/userService.service';
import { MessageService } from 'primeng/api';
import { UserRole } from '../../shared/enum/enum';
import { RouterLink } from '@angular/router';
import { ValidateAllFormFields } from '../../shared/helpers/helpers';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    RouterLink,
  ],
  template: `<div
    class="w-full h-screen flex flex-col items-center bg-white text-gray-500"
  >
    <div class="relative py-7 w-full bg-[var(--p-button-info-background)]">
      <div
        class="z-10 absolute top-8 -left-1 border-t border-gray-200 rounded-b rounded-full bg-white p-4 px-15"
      ></div>
      <div
        class="z-20 absolute top-10 border-t border-gray-300 left-1 rounded-b rounded-full bg-white p-4 px-15"
      ></div>

      <div
        class="z-10 absolute top-8 left-1/3 border-t border-gray-200 rounded-b rounded-full bg-white p-4 px-15"
      ></div>
      <div
        class="z-20 absolute top-10 border-t border-gray-300 left-1/2 transform -translate-x-1/2 rounded-t-full bg-white p-4 px-15"
      ></div>

      <div
        class="z-10 absolute top-8 right-1 border-t border-gray-200 rounded-b rounded-full bg-white p-4 px-15"
      ></div>
      <div
        class="z-20 absolute top-10 -right-1 border-t border-gray-300 rounded-b rounded-full bg-white p-4 px-15"
      ></div>
    </div>
    <div class="flex flex-col w-full login-fade-in p-4 px-6">
      <div class="font-semibold text-3xl tracking-widest text-cyan-600">
        Create Account,
      </div>
      <div class="mt-1 text-gray-400">Sign up to get started!</div>
    </div>

    <div class="w-full rounded-md login-fade-in p-4 px-6">
      <div [formGroup]="FG">
        <div class="flex flex-col gap-2">
          <div class="text-gray-500 tracking-wider font-semibold">Email</div>
          <input
            type="text"
            pInputText
            class="w-full"
            formControlName="email"
          />
          <div
            *ngIf="FG.get('email')?.touched && FG.get('email')?.invalid"
            class="text-red-500 text-xs"
          >
            <div *ngIf="FG.get('email')?.errors?.['required']">
              Email is required.
            </div>
            <div *ngIf="FG.get('email')?.errors?.['email']">
              Please enter a valid email address.
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div class="text-gray-500 tracking-wider font-semibold">Name</div>
          <input
            type="text"
            pInputText
            class="w-full"
            formControlName="fullName"
          />
          <div
            *ngIf="FG.get('fullName')?.touched && FG.get('fullName')?.invalid"
            class="text-red-500 text-xs"
          >
            <div *ngIf="FG.get('fullName')?.errors?.['required']">
              Name is required.
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div class="text-gray-500 tracking-wider font-semibold">
            Phone Number
            <span class="italic font-medium text-sm">(optional)</span>
          </div>
          <input
            type="text"
            pInputText
            class="w-full"
            formControlName="phoneNumber"
          />
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div class="text-gray-500 tracking-wider font-semibold">Password</div>
          <p-password
            formControlName="password"
            [toggleMask]="true"
            class="w-full"
            inputStyleClass="!w-full"
            styleClass="!w-full"
            [feedback]="false"
          />
          <div
            *ngIf="FG.get('password')?.touched && FG.get('password')?.invalid"
            class="text-red-500 text-xs"
          >
            <div *ngIf="FG.get('password')?.errors?.['required']">
              Password is required.
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div class="text-gray-500 tracking-wider font-semibold">
            Confirm Password
          </div>
          <p-password
            formControlName="confirmPassword"
            [toggleMask]="true"
            class="w-full"
            inputStyleClass="!w-full"
            styleClass="!w-full"
            [feedback]="false"
          />
          <div
            *ngIf="
              FG.get('confirmPassword')?.touched &&
              FG.get('confirmPassword')?.invalid
            "
            class="text-red-500 text-xs"
          >
            <div *ngIf="FG.get('confirmPassword')?.errors?.['required']">
              Confirm Password is required.
            </div>
            <div
              *ngIf="
                FG.get('confirmPassword')?.value !== FG.get('password')?.value
              "
            >
              Passwords do not match.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full login-fade-in p-4 px-6">
      <div class="border-b mb-5 border-gray-200"></div>
      <p-button
        (onClick)="Register()"
        label="Sign Up"
        severity="info"
        styleClass="!w-full !py-3 !shadow-md"
      ></p-button>
      <div class="text-gray-500 mt-3 text-center tracking-wider text-sm">
        Already have an account ?
        <b class="font-semibold text-cyan-600" [routerLink]="'/login'"
          >Sign In</b
        >
      </div>
    </div>
  </div>`,
  styleUrl: './register.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnDestroy {
  private readonly loadingService = inject(LoadingService);
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserService);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  FG!: FormGroup;

  constructor() {
    this.FG = new FormGroup({
      fullName: new FormControl<string | null>(null, Validators.required),
      email: new FormControl<string | null>(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string | null>(null, Validators.required),
      confirmPassword: new FormControl<string | null>(
        null,
        Validators.required
      ),
      phoneNumber: new FormControl<string | null>(null),
      role: new FormControl<UserRole>(UserRole.Guest),
    });
  }

  Register() {
    if (this.FG.valid) {
      this.loadingService.start();
      this.userService
        .Register(this.FG.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            if (!res.success)
              return this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message,
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
    ValidateAllFormFields(this.FG);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }
}

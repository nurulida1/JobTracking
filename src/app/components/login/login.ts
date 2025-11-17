import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
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
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoadingService } from '../../services/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ValidateAllFormFields } from '../../shared/helpers/helpers';
import { AuthService } from '../../services/authService';
import { AccountService } from '../../services/AccountService.service';
import { UserService } from '../../services/userService.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    RouterLink,
  ],
  template: `
    <div
      class="w-full h-screen flex items-center justify-center bg-white text-gray-500"
      [ngClass]="{ 'flex-col': isMobile, 'flex-row': !isMobile }"
    >
      <div
        class="md:h-full h-[20%] w-full bg-gradient-to-r from-[#285895] via-[#2D75AA] to-[#3090C0] pb-5"
      >
        <div class="flex flex-col justify-center items-center h-full">
          <div *ngIf="!isMobile">
            <div
              class="p-2 pb-7 text-3xl text-white text-shadow-md tracking-wider"
            >
              Welcome to
            </div>
          </div>
          <img src="assets/logo.png" alt="" class="w-[100px] md:w-[150px]" />
          <div
            class="text-white tracking-widest font-bold text-lg md:text-2xl text-shadow-md"
          >
            YL Works
          </div>
          <div *ngIf="!isMobile">
            <div class="relative h-32 flex flex-col justify-between">
              <div
                class="mt-2 text-[12px] text-white/80 tracking-widest text-center"
              >
                Manage your daily operations seamlessly.
              </div>

              <div
                class="absolute -bottom-30 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/80"
              >
                YL Systems Sdn Bhd
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="relative h-[80%] md:h-full md:items-center md:justify-center flex flex-col w-full p-4 login-fade-in"
      >
        <div
          class="p-4 rounded-b rounded-full absolute -top-6 left-0 right-0 w-full bg-white z-20 "
        ></div>
        <div class="flex flex-col items-start w-full gap-1 md:px-10 lg:px-30">
          <div
            class="font-semibold text-3xl tracking-widest pl-2 text-cyan-600"
          >
            Sign In
          </div>
          <div class="pb-2 pl-2 text-gray-400 text-sm tracking-wider">
            Let's get to work!
          </div>
        </div>
        <div class="md:px-10 lg:px-30 w-full">
          <div class="border-b border-gray-200 w-full mt-2 mb-2"></div>
        </div>
        <div class="w-full p-2 rounded-md md:px-10 lg:px-30">
          <div [formGroup]="FG">
            <div class="flex flex-col gap-2">
              <div
                class="text-gray-500 tracking-wider font-semibold md:text-sm"
              >
                Username
              </div>
              <input
                type="text"
                pInputText
                class="w-full md:!text-sm"
                formControlName="username"
              />
              <div
                *ngIf="
                  FG.get('username')?.touched && FG.get('username')?.invalid
                "
                class="text-red-500 text-xs"
              >
                <div *ngIf="FG.get('username')?.errors?.['required']">
                  Email is required.
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2 mt-5">
              <div
                class="text-gray-500 tracking-wider font-semibold md:text-sm"
              >
                Password
              </div>
              <p-password
                formControlName="password"
                [toggleMask]="true"
                class="w-full"
                inputStyleClass="!w-full md:!text-sm"
                styleClass="!w-full"
                [feedback]="false"
              />
              <div
                *ngIf="
                  FG.get('password')?.touched && FG.get('password')?.invalid
                "
                class="text-red-500 text-xs"
              >
                <div *ngIf="FG.get('password')?.errors?.['required']">
                  Password is required.
                </div>
              </div>
              <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row items-center gap-2">
                  <p-checkbox
                    formControlName="rememberMe"
                    [binary]="true"
                  ></p-checkbox>
                  <div class="text-sm text-gray-400">Remember me</div>
                </div>
                <div
                  class="text-sm text-cyan-600 cursor-pointer hover:text-cyan-700"
                  [routerLink]="'/confirm-email'"
                >
                  Forgot Password ?
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full px-2 pt-6 md:px-10 lg:px-30">
          <p-button
            (onClick)="onLogin()"
            label="Login"
            severity="info"
            styleClass="!w-full !py-3 !shadow-md"
          ></p-button>
          <div class="text-gray-500 mt-3 text-center tracking-wider text-sm">
            Don't have account ?
            <b
              class="font-semibold text-cyan-600 cursor-pointer hover:text-cyan-700"
              [routerLink]="'/register'"
              >Sign Up</b
            >
          </div>
        </div>
      </div>
      <ng-container *ngIf="error">
        <div
          class="backdrop-blur-xs absolute top-0 left-0 w-full min-h-screen flex justify-center items-center
    transition-opacity duration-300 ease-in-out"
          [ngClass]="{ 'opacity-100': error, 'opacity-0': !error }"
        >
          <div
            class="flex flex-col rounded-2xl bg-gray-200 drop-shadow-lg transform transition-all duration-300 ease-in-out
      scale-100"
            [ngClass]="{
              'scale-100 opacity-100': error,
              'scale-90 opacity-0': !error
            }"
          >
            <div
              class="py-5 px-15 flex flex-col justify-center items-center gap-2"
            >
              <div
                class="font-semibold tracking-wider text-red-500 text-shadow-sm"
              >
                Error
              </div>
              <div class="tracking-wide">{{ errorMessage }}</div>
            </div>

            <div class="border-b border-gray-300"></div>

            <div class="flex flex-row justify-center items-center">
              <div
                class="flex-1 py-3 border-r border-gray-300 cursor-pointer"
                (click)="CancelDialog()"
              >
                <div class="text-center font-medium tracking-wide">Cancel</div>
              </div>
              <div
                [routerLink]="'/confirm-email'"
                *ngIf="errorMessage === 'Your password is incorrect'"
                class="flex-1 py-3 text-center text-blue-600 font-medium tracking-wide cursor-pointer"
              >
                Reset
              </div>
              <div
                *ngIf="errorMessage !== 'Your password is incorrect'"
                class="flex-1 py-3 text-center text-blue-600 font-medium tracking-wide cursor-pointer"
                [routerLink]="'/register'"
              >
                Register
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styleUrl: './login.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnDestroy, OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly accountService = inject(AccountService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  FG!: FormGroup;
  error: boolean = false;
  errorMessage: string = '';
  isMobile = window.innerWidth < 770;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  constructor() {
    this.FG = new FormGroup({
      username: new FormControl<string | null>(null, Validators.required),
      password: new FormControl<string | null>(null, Validators.required),
      rememberMe: new FormControl<boolean>(false),
    });
  }

  ngOnInit(): void {}

  CancelDialog() {
    this.error = false;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  onLogin() {
    if (!this.FG.valid) {
      ValidateAllFormFields(this.FG);
      return;
    }

    this.loadingService.start();

    const username = this.FG.get('username')?.value;
    const password = this.FG.get('password')?.value;
    const rememberMe = this.FG.get('rememberMe')?.value;

    this.authService
      .authenticate(username, password)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.loadingService.stop();

          if (res.success) {
            // ✅ Set currentUser in UserService
            this.userService.setCurrentUser(res, rememberMe);

            // Navigate only after currentUser is set
            this.router.navigate(['/dashboard']);
          } else {
            this.error = true;
            this.errorMessage = res.message ?? 'Login failed';
          }
        },
        error: (err) => {
          this.loadingService.stop();
          this.error = true;
          this.errorMessage =
            err?.error?.message ?? 'An unexpected error occurred';
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingService.stop();
  }
}

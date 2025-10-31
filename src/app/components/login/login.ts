import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
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
import { UserService } from '../../services/userService.service';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ValidateAllFormFields } from '../../shared/helpers/helpers';

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
  template: ` <div
    class="w-full h-screen items-center justify-center bg-white text-gray-500"
  >
    <div
      class="h-[20%] w-full bg-gradient-to-r from-[#285895] via-[#2D75AA] to-[#3090C0] pb-5"
    >
      <div class="flex flex-col justify-center items-center h-full">
        <img src="assets/logo.png" alt="" class="w-[100px]" />
        <div
          class="text-white tracking-widest font-bold text-lg text-shadow-md"
        >
          YL Works
        </div>
      </div>
    </div>
    <div class="relative h-[80%] flex flex-col w-full p-4 login-fade-in">
      <div
        class="p-4 rounded-b rounded-full absolute -top-6 left-0 right-0 w-full bg-white rounded z-20 "
      ></div>
      <div class="flex flex-col items-start w-full gap-1 ">
        <div class="font-semibold text-3xl tracking-widest pl-2 text-cyan-600">
          Sign In
        </div>
        <div class="pb-2 pl-2 text-gray-400 text-sm tracking-wider">
          Let's get to work!
        </div>
      </div>
      <div class="border-b border-gray-200 w-full mt-2 mb-2"></div>

      <div class="w-full p-2 rounded-md">
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
            <div class="text-gray-500 tracking-wider font-semibold">
              Password
            </div>
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
            <div class="flex flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-2">
                <p-checkbox
                  formControlName="rememberMe"
                  [binary]="true"
                ></p-checkbox>
                <div class="text-sm text-gray-400">Remember me</div>
              </div>
              <div class="text-sm text-cyan-600">Forgot Password ?</div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full px-2 pt-6">
        <p-button
          (onClick)="Login()"
          label="Login"
          severity="info"
          styleClass="!w-full !py-3 !shadow-md"
        ></p-button>
        <div class="text-gray-500 mt-3 text-center tracking-wider text-sm">
          Don't have account ?
          <b class="font-semibold text-cyan-600" [routerLink]="'/register'"
            >Sign Up</b
          >
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './login.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnDestroy, OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private SPLASH_DURATION_MS: number = 3000;
  private FADE_DURATION_MS: number = 1000;

  FG!: FormGroup;

  constructor() {
    this.FG = new FormGroup({
      email: new FormControl<string | null>(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string | null>(null, Validators.required),
      rememberMe: new FormControl<boolean>(false),
    });
  }

  ngOnInit(): void {}

  Login() {
    if (this.FG.valid) {
      this.loadingService.start();
      this.userService
        .Login(this.FG.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            if (res.success) this.router.navigate(['/dashboard']);
            else
              this.messageService.add({
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

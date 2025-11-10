import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
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
    class="relative w-full h-screen flex flex-col md:flex-row items-center bg-white text-gray-500"
  >
    <div
      class="text-white flex-1 h-full flex flex-col items-center justify-center bg-gradient-to-r from-[#285895] via-[#2D75AA] to-[#3090C0] border-r-7 border-[#2D75AA]"
      *ngIf="!isMobile"
    >
      <img src="assets/register.png" alt="" class="w-[250px] xl:w-[350px]" />
      <div class="flex flex-row items-center gap-2 pb-5">
        <img src="assets/logo.png" alt="" class="w-[30px] xl:w-[40px]" />
        <div class="text-lg xl:text-2xl text-shadow-lg">YL Works</div>
      </div>
      <div class="tracking-wider text-xl xl:text-3xl text-shadow-lg">
        Let's Get Started !
      </div>
    </div>
    <div
      class="relative py-7 w-full bg-[var(--p-button-info-background)]"
      *ngIf="isMobile"
    >
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
    <div
      class="flex flex-col w-full login-fade-in py-4 md:border md:border-gray-200 px-6 px-10 xl:px-30 md:flex-1 md:h-full md:items-center md:justify-center"
    >
      <div class="w-full flex flex-col">
        <div
          class="font-semibold text-2xl pt-4 md:pt-0 md:text-2xl tracking-widest text-cyan-600 md:px-20"
        >
          Create Account,
        </div>
        <div class="mt-1 text-gray-400 md:px-20 md:text-sm">
          Sign up to get started!
        </div>
        <div [formGroup]="FG" class="pt-7 md:px-20">
          <div class="flex flex-col gap-2">
            <div class="text-gray-500 tracking-wider font-semibold md:text-sm">
              Email
            </div>
            <input
              type="text"
              pInputText
              class="w-full md:!text-sm"
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
            <div class="text-gray-500 tracking-wider font-semibold md:text-sm">
              Name
            </div>
            <input
              type="text"
              pInputText
              class="w-full md:!text-sm"
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
            <div class="text-gray-500 tracking-wider font-semibold md:text-sm">
              Username
            </div>
            <input
              type="text"
              pInputText
              class="w-full md:!text-sm"
              formControlName="username"
            />
            <div
              *ngIf="FG.get('username')?.touched && FG.get('username')?.invalid"
              class="text-red-500 text-xs"
            >
              <div *ngIf="FG.get('username')?.errors?.['required']">
                Username is required.
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-5">
            <div class="text-gray-500 tracking-wider font-semibold md:text-sm">
              Phone Number
              <span class="italic font-medium text-sm">(optional)</span>
            </div>
            <input
              type="text"
              pInputText
              class="w-full md:!text-sm"
              formControlName="phoneNumber"
            />
          </div>
          <div class="flex flex-col gap-2 mt-5">
            <div class="text-gray-500 tracking-wider font-semibold md:text-sm">
              Password
            </div>
            <p-password
              formControlName="password"
              [toggleMask]="true"
              class="w-full"
              inputStyleClass="!w-full md:!text-sm"
              styleClass="!w-full"
              [feedback]="true"
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
            <div class="text-gray-500 tracking-wider font-semibold md:text-sm">
              Confirm Password
            </div>
            <p-password
              formControlName="confirmPassword"
              [toggleMask]="true"
              class="w-full"
              inputStyleClass="!w-full md:!text-sm"
              styleClass="!w-full"
              [feedback]="true"
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
        <div class="md:px-20">
          <div class="border-b mb-5 mt-5 border-gray-300"></div>
        </div>
        <div class="w-full md:px-20">
          <p-button
            (onClick)="Register()"
            label="Sign Up"
            severity="info"
            styleClass="!w-full !py-3 !shadow-md md:!text-sm md:tracking-wider"
          ></p-button>
        </div>
        <div class="text-gray-500 mt-3 text-center tracking-wider text-sm">
          Already have an account ?
          <b
            class="font-semibold text-cyan-600 cursor-pointer hover:text-cyan-700"
            [routerLink]="'/login'"
            >Sign In</b
          >
        </div>
      </div>
    </div>

    <div
      *ngIf="successPopup"
      class="w-full min-h-screen absolute top-0 left-0 z-30 backdrop-blur-xs flex justify-center items-center
         opacity-0 animate-fadeIn"
    >
      <div
        class="flex flex-col items-center justify-center rounded-2xl bg-gray-200 drop-shadow-lg py-3 w-[80%] md:w-[40%]"
      >
        <img src="assets/success.png" alt="" class="w-[80px]" />
        <div class="pt-4 font-semibold tracking-widest text-lg">
          Registration Successful!
        </div>
        <div class="text-gray-500 tracking-wide text-center text-sm px-3">
          Your account has been created successfully. You can now sign in to
          continue.
        </div>
        <div class="w-full pt-5 px-5">
          <p-button
            [routerLink]="'/login'"
            label="Sign In"
            severity="success"
            styleClass="!w-full !shadow-md !tracking-wider !rounded-2xl"
          ></p-button>
        </div>
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
  private readonly cdr = inject(ChangeDetectorRef);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  FG!: FormGroup;
  successPopup: boolean = false;
  isMobile = window.innerWidth < 770;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  constructor() {
    this.FG = new FormGroup({
      fullName: new FormControl<string | null>(null, Validators.required),
      username: new FormControl<string | null>(null, Validators.required),
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
            if (res.success) {
              setTimeout(() => {
                this.loadingService.stop();
                this.successPopup = true;
                this.cdr.detectChanges();
              }, 1500);
            } else {
              this.loadingService.stop();

              return this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message,
              });
            }
          },
          error: (err) => {
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

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  imports: [CommonModule],
  template: `<div
    class="transition-all duration-1000 relative text-white bg-gradient-to-r from-[#285895] via-[#2D75AA] to-[#3090C0] w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
    [class.slide-up]="isSplashFadingOut() && isMobile"
    [class.slide-left]="isSplashFadingOut() && !isMobile"
    [class.hidden]="!isSplashVisible()"
  >
    <!-- splash screen -->
    <div><img src="assets/logo.png" alt="" class="w-[200px]" /></div>
    <div class="text-shadow-lg font-bold text-4xl tracking-widest">
      YL Works
    </div>
    <div class="mt-3 tracking-wider text-white/80">
      Quotations. Works. Deliveries
    </div>

    <!-- footer section -->
    <div class="absolute bottom-15 left-0 right-0 w-full">
      <div
        class="text-shadow-md flex flex-row items-center justify-center tracking-wider text-sm"
      >
        YL Systems Sdn Bhd
      </div>
      <div class="loader3 mt-3">
        <div class="bars bar1"></div>
        <div class="bars bar2"></div>
        <div class="bars bar3"></div>
        <div class="bars bar4"></div>
        <div class="bars bar5"></div>
        <div class="bars bar6"></div>
        <div class="bars bar7"></div>
        <div class="bars bar8"></div>
        <div class="bars bar9"></div>
        <div class="bars bar10"></div>
      </div>
    </div>
  </div>`,
  styleUrl: './splashScreen.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreen implements OnInit {
  isMobile = window.innerWidth < 770;
  private readonly router = inject(Router);

  private SPLASH_DURATION_MS: number = 3000;
  private FADE_DURATION_MS: number = 1000;

  isSplashVisible = signal(true);
  isSplashFadingOut = signal(false);

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isSplashFadingOut.set(true);
    }, this.SPLASH_DURATION_MS);

    setTimeout(() => {
      this.isSplashVisible.set(false);
      this.router.navigate(['/login']);
    }, this.SPLASH_DURATION_MS + this.FADE_DURATION_MS);
  }
}

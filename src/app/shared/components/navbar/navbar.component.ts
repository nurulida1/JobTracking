import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Subject, filter, takeUntil } from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { AppConfigService } from '../../../services/appConfig.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    AvatarModule,
    RouterLink,
    ButtonModule,
    PopoverModule,
    DialogModule,
  ],
  template: `<div class="shadow-md p-3 w-full bg-blue-900">
    <div class="flex flex-row items-center justify-between">
      <div class="font-semibold tracking-wider text-white">YL Systems</div>
    </div>
  </div>`,
  styleUrl: './navbar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly appConfigService = inject(AppConfigService);
  private destroy$ = new Subject<void>();
  isDarkMode = computed(
    () => this.appConfigService.appState()?.darkTheme ?? false
  );
  currentUrl: string = '';
  role: string | null = localStorage.getItem('role');
  showLogoutDialog: boolean = false;
  isLogin: boolean = false;

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  isActive(route: string): boolean {
    return this.currentUrl.includes(route);
  }

  LogOutClick() {
    this.showLogoutDialog = true;
  }

  cancelLogout() {
    this.showLogoutDialog = false;
  }

  confirmLogout() {
    this.showLogoutDialog = false;
  }

  toggleDarkMode() {
    this.appConfigService.appState.update((state) => ({
      ...state,
      darkTheme: !state?.darkTheme,
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

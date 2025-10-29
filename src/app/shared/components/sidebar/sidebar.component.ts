import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, AvatarModule, TooltipModule],
  template: `
    <div class="h-full w-[60px] p-[25px] border">
      <div class="fixed top-0 left-0"></div>
    </div>
  `,
  styleUrl: './sidebar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnDestroy {
  private readonly router = inject(Router);

  private destroy$ = new Subject<void>();

  currentUrl: string = '';

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

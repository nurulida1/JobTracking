import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { MenuItem } from 'primeng/api';
import { AppConfigService } from '../../../services/appConfig.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FooterComponent,
    SidebarComponent,
  ],
  template: `
    <div class="relative w-full min-h-screen flex flex-col">
      <div *ngIf="isMobile" class="flex-1 flex flex-col w-full">
        <app-navbar
          class="p-2 fixed top-0 left-0 w-full z-50 shadow-md bg-gray-100"
        ></app-navbar>
        <div class="flex-1 flex flex-col min-h-full min-w-0">
          <div
            class="flex-1 w-full overflow-auto relative"
            [ngStyle]="{
              'background-image':
                theme() === 'dark'
                  ? 'url(assets/dark-background.png)'
                  : 'url(assets/light-background.jpg)',
              'background-size': 'cover',
              'background-position': 'center',
              'background-repeat': 'no-repeat'
            }"
          >
            <!-- Optional overlay for better readability in dark mode -->
            <div class="absolute inset-0 bg-white/50 backdrop-blur-xs"></div>
            <div class="relative z-10">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
        <app-footer
          class="p-2 fixed bottom-0 left-0 w-full z-50 shadow-md"
        ></app-footer>
      </div>

      <div
        *ngIf="!isMobile"
        class="flex-1 w-full overflow-auto relative"
        [ngStyle]="{
          'background-image':
            theme() === 'dark'
              ? 'url(assets/dark-background.png)'
              : 'url(assets/light-background.jpg)',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        }"
      >
        <!-- Optional overlay for better readability in dark mode -->
        <div class="absolute inset-0 bg-white/70"></div>

        <!-- router content stays above background -->
        <div class="relative z-10">
          <app-navbar
            class="p-2 w-full border-b border-gray-200 bg-white"
          ></app-navbar>
          <div class="w-full flex flex-row">
            <app-sidebar
              class="border-r bg-white border-gray-200 px-2"
            ></app-sidebar>
            <div class="w-full">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './main-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  private appConfig = inject(AppConfigService);

  isMobile = window.innerWidth < 770;
  theme = computed(() =>
    this.appConfig.theme() === 'dark' ? 'dark' : 'light'
  );

  items: MenuItem[] = [];

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 770;
  }

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-cog',
        label: 'Settings',
        routerLink: ['/settings'],
      },
      {
        icon: 'pi pi-box',
        label: 'Delivery',
        routerLink: ['/delivery'],
      },
      {
        icon: 'pi pi-briefcase',
        label: 'Jobs',
        routerLink: ['/jobs'],
      },
      {
        icon: 'pi pi-list-check',
        label: 'Purchase Order',
        routerLink: ['/purchase-order'],
      },
      {
        icon: 'pi pi-receipt',
        label: 'Quotations',
        routerLink: ['/quotation'],
      },
    ];
  }
}

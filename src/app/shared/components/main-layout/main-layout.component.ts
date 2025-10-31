import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  imports: [
    SidebarComponent,
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FooterComponent,
    SpeedDialModule,
  ],
  template: `
    <div class="relative w-full min-h-screen flex flex-col">
      <div *ngIf="isMobile" class="flex-1 flex flex-col w-full">
        <app-navbar
          class="p-2 fixed top-0 left-0 w-full z-50 shadow-md rounded-b-2xl bg-black/30"
        ></app-navbar>
        <div class="flex-1 flex flex-col min-h-full min-w-0">
          <div class="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
            <router-outlet></router-outlet>
          </div>
        </div>
        <app-footer
          class="p-2 fixed bottom-0 left-0 w-full z-50 shadow-md"
        ></app-footer>
      </div>

      <div *ngIf="!isMobile" class="flex-1 w-full overflow-auto bg-gray-100">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: './main-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  isMobile = window.innerWidth < 770;
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

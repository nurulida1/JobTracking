import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    SidebarComponent,
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FooterComponent,
  ],
  template: `
    <div class="relative w-full min-h-screen flex flex-col">
      <app-navbar class="w-full"></app-navbar>

      <div *ngIf="isMobile" class="flex-1 flex flex-row w-full">
        <div class="flex-1 flex flex-col min-h-full min-w-0">
          <div class="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
            <router-outlet></router-outlet>
          </div>
          <app-footer class="shrink-0"></app-footer>
        </div>
      </div>

      <div *ngIf="!isMobile" class="flex-1 w-full overflow-auto">
        <router-outlet></router-outlet>
      </div>

      <app-footer *ngIf="!isMobile" class="shrink-0"></app-footer>
    </div>
  `,
  styleUrl: './main-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  isMobile = window.innerWidth < 1280;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 1280;
  }
}

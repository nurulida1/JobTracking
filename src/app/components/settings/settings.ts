import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FooterComponent, AvatarModule],
  template: `<div
    class="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
    style="background-image: url('assets/background.png');"
  >
    <div class="absolute inset-0 backdrop-blur-sm bg-black/40 z-10"></div>
    <div
      class="relative z-20 border border-gray-400/30 bg-black/20 
          w-full min-h-screen shadow-xl
          shadow-[0_0_40px_rgba(173,216,230,0.5)] text-white backdrop-filter backdrop-blur-xl
          flex flex-col"
    >
      <div
        class="flex flex-row items-center justify-center p-3 py-5 border border-white/10 shadow-md"
      >
        <div class="tracking-widest">Settings</div>
        <app-footer
          class="p-2 fixed bottom-0 left-0 w-full z-50 shadow-md"
        ></app-footer>
      </div>
      <div class="mt-3 px-3">
        <div
          class="p-5 border-b border-white/20 flex flex-col justify-center items-center"
        >
          <p-avatar
            icon="pi pi-user"
            class="mr-2"
            size="xlarge"
            shape="circle"
          />
          <div class="mt-2 tracking-wider text-shadow-md text-lg">Nurul</div>
          <div class="text-white/50 text-xs tracking-widest">Admin</div>
        </div>
        <div class="p-3 pt-5 pb-2 flex flex-row items-center gap-3">
          <div
            class="bg-white/30 shadow-md w-10 h-10 flex items-center justify-center rounded-full"
          >
            <i class="pi pi-unlock !text-lg"></i>
          </div>
          <div>Change Password</div>
        </div>
        <div class="p-3 pb-5 flex flex-row items-center gap-3">
          <div
            class="bg-white/30 shadow-md w-10 h-10 flex items-center justify-center rounded-full"
          >
            <i class="pi pi-sign-out !text-lg"></i>
          </div>
          <div>Log Out</div>
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './settings.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {}

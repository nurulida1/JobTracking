import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  template: `<div class="p-2 text-[#3F403D] text-xs bg-gray-100 lg:text-sm">
    {{ '@2025 YL Systems Sdn Bhd. All Rights Reserved.' }}
  </div>`,
  styleUrl: './footer.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}

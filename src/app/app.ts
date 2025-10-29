import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './common/components/spinner/spinner.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { delay } from 'rxjs';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SpinnerComponent,
    CommonModule,
    ToastModule,
    ConfirmPopupModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly title = signal('JobTracking');
  isSpinning$ = inject(LoadingService).isLoading$.pipe(delay(0));
}

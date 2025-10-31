import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { LoadingService } from '../../../services/loading.service';
import { JobService } from '../../../services/jobService.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-job-view',
  imports: [CommonModule, RouterLink, TagModule, InputTextModule, FormsModule],
  template: ``,
  styleUrl: './job-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobView implements OnInit, OnDestroy {
  private readonly loadingService = inject(LoadingService);
  private readonly jobService = inject(JobService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}

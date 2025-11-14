import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-to-do-view',
  imports: [CommonModule],
  template: `<div class="w-full min-h-screen">
    <div class="p-2 mt-15">
      <div class="p-4 flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <button class="text-gray-500 hover:text-black" (click)="prevMonth()">
            ‹
          </button>
          <div class="font-semibold text-lg text-center">
            {{ currentDate | date : 'MMMM yyyy' }}
          </div>
          <button class="text-gray-500 hover:text-black" (click)="nextMonth()">
            ›
          </button>
        </div>

        <div
          class="grid grid-cols-7 text-center text-xs font-semibold text-gray-600"
        >
          <div
            *ngFor="let d of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          >
            {{ d }}
          </div>
        </div>

        <div class="grid grid-cols-7 text-center text-sm gap-1">
          <div
            *ngFor="let day of daysInMonth"
            (click)="selectDate(day)"
            [ngClass]="{
              'bg-blue-500 text-white':
                selectedDate && isSameDay(day.date, selectedDate),
              'bg-gray-100': !day.isCurrentMonth,
              'border border-blue-400': day.isToday && !selectedDate
            }"
            class="p-2 rounded-lg cursor-pointer hover:bg-blue-200 transition"
          >
            {{ day.date.getDate() }}
          </div>
        </div>

        <div *ngIf="selectedDate" class="mt-4 border-t pt-3">
          <div class="font-semibold text-gray-700 text-sm mb-2">
            Tasks on {{ selectedDate | date : 'fullDate' }}
          </div>

          <ng-container *ngIf="dailyTasks.length; else noTasks">
            <div
              *ngFor="let t of dailyTasks"
              class="border rounded-lg p-2 mb-2 shadow-sm bg-white text-xs flex justify-between"
            >
              <div>{{ t.description }}</div>
              <div
                [ngClass]="{
                  'text-yellow-600': t.status === 'Pending',
                  'text-green-600': t.status === 'Completed',
                  'text-blue-600': t.status === 'Active',
                  'text-red-600': t.status === 'Delayed'
                }"
              >
                {{ t.status }}
              </div>
            </div>
          </ng-container>

          <ng-template #noTasks>
            <div class="text-gray-400 italic text-xs">
              No tasks for this day.
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './to-do-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoView implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  daysInMonth: { date: Date; isToday: boolean; isCurrentMonth: boolean }[] = [];

  tasks: any[] = [];
  dailyTasks: any[] = [];

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      const prevDate = new Date(year, month, i - startDayOfWeek + 1);
      days.push({ date: prevDate, isToday: false, isCurrentMonth: false });
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const isToday = this.isSameDay(date, new Date());
      days.push({ date, isToday, isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isToday: false, isCurrentMonth: false });
    }

    this.daysInMonth = days;
  }

  isSameDay(d1: Date, d2: Date) {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  selectDate(day: any) {
    this.selectedDate = day.date;
    this.dailyTasks = this.tasks.filter(
      (t) =>
        new Date(t.date).toDateString() === this.selectedDate!.toDateString()
    );
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }
}

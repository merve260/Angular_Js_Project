import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toastService.message$ | async as message" class="toast">
      {{ message }}
    </div>
  `,
  styles: [`
    .toast {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 1000;
  font-size: 19px;
  opacity: 0.95;
  animation: fadeInOut 4s;
}


    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      10% { opacity: 1; transform: translateX(-50%) translateY(0); }
      90% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}

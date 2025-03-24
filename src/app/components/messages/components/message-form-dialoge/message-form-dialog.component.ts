import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import {
  selectError,
  selectSubmitting,
} from '../../../../store/messages/messages.reducer';
import { MessagesActions } from '../../../../store/messages/messages.action';

@Component({
  selector: 'app-message-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './message-form-dialog.component.html',
  styleUrl: './message-form-dialog.component.scss',
})
export class MessageFormDialogComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<MessageFormDialogComponent>);

  messageForm: FormGroup;
  submitting$: Observable<boolean>;
  private subscription = new Subscription();
  private wasSubmitting = false;

  constructor() {
    this.messageForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
    });

    this.submitting$ = this.store.select(selectSubmitting);

    this.subscription.add(
      combineLatest([
        this.store.select(selectSubmitting),
        this.store.select(selectError),
      ]).subscribe(([submitting, error]) => {
        if (!submitting && this.wasSubmitting && !error) {
          setTimeout(() => {
            this.dialogRef.close();
          }, 300);
        }
        this.wasSubmitting = submitting;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.messageForm.valid) {
      const formValue = this.messageForm.value;

      this.store.dispatch(
        MessagesActions.createMessage({
          message: {
            email: formValue.email,
            message: formValue.message,
            createdAt: new Date(),
          },
        })
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf, SlicePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { MessageFormDialogComponent } from './components/message-form-dialoge/message-form-dialog.component';
import { Message } from '../../types/message.model';
import {
  selectLoading,
  selectMessages,
} from '../../store/messages/messages.reducer';
import { MessagesActions } from '../../store/messages/messages.action';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    SlicePipe,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  messages$: Observable<Message[]>;
  loading$: Observable<boolean>;
  displayedColumns = ['id', 'email', 'message', 'createdAt'];

  constructor() {
    this.messages$ = this.store
      .select(selectMessages)
      .pipe(map((messages) => messages || []));
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(MessagesActions.loadMessages());
  }

  openMessageForm(): void {
    this.dialog.open(MessageFormDialogComponent, {
      width: '500px',
    });
  }
}

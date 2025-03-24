import { Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { messagesFeature } from '../../store/messages/messages.reducer';
import { MessagesEffects } from '../../store/messages/messages.effect';


export const MESSAGES_ROUTES: Routes = [
  {
    path: '',
    component: MessagesComponent,
    providers: [
      provideState(messagesFeature),
      provideEffects(MessagesEffects)
    ]
  }
];
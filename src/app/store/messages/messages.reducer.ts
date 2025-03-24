import { createFeature, createReducer, on } from '@ngrx/store';

import { MessagesActions } from './messages.action';
import { Message } from '../../types/message.model';

export interface MessagesState {
  messages: Message[];
  loading: boolean;
  submitting: boolean;
  error: any;
}

export const initialMessagesState: MessagesState = {
  messages: [],
  loading: false,
  submitting: false,
  error: null,
};

export const messagesFeature = createFeature({
  name: 'messages',
  reducer: createReducer(
    initialMessagesState,

    on(MessagesActions.loadMessages, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MessagesActions.loadMessagesSuccess, (state, { messages }) => ({
      ...state,
      loading: false,
      messages,
    })),
    on(MessagesActions.loadMessagesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(MessagesActions.createMessage, (state) => ({
      ...state,
      submitting: true,
      error: null,
    })),
    on(MessagesActions.createMessageSuccess, (state, { message }) => ({
      ...state,
      submitting: false,
      messages: [message, ...state.messages],
    })),
    on(MessagesActions.createMessageFailure, (state, { error }) => ({
      ...state,
      submitting: false,
      error,
    }))
  ),
});

export const {
  name: messagesFeatureKey,
  reducer: messagesReducer,
  selectMessagesState,
  selectMessages,
  selectLoading,
  selectSubmitting,
  selectError,
} = messagesFeature;

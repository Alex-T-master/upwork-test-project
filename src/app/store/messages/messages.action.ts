import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Message } from '../../types/message.model';


export const MessagesActions = createActionGroup({
  source: 'Messages',
  events: {
    
    'Load Messages': emptyProps(),
    'Load Messages Success': props<{ messages: Message[] }>(),
    'Load Messages Failure': props<{ error: any }>(),
    

    'Create Message': props<{ message: Omit<Message, 'id'> }>(),
    'Create Message Success': props<{ message: Message }>(),
    'Create Message Failure': props<{ error: any }>()
  }
});
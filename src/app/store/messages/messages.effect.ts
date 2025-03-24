
import { Injectable, inject, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from '@angular/fire/firestore';
import { from, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { MessagesActions } from './messages.action';

@Injectable()
export class MessagesEffects {
  private actions$ = inject(Actions);
  private firestore = inject(Firestore);
  private snackBar = inject(MatSnackBar);
  private ngZone = inject(NgZone);

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessages),
      switchMap(() => {
        return this.ngZone.runOutsideAngular(() => {
          const messagesCollection = collection(this.firestore, 'messages');
          const messagesQuery = query(
            messagesCollection,
            orderBy('createdAt', 'desc')
          );

          return from(getDocs(messagesQuery)).pipe(
            map((snapshot) => {
              const messages = snapshot.docs.map((doc) => {
                const data = doc.data();

                const createdAt = data['createdAt']
                  ? data['createdAt'].toDate
                    ? data['createdAt'].toDate()
                    : new Date(data['createdAt'])
                  : new Date();

                return {
                  id: doc.id,
                  email: data['email'],
                  message: data['message'],
                  createdAt: createdAt,
                };
              });

              return this.ngZone.run(() =>
                MessagesActions.loadMessagesSuccess({ messages })
              );
            }),
            catchError((error) =>
              of(MessagesActions.loadMessagesFailure({ error }))
            )
          );
        });
      })
    )
  );

  createMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.createMessage),
      switchMap(({ message }) => {
        return this.ngZone.runOutsideAngular(() => {
          const messagesCollection = collection(this.firestore, 'messages');
          const messageWithTimestamp = {
            ...message,
            createdAt: serverTimestamp(),
          };

          return from(addDoc(messagesCollection, messageWithTimestamp)).pipe(
            map((docRef) => {
              const newMessage = {
                ...message,
                id: docRef.id,
              };
              return this.ngZone.run(() =>
                MessagesActions.createMessageSuccess({ message: newMessage })
              );
            }),
            catchError((error) =>
              of(MessagesActions.createMessageFailure({ error }))
            )
          );
        });
      })
    )
  );

  createMessageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.createMessageSuccess),
        tap(() => {
          this.snackBar.open('Message sent successfully!', 'Close', {
            duration: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  createMessageFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.createMessageFailure),
        tap(({ error }) => {
          this.snackBar.open(
            `Error: ${error.message || 'Unknown error'}`,
            'Close',
            {
              duration: 5000,
            }
          );
        })
      ),
    { dispatch: false }
  );
}

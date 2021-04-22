/* Copyright 2021 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType, OnInitEffects} from '@ngrx/effects';
import {Action, createAction, Store} from '@ngrx/store';
import {EMPTY, Observable} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';

import {State} from '../../app_state';
import {NotificationCenterDataSource} from '../_data_source/index';
import * as actions from './notification_center_actions';
import {CategoryEnum} from './notification_center_types';

/** @typehack */ import * as _typeHackNgrxEffects from '@ngrx/effects';
/** @typehack */ import * as _typeHackModels from '@ngrx/store/src/models';

export const initAction = createAction('[NotificationCenter Effects] Init');

@Injectable()
export class NotificationCenterEffects implements OnInitEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<State>,
    private readonly dataSource: NotificationCenterDataSource
  ) {}

  /** @export */
  ngrxOnInitEffects(): Action {
    return initAction();
  }

  /**
   * Initiates notifications fetching.
   *
   * @export
   */
  initialNotificationFetch$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(initAction),
        mergeMap(() => this.fetchNotifications())
      );
    },
    {dispatch: false}
  );

  private fetchNotifications(): Observable<void> {
    return this.dataSource.fetchNotifications().pipe(
      map((response) => {
        const notifications = response.notifications.map(
          (backendNotification) => {
            return {
              ...backendNotification,
              category: CategoryEnum.WHATS_NEW,
            };
          }
        );
        this.store.dispatch(actions.fetchNotificationsLoaded({notifications}));
      }),
      catchError(() => {
        this.store.dispatch(actions.fetchNotificationsFailed());
        return EMPTY;
      })
    );
  }

  /**
   * Updates last read timestamp.
   *
   * @export
   */
   updateLastReadTimestampInMs$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(actions.notificationBellClicked),
        mergeMap(() => this.dataSource.updateLastReadTimeStampInMs())
      );
    },
    {dispatch: false}
  );
}

export const TEST_ONLY = {
  initAction,
};

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
import {of} from 'rxjs';
import {
  NotificationCenterDataSource,
  NotificationCenterResponse as DataSourceNotifications,
} from '../_data_source';
import {
  CategoryEnum,
  NotificationState,
  NOTIFICATION_FEATURE_KEY,
  State,
} from './notification_center_types';

/** @typehack */ import * as _typeHackRxjs from 'rxjs';

export function buildNotificationState(
  override: Partial<NotificationState>
): NotificationState {
  return {
    notifications: [],
    lastReadTimestampInMs: null,
    ...override,
  };
}

export function buildStateFromNotificationState(
  runsState: NotificationState
): State {
  return {[NOTIFICATION_FEATURE_KEY]: runsState};
}

@Injectable()
export class TestingNotificationCenterDataSource
  implements NotificationCenterDataSource {
  fetchNotifications() {
    return of({
      notifications: [],
    });
  }
}

export function provideTestingNotificationCenterDataSource() {
  return [
    TestingNotificationCenterDataSource,
    {
      provide: NotificationCenterDataSource,
      useExisting: TestingNotificationCenterDataSource,
    },
  ];
}

export function buildDataSourceNotification(): DataSourceNotifications {
  return {
    notifications: [
      {
        category: CategoryEnum.WHATS_NEW,
        dateInMs: 123,
        title: 'test title',
        content: 'random content',
      },
    ],
  };
}

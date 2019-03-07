import { createSelector } from 'reselect';
import {
  makeReducer,
  removeByKey,
  roundTo2Points
} from '../../utils';

const initial = {
  list: [],
  isLoading: false,
  activeUserId: null,
  activeTasksMap: {}
};

export const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
export const GET_USERS_FULFILLED = 'users/GET_USERS_FULFILLED';
export const GET_USERS_REJECTED = 'users/GET_USERS_REJECTED';
export const SET_ACTIVE = 'users/SET_ACTIVE';
export const SWITCH_ACTIVE_TASK = 'users/SWITCH_ACTIVE_TASK';

export default makeReducer({
  [GET_USERS_PENDING]:
    state => ({
      ...state,
      isLoading: true
    }),

  [GET_USERS_FULFILLED]:
    (state, { payload }) => ({
      ...state,
      list: payload,
      isLoading: false
    }),

  [GET_USERS_REJECTED]:
    state => ({
      ...state,
      isLoading: false
    }),

  [SET_ACTIVE]:
    (state, { payload }) => ({
      ...state,
      activeUserId: payload
    }),

  [SWITCH_ACTIVE_TASK]:
    (state, { payload: taskId }) => ({
      ...state,
      activeTasksMap:
        state.activeTasksMap[state.activeUserId] &&
        state.activeTasksMap[state.activeUserId][taskId] != null
          ? {
            [state.activeUserId]: removeByKey(
              taskId,
              state.activeTasksMap[state.activeUserId]
            )
          }
          : {
            [state.activeUserId]: {
              ...state.activeTasksMap[state.activeUserId],
              [taskId]: true
            }
          }
    })
}, initial);

export const fetchUsers =
  () => ({
    type: GET_USERS_PENDING
  });

export const setActiveUser =
  userId => ({
    type: SET_ACTIVE,
    payload: userId
  });

export const switchActiveTask =
  taskId => ({
    type: SWITCH_ACTIVE_TASK,
    payload: taskId
  });

export const getUsers =
  createSelector(
    ({ users }) => users.list,
    users =>
      users.map(user => {
        const average =
          !user.tasks.length ? 0 : (
            user.tasks.reduce((acc, { score }) =>
              acc + score,
              0
            ) / user.tasks.length
          );

        return {
          ...user,
          isGreat: (
            (user.age < 30 && average >= 4) ||
            (user.age >= 30 && average >= 4.33)
          )
        };
      })
  );

export const getTasksAndAverage =
  createSelector(
    ({ users }) => users.list,
    ({ users }) => users.activeUserId,
    ({ users }) => users.activeTasksMap,
    (users, activeUserId, activeTasksMap) => {
      const selectedMap = activeTasksMap[activeUserId] || {};
      const tasks =
        !activeUserId ? [] : (
          users.find(({ id }) => id === activeUserId)
            .tasks
        );
      const selectedTaskIds = Object.keys(selectedMap);
      const selectedTasksAverage =
        !(activeUserId && selectedTaskIds.length)
          ? null
          : selectedTaskIds
            .reduce((acc, id) =>
              acc + (
                tasks.find(({ id: taskId }) => taskId === +id)
                  .score
              ),
              0
            ) / selectedTaskIds.length;

      return {
        tasks,
        selectedTasksAverage:
          roundTo2Points(selectedTasksAverage),
      };
    }
  );

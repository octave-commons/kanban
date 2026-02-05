import test from 'ava';

import type { Board, EpicTask, Task } from '../lib/types.js';
import {
  addSubtaskToEpic,
  calculateEpicStatus,
  createEpic,
  getAllEpics,
  getAllSubtasks,
  getEpicSubtasks,
  getSubtaskEpic,
  isEpic,
  isSubtask,
  removeSubtaskFromEpic,
  updateEpicStatus,
  validateEpicTransition,
} from '../lib/epic.js';
import { makeBoard, makeTask } from '../test-utils/helpers.js';

const buildBoard = (tasks: Task[]): Board => {
  const columns = [{ name: 'Todo', count: tasks.length, limit: null, tasks }];
  return makeBoard(columns);
};

test('isEpic and isSubtask identify task types', (t) => {
  const epic: EpicTask = {
    ...makeTask({ uuid: 'epic-1', title: 'Epic', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['task-1'],
    epicStatus: 'pending',
  };
  const subtask: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Subtask', status: 'Todo' }),
    type: 'task',
    epicId: 'epic-1',
  };

  t.true(isEpic(epic));
  t.false(isEpic(subtask));
  t.true(isSubtask(subtask as any));
  t.false(isSubtask(epic as any));
});

test('getEpicSubtasks and getSubtaskEpic resolve relationships', (t) => {
  const epic: EpicTask = {
    ...makeTask({ uuid: 'epic-1', title: 'Epic', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['task-1'],
    epicStatus: 'pending',
  };
  const subtask: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Subtask', status: 'Todo' }),
    type: 'task',
    epicId: 'epic-1',
  };
  const board = buildBoard([epic, subtask]);

  t.deepEqual(getEpicSubtasks(board, epic), [subtask]);
  t.is(getSubtaskEpic(board, subtask as any)?.uuid, epic.uuid);
});

test('calculateEpicStatus derives aggregate status from subtasks', (t) => {
  t.is(calculateEpicStatus([]), 'pending');

  const doneSubtask = makeTask({ uuid: 'task-1', title: 'Done', status: 'done' });
  t.is(calculateEpicStatus([doneSubtask]), 'completed');

  const blockedSubtask = makeTask({ uuid: 'task-2', title: 'Blocked', status: 'blocked' });
  t.is(calculateEpicStatus([doneSubtask, blockedSubtask]), 'blocked');

  const progressSubtask = makeTask({ uuid: 'task-3', title: 'Progress', status: 'in_progress' });
  t.is(calculateEpicStatus([progressSubtask, doneSubtask]), 'in_progress');
});

test('validateEpicTransition enforces done transitions and warns on partial review', (t) => {
  const epic: EpicTask = {
    ...makeTask({ uuid: 'epic-1', title: 'Epic', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['task-1', 'task-2'],
    epicStatus: 'pending',
  };
  const subtaskDone: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Done', status: 'done' }),
    epicId: epic.uuid,
  };
  const subtaskTodo: Task = {
    ...makeTask({ uuid: 'task-2', title: 'Todo', status: 'todo' }),
    epicId: epic.uuid,
  };
  const board = buildBoard([epic, subtaskDone, subtaskTodo]);

  const blocked = validateEpicTransition(epic, 'done', board);
  t.false(blocked.allowed);
  t.truthy(blocked.blockedBy?.length);

  const review = validateEpicTransition(epic, 'review', board);
  t.true(review.allowed);
  t.true((review.warnings ?? []).length > 0);
});

test('addSubtaskToEpic updates task relationships and status', (t) => {
  const epic: EpicTask = {
    ...makeTask({ uuid: 'epic-1', title: 'Epic', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['seed-1'],
    epicStatus: 'pending',
  };
  const seedSubtask: Task = {
    ...makeTask({ uuid: 'seed-1', title: 'Seed', status: 'todo' }),
    epicId: epic.uuid,
  };
  const subtask: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Subtask', status: 'Todo' }),
    type: 'task',
  };
  const board = buildBoard([epic, seedSubtask, subtask]);

  const result = addSubtaskToEpic(board, epic.uuid, subtask.uuid);
  t.true(result.success);
  t.true(epic.subtaskIds.includes(subtask.uuid));
  t.is(subtask.epicId, epic.uuid);
  t.is(epic.epicStatus, 'pending');
});

test('addSubtaskToEpic rejects invalid combinations', (t) => {
  const epic: EpicTask = {
    ...makeTask({ uuid: 'epic-1', title: 'Epic', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['seed-1'],
    epicStatus: 'pending',
  };
  const otherEpic: EpicTask = {
    ...makeTask({ uuid: 'epic-2', title: 'Epic 2', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['other-seed'],
    epicStatus: 'pending',
  };
  const seedSubtask: Task = {
    ...makeTask({ uuid: 'seed-1', title: 'Seed', status: 'todo' }),
    epicId: epic.uuid,
  };
  const otherSeed: Task = {
    ...makeTask({ uuid: 'other-seed', title: 'Seed', status: 'todo' }),
    epicId: otherEpic.uuid,
  };
  const subtask: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Subtask', status: 'Todo' }),
    type: 'task',
    epicId: 'epic-1',
  };
  const board = buildBoard([epic, otherEpic, seedSubtask, otherSeed, subtask]);

  t.false(addSubtaskToEpic(board, 'missing', subtask.uuid).success);
  t.false(addSubtaskToEpic(board, subtask.uuid, subtask.uuid).success);
  t.false(addSubtaskToEpic(board, epic.uuid, otherEpic.uuid).success);
  t.false(addSubtaskToEpic(board, otherEpic.uuid, subtask.uuid).success);
});

test('removeSubtaskFromEpic detaches subtasks and updates status', (t) => {
  const epic: EpicTask = {
    ...makeTask({ uuid: 'epic-1', title: 'Epic', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['task-1'],
    epicStatus: 'pending',
  };
  const subtask: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Subtask', status: 'Todo' }),
    type: 'task',
    epicId: 'epic-1',
  };
  const board = buildBoard([epic, subtask]);

  const result = removeSubtaskFromEpic(board, epic.uuid, subtask.uuid);
  t.true(result.success);
  t.false(epic.subtaskIds.includes(subtask.uuid));
  t.true(subtask.epicId === undefined);
});

test('createEpic and updateEpicStatus manage epic metadata', (t) => {
  const epic = createEpic('Epic Title', 'Epic description', ['task-1']);
  t.is(epic.title, 'Epic Title');
  t.is(epic.type, 'epic');
  t.true(epic.labels?.includes('epic') ?? false);

  const subtask: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Done', status: 'done' }),
    epicId: epic.uuid,
  };
  const board = buildBoard([epic, subtask]);
  updateEpicStatus(board, epic);
  t.is(epic.epicStatus, 'completed');
});

test('getAllEpics and getAllSubtasks return filtered lists', (t) => {
  const epic: EpicTask = {
    ...makeTask({ uuid: 'epic-1', title: 'Epic', status: 'Todo' }),
    type: 'epic',
    subtaskIds: ['task-1'],
    epicStatus: 'pending',
  };
  const subtask: Task = {
    ...makeTask({ uuid: 'task-1', title: 'Subtask', status: 'Todo' }),
    type: 'task',
    epicId: 'epic-1',
  };
  const board = buildBoard([epic, subtask]);

  t.deepEqual(getAllEpics(board).map((task) => task.uuid), [epic.uuid]);
  t.deepEqual(getAllSubtasks(board).map((task) => task.uuid), [subtask.uuid]);
});

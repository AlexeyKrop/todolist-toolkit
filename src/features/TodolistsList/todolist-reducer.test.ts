import {removeTodolistAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";

test('check remove todolist', () => {
  const startState:  Array<TodolistDomainType> = [
    {
      id: '1',
      title: 'ts',
      addedDate: 'string',
      order: 1,
      filter: 'all',
      entityStatus: 'idle',
    },
    {
      id: '2',
      title: 'ts',
      addedDate: 'string',
      order: 1,
      filter: 'all',
      entityStatus: 'idle',
    }
  ];
  const endState = todolistsReducer(startState, removeTodolistAC('2'))
  expect(endState.length).toBe(1)

});
import {addTodolistAC, removeTodolistAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";

test('check remove todolist', () => {
  const startState:  Array<TodolistDomainType> = [
    {
      id: '1',
      title: 'js',
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
test('check add todolist', () => {
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
  const todolist =  {
    id: '3',
    title: 'react',
    addedDate: 'string',
    order: 1,
    filter: 'all',
    entityStatus: 'idle',
  }
  const endState = todolistsReducer(startState, addTodolistAC(todolist))
  expect(endState[0].title).toBe('react')
});
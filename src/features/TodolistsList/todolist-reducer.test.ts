import {
  addTodolistAC,
  changeTodolistTitleAC,
  removeTodolistAC,
  TodolistDomainType,
  todolistsReducer
} from "./todolists-reducer";
let startState:  Array<TodolistDomainType> = []
beforeEach(() => {
  startState = [
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
})
test('check remove todolist', () => {
  const endState = todolistsReducer(startState, removeTodolistAC('2'))
  expect(endState.length).toBe(1)
});
test('check add todolist', () => {
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
test('check change todolist title', () => {

  const endState = todolistsReducer(startState, changeTodolistTitleAC('1', 'js + react'))
  expect(endState[0].title).toBe('js + react')
});
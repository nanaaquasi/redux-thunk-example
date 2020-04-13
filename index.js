const redux = require('redux');
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;
const thunkMiddleware = require('redux-thunk').default;
const axios = require('axios');

// initial state(central)
const initialState = {
  loading: true,
  todos: [],
  error: '',
};

// ***ACTION TYPE CONSTANTS ***

const FETCH_TODOS_REQUEST = 'FETCH_TODOS_REQUEST',
  FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS',
  FETCH_TODOS_FAILURE = 'FETCH_TODOS_FAILURE';

// SYNCHRONUOUS ACTION CREATORS

const fetchTodosRequest = () => {
  return {
    type: FETCH_TODOS_REQUEST,
  };
};

const fetchTodosSuccess = (todos) => {
  return {
    type: FETCH_TODOS_SUCCESS,
    payload: todos,
  };
};

const fetchTodosFailure = (error) => {
  return {
    type: FETCH_TODOS_FAILURE,
    payload: error,
  };
};

// CREATE REDUCER
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TODOS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_TODOS_SUCCESS:
      return {
        ...state,
        loading: false,
        todos: action.payload,
      };

    case FETCH_TODOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

// CREATE ASYNC ACTION CREATOR WITH REDUX-THUNK MIDDLEWARE

const fetchTodos = () => {
  return (dispatch) => {
    dispatch(fetchTodosRequest());
    axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((response) => {
        const todos = response.data.map((todo) => todo.title);
        dispatch(fetchTodosSuccess(todos.splice(0, 5)));
      })
      .catch((error) => {
        dispatch(fetchTodosFailure(error.message));
      });
  };
};

// initialise store with thunk middleware

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// subscribe to store events
store.subscribe(() => {
  console.log(store.getState());
});

// dispatch async action

store.dispatch(fetchTodos());

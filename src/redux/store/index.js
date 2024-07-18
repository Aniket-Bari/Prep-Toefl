// import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from "../reducer/rootReducer";
// import ReduxThunk from "redux-thunk";

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: [ReduxThunk],
// });

// export { store };


import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducer/rootReducer';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export { store };

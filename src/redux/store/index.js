import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer/rootReducer";
import ReduxThunk from "redux-thunk";

const store = configureStore({
  reducer: rootReducer,
  middleware: [ReduxThunk],
});

export { store };

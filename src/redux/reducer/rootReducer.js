import { combineReducers } from 'redux';
import {QuestionReducer} from './QuestionReducer';
// import logoutReducer from './logoutReducer'; 
const rootReducer = combineReducers({
  questions: QuestionReducer,
  // logout: logoutReducer,
 
});

export default rootReducer;

import { ACTION_TYPE } from "../actions/Type";

const initialState = {
  loading: false,
  QuestionList: [],
};

export const QuestionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.GET_AllQUESTIONS_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTION_TYPE.GET_AllQUESTIONS_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        QuestionList: action.payload,
      };
    case ACTION_TYPE.GET_AllQUESTIONS_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

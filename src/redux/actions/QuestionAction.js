import axios from "axios";
import { Constants } from "../../utilities/ApiConstant";
import { ACTION_TYPE } from "./Type";

// Get question data
export const getAllQuestionsList =
  ({ dataList, header, onSuccess, onFailure }) =>
  async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_AllQUESTIONS_LIST_REQUEST });

    const formData = new FormData();
    formData.append("user_id", dataList?.user_id);
    // debugger
    formData.append("test_id", dataList?.test_id);
    // formData.append("section_type", dataList?.section_type);
    formData.append("test_type", dataList?.test_type);
    // formData.append("test_status", dataList?.test_status);
    // formData.append("part", dataList?.part);
    // formData.append("internet_speed", dataList?.internet_speed);
    try {
      await axios
        .post(Constants.apiBaseUrl + Constants.ApiAction.questions, formData, {
          headers: header,
        })
        .then((response) => {
          dispatch({
            type: ACTION_TYPE.GET_AllQUESTIONS_LIST_SUCCESS,
            payload: response.data,
            statusCode: response.statusCode,
          });
          onSuccess(response);
        });
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_AllQUESTIONS_LIST_FAILURE,
        error: error,
      });

      onFailure(error);
    }
  };

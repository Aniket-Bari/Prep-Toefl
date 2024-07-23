import React from 'react';
import Routing from './Routing';
import advancedTOEFLDatabase from './db';
import { useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  const navigation = useNavigate();
  const location = useLocation();

  let getURLQueryString = new URLSearchParams(window?.location?.search);
  let queryString = '';
  for (const entry of getURLQueryString.entries()) {
    queryString = entry[0];
  }

  let searchParams = new URLSearchParams(queryString);


  const handleClearLocalStorageData = () => {
    // console.log('hi',handleClearLocalStorageData);
    localStorage.clear();
    // advancedTOEFLDatabase.speakingTestAnswer.clear();
    // advancedTOEFLDatabase.writingTestAnswer.clear();
    advancedTOEFLDatabase.readingTestAnswer.clear();
    // advancedTOEFLDatabase.listeningTestAnswer.clear();
    // advancedTOEFLDatabase.speakingTestAnswer.clear();
    // advancedTOEFLDatabase.listeningTestQuestions.clear();
    advancedTOEFLDatabase.readingTestQuestion.clear();
    // advancedTOEFLDatabase.writingTestQuestions.clear();
    // advancedTOEFLDatabase.speakingTestQuestions.clear();
    // advancedTOEFLDatabase.customeTestQuestions.clear();
    // advancedTOEFLDatabase.customTestAnswer.clear();
  }

  React.useEffect(() => {
    if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
      handleClearLocalStorageData();
    }
    if (location?.pathname === "/toefl/" || location?.pathname === "/toefl") {
      localStorage.setItem("userInfo",
        JSON.stringify({
          id: searchParams.get("id"),
          test_type: searchParams.get("test_type"),
          user_id: searchParams.get("user_id"),
          api_token: searchParams.get("api_token"),
          test_token: searchParams.get("test_token")
        })
      )
      navigation('/toefl/genralTestInfo')
    }
  }, [])

  return (
    <Routing />
  );
}

export default App;

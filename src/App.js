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


  
  const handleClearLocalStorageData = () =>{
    localStorage.clear();
    advancedTOEFLDatabase.speakingTestAnswer.clear();
    advancedTOEFLDatabase.writingTestAnswer.clear();
    advancedTOEFLDatabase.readingTestAnswer.clear();
    advancedTOEFLDatabase.listeningTestAnswer.clear();
    advancedTOEFLDatabase.speakingTestAnswer.clear();
    advancedTOEFLDatabase.listeningTestQuestions.clear();
    advancedTOEFLDatabase.readingTestQuestions.clear();
    advancedTOEFLDatabase.writingTestQuestions.clear();
    advancedTOEFLDatabase.speakingTestQuestions.clear();
    advancedTOEFLDatabase.customeTestQuestions.clear();
    advancedTOEFLDatabase.customTestAnswer.clear();
  }

React.useEffect(()=>{
  if(performance.navigation.type !== performance.navigation.TYPE_RELOAD){
    handleClearLocalStorageData();
  }  
  if(location?.pathname === "/toefl/" || location?.pathname === "/toefl"){
    localStorage.setItem("userInfo",
      JSON.stringify({
        id:searchParams.get("id")
      })
    )

  }

    localStorage.clear();
    advancedTOEFLDatabase.readingTestQuestion.clear()
  
},[])

  return (
    <Routing />
  );
}

export default App;

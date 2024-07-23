import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import advancedTOEFLDatabase from './../../../db';
import { useDispatch } from 'react-redux';
import { getAllQuestionsList } from './../../../redux/actions/QuestionAction';
import debounce from 'lodash.debounce';
// import axios from 'axios';
let paragraphs = [];
let title = '';
let questions = [];

const Reading = () => {
  const getQuestionsReadingTestDataOfDB = useLiveQuery(
    () => advancedTOEFLDatabase.readingTestQuestion.toArray(),
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(parseInt(localStorage.getItem('currentIndex'), 10) || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(parseInt(localStorage.getItem('currentQuestionIndex'), 10) || -1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [questionData, setQuestionData] = React.useState([])
  const [handleStatusDb, setHandleStatusDb] = React.useState(true)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const currentTest = questionData[currentIndex];
  const [paragraph, setParagraph] = React.useState([])

  React.useEffect(() => {
    hello()


  }, [getQuestionsReadingTestDataOfDB]);


  const hello = async () => {
    if (await getQuestionsReadingTestDataOfDB && await getQuestionsReadingTestDataOfDB.length !== 0) {

      const data = await advancedTOEFLDatabase.readingTestQuestion.toArray()
      console.log(data);
      setQuestionData([...data[0]]);
    }
  }

  React.useEffect(() => {
    questionAPICalling("call_API")
  }, [getQuestionsReadingTestDataOfDB])

  React.useEffect(() => {
    localStorage.setItem('currentIndex', currentIndex);
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  }, [currentIndex, currentQuestionIndex]);

  React.useEffect(() => {
    if (questionData && questionData.length != 0 && currentIndex >= 0) {
      console.log(currentTest)
      let data = []
      if (currentTest?.paragraph) {
        data.push(currentTest?.paragraph)
      }
      if (data && data.length !== 0) {
        title = JSON.parse(data)?.title || '';
        paragraphs = JSON.parse(data)?.paragraphs || [];
        questions = JSON.parse(data)?.questions || [];
      }
    }
  }, [questionData, currentIndex])

  



  // const handlePrevious = () => {
  //   if (currentQuestionIndex > 0) {
  //     setCurrentQuestionIndex(currentQuestionIndex - 1);
  //   } else if (currentIndex > 0) {
  //     setCurrentIndex(currentIndex - 1);
  //     setCurrentQuestionIndex(getQuestionsReadingTestDataOfDB[currentIndex - 1].questions.length - 1);
  //   }
  // };

  

  // const debouncedSaveSelectedOptionsToDB = useCallback(debounce(async (updatedSelectedOptions) => {
  //   try {
  //     const answers = Object.keys(updatedSelectedOptions).map(questionIndex => ({
  //       testId: getQuestionsReadingTestDataOfDB[currentIndex].id,
  //       questionIndex: parseInt(questionIndex, 10),
  //       answer: updatedSelectedOptions[questionIndex],
  //     }));
  //     await advancedTOEFLDatabase.readingTestAnswer.Put(answers);
  //   } catch (error) {
  //     console.error('Error saving selected options to IndexedDB:', error);
  //   }
  // }, 500), [getQuestionsReadingTestDataOfDB, currentIndex]);

  // const handleOptionChange = (event, allowsMultipleSelection) => {
  //   const { value } = event.target;
  //   const updatedSelectedOptions = { ...selectedOptions };

  //   if (allowsMultipleSelection) {
  //     const currentSelectedOptions = selectedOptions[currentQuestionIndex] || [];
  //     if (currentSelectedOptions.includes(value)) {
  //       updatedSelectedOptions[currentQuestionIndex] = currentSelectedOptions.filter(option => option !== value);
  //     } else if (currentSelectedOptions.length < getMaxSelectionLimit(currentQuestionIndex)) {
  //       updatedSelectedOptions[currentQuestionIndex] = [...currentSelectedOptions, value];
  //     }
  //   } else {
  //     updatedSelectedOptions[currentQuestionIndex] = [value];
  //   }

  //   setSelectedOptions(updatedSelectedOptions);
  //   debouncedSaveSelectedOptionsToDB(updatedSelectedOptions);
  // };

  // const getMaxSelectionLimit = index => {
  //   if (index === 9) {
  //     return 3;
  //   } else if (index === 6) {
  //     return 2;
  //   } else {
  //     return 1;
  //   }
  // };

  // const calculateQuestionScore = (questionIndex, selectedOptions) => {
  //   if (!getQuestionsReadingTestDataOfDB || getQuestionsReadingTestDataOfDB.length === 0 || !questions[questionIndex] || !Array.isArray(questions[questionIndex].correct_answer)) {
  //     return 0;
  //   }

  //   const correctAnswer = questions[questionIndex].correct_answer;
  //   const selected = selectedOptions || [];

  //   const isCorrect = correctAnswer.every(option => selected.includes(option));

  //   return isCorrect ? 1.5 : 0;
  // };

  // const resetTest = () => {
  //   setCurrentIndex(0);
  //   setCurrentQuestionIndex(-1);
  //   setSelectedOptions({});
  //   setScore(0);
  //   // localStorage.clear();
  //   advancedTOEFLDatabase.readingTestAnswer.clear();
  //   debouncedSaveSelectedOptionsToDB({});
  // };





  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error}</p>;
  // }

  // if (!getQuestionsReadingTestDataOfDB || getQuestionsReadingTestDataOfDB.length === 0) {
  //   return <p>No tests available.</p>;
  // }

  // const test = advancedTOEFLDatabase.readingTestQuestion.toArray()
  // console.log(test)

  const fetchQuestions = () => {
    const dataList = {
      user_id: userInfo?.user_id,
      test_id: userInfo?.id,//change in future
      test_type: userInfo?.test_type,
    };
    // console.log(dataList)
    const header = {
      Accept: "application/json",
      "user-id": userInfo?.user_id,
      "api-token": userInfo?.api_token,
      "test_token": userInfo?.test_token,
    };

    dispatch(
      getAllQuestionsList({
        header,
        dataList,
        onSuccess: async (response) => {
          // console.log(response)
          if (response?.statusCode === 200 || response?.status === 200) {

            await advancedTOEFLDatabase.readingTestQuestion.add(response?.data?.data);


            // const parsedData = data.map(test => ({
            //   ...test,
            //   paragraph: Array.isArray(test.paragraph) ? test.paragraph : [test.paragraph],
            //   questions: Array.isArray(test.questions) ? test.questions : [test.questions],
            // }));
            // console.log(parsedData);
            // await saveTestsToDB(parsedData);
            // setLoading(false);
          } else if (response?.data?.statusCode === 599) {
            // console.log()
            setError("Some error occurred.");
            setLoading(false);
          }
        },
        onFailure: (error) => {
          console.log("hii", error);
          setError(error.message);
          setLoading(false);

        },
      })
    );
  }
  // // const saveTestsToDB = async (getQuestionsReadingTestDataOfDB) => {
  // //   console.log(getQuestionsReadingTestDataOfDB);
  // //   try {
  // //     await advancedTOEFLDatabase.readingTestQuestion.clear();
  // //     await advancedTOEFLDatabase.readingTestQuestion.add(getQuestionsReadingTestDataOfDB);
  // //   } catch (error) {
  // //     console.error('Error saving tests to IndexedDB:', error);
  // //   }
  // // };

  // const loadSelectedOptions = useCallback(async () => {
  //   if (!getQuestionsReadingTestDataOfDB || getQuestionsReadingTestDataOfDB.length === 0) return;

  //   try {
  //     const answers = await advancedTOEFLDatabase.readingTestAnswer.where({ testId: getQuestionsReadingTestDataOfDB[currentIndex]?.id }).toArray();
  //     const selectedOptionsMap = {};
  //     answers.forEach(answer => {
  //       selectedOptionsMap[answer.questionIndex] = answer.answer;
  //     });
  //     setSelectedOptions(selectedOptionsMap);
  //   } catch (error) {
  //     console.error('Error loading selected options from IndexedDB:', error);
  //   }
  // }, [currentIndex, getQuestionsReadingTestDataOfDB]);

  const highlightText = (text, wordsToHighlight) => {
    if (!text || !wordsToHighlight || wordsToHighlight.length === 0) return text;

    const highlightedText = text.map((paragraph, index) => {
      if (index === 0) {
        return paragraph;
      }
      let content = paragraph.content;
      wordsToHighlight.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        content = content.replace(regex, `<span class="highlight">$1</span>`);
      });
      return { ...paragraph, content };
    });

    return highlightedText;
  };

  // const highlightedParagraphs = highlightText(paragraphs, ['ingenuity', 'a competitive edge over its neighbors', 'The thriving obsidian operation,', 'In fact, artifacts and pottery from Teotihuacán have been discovered in sites as far away as the Mayan lowlands, the Guatemalan highlands, northern Mexico, and the Gulf Coast of Mexico.', 'Not a single pebble was found that might have indicated that the pebbles came from the nearby continent', 'scores', 'Thus, scientists had information about the shape of the domes but not about their chemical composition and origin.']);

  // const currentQuestion = questions[currentQuestionIndex] || {};
  // const allowsMultipleSelection = getMaxSelectionLimit(currentQuestionIndex) > 1;
  // const isLastQuestion = currentIndex === getQuestionsReadingTestDataOfDB.length - 1 && currentQuestionIndex === questions.length - 1;

  // const ShowHideContents = ({ paragraph }) => {
  //   const regex = /\{(.+?)\}/g;

  //   let matches = [];
  //   let match;

  //   while ((match = regex.exec(paragraph)) !== null) {
  //     matches.push(match[1]);
  //   }

  //   const [visibleContent, setVisibleContent] = useState(
  //     new Array(matches.length).fill(false)
  //   );

  //   const toggleVisibility = (index) => {
  //     const newVisibility = [...visibleContent];
  //     newVisibility[index] = !newVisibility[index];
  //     setVisibleContent(newVisibility);
  //   };

  //   return paragraph?.split(regex).map((part, index) => {
  //     if (index % 2 === 0) {
  //       return <span key={index}>{part}</span>;
  //     } else {
  //       const matchIndex = Math.floor(index / 2);
  //       return (
  //         <span key={index}>
  //           <button onClick={() => toggleVisibility(matchIndex)}>
  //             {visibleContent[matchIndex] ? "" : ""}
  //             {visibleContent[matchIndex] && <span>{matches[matchIndex]}</span>}
  //           </button>
  //         </span>
  //       );
  //     }
  //   });
  // };

  // component start
  const handleContinue = async () => {
    if (!getQuestionsReadingTestDataOfDB || getQuestionsReadingTestDataOfDB.length === 0) return;

    //   const selectedOptionsForCurrentQuestion = selectedOptions[currentQuestionIndex] || [];
    //   const questionScore = calculateQuestionScore(currentIndex, currentQuestionIndex, selectedOptionsForCurrentQuestion);

    //   setScore(prevScore => prevScore + questionScore);

    //   try {
    //     await advancedTOEFLDatabase.readingTestAnswer.add({
    //       testId: getQuestionsReadingTestDataOfDB[currentIndex].id,
    //       questionIndex: currentQuestionIndex,
    //       answer: selectedOptionsForCurrentQuestion,
    //     });
    //     // await axios.post('http://localhost:8000/api/Store', {
    //     //   testId: tests[currentIndex].id,
    //     //   questionIndex: currentQuestionIndex,
    //     //   answer: selectedOptionsForCurrentQuestion,
    //     //   score: questionScore,
    //     // });
    //   } catch (error) {
    //     console.error('Error saving answer to IndexedDB:', error);
    //   }

    //   // Navigate to the end of section or handle completion logic
    navigate('/toefl/end-of-section');
  };

  const handleNextOrSubmit = () => {

    console.log(getQuestionsReadingTestDataOfDB.length - 1, currentIndex, currentQuestionIndex, questions.length - 1)
    // if (currentIndex === getQuestionsReadingTestDataOfDB.length - 1 && currentQuestionIndex === questions.length - 1) {

    //   handleContinue();
    // } else {
    handleNext();
    // }
  };

  const handleSave = () => {

  }
  const questionAPICalling = (status) => {
    if (handleStatusDb) {
      if (
        getQuestionsReadingTestDataOfDB?.length === 0 &&
        status === "call_API"
      ) {
        // setLoaderStatus(true);
        fetchQuestions();
      } else if (
        getQuestionsReadingTestDataOfDB !== undefined &&
        getQuestionsReadingTestDataOfDB.length !== 0
      ) {

        // setLoaderStatus(true);
        // setQuestionData([...questionData]);


        // setLoaderStatus(false);


        // if (getAnswerReadingTestDataOfDB !== undefined) {
        //   setHandleStatusDb(false);
        // }
      }
    }
  }

  const handleExit = () => {
    // resetTest();
    navigate('/toefl/end-of-section');
  };

  const handleNext = () => {

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      debugger
    } else if (currentIndex < getQuestionsReadingTestDataOfDB.length - 1) {
      debugger
      setCurrentIndex(currentIndex + 1);
      setCurrentQuestionIndex(-1);
    }
  };

  return (
    // <>
    // </>
    <div className="only-para-type-wrap">
      <div className="head-bar">
        <span>Reading</span>
        {/* <button onClick={resetTest} className="reset-test-button">Restart Test</button> */}
        <button onClick={handleSave} className="save-test-button">Save</button>
        <button onClick={handleExit} className="exit-test-button">Exit</button>
      </div>
      <div className="content-wrapper" key={currentTest?.id}>
        <div className="paragraph-box">
          <div className="paragraph-content">
            <h4>{title}cdcdc</h4>
            {paragraphs?.map((paragraph, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: paragraph?.content }} />


            ))}
          </div>
        </div>
        {currentQuestionIndex >= 0 && (
          <div className="question-box">
            <div className="question-content">
              <div className="question-item">


                {/*currentQuestionIndex === 8 ?
                  <ShowHideContents paragraph={currentQuestion?.question} />
                  : */}
                <p>{questions}</p>
                <ul>
                  {/* {currentQuestion?.options?.map((option, oIndex) => (

                    <li key={oIndex}>
                      <label>
                        <input
                          type={allowsMultipleSelection ? 'checkbox' : 'radio'}
                          name={`question_${currentQuestionIndex}`}
                          value={option}
                          checked={selectedOptions[currentQuestionIndex]?.includes(option) || false}
                          onChange={e => handleOptionChange(e, allowsMultipleSelection)}
                        />
                        {option}
                      </label>
                    </li>
                  ))} */}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        {/* <button onClick={handlePrevious} disabled={currentIndex === 0 && currentQuestionIndex === 0}>Back</button> */}

        {/* {isLastQuestion ? (
          <button className="continue-button" onClick={handleContinue}>Submit</button>
        ) : (*/}
        <button onClick={handleNextOrSubmit}>Next</button>

      </div>
      <div className="score-display">Score: {score} / 30</div>
      <div>
        {score >= 24 ? "Advanced (24-30)" :
          score >= 18 ? "High-Intermediate (18-23)" :
            score >= 4 ? "Low-Intermediate (4-17)" :
              "Below Low-Intermediate (0-3)"}
      </div>
    </div>
  );
};

export default Reading;

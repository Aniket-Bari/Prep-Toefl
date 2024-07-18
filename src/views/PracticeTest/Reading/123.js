import React, { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import advancedTOEFLDatabase from './../../../db';
import { useDispatch } from 'react-redux';
import { getAllQuestionsList } from './../../../redux/actions/QuestionAction';
import debounce from 'lodash.debounce';
// import axios from 'axios';

const Reading = ({ apiEndpoint = 'http://127.0.0.1:8000/api/toefl/r_q' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(parseInt(localStorage.getItem('currentIndex'), 10) || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(parseInt(localStorage.getItem('currentQuestionIndex'), 10) || -1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);

  const tests = useLiveQuery(() => advancedTOEFLDatabase.readingTestQuestion.toArray(), []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(()=>{
    const fetchQuestions = () => {
      const dataList = {
        user_id: 1,
        test_id: 1,
        // section_type: "P",
        test_type: "M",
        // test_status: "E",
      };
      const header = {
        Accept: "application/json",
        "user-id": 1,
        "api-token": "xyz43jvtf",
      };
  
      dispatch(
        getAllQuestionsList({
          header,
          dataList,
          onSuccess: async (response) => {
            if (response?.data?.statusCode === 200) {
              const data = response.data.data;
              // console.log('Fetched data:', data);
  
              const parsedData = data.map(test => ({
                ...test,
                paragraph: Array.isArray(test.paragraph) ? test.paragraph : [test.paragraph],
                questions: Array.isArray(test.questions) ? test.questions : [test.questions],
              }));
  
              await saveTestsToDB(parsedData);
              setLoading(false);
            } else if (response?.data?.statusCode === 599) {
              // Handle other statuses if needed
            }
          },
          onFailure: (error) => {
            setError(error.message);
            setLoading(false);
          },
        })
      );
    }
    // fetchQuestions()
  // },[])
  // const fetchQuestions = useCallback(() => {
  //   const dataList = {
  //     user_id: 1,
  //     // test_id: 1,
  //     // section_type: "P",
  //     // test_type: "reading1",
  //     // test_status: "E",
  //   };
  //   const header = {
  //     Accept: "application/json",
  //     "user-id": 1,
  //     "api-token": "xyz43jvtf",
  //   };

  //   dispatch(
  //     getAllQuestionsList({
  //       header,
  //       dataList,
  //       onSuccess: async (response) => {
  //         if (response?.data?.statusCode === 200) {
  //           const data = response.data.data;
  //           // console.log('Fetched data:', data);

  //           const parsedData = data.map(test => ({
  //             ...test,
  //             paragraph: Array.isArray(test.paragraph) ? test.paragraph : [test.paragraph],
  //             questions: Array.isArray(test.questions) ? test.questions : [test.questions],
  //           }));

  //           await saveTestsToDB(parsedData);
  //           setLoading(false);
  //         } else if (response?.data?.statusCode === 599) {
  //           // Handle other statuses if needed
  //         }
  //       },
  //       onFailure: (error) => {
  //         setError(error.message);
  //         setLoading(false);
  //       },
  //     })
  //   );
  // }, [dispatch]);

  const saveTestsToDB = async (tests) => {
    try {
      await advancedTOEFLDatabase.readingTestQuestion.clear();
      await advancedTOEFLDatabase.readingTestQuestion.bulkAdd(tests);
    } catch (error) {
      console.error('Error saving tests to IndexedDB:', error);
    }
  };

  const loadSelectedOptions = useCallback(async () => {
    if (!tests || tests.length === 0) return;

    try {
      const answers = await advancedTOEFLDatabase.readingTestAnswer.where({ testId: tests[currentIndex]?.id }).toArray();
      const selectedOptionsMap = {};
      answers.forEach(answer => {
        selectedOptionsMap[answer.questionIndex] = answer.answer;
      });
      setSelectedOptions(selectedOptionsMap);
    } catch (error) {
      console.error('Error loading selected options from IndexedDB:', error);
    }
  }, [currentIndex, tests]);

  useEffect(() => {
    if (tests && tests.length === 0) {
      fetchQuestions();
    } else {
      setLoading(false);
      loadSelectedOptions();
    }
  }, [fetchQuestions, loadSelectedOptions, tests]);
// }, [ loadSelectedOptions, tests]);

  useEffect(() => {
    localStorage.setItem('currentIndex', currentIndex);
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  }, [currentIndex, currentQuestionIndex]);

  const handleNextOrSubmit = () => {
    if (currentIndex === tests.length - 1 && currentQuestionIndex === questions.length - 1) {
      handleContinue(); // Submit if it's the last question
    } else {
      handleNext(); // Move to the next question otherwise
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentIndex < tests.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuestionIndex(-1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentQuestionIndex(tests[currentIndex - 1].questions.length - 1);
    }
  };

  const handleContinue = async () => {
    if (!tests || tests.length === 0) return;

    const selectedOptionsForCurrentQuestion = selectedOptions[currentQuestionIndex] || [];
    const questionScore = calculateQuestionScore(currentIndex, currentQuestionIndex, selectedOptionsForCurrentQuestion);

    setScore(prevScore => prevScore + questionScore);

    try {
      await advancedTOEFLDatabase.readingTestAnswer.add({
        testId: tests[currentIndex].id,
        questionIndex: currentQuestionIndex,
        answer: selectedOptionsForCurrentQuestion,
      });
      // await axios.post('http://localhost:8000/api/Store', {
      //   testId: tests[currentIndex].id,
      //   questionIndex: currentQuestionIndex,
      //   answer: selectedOptionsForCurrentQuestion,
      //   score: questionScore,
      // });
    } catch (error) {
      console.error('Error saving answer to IndexedDB:', error);
    }

    // Navigate to the end of section or handle completion logic
    navigate('/end-of-section');
  };

  const debouncedSaveSelectedOptionsToDB = useCallback(debounce(async (updatedSelectedOptions) => {
    try {
      const answers = Object.keys(updatedSelectedOptions).map(questionIndex => ({
        testId: tests[currentIndex].id,
        questionIndex: parseInt(questionIndex, 10),
        answer: updatedSelectedOptions[questionIndex],
      }));
      await advancedTOEFLDatabase.readingTestAnswer.bulkPut(answers);
    } catch (error) {
      console.error('Error saving selected options to IndexedDB:', error);
    }
  }, 500), [tests, currentIndex]);

  const handleOptionChange = (event, allowsMultipleSelection) => {
    const { value } = event.target;
    const updatedSelectedOptions = { ...selectedOptions };

    if (allowsMultipleSelection) {
      const currentSelectedOptions = selectedOptions[currentQuestionIndex] || [];
      if (currentSelectedOptions.includes(value)) {
        updatedSelectedOptions[currentQuestionIndex] = currentSelectedOptions.filter(option => option !== value);
      } else if (currentSelectedOptions.length < getMaxSelectionLimit(currentQuestionIndex)) {
        updatedSelectedOptions[currentQuestionIndex] = [...currentSelectedOptions, value];
      }
    } else {
      updatedSelectedOptions[currentQuestionIndex] = [value];
    }

    setSelectedOptions(updatedSelectedOptions);
    debouncedSaveSelectedOptionsToDB(updatedSelectedOptions);
  };

  const getMaxSelectionLimit = index => {
    if (index === 9) {
      return 3;
    } else if (index === 6) {
      return 2;
    } else {
      return 1;
    }
  };

  const calculateQuestionScore = (questionIndex, selectedOptions) => {
    if (!tests || tests.length === 0 || !questions[questionIndex] || !Array.isArray(questions[questionIndex].correct_answer)) {
      return 0;
    }

    const correctAnswer = questions[questionIndex].correct_answer;
    const selected = selectedOptions || [];

    const isCorrect = correctAnswer.every(option => selected.includes(option));

    return isCorrect ? 1.5 : 0;
  };

  const resetTest = () => {
    setCurrentIndex(0);
    setCurrentQuestionIndex(-1);
    setSelectedOptions({});
    setScore(0);
    localStorage.removeItem('currentIndex');
    localStorage.removeItem('currentQuestionIndex');
    debouncedSaveSelectedOptionsToDB({});
  };

  const handleSave = () => {

  };

  const handleExit = () => {
    resetTest();
    navigate('/end-of-section');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!tests || tests.length === 0) {
    return <p>No tests available.</p>;
  }

  const currentTest = tests[currentIndex];
  let paragraphs = [];
  let title = '';
  let questions = [];

  try {
    // const parsedParagraph = JSON.parse(currentTest.paragraph);
    title = JSON.parse(currentTest.paragraph).title || '';
    paragraphs = JSON.parse(currentTest.paragraph).paragraphs || [];
    questions = JSON.parse(currentTest.questions).questions || [];
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }

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

  const highlightedParagraphs = highlightText(paragraphs, ['ingenuity', 'a competitive edge over its neighbors', 'The thriving obsidian operation,', 'In fact, artifacts and pottery from Teotihuacán have been discovered in sites as far away as the Mayan lowlands, the Guatemalan highlands, northern Mexico, and the Gulf Coast of Mexico.', 'Not a single pebble was found that might have indicated that the pebbles came from the nearby continent', 'scores', 'Thus, scientists had information about the shape of the domes but not about their chemical composition and origin.']);

  const currentQuestion = questions[currentQuestionIndex] || {};
  const allowsMultipleSelection = getMaxSelectionLimit(currentQuestionIndex) > 1;
  const isLastQuestion = currentIndex === tests.length - 1 && currentQuestionIndex === questions.length - 1;

  return (
    <div className="only-para-type-wrap">
      <div className="head-bar">
        <span>Reading</span>
        <button onClick={resetTest} className="reset-test-button">Restart Test</button>
        <button onClick={handleSave} className="save-test-button">Save</button>
        <button onClick={handleExit} className="exit-test-button">Exit</button>
      </div>
      <div className="content-wrapper" key={currentTest.id}>
        <div className="paragraph-box">
          <div className="paragraph-content">
            <h4>{title}</h4>
            {highlightedParagraphs.map((paragraph, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.content }} />
            ))}
          </div>
        </div>
        {currentQuestionIndex >= 0 && (
          <div className="question-box">
            <div className="question-content">
              <div className="question-item">
                <p>{currentQuestion?.question}</p>
                <ul>
                  {currentQuestion?.options?.map((option, oIndex) => (
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
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentIndex === 0 && currentQuestionIndex === 0}>Back</button>

        {isLastQuestion ? (
          <button className="continue-button" onClick={handleContinue}>Submit</button>
        ) : (
          <button onClick={handleNextOrSubmit}>Next</button>
        )}
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

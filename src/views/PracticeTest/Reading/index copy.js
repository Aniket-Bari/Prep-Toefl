import React, { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import advancedTOEFLDatabase from './../../../db';

const Reading = ({ apiEndpoint = 'http://127.0.0.1:8000/api/toefl/r_q' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [paragraphIndex, setParagraphIndex] = useState(0);

  const tests = useLiveQuery(() => advancedTOEFLDatabase.ReadingTestQuestion.toArray(), []);
  const navigate = useNavigate();

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);

      const parsedData = data.map(test => ({
        ...test,
        paragraph: Array.isArray(test.paragraph) ? test.paragraph : [test.paragraph],
        questions: Array.isArray(test.questions) ? test.questions : [test.questions],
      }));

      await saveTestsToDB(parsedData);
      setCorrectAnswers(parsedData.map(test => test.correctAnswers));
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [apiEndpoint]);

  const saveTestsToDB = async (tests) => {
    try {
      await advancedTOEFLDatabase.ReadingTestQuestion.clear();
      await advancedTOEFLDatabase.ReadingTestQuestion.bulkAdd(tests);
    } catch (error) {
      console.error('Error saving tests to IndexedDB:', error);
    }
  };

  const loadSelectedOptions = useCallback(async () => {
    if (!tests || tests.length === 0) return;

    try {
      const answers = await advancedTOEFLDatabase.ReadingTestAnswer.where({ testId: tests[currentIndex]?.id }).toArray();
      const currentAnswer = answers.find(correct_answer => correct_answer.questionIndex === currentQuestionIndex);
      setSelectedOptions(currentAnswer ? currentAnswer.answer : []);
    } catch (error) {
      console.error('Error loading selected options from IndexedDB:', error);
    }
  }, [currentIndex, currentQuestionIndex, tests]);

  useEffect(() => {
    if (tests && tests.length === 0) {
      fetchQuestions();
    } else {
      setLoading(false);
      loadSelectedOptions();
    }
  }, []);

  const handleNext = () => {
    console.log(questions.length,currentQuestionIndex)
    if (currentQuestionIndex === questions.length - 1) {
      setParagraphIndex(paragraphIndex + 1)
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptions([]);
    } else {
      if (currentIndex < tests.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestionIndex(0);
        setSelectedOptions([]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setCurrentQuestionIndex(questions.length - 1);
        setSelectedOptions([]);
      }
    }
  };

  const handleContinue = async () => {
    if (!tests || tests.length === 0) return;
    const currentTestCorrectAnswers = correctAnswers[currentIndex] || [];
    const currentQuestionCorrectAnswers = currentTestCorrectAnswers[currentQuestionIndex] || [];
    const isCorrect = currentQuestionCorrectAnswers.every(answer => selectedOptions.includes(answer));

    try {
      await advancedTOEFLDatabase.ReadingTestAnswer.add({
        testId: tests[currentIndex].id,
        answer: selectedOptions,
        isCorrect,
      });
    } catch (error) {
      console.error('Error saving answer to IndexedDB:', error);
    }

    navigate('/end-of-section');
  };

  const handleOptionChange = (event, allowsMultipleSelection) => {
    const { value } = event.target;

    setSelectedOptions(prevSelectedOptions => {
      if (allowsMultipleSelection) {
        if (prevSelectedOptions.includes(value)) {
          return prevSelectedOptions.filter(option => option !== value);
        } else if (prevSelectedOptions.length < getMaxSelectionLimit(currentQuestionIndex)) {
          return [...prevSelectedOptions, value];
        } else {
          return prevSelectedOptions;
        }
      } else {
        return [value];
      }
    });
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

  const clearResponse = () => {
    setSelectedOptions([]);
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
    title = JSON.parse(currentTest.paragraph).title || '';
    paragraphs = JSON.parse(currentTest.paragraph).paragraphs || [];
    questions = JSON.parse(currentTest.questions).questions || [];
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }

  if (paragraphs.length >= 2) {
    [paragraphs[0], paragraphs[1]] = [paragraphs[1], paragraphs[0]];
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allowsMultipleSelection = getMaxSelectionLimit(currentQuestionIndex) > 1;

  console.log(currentQuestion?.options, 'himanshi')
  return (
    <div className="only-para-type-wrap">
      <div className="head-bar">
        <span>Reading</span>
      </div>
      <div className="content-wrapper" key={currentTest.id}>
        <div className="paragraph-box">
          {/* {paragraphIndex >= 0 && ( */}
          <div className="paragraph-content">
            <h4>{title}</h4>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.content}</p>
            ))}
          </div>
          {/* )} */}
        </div>
        {currentQuestionIndex >= 0 && (
          <div className="question-box">
            <div className="question-content">
              <div className="question-item">
                <p>{currentQuestion.question}</p>
                <ul>
                  {currentQuestion?.options?.map((option, oIndex) => (
                    <li key={oIndex}>
                      <label>
                        <input
                          type={allowsMultipleSelection ? 'checkbox' : 'radio'}
                          name={`question_${currentQuestionIndex}`}
                          value={option}
                          checked={selectedOptions.includes(option)}
                          onChange={e => handleOptionChange(e, allowsMultipleSelection)}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
                <button className="clear-response-button" onClick={clearResponse}>
                  Clear Response
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentIndex === 0 && currentQuestionIndex === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={currentIndex === tests.length - 1 && currentQuestionIndex === (currentTest.questions || []).length - 1}>
          Next
        </button>
        <button className="continue-button" onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

export default Reading;

import React, { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import advancedTOEFLDatabase from './../../../db';

const Reading = ({ apiEndpoint = 'http://127.0.0.1:8000/api/toefl/r_q' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(parseInt(localStorage.getItem('currentIndex'), 10) || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(parseInt(localStorage.getItem('currentQuestionIndex'), 10) || -1);
  const [selectedOptions, setSelectedOptions] = useState(JSON.parse(localStorage.getItem('selectedOptions')) || []);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [score, setScore] = useState(0); // State to hold the score

  const tests = useLiveQuery(() => advancedTOEFLDatabase.readingTestQuestion.toArray(), []);
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
      const currentAnswer = answers.find(answer => answer.questionIndex === currentQuestionIndex);
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
  }, [fetchQuestions, loadSelectedOptions, tests]);

  useEffect(() => {
    localStorage.setItem('currentIndex', currentIndex);
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
  }, [currentIndex, currentQuestionIndex, selectedOptions]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentIndex < tests.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuestionIndex(0);
    }

    setSelectedOptions([]);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentQuestionIndex(tests[currentIndex - 1].questions.length - 1);
    }

    setSelectedOptions([]);
  };

  const handleContinue = async () => {
    if (!tests || tests.length === 0) return;
    const currentTestCorrectAnswers = correctAnswers[currentIndex] || [];
    const currentQuestionCorrectAnswers = currentTestCorrectAnswers[currentQuestionIndex] || [];
    const isCorrect = currentQuestionCorrectAnswers.every(answer => selectedOptions.includes(answer));

    // Calculate score
    let questionScore = 0;
    if (isCorrect && selectedOptions.length === currentQuestionCorrectAnswers.length) {
      questionScore = 30; // All correct, give 30 marks
    } else {
      const correctQuestions = tests.reduce((count, test, index) => {
        const correctAnswers = test.correctAnswers[index] || [];
        const selected = selectedOptions[index] || [];
        return count + (correctAnswers.every(answer => selected.includes(answer)) ? 1 : 0);
      }, 0);
      questionScore = (correctQuestions / tests.length) * 30; // Calculate based on percentage of correct questions
    }

    setScore(prevScore => prevScore + questionScore);

    try {
      await advancedTOEFLDatabase.readingTestAnswer.add({
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

  const resetTest = () => {
    setCurrentIndex(0);
    setCurrentQuestionIndex(-1);
    setSelectedOptions([]);
    setScore(0); // Reset score
    localStorage.removeItem('currentIndex');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('selectedOptions');
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
    const parsedParagraph = JSON.parse(currentTest.paragraph);
    title = parsedParagraph.title || '';
    paragraphs = parsedParagraph.paragraphs || [];
    questions = JSON.parse(currentTest.questions).questions || [];
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }

  const currentQuestion = questions[currentQuestionIndex] || {};
  const allowsMultipleSelection = getMaxSelectionLimit(currentQuestionIndex) > 1;

  return (
    <div className="only-para-type-wrap">
      <div className="head-bar">
        <span>Reading</span>
        <button onClick={resetTest} className="reset-test-button">Restart Test</button>
      </div>
      <div className="content-wrapper" key={currentTest.id}>
        <div className="paragraph-box">
          <div className="paragraph-content">
            <h4>{title}</h4>
            {paragraphs.map((paragraph, index) => (
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
        <button
          onClick={handleNext}
          disabled={currentIndex === tests.length - 1 && currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
        <button className="continue-button" onClick={handleContinue}>
          Continue
        </button>
      </div>
      <div className="score-display">
        Score: {score.toFixed(2)} / 30
      </div>
    </div>
  );
};

export default Reading;

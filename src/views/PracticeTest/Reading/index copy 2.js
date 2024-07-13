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

  const tests = useLiveQuery(() => advancedTOEFLDatabase.ReadingTestQuestion.toArray(), []);
  const navigate = useNavigate();

  // const fetchParagraphData = async (testId) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('testId', testId);
  //     const response = await fetch('http://127.0.0.1:8000/api/r_q', {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     console.log('Fetched Paragraph Data:', data);
  //   } catch (error) {
  //     console.error('Error fetching paragraph data:', error);
  //   }
  // };

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
  }, [fetchQuestions, loadSelectedOptions, tests]);

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
    const parsedParagraph = JSON.parse(currentTest.paragraph);
    title = parsedParagraph.title || '';
    paragraphs = parsedParagraph.paragraphs || [];
    questions = JSON.parse(currentTest.questions).questions || [];
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }

  const currentQuestion = questions[currentQuestionIndex] || {};
  const allowsMultipleSelection = getMaxSelectionLimit(currentQuestionIndex) > 1;

  // const highlightText = (text, wordsToHighlight) => {
  //   if (!text || !wordsToHighlight || wordsToHighlight.length === 0) return text;
  
  //   const highlightedText = text.map((paragraph, index) => {
  //     if (index === 0) {
  //       return paragraph; // Skip highlighting for the first paragraph
  //     }
  //     let content = paragraph.content;
  //     wordsToHighlight.forEach(word => {
  //       const regex = new RegExp(`\\b(${word})\\b`, 'gi');
  //       content = content.replace(regex, `<span class="highlight">$1</span>`);
  //     });
  //     return { ...paragraph, content };
  //   });
  
  //   return highlightedText;
  // };
  
  
  // const highlightedParagraphs = highlightText(paragraphs, ['ingenuity', 'a competitive edge over its neighbors', 'The thriving obsidian operation,', 'In fact, artifacts and pottery from Teotihuacán have been discovered in sites as far away as the Mayan lowlands, the Guatemalan highlands, northern Mexico, and the Gulf Coast of Mexico.', 'Not a single pebble was found that might have indicated that the pebbles came from the nearby continent', 'scores', 'Thus, scientists had information about the shape of the domes but not about their chemical composition and origin.']); 

  return (
    <div className="only-para-type-wrap">
      <div className="head-bar">
        <span>Reading</span>
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
    </div>
  );
};

export default Reading;

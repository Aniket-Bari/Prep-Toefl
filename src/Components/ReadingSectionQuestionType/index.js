import React ,{ useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Reading from './../../../PracticeTest';

const ReadingSectionQuestionType = () => {

  const dispatch = useDispatch();
  const [currentIndex] = useState(parseInt(localStorage.getItem('currentIndex'), 10) || 0);
  const [currentQuestionIndex] = useState(parseInt(localStorage.getItem('currentQuestionIndex'), 10) || -1);

  const fetchQuestions = useCallback(() => {
    const dataList = {
      user_id: 1,
      test_id: 1,
      section_type: "P",
      test_type: "reading1",
      test_status: "E",
    };
    const header = {
      Accept: "application/json",
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
  }, [dispatch]);

  useEffect(() => {
    if (tests && tests.length === 0) {
      fetchQuestions();
    } else {
      loadSelectedOptions();
    }
  }, [fetchQuestions, loadSelectedOptions, tests]);

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

  const currentQuestion = questions[currentQuestionIndex] || {};

  return (
    <div>
      <Reading apiEndpoint="http://127.0.0.1:8000/api/toefl/r_q" />
      <div className="content-wrapper" key={currentTest.id}>
        <div className="paragraph-box">
          <div className="paragraph-content">
            <h4>{title}</h4>
            {paragraphs.map((paragraph, index) => (
              <p key={index} />
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
    </div>
  );
};

export default ReadingSectionQuestionType;

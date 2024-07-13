import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { getAllQuestionsList } from '../../../redux/actions/QuestionAction';
import './style.scss';

const Listening = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { tests, loading } = useSelector((state) => state.questions || {});

  useEffect(() => {
    fetchQuestions();
  }, [dispatch]);

  const fetchQuestions = () => {
    const requestData = {
      dataList: {
        user_id: '1',
        test_id: '1',
        section_type: 'listening',
        test_type: 'listening1',
        test_status: 'enable',
      },
      header: { 'Content-Type': 'application/json' },
      onSuccess: (response) => console.log('Success:', response),
      onFailure: (error) => console.log('Error:', error),
    };

    dispatch(getAllQuestionsList(requestData));
  };

  const handleContinue = () => {
    navigate('/put-on-headset'); 
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // if (error) {
  //   return <p>Error: {error.message || error}</p>;
  // }

  return (
    <div className="listening-main">
  <h1>Listening Section</h1>
  {tests && tests.length > 0 ? (
    tests.map((test) => (
      <div key={test.id}>
        <h2>{test.test_name}</h2>
        <p>{test.description}</p>
      </div>
    ))
  ) : (
    <p>No tests available</p>
  )}

  <div>
    <button onClick={handleContinue}>Continue</button>
  </div>
</div>

  );
};

export default Listening;

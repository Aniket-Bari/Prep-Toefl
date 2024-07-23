import React from 'react';
import { Link } from 'react-router-dom';
import "./style.scss";
import Header from '../../../Components/Header'

const GeneralTestInfo = () => {
  return (
    <>
      {/* <Header /> */}
      <div className='general-guidance-main'>
        <div className='general-main-heading'>
          <h4>General Test Information</h4>
        </div>
        <div className='general-description-main'>
          <p>
            This free practice test will familiarize you with most of the question types found on the TOEFL iBT® test. Please note that this test is not a simulation of the® test. You will not receive scores and your answers will not be saved.
          </p>
          <ul>
            <li>
              In the <b>Reading</b> section, you will answer questions about /toefl/reading passages. Unlike the actual test, you will be able to review the correct answer for each question by selecting “Show Answer”. You may also check your answers on the Review Screen which will appear at the end of the section. In the actual test, the Reading review screen will only show you which questions you have answered.
            </li>
            <li>
              In the <b>Listening</b> section, you will answer questions about conversations and lectures. Unlike the actual test, you will be able to review the correct answer for each question by selecting “Show Answer”. You may also check your answers on the Review Screen which will appear at the end of the section. In the actual test, there is no review screen in the Listening section.
            </li>
            <li>
              In the <b>Speaking</b> section, you will be presented with four questions that ask you to speak about a familiar topic and about a passage you have read and/or a lecture you have heard. In this practice test, you will not record your responses. Instead, you will hear sample responses to the four questions.
            </li>
            <li>
              In the <b>Writing</b> section, you will see two types of writing tasks. The first task asks you to write about the relationship between a passage you have read and a lecture you have heard. The second writing task will ask you to write your opinion about a topic or issue. In this practice test, you will not write your responses. Instead, you will see sample responses for each task.
            </li>
          </ul>
          <h3>Click <Link to="/toefl/reading-direction">Continue</Link> to go on.</h3>
        </div>
      </div>
    </>
  );
};

export default GeneralTestInfo;

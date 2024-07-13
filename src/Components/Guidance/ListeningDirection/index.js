import React, { useEffect, useRef,useState } from 'react';
import './style.scss'
import blueheadset from "../../../assets/Images/blueheadsetsmall_blue_headset.webp";
import listeningDirection from "../../../assets/Audio/ttsMP3.com_VoiceText_2023-8-10_17_23_26.mp3"
import { useVolume } from '../../../context/VolumeContext';


const ListeningDirection = (props) => {

  const [getlocalVolume, setGetlocalVolume] = useState(
    Number(localStorage.getItem('volume')) || 100
  );
  
  const [updateVolume, setUpdateVolume] = useState(getlocalVolume);
  const { volume } = useVolume();
  const [audioCompleted, setAudioCompleted] = useState(false);

  useEffect(() => {
    const audioElement = document.getElementById("audio-player");
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
    localStorage.setItem("volume", updateVolume);
  }, [volume]);

  useEffect(() => {
    const audioElement = document.getElementById("audio-player");

    const handleAudioEnded = () => {
      setAudioCompleted(true); // Set audioCompleted to true when audio ends
      // Navigate to the next page when audio ends
      // navigate("/WritingQuestionPara");
    };

    audioElement.addEventListener("ended", handleAudioEnded);

    return () => {
      audioElement.removeEventListener("ended", handleAudioEnded);
    };
  }, [props, updateVolume]);

  // const utteranceRef = useRef(null);

  // useEffect(() => {
  //   const speakDirections = () => {
  //     const speechText = [
  //       'This section measures your ability to understand conversations and lectures in English.',
  //       'The Listening section is divided into 2 separately timed parts. In each part, you will listen to 1 conversation and 2 lectures. You will hear each conversation or lecture only one time.',
  //       'After each conversation or lecture, you will answer some questions about it. The questions typically ask about the main idea and supporting details. Some questions ask about a speaker’s purpose or attitude. Answer the questions based on what is stated or implied by the speakers.',
  //       'You may take notes while you listen. You may use your notes to help you answer the questions. Your notes will not be scored.',
  //       'In some questions, you will see this icon.',
  //       'This means that you will hear, but not see, part of the question.',
  //       'Some of the questions have special directions. These directions appear in a gray box on the screen.',
  //       'Most questions are worth 1 point. If a question is worth more than 1 point, it will have special directions that indicate how many points you can receive.',
  //       'You must answer each question. After you answer, click on Next. Then click on OK to confirm your answer and go on to the next question. After you click OK, you cannot return to previous questions.',
  //       'A clock at the top of the screen will show you how much time is remaining. The clock will not count down while you are listening. The clock will count down only while you are answering the questions.',
  //       'Click on Continue at any time to dismiss these directions.'
  //     ];

  //     const speechSynthesis = window.speechSynthesis;

  //     speechText.forEach((text, index) => {
  //       const utterance = new SpeechSynthesisUtterance(text);
  //       if (index === speechText.length - 1) {
  //         utterance.onend = handleSpeechEnd;
  //       }
  //       // speechSynthesis.speak(utterance);
  //       utteranceRef.current = utterance;
  //     });
  //   };

  //   const handleSpeechEnd = () => {
  //     // Speech ended, do something here
  //     console.log('Speech ended');
  //   };

  //   speakDirections();

  //   return () => {
  //     // Cleanup: Cancel speech when component unmounts
  //     cancelSpeech();
  //   };
  // }, []);

  // const cancelSpeech = () => {
  //   if (utteranceRef.current) {
  //     window.speechSynthesis.cancel();
  //     utteranceRef.current = null;
  //   }
  // };

  return (
    <div className="listening-direction-main">
      <div className="reading-main-heading">
        <h4>Listening Section Directions</h4>
      </div>
      <div className="reading-description-main">
        <p>This section measures your ability to understand conversations and lectures in English.</p>
        <p>The Listening section is divided into 2 separately timed parts. In each part you will listen to 1 conversation and 2 lectures. You will hear each conversation or lecture only <b>one</b> time.</p>
        <p>After each conversation or lecture, you will answer some questions about it. The questions typically ask about the main idea and supporting details. Some questions ask about a speakers purpose or attitude. Answer the questions based on what is stated or implied by the speakers.</p>
        <p>You may take notes while you listen. You may use your notes to help you answer the questions. Your notes will not be scored.</p>
        <p>In some questions, you will see this icon: <img src={blueheadset} alt="headset" /> This means that you will hear, but not see, part of the question.</p>
        <p>Some of the questions have special directions. These directions appear in a gray box on the screen.</p>
        <p>Most questions are worth 1 point. If a question is worth more than 1 point, it will have special directions that indicate how many points you can receive.</p>
        <p>You must answer each question. After you answer, click on <b>Next.</b> Then click on <b>OK</b> to confirm your answer and go on to the next question. After you click <b>OK, </b>you cannot return to previous questions.</p>
        <p>A clock at the top of the screen will show you how much time is remaining. The clock will not count down while you are listening. The clock will count down only while you are answering the questions.</p>
        <p className="center">Click on <b>Continue </b>at any time to dismiss these directions.</p>
      </div>
      <audio id='audio-player'controls autoPlay>
        <source
          src={listeningDirection}
          type="audio/mp3"
        />
      </audio>
    </div>
  );
};

export default ListeningDirection;

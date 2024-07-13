import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SpeakingVoice from "../../../assets/Audio/speakingdirection.mp3";
import { useVolume } from '../../../context/VolumeContext';
import './style.scss';

const SpeakingDirection = (props) => {
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

    return (
        <div className='speaking-guidance-main'>
            <div className='reading-main-heading'>
                <h4>Speaking Section Directions</h4>
            </div>
            <div className='speaking-description-main'>
                <div>
                    <p>
                        This section measures your ability to speak and communicate effectively.
                    </p>
                </div>
                <div>
                    <p>You will be presented with three tasks. For each task, you will provide a series of responses. </p>
                    <p>In the actual test, you will have a short amount of time for each response and the clock will show you how much time is remaining. Additionally, you will not have time to prepare your responses (Note: We do not recommend taking notes in this section). When your time for each response is over, you will be moved to the next task and will not be able to go back.  </p>
                </div>
                <div className='para-points'>
                    <p>In this practice test, you can:   </p>
                    <p>• use<b> back </b>and <b> next </b>button </p>
                    <p>• use the<b> play </b>button to start playing audio files. </p>
                    <p>• listen to sample responses and read comments about them (<b>Play Sample Response</b> buttons will appear automatically after the audio of a part or question is played)  </p>
                </div>
                <p>Select <Link to="/speaking">Continue</Link> to go on. </p>
            </div>
            <audio id='audio-player'  controls autoPlay>
                <source
                    src={SpeakingVoice}
                    type="audio/mp3"
                />
            </audio>
        </div>
    );
}

export default SpeakingDirection;

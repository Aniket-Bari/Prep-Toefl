import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import writingvoice from "../../../assets/Audio/writingvoice.mp3";
import { useVolume } from '../../../context/VolumeContext';
import './style.scss';

const WritingDirection = () => {
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
    }, [updateVolume]);

    return (
        <div className='reading-guidance-main'>
            <div className='reading-main-heading'>
                <h4>Writing Section Directions</h4>
            </div>
            <div className='reading-description-main'>
                <div>
                    <p>
                        This section measures your ability to use written English. It is divided into separately timed parts.
                    </p>
                    <p>
                        In the first part of the writing section, you will move words and phrases into blanks so that they form grammatical sentences.
                    </p>
                    <p>
                        In the second part, you will write in response to a variety of different situations. You may take notes and use your notes to help you answer the questions. Your notes will not be scored.
                    </p>
                </div>
                <p>Select <Link to="/writing">Continue</Link> to go on.</p>
            </div>
            <audio id='audio-player' controls autoPlay>
                <source
                    src={writingvoice}
                    type="audio/mp3"
                />
            </audio>
        </div>
    );
}

export default WritingDirection;

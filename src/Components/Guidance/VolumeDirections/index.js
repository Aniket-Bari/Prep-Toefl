import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './style.scss';
import volumeDirect from "../../../assets/Audio/volume.mp3";
import { useVolume } from "../../../context/VolumeContext";

const VolumeDirections = (props) => {
  const { volume } = useVolume();

  useEffect(() => {
    const audioElement = document.getElementById("audio-player");

    const handleAudioEnded = () => {
      // Handle completion logic if needed
    };

    audioElement.addEventListener("ended", handleAudioEnded);

    return () => {
      audioElement.removeEventListener("ended", handleAudioEnded);
    };
  }, []);

  return (
    <div className="volume-direction-main">
      <div className="/toefl/reading-main-heading">
        <h4>Changing the Volume</h4>
      </div>
      <div className="speaking-description-main">
        <div>
          <p>
            To change the volume, click on the <strong>Volume</strong> icon at the top of the screen. The volume control will
            appear. Move the volume indicator to the left or to the right to change the volume.
          </p>
        </div>
        <div>
          <p>To close the volume control, click on the Volume icon again.</p>
        </div>
        <div>
          <p>You will be able to change the volume during the test if you need to.</p>
        </div>
        <div>
          <p>You may now change the volume.</p>
        </div>
        <div>
          <p>When you are finished, click on <Link to="/listening">Continue</Link>.</p>
          <audio id="audio-player" controls autoPlay>
            <source src={volumeDirect} type="audio/mp3" />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default VolumeDirections;

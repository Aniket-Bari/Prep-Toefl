import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';

import "./style.scss"
import Header from '../../components/Header';
import ReadingDirection from "../../Components/Guidance/ReadingDirection"
import GeneralTestInfo from "../../Components/Guidance/GeneralTestInfo"
import EndOfSection from "../../Components/Guidance/EndOfSection"
import SpeakingDirection from "../../Components/Guidance/SpeakingDirection"
import ListeningDirection from "../../Components/Guidance/ListeningDirection"
import WritingDirection from "../../Components/Guidance/WritingDirection"
import PutOnHeadset from "../../Components/Guidance/PutOnHeadset"
import VolumeDirections from "../../Components/Guidance/VolumeDirections";
import Reading from "../PracticeTest/Reading";

const MainTest = () => {
  const [page, setPage] = React.useState(0);
  const [updateVolume, setUpdateVolume] = React.useState(100);

  const location = useLocation();
  const showPageNumber = location.pathname !== '/PageExpire';

  useEffect(() => {
    if (location?.state?.page) {
      console.log(location?.state?.page);
      setPage(location?.state?.page);
    }
  }, [])


  return (
    <div className="main-layout">
      {/* header */}

      <Header setPage={setPage} page={page} updateVolume={updateVolume} showPageNumber={showPageNumber} setUpdateVolume={setUpdateVolume} />

      {/* main content */}

      {page === 0 && <GeneralTestInfo />}
      {page === 1 && <ReadingDirection />}
      {page === 2 && <Reading />}
      {page === 8 && <EndOfSection heading="EXIT READING SECTION" />}

      {page === 10 && <VolumeDirections updateVolume={updateVolume}/>}
      {page === 11 && <ListeningDirection />}
     
      {page === 13 && <EndOfSection heading="EXIT LISTENING SECTION" />}
      {page === 14 && <PutOnHeadset />}
      
      {page === 16 && <SpeakingDirection  />}
    
      {page === 18 && <EndOfSection heading="EXIT SPEAKING SECTION" />}
      {page === 19 && <WritingDirection />}
     
      {page === 25 && <EndOfSection heading="EXIT WRITING SECTION" />}

    </div>
  );
}

export default MainTest;

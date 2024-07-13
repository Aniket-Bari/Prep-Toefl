import React from 'react';
import headset from "../../../assets/Images/headset.webp";
import { Link } from 'react-router-dom'; // Import useNavigate
import "./style.scss";

const PutOnHeadset = () => {

    return (
        <div className="putonheadset-img">
            <div>
                <p>Now put on your headset</p>
                <img src={headset} alt="headset" />
                <p>Click on <Link to="/speaking-direction">Continue</Link> to go on.</p>
            </div>
        </div>
    );
};

export default PutOnHeadset;

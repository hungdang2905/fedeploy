import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import play_icon from '../Background/play_icon.png';
import pause_icon from '../Background/pause_icon.png';
import {useState} from "react";

const Hero = ({ heroData, setHeroCount, heroCount, setPlayStatus, playStatus }) => {
    const [showContent, setShowContent] = useState(true);
    const textStyle = {
        color: '#fff',
        fontSize: '80px',
        fontWeight: '500',
        lineHeight: '120px',
    };
    const dotStyle = {
        width: '15px', // Increase the width
        height: '10px', // Increase the height
        borderRadius: '50%', // Make it circular
        display: 'inline-block',
        margin: '5px',
        cursor: 'pointer',
        backgroundColor: 'gray', // Default color
    };

    const activeDotStyle = {
        ...dotStyle,
        backgroundColor: 'white', // Active color
    };

    return (
        <div className="hero" style={{
            margin:'-470px 119px 0px',
        }}>
            {/*{showContent && ( // Render content only if showContent is true*/}
                <div>
                    <div className="hero-text" style={{
                        color: '#fff',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                        WebkitTextStroke: '1px black'
                    }}>
                        <p style={textStyle}>{heroData.text1}</p>
                        <p style={textStyle}>{heroData.text2}</p>
                    </div>
                    <div className="hero-explore" style={{
                        display:'flex',
                        alignItems:'center',
                        gap:'50px',
                        width:'fit-content',
                        padding:'5px 8px',
                        cursor:'pointer',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }}>
                        <button type="button" className="btn btn-secondary">Chuyển trang tự động<span><ArrowCircleRightIcon/></span></button>
                    </div>
                </div>
            {/*)}*/}
            <div className="hero-dot-play" style={{ marginTop:'120px', display:'flex', justifyContent: 'space-between'}}>
                <ul className="hero-dots" style={{ display:'flex', alignItems:'center'}}>
                    <li
                        onClick={() => setHeroCount(0)}
                        style={heroCount === 0 ? activeDotStyle : dotStyle}
                    ></li>
                    <li
                        onClick={() => setHeroCount(1)}
                        style={heroCount === 1 ? activeDotStyle : dotStyle}
                    ></li>
                    <li
                        onClick={() => setHeroCount(2)}
                        style={heroCount === 2 ? activeDotStyle : dotStyle}
                    ></li>
                </ul>
                <div style={{position: 'relative'}}>
                    <img
                        style={{
                            position:'absolute',
                            top:'-80px'
                        }}
                        onClick={() => {
                        setPlayStatus(!playStatus);
                        // setShowContent(!showContent); // Toggle showContent value
                    }} src={playStatus ? pause_icon : play_icon} />
                    <p>Xem giới thiệu</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
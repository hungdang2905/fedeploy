import video1 from './video1.mp4'
import image1 from './img3.jpg';
import image2 from './img4.jpg';
import image3 from './img5.jpg';

const backgroundStyle = {
    height: 'auto',
    width: '1150px',
    display: 'block',
    margin: 'auto',
    top: 0,
    left: 0,
    objectFit: 'cover'
};
const Background = ({playStatus, heroCount})=>{
    if(playStatus){
        return(
            <video style={backgroundStyle} controls>
                <source src={video1} type='video/mp4'/>
            </video>
        )
    }
    else if(heroCount == 0){
        return(
            <img src={image1} style={backgroundStyle} alt=""/>
        )
    }
    else if(heroCount == 1){
        return(
            <img src={image2} style={backgroundStyle} alt=""/>
        )
    }
    else if(heroCount == 2){
        return(
            <img src={image3} style={backgroundStyle} alt=""/>
        )
    }
}

export default Background;
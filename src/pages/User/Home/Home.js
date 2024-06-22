import ListProductCategory from "./ListProductCategory";
import {useEffect, useState} from "react";
import axios from "axios";
import RootPathApi from "../../../route/RootPathApi";
import Background from "../../../component/User/Background/Background";
import Hero from "../../../component/User/Hero/Hero";


function Home() {
    const heroData = [
        {text1: "Laptop", text2: "ở đâu?"},
        {text1: "Thì rẻ", text2: "Mà lại bềnh"},
        {text1: "Hãy đến với", text2: "Chúng tôi"}
    ]
    const [categorys, setCategorys] = useState([]);
    const baseUrl = RootPathApi()
    const [heroCount, setHeroCount] = useState(0);
    const [playStatus, setPlayStatus] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {

            try {
                const res = await axios.get(`${baseUrl}/api/v1/category/all`)
                setCategorys(res.data)
            } catch
                (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchCategory()

    }, []);
    console.log(categorys)
    useEffect(() => {
        const interval = setInterval(() => {
            setHeroCount((prevCount) => (prevCount + 1) % heroData.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [heroData.length]);

    return (
        <div className="wrapper">
            <div className="big-banner mt-100 pb-85 mt-sm-60 pb-sm-45">
                <div className="container banner-2">
                    <div className="banner-box">
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/sale-laptop.jpg" width={"266px"} height={"158px"}
                                             alt="banner 3"/></a>
                        </div>
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/sale-2.jpg" width={"266px"} height={"172px"}
                                             alt="banner 3"/></a>

                        </div>
                    </div>
                    <div className="banner-box">
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/banner3-3.jpg" alt="banner 3"
                                             height={"342px"}/></a>
                        </div>
                    </div>
                    <div className="banner-box">
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/sale-3.jpg" width={"266px"} height={"172px"}
                                             alt="banner 3"/></a>
                        </div>
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/sale-4.avif" width={"266px"} height={"160px"}
                                             alt="banner 3"/></a>
                        </div>
                    </div>
                    <div className="banner-box">
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/sale-5.avif" width={"148px"} height={"344px"}
                                             alt="banner 3"/></a>
                        </div>
                    </div>
                    <div className="banner-box">
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/sale-6.webp" width={"266px"} height={"160px"}
                                             alt="banner 3"/></a>
                        </div>
                        <div className="col-img">
                            <a href="#"><img src="/assets/img/banner/sale-7.jpg" width={"266px"} height={"170px"}
                                             alt="banner 3"/></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="arrivals-product pb-85 pb-sm-45">
                <div className="container">
                    <div className="main-product-tab-area">
                        {categorys.map(category => (
                            <ListProductCategory value={category}/>
                        ))}
                    </div>
                </div>
            </div>
            <div className="second-arrivals-product pb-45 pb-sm-5">
                <div className="container">
                    <div className="main-product-tab-area">
                        <Background playStatus={playStatus} heroCount={heroCount}/>
                        <Hero
                            setPlayStatus={setPlayStatus}
                            heroData={heroData[heroCount]}
                            heroCount={heroCount}
                            setHeroCount={setHeroCount}
                            playStatus={playStatus}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home;
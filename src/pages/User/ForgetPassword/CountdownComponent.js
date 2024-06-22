import React, { useState, useEffect } from 'react';
const CountdownComponent = () => {
    const [timeLeft, setTimeLeft] = useState(600); // 300 giây = 5 phút

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="text-center">
            <h2 className="fs-6 fw-normal text-center text-secondary m-0 px-md-5">
                Vui lòng nhập mã xác nhận trong email của bạn.
            </h2>
            <p className="text-center mt-3 fs-5">
                Mã xác nhận của bạn sẽ hết sau  <span className="fw-bold text-primary"> {formatTime(timeLeft)} </span> .
            </p>
        </div>
    );
};

export default CountdownComponent;
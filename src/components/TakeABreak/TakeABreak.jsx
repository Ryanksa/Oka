import React, { useRef } from 'react';
import './TakeABreak.scss'

export default function TakeABreak() {
    const splashRef = useRef();

    const onClickOnsen = (e) => {
        if (splashRef.current) {
            splashRef.current.classList.remove("active");
            const onsen = e.target.getBoundingClientRect();
            const x = e.clientX + onsen.left;
            const y = e.clientY - onsen.top;
            splashRef.current.style.setProperty("left", `calc(${x}px - 12vmin)`);
            splashRef.current.style.setProperty("top", `calc(${y}px - 6vmin)`);
            splashRef.current.classList.add("active");
        }  
    };

    return (
        <div className="scene">
            <div className="sun-container">
                <div className="sun"></div>
            </div>
            <div className="mountain mountain-1"></div>
            <div className="mountain mountain-2"></div>
            <div className="mountain mountain-3"></div>
            <div className="grass grass-1"></div>
            <div className="grass grass-2"></div>
            <div className="grass grass-3"></div>
            <div className="grass grass-4"></div>
            <div className="rock rock-1 rock-reflection"></div>
            <div className="rock rock-2 rock-reflection"></div>
            <div className="rock rock-3 rock-reflection"></div>
            <div className="rock rock-4 rock-reflection"></div>
            <div className="rock rock-5 rock-reflection"></div>
            <div className="rock rock-6 rock-reflection"></div>
            <div className="rock rock-7 rock-reflection"></div>
            <div className="rock rock-8 rock-reflection"></div>
            <div className="rock rock-9 rock-reflection"></div>
            <div className="rock rock-10 rock-reflection"></div>
            <div className="onsen" onClick={onClickOnsen}>
                <div className="splash" ref={splashRef}></div>
            </div>
            <div className="smoke smoke-1"></div>
            <div className="smoke smoke-2"></div>
            <div className="smoke smoke-3"></div>
            <div className="smoke smoke-4"></div>
        </div>
    );
}
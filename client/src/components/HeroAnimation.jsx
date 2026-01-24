import React from 'react';
import './HeroAnimation.css';

const HeroAnimation = () => {
    return (
        <div className="hero-animation-container">
            <div className="geometric-shape">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="shape-segment"
                        style={{
                            transform: `rotateY(${i * 30}deg) translateZ(180px)`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroAnimation;

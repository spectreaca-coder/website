import React, { useEffect } from 'react';
import './CustomCursorV2.css';

const CustomCursorV2 = () => {
    useEffect(() => {
        // Add class to hide default cursor globally
        document.body.classList.add('cursor-hidden-v2');

        const cursor = document.querySelector('.custom-cursor-v2');

        const moveCursor = (e) => {
            if (cursor) {
                // Use requestAnimationFrame for smoother performance
                requestAnimationFrame(() => {
                    cursor.style.left = `${e.clientX}px`;
                    cursor.style.top = `${e.clientY}px`;
                });
            }
        };

        const handleHover = () => cursor?.classList.add('hover');
        const handleLeave = () => cursor?.classList.remove('hover');

        window.addEventListener('mousemove', moveCursor);

        // Targeted interactive elements for hover effect
        const interactiveSelectors = 'a, button, .sw-button-v2, .social-btn-v2, .review-card-v2, .curriculum-section, .slider-tab, .notice-item-v2, input, select, textarea';

        // Use event delegation for better performance and dynamic content support
        const handleMouseOver = (e) => {
            if (e.target.closest(interactiveSelectors)) {
                handleHover();
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.closest(interactiveSelectors)) {
                handleLeave();
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.body.classList.remove('cursor-hidden-v2');
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <>
            <div className="custom-cursor-v2"></div>
            <div className="noise-overlay-v2"></div>
        </>
    );
};

export default CustomCursorV2;

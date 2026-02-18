import React, { useState, useEffect, useRef, useCallback } from 'react';
import './InstructorsMarquee.css';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const InstructorsMarquee = () => {
    const [instructors, setInstructors] = useState([]);
    const trackRef = useRef(null);

    // Animation Refs
    const requestRef = useRef(null);
    const positionRef = useRef(0);
    const speedRef = useRef(0.6); // slightly slower than reviews for elegance
    const originalSpeedRef = useRef(0.6);

    // Drag Refs
    const isDraggingRef = useRef(false);
    const lastXRef = useRef(0);
    const velocityRef = useRef(0);

    // Load instructors from Firebase
    useEffect(() => {
        const q = query(collection(db, 'instructors'), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInstructors(data);
        }, (error) => {
            console.error('강사진 로드 실패:', error);
        });
        return () => unsubscribe();
    }, []);

    // Quadruple for smooth infinite loop
    const extendedInstructors = instructors.length > 0
        ? [...instructors, ...instructors, ...instructors, ...instructors]
        : [];

    // Animation loop
    const animate = useCallback(() => {
        if (!trackRef.current) return;

        if (!isDraggingRef.current) {
            if (Math.abs(velocityRef.current) > 0.1) {
                positionRef.current -= velocityRef.current;
                velocityRef.current *= 0.95;
            } else {
                positionRef.current -= speedRef.current;
            }
        }

        const trackWidth = trackRef.current.scrollWidth;
        const oneSetWidth = trackWidth / 4;

        if (positionRef.current <= -oneSetWidth) {
            positionRef.current += oneSetWidth;
        } else if (positionRef.current > 0) {
            positionRef.current -= oneSetWidth;
        }

        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
        requestRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

    // Drag handlers
    const handleDragStart = (e) => {
        isDraggingRef.current = true;
        lastXRef.current = e.pageX || e.touches?.[0]?.pageX || 0;
        velocityRef.current = 0;
        speedRef.current = 0;
        if (trackRef.current) {
            trackRef.current.style.cursor = 'grabbing';
            trackRef.current.style.transition = 'none';
        }
    };

    const handleDragMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        const currentX = e.pageX || e.touches?.[0]?.pageX || 0;
        const delta = currentX - lastXRef.current;
        positionRef.current += delta;
        velocityRef.current = delta;
        lastXRef.current = currentX;
    };

    const handleDragEnd = () => {
        isDraggingRef.current = false;
        speedRef.current = originalSpeedRef.current;
        if (trackRef.current) trackRef.current.style.cursor = 'grab';
    };

    if (instructors.length === 0) return null;

    return (
        <section className="instructors-marquee-section">
            <div className="instructors-marquee-header">
                <h2 className="instructors-marquee-title">OUR INSTRUCTORS</h2>
            </div>

            <div className="instructors-marquee-wrapper">
                <div
                    className="instructors-track-marquee draggable"
                    ref={trackRef}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    {extendedInstructors.map((instructor, index) => (
                        <div
                            key={`${instructor.id}-${index}`}
                            className="instructor-slide"
                        >
                            <div className="instructor-marquee-card">
                                <div className="instructor-marquee-tape"></div>
                                {instructor.imageUrl && (
                                    <div className="instructor-marquee-image">
                                        <img src={instructor.imageUrl} alt={instructor.name} draggable={false} />
                                    </div>
                                )}
                                <div className="instructor-marquee-header-inner">
                                    <span className="instructor-marquee-badge">{instructor.subject}</span>
                                    <h3 className="instructor-marquee-name">{instructor.name}</h3>
                                </div>
                                {instructor.bio && (
                                    <div className="instructor-marquee-body">
                                        <p className="instructor-marquee-bio">{instructor.bio}</p>
                                    </div>
                                )}
                                {instructor.tags && instructor.tags.length > 0 && (
                                    <div className="instructor-marquee-tags">
                                        {instructor.tags.map((tag, i) => (
                                            <span key={i} className="instructor-marquee-tag">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InstructorsMarquee;

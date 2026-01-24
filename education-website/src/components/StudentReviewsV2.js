import React, { useState, useEffect, useRef, useCallback } from 'react';
import './StudentReviewsV2.css';

const reviews = [
    {
        id: 1,
        category: '효율적 수업',
        title: 'Q&A 방식 강의로 최대 효율을 추구',
        comment: '"신쌤 수업을 들으면서 제가 가장 크게 느낀 점은 학습 효율성이 높다 라는 것이었어요! 철저한 오답풀이 중심의 수업 구성 덕분에 시간을 낭비하지 않고 제게 필요한 영어 학습에 집중하여 공부할 수 있었습니다."',
        author: '서울대 의예과 박성재'
    },
    {
        id: 2,
        category: '놀라운 적중력',
        title: '기출 데이터에 근거한 학교별 예상문제',
        comment: '"신쌤께 배운 이후에는 신쌤의 초강력 내신대비 덕분에 계속 1등급을 받을 수 있었어요. 특히 신쌤의 예상문제는 진짜 대박입니다. 공부할 때는 진짜 이대로 나오나 하다가 시험지 보고 똑같이 나와서 깜놀 한 적이 한 두번이 아니었죠. ㅎㅎ"',
        author: '서울대 화공생명학과 허영준'
    },
    {
        id: 3,
        category: '열정적 강의',
        title: '학생들을 감동시키는 무한 열정 강의',
        comment: '"신쌤 수업을 유독 강조하는 이유는 열정 이에요! 새벽이 되어도 저희 질문을 친절하게 받아주시기 때문에 내신 공부하는데에 큰 도움이 되었어요. 시험 전날 밤까지 모르는 게 생기면 답답해서 미치는데 신쌤이 저희와 함께 깨어있으시기 때문에 다음날 시험을 상쾌하게 볼 수 있었어요."',
        author: '연세대 사학과 김유은'
    },
    {
        id: 4,
        category: '유쾌한 강의',
        title: '수업에 몰입할 수 밖에 없는 유쾌한 강의',
        comment: '"첫 수업 들어보시면 알겠지만 신쌤은 사랑입니다! 타이트하게 수업 진행 하면서도 웃음과 유머를 겸비하셨기 때문에 몸은 힘들어도 저는 언제나 신쌤 수업 들으러 학원 가는게 기쁘고 행복했던 것 같습니다. ㅎㅎ 한번 들으면 못 빠져나올걸요?! 제가 장담합니다. ㅋㅋ"',
        author: '연세대 경영학과 황이주'
    },
];

const StudentReviewsV2 = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    // Animation Refs
    const requestRef = useRef(null);
    const positionRef = useRef(0);
    const speedRef = useRef(0.8); // Pixels per frame
    const originalSpeedRef = useRef(0.8);

    // Drag Refs
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const lastXRef = useRef(0);
    const velocityRef = useRef(0);

    // Quadruple for smooth loop
    const extendedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

    const animate = useCallback(() => {
        if (!trackRef.current) return;

        // Apply drag physics or auto-scroll
        if (!isDraggingRef.current) {
            // Apply friction to extra velocity from drag
            if (Math.abs(velocityRef.current) > 0.1) {
                positionRef.current -= velocityRef.current;
                velocityRef.current *= 0.95; // Friction
            } else {
                positionRef.current -= speedRef.current; // Normal flow
            }
        }

        // Infinite Loop Logic
        // Assumption: 4 original items. We have 4 sets.
        // Loop point is when we've scrolled past 1 set width.
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

    // Drag Handlers
    const handleDragStart = (e) => {
        isDraggingRef.current = true;
        startXRef.current = e.pageX || e.touches[0].pageX;
        lastXRef.current = startXRef.current;
        velocityRef.current = 0;

        // Stop any momentary speed changes
        speedRef.current = 0;

        if (trackRef.current) {
            trackRef.current.style.cursor = 'grabbing';
            trackRef.current.style.transition = 'none';
        }
    };

    const handleDragMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault(); // Prevent standard scroll on mobile if needed

        const currentX = e.pageX || e.touches[0].pageX;
        const delta = currentX - lastXRef.current;

        positionRef.current += delta;
        velocityRef.current = delta; // Capture velocity
        lastXRef.current = currentX;
    };

    const handleDragEnd = () => {
        isDraggingRef.current = false;
        speedRef.current = originalSpeedRef.current; // Restore auto speed

        if (trackRef.current) {
            trackRef.current.style.cursor = 'grab';
        }
    };

    // Intersection Observer to update indicators
    useEffect(() => {
        const options = {
            root: containerRef.current,
            threshold: 0.6 // Trigger when 60% visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Extract ID from custom data attribute
                    const reviewId = Number(entry.target.getAttribute('data-id'));
                    // Find actual index (0-3) from ID
                    const realIndex = reviews.findIndex(r => r.id === reviewId);
                    if (realIndex !== -1) {
                        setActiveIndex(realIndex);
                    }
                }
            });
        }, options);

        const cards = document.querySelectorAll('.review-slide-v2');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [reviews]);


    return (
        <section className="student-reviews-section-v2">
            <h2 className="section-title-reviews-v2">STUDENT REVIEWS</h2>

            <div className="reviews-marquee-wrapper" ref={containerRef}>
                <div
                    className="reviews-track-marquee draggable"
                    ref={trackRef}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    {extendedReviews.map((review, index) => (
                        <div
                            key={`${review.id}-${index}`}
                            className="review-slide-v2"
                            data-id={review.id}
                        >
                            <div className="review-card-v2">
                                <div className="review-tape-v2"></div>
                                <div className="review-header-v2">
                                    <span className="review-category-badge-v2">{review.category}</span>
                                    <h3 className="review-title-v2">{review.title}</h3>
                                </div>
                                <div className="review-body-v2">
                                    <p className="review-comment-v2">{review.comment}</p>
                                </div>
                                <div className="review-footer-v2">
                                    <p className="review-author-v2">{review.author}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Read-only Indicators */}
            <div className="review-indicators-v2">
                {reviews.map((_, index) => (
                    <div
                        key={index}
                        className={`review-indicator-square-v2 ${index === activeIndex ? 'active' : ''}`}
                        aria-label={`Review ${index + 1} active`}
                    />
                ))}
            </div>
        </section>
    );
};

export default StudentReviewsV2;

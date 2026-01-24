import { useEffect } from 'react';

const useScrollReveal = (selector = '.reveal-on-scroll, .section-divider-v2', threshold = 0.1, dependencies = []) => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold });

        const targets = document.querySelectorAll(selector);
        targets.forEach(target => observer.observe(target));

        return () => targets.forEach(target => observer.unobserve(target));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector, threshold, ...dependencies]);
};

export default useScrollReveal;

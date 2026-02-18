import { useState, useCallback } from 'react';

/**
 * useToast - alert() 대체 토스트 알림 훅
 * 사용법: const { toast, showToast } = useToast();
 * JSX에 {toast} 삽입, showToast('메시지', 'success'|'error'|'info') 호출
 */
const useToast = () => {
    const [toastState, setToastState] = useState({ show: false, message: '', type: 'success' });

    const showToast = useCallback((message, type = 'success') => {
        setToastState({ show: true, message, type });
        setTimeout(() => {
            setToastState(prev => ({ ...prev, show: false }));
        }, 3000);
    }, []);

    const toast = toastState.show ? (
        <div
            style={{
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: toastState.type === 'error' ? '#c0392b' : toastState.type === 'info' ? '#2980b9' : '#27ae60',
                color: '#fff',
                padding: '14px 28px',
                fontFamily: 'Helvetica Neue, sans-serif',
                fontWeight: '700',
                fontSize: '0.95rem',
                letterSpacing: '0.02em',
                border: '2px solid #000',
                boxShadow: '4px 4px 0px #000',
                zIndex: 9999,
                pointerEvents: 'none',
                animation: 'toastFadeIn 0.2s ease',
                whiteSpace: 'nowrap',
                maxWidth: '90vw',
            }}
        >
            {toastState.type === 'error' ? '✕ ' : toastState.type === 'info' ? 'ℹ ' : '✓ '}
            {toastState.message}
        </div>
    ) : null;

    return { toast, showToast };
};

export default useToast;

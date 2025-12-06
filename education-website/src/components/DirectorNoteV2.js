import React from 'react';
import './DirectorNoteV2.css';

const DirectorNoteV2 = () => {
    return (
        <section className="director-note-section-v2">
            <div className="director-note-container-v2">
                <div className="note-header-v2">
                    <h2 className="note-title-v2">DIRECTOR'S NOTE</h2>
                    <span className="note-date-v2">2024.11.29</span>
                </div>
                <div className="note-content-v2">
                    <p>
                        "진정한 교육은 단순히 지식을 전달하는 것이 아니라,
                        학생 스스로 생각하고 질문하는 힘을 길러주는 것입니다."
                    </p>
                    <p>
                        스펙터 아카데미는 대치동의 치열한 경쟁 속에서도
                        흔들리지 않는 본질적인 실력을 추구합니다.
                        우리는 단순한 입시 성공을 넘어,
                        더 넓은 세상으로 나아갈 수 있는 단단한 기반을 만듭니다.
                    </p>
                    <p className="note-signature-v2">
                        - Director Shin
                    </p>
                </div>
                <div className="note-footer-deco-v2">
                    <span>VERITAS</span>
                    <span>LUX</span>
                    <span>MEA</span>
                </div>
            </div>
        </section>
    );
};

export default DirectorNoteV2;

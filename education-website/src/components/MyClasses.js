import React, { useState, useEffect } from 'react';
import './MyClasses.css';
import Modal from './Modal';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import DOMPurify from 'dompurify';

Quill.register('modules/imageResize', ImageResize);

const initialLectures = [
  {
    id: 1, name: '미적분 1강 - 함수의 극한', instructor: '김현빈',
    content: '<p>함수의 극한 개념을 정복합니다.</p><p><br></p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/P_s_8X6sN8s"></iframe><p><br></p>'
  },
  {
    id: 2, name: '확률과 통계 1강 - 순열과 조합', instructor: '이수진',
    content: '<p>경우의 수를 세는 기본 원리를 배웁니다.</p>'
  },
];

const MyClasses = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lectures, setLectures] = useState(() => {
    const savedLectures = localStorage.getItem('videoLectures');
    return savedLectures ? JSON.parse(savedLectures) : initialLectures;
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [openLectureId, setOpenLectureId] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('videoLectures', JSON.stringify(lectures));
  }, [lectures]);

  const clearForm = () => {
    setName(''); setInstructor(''); setContent('');
    setEditingLecture(null);
    setIsModalVisible(false);
  };

  const handleEditClick = (lecture) => {
    setEditingLecture(lecture);
    setName(lecture.name);
    setInstructor(lecture.instructor);
    setContent(lecture.content);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 강의를 삭제하시겠습니까?')) {
      setLectures(lectures.filter(lec => lec.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !instructor) { alert('강의 이름과 강사명은 필수입니다.'); return; }

    if (editingLecture) {
      const updatedLectures = lectures.map(lec => 
        lec.id === editingLecture.id ? { ...lec, name, instructor, content } : lec
      );
      setLectures(updatedLectures);
    } else {
      const newLecture = { id: Date.now(), name, instructor, content };
      setLectures([newLecture, ...lectures]);
    }
    clearForm();
  };

  const handleToggleAccordion = (id) => {
    setOpenLectureId(openLectureId === id ? null : id);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  };

  return (
    <div className="page-container">
      <h1>강좌소개</h1>
      {isAdmin && (
        <div className="admin-actions">
          <h2>관리자 메뉴</h2>
          <button onClick={() => { setEditingLecture(null); clearForm(); setIsModalVisible(true); }}>강의 추가</button>
        </div>
      )}
      <div className="accordion-list">
        {lectures.map(lec => (
          <div key={lec.id} className="accordion-item">
            <div className="accordion-header">
              <span className="accordion-title" onClick={() => handleToggleAccordion(lec.id)}>{lec.name}</span>
              <div className="accordion-controls">
                {isAdmin && (
                  <div className="accordion-admin-actions">
                    <button className="edit-btn" onClick={() => handleEditClick(lec)}>수정</button>
                    <button className="delete-btn-accordion" onClick={(e) => { e.stopPropagation(); handleDelete(lec.id); }}>삭제</button>
                  </div>
                )}
                <span className={`accordion-icon ${openLectureId === lec.id ? 'open' : ''}`} onClick={() => handleToggleAccordion(lec.id)}>▼</span>
              </div>
            </div>
            {openLectureId === lec.id && (
              <div className="accordion-content">
                <div className="ql-snow">
                  <div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lec.content, {
                    ADD_TAGS: ['iframe'],
                    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'class', 'src']
                  }) }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalVisible && (
        <Modal onClose={clearForm}>
          <form onSubmit={handleSubmit} className="create-course-form">
            <h2>{editingLecture ? '강의 수정' : '새 강의 추가'}</h2>
            <input type="text" placeholder="강의 이름" value={name} onChange={e => setName(e.target.value)} required />
            <input type="text" placeholder="담당 강사" value={instructor} onChange={e => setInstructor(e.target.value)} required />
            <div className="quill-container">
              <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} />
            </div>
            <button type="submit">{editingLecture ? '수정 완료' : '추가하기'}</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyClasses;
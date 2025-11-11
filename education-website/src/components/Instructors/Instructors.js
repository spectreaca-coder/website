import React, { useState, useEffect } from 'react';
import './Instructors.css';
import Modal from '../Modal';

const initialInstructors = [
  {
    id: 1, name: '김현빈', subject: '수학',
    comment: '최고가 최고를 만듭니다.',
    career: '전) 메가스터디 수학 강사\n현) 스펙터학원 대표 강사',
    photo: ''
  },
  {
    id: 2, name: '이수진', subject: '과학',
    comment: '기본에 충실한 강의를 약속합니다.',
    career: '서울대학교 화학과 졸업\n현) 스펙터학원 과학 대표 강사',
    photo: ''
  },
];

const Instructors = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [instructors, setInstructors] = useState(() => {
    const savedInstructors = localStorage.getItem('instructors');
    return savedInstructors ? JSON.parse(savedInstructors) : initialInstructors;
  });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newCareer, setNewCareer] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  useEffect(() => {
    const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  useEffect(() => {
    localStorage.setItem('instructors', JSON.stringify(instructors));
  }, [instructors]);

  const clearForm = () => {
    setNewName(''); setNewSubject(''); setNewComment(''); setNewCareer(''); setNewPhoto('');
    setEditingInstructor(null);
    setIsCreateModalVisible(false);
  };

  const handleEditClick = (instructor) => {
    setEditingInstructor(instructor);
    setNewName(instructor.name);
    setNewSubject(instructor.subject);
    setNewComment(instructor.comment);
    setNewCareer(instructor.career);
    setNewPhoto(instructor.photo);
    setIsCreateModalVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 강사 정보를 삭제하시겠습니까?')) {
      setInstructors(instructors.filter(inst => inst.id !== id));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newSubject || !newComment) { alert('모든 항목을 입력해주세요.'); return; }

    if (editingInstructor) {
      // Update
      const updatedInstructors = instructors.map(inst => 
        inst.id === editingInstructor.id 
          ? { ...inst, name: newName, subject: newSubject, comment: newComment, career: newCareer, photo: newPhoto }
          : inst
      );
      setInstructors(updatedInstructors);
    } else {
      // Create
      const newInstructor = { id: Date.now(), name: newName, subject: newSubject, comment: newComment, career: newCareer, photo: newPhoto || '' };
      setInstructors([newInstructor, ...instructors]);
    }
    clearForm();
  };

  return (
    <div className="page-container">
      <h1>강사진 소개</h1>
      {isAdmin && (
        <div className="admin-actions">
          <h2>관리자 메뉴</h2>
          <button onClick={() => { setEditingInstructor(null); setIsCreateModalVisible(true); }}>강사 추가</button>
        </div>
      )}
      <div className="instructor-list">
        {instructors.map(inst => (
          <div key={inst.id} className="instructor-card">
            <div className="card-admin-actions">
              {isAdmin && (
                <>
                  <button className="edit-btn" onClick={() => handleEditClick(inst)}>수정</button>
                  <button className="delete-btn" onClick={() => handleDelete(inst.id)}>삭제</button>
                </>
              )}
            </div>
            {inst.photo && inst.photo.trim() !== '' && <img src={inst.photo} alt={inst.name} className="instructor-photo" />}
            <div className="instructor-info">
              <h3 className="instructor-name">{inst.name}</h3>
              <p className="instructor-subject">{inst.subject}</p>
              <p className="instructor-comment">\"{inst.comment}\"</p>
              {inst.career && (
                <div className="instructor-career">
                  {inst.career.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {isCreateModalVisible && (
        <Modal onClose={clearForm}>
          <form onSubmit={handleSubmit} className="create-course-form">
            <h2>{editingInstructor ? '강사 정보 수정' : '새 강사 추가'}</h2>
            <label>사진 파일:</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            <input type="text" placeholder="강사명" value={newName} onChange={e => setNewName(e.target.value)} required />
            <input type="text" placeholder="주 과목" value={newSubject} onChange={e => setNewSubject(e.target.value)} required />
            <input type="text" placeholder="한 줄 코멘트" value={newComment} onChange={e => setNewComment(e.target.value)} required />
            <textarea placeholder="경력 (줄바꿈으로 구분)" value={newCareer} onChange={e => setNewCareer(e.target.value)}></textarea>
            <button type="submit">{editingInstructor ? '수정 완료' : '추가하기'}</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Instructors;
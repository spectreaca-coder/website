import React, { useState, useEffect } from 'react';
import './CourseRegistration.css';
import Modal from './Modal';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const CourseRegistration = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form states...
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCapacity, setNewCapacity] = useState('20');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  // Firestore에서 강좌 목록 실시간 가져오기
  useEffect(() => {
    setIsLoading(true); // Start loading
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
      setIsLoading(false); // Stop loading on success
    }, (error) => {
      console.error('강좌 목록 가져오기 실패:', error);
      setIsLoading(false); // Stop loading on error
    });

    return () => unsubscribe();
  }, []);

  // ... (rest of the functions: sendToGoogleSheets, clearForm, handleEditClick, handleDeleteCourse, handleSubmitCourse, handleApplyClick, handleApplicationSubmit)

  return (
    <div className="page-container">
      <h1>수강신청</h1>
      {isAdmin && (
        <div className="admin-actions">
          <h2>관리자 메뉴</h2>
          <button onClick={() => { setEditingCourse(null); setIsCreateModalVisible(true); }}>수업 개설</button>
        </div>
      )}
      <div className="course-list">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-title"></div>
              <div className="skeleton-desc"></div>
              <div className="skeleton-desc" style={{ width: '80%' }}></div>
              <div className="skeleton-details">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
              <div className="skeleton-btn"></div>
            </div>
          ))
        ) : (
          courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="card-admin-actions">
                {isAdmin && (
                  <>
                    <button className="edit-btn" onClick={() => handleEditClick(course)}>수정</button>
                    <button className="delete-btn" onClick={() => handleDeleteCourse(course.id)}>삭제</button>
                  </>
                )}
              </div>
              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <p><strong>강사명:</strong> {course.teacher}</p>
                  <p><strong>요일:</strong> {course.day}</p>
                  <p><strong>시간:</strong> {course.time}</p>
                  {isAdmin && <p><strong>정원:</strong> {course.capacity || 20}명</p>}
                </div>
                <button className="register-btn" onClick={() => handleApplyClick(course)}>수강신청</button>
              </div>
            </div>
          ))
        )}
      </div>
      {isCreateModalVisible && (
        <Modal onClose={clearForm}>
          <form onSubmit={handleSubmitCourse} className="create-course-form">
            <h2>{editingCourse ? '수업 정보 수정' : '새 수업 개설'}</h2>
            <input type="text" placeholder="수업 제목" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            <textarea placeholder="수업 설명" value={newDesc} onChange={e => setNewDesc(e.target.value)} required></textarea>
            <input type="text" placeholder="강사명" value={newTeacher} onChange={e => setNewTeacher(e.target.value)} required />
            <input type="text" placeholder="요일 (예: 월, 수, 금)" value={newDay} onChange={e => setNewDay(e.target.value)} required />
            <input type="text" placeholder="시간 (예: 19:00 - 22:00)" value={newTime} onChange={e => setNewTime(e.target.value)} required />
            <input type="number" placeholder="정원 (예: 20)" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} min="1" required />
            <button type="submit">{editingCourse ? '수정 완료' : '개설하기'}</button>
          </form>
        </Modal>
      )}
      {isApplyModalVisible && selectedCourse && (
        <Modal onClose={() => setIsApplyModalVisible(false)}>
          <form onSubmit={handleApplicationSubmit} className="application-form">
            <h2>'{selectedCourse.title}' 수강신청</h2>
            <input type="text" placeholder="학생 이름" value={studentName} onChange={e => setStudentName(e.target.value)} required disabled={isSubmitting} />
            <select value={studentGrade} onChange={e => setStudentGrade(e.target.value)} required disabled={isSubmitting}>
              <option value="" disabled>학년 선택</option>
              <option value="중1">중학교 1학년</option>
              <option value="중2">중학교 2학년</option>
              <option value="중3">중학교 3학년</option>
              <option value="고1">고등학교 1학년</option>
              <option value="고2">고등학교 2학년</option>
              <option value="고3">고등학교 3학년</option>
              <option value="N수">N수</option>
            </select>
            <input type="tel" placeholder="학생 전화번호" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} required disabled={isSubmitting} />
            <input type="tel" placeholder="부모님 전화번호" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required disabled={isSubmitting} />
            <button type="submit" disabled={isSubmitting} className={isSubmitting ? 'loading' : ''}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  신청 중...
                </>
              ) : '신청하기'}
            </button>
          </form>
          {isSubmitting && (
            <div className="loading-overlay">
              <div className="loading-content">
                <div className="loading-spinner"></div>
                <p>수강신청을 처리하고 있습니다...</p>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CourseRegistration;

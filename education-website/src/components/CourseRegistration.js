import React, { useState, useEffect } from 'react';
import './CourseRegistration.css';
import Modal from './Modal';

const initialCourses = [
  {
    id: 1, title: '2025학년도 6월 모의평가 대비', description: '수학 정규반 (미적분/기하/확통)',
    teacher: '김현빈', day: '월, 수, 금', time: '19:00 - 22:00', capacity: 20
  },
  {
    id: 2, title: '내신 대비 특별반', description: '고1·고2 수학 집중 과정',
    teacher: '이수진', day: '화, 목', time: '18:00 - 21:00', capacity: 15
  },
];

const CourseRegistration = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem('courses');
    return savedCourses ? JSON.parse(savedCourses) : initialCourses;
  });
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

  useEffect(() => {
    const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  // Google Sheets 연동 함수
  const sendToGoogleSheets = async (applicationData) => {
    const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('Google Sheets URL이 설정되지 않았습니다.');
      return;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });
      console.log('Google Sheets로 데이터 전송 완료');
    } catch (error) {
      console.error('Google Sheets 전송 실패:', error);
    }
  };

  const clearForm = () => {
    setNewTitle(''); setNewDesc(''); setNewTeacher(''); setNewDay(''); setNewTime(''); setNewCapacity('20');
    setEditingCourse(null);
    setIsCreateModalVisible(false);
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setNewTitle(course.title);
    setNewDesc(course.description);
    setNewTeacher(course.teacher);
    setNewDay(course.day);
    setNewTime(course.time);
    setNewCapacity(course.capacity ? course.capacity.toString() : '20');
    setIsCreateModalVisible(true);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('정말로 이 수업을 삭제하시겠습니까?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const handleSubmitCourse = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newTeacher || !newDay || !newTime || !newCapacity) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const capacity = parseInt(newCapacity);
    if (isNaN(capacity) || capacity <= 0) {
      alert('정원은 1 이상의 숫자여야 합니다.');
      return;
    }

    if (editingCourse) {
      // Update
      const updatedCourses = courses.map(c =>
        c.id === editingCourse.id
          ? { ...c, title: newTitle, description: newDesc, teacher: newTeacher, day: newDay, time: newTime, capacity }
          : c
      );
      setCourses(updatedCourses);
    } else {
      // Create
      const newCourse = { id: Date.now(), title: newTitle, description: newDesc, teacher: newTeacher, day: newDay, time: newTime, capacity };
      setCourses([newCourse, ...courses]);
    }
    clearForm();
  };

  const handleApplyClick = (course) => {
    setSelectedCourse(course);
    setIsApplyModalVisible(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    // 입력 검증
    if (!studentName || !studentGrade || !studentPhone || !parentPhone) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!phoneRegex.test(studentPhone)) {
      alert('학생 전화번호 형식이 올바르지 않습니다. 다시 확인해주세요.');
      return;
    }
    if (!phoneRegex.test(parentPhone)) {
      alert('부모님 전화번호 형식이 올바르지 않습니다. 다시 확인해주세요.');
      return;
    }

    const savedApplications = JSON.parse(localStorage.getItem('applications')) || [];

    // 중복 신청 체크
    const isDuplicate = savedApplications.some(
      app => app.studentPhone === studentPhone && app.courseId === selectedCourse.id && app.status !== 'waiting'
    );
    if (isDuplicate) {
      alert('이미 해당 수업에 신청하셨습니다.');
      return;
    }

    // 해당 수업의 현재 신청자 수 확인 (대기자 제외)
    const courseApplications = savedApplications.filter(
      app => app.courseId === selectedCourse.id && app.status === 'confirmed'
    );
    const currentEnrollment = courseApplications.length;
    const courseCapacity = selectedCourse.capacity || 20;

    // 정원 체크
    const isWaitlisted = currentEnrollment >= courseCapacity;
    const status = isWaitlisted ? 'waiting' : 'confirmed';

    const newApplication = {
      studentName,
      studentGrade,
      studentPhone,
      parentPhone,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      courseTeacher: selectedCourse.teacher,
      courseDay: selectedCourse.day,
      courseTime: selectedCourse.time,
      status,
      appliedAt: new Date().toISOString(),
      appliedDate: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    const updatedApplications = [newApplication, ...savedApplications];
    localStorage.setItem('applications', JSON.stringify(updatedApplications));

    // Google Sheets로 전송
    await sendToGoogleSheets(newApplication);

    // 사용자 알림
    if (isWaitlisted) {
      alert('현재 수강 신청자 수가 초과되어 등록 대기 상태입니다.\n공석 발생 시 바로 연락드리겠습니다.');
    } else {
      alert(`'${selectedCourse.title}' 수업에 대한 수강신청이 완료되었습니다.\n곧 해당 전화번호로 연락이 갈 것입니다.`);
    }

    setStudentName('');
    setStudentGrade('');
    setStudentPhone('');
    setParentPhone('');
    setIsApplyModalVisible(false);
    setSelectedCourse(null);
  };

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
        {courses.map(course => (
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
        ))}
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
            <input type="text" placeholder="학생 이름" value={studentName} onChange={e => setStudentName(e.target.value)} required />
            <select value={studentGrade} onChange={e => setStudentGrade(e.target.value)} required>
              <option value="" disabled>학년 선택</option>
              <option value="중1">중학교 1학년</option>
              <option value="중2">중학교 2학년</option>
              <option value="중3">중학교 3학년</option>
              <option value="고1">고등학교 1학년</option>
              <option value="고2">고등학교 2학년</option>
              <option value="고3">고등학교 3학년</option>
              <option value="N수">N수</option>
            </select>
            <input type="tel" placeholder="학생 전화번호" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} required />
            <input type="tel" placeholder="부모님 전화번호" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required />
            <button type="submit">신청하기</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CourseRegistration;

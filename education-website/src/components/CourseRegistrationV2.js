import React, { useState, useEffect } from 'react';
import './CourseRegistrationV2.css';
import Modal from './Modal';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import FooterV2 from './FooterV2';
import useScrollReveal from '../hooks/useScrollReveal';
import HeaderV2 from './HeaderV2';

const CourseRegistrationV2 = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Form states
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
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    useEffect(() => {
        const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminFlag);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const coursesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesData);
            setIsLoading(false);
        }, (error) => {
            console.error('강좌 목록 가져오기 실패:', error);
            setIsLoading(false);
        });

        const timeoutId = setTimeout(() => {
            setIsLoading((prev) => {
                if (prev) {
                    console.warn('Course fetching timed out.');
                    return false;
                }
                return prev;
            });
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    // Custom Cursor Logic
    useEffect(() => {
        const cursor = document.querySelector('.custom-cursor-v2');
        const moveCursor = (e) => {
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
        };

        const handleHover = () => cursor?.classList.add('hover');
        const handleLeave = () => cursor?.classList.remove('hover');

        window.addEventListener('mousemove', moveCursor);

        const interactiveElements = document.querySelectorAll('a, button, .cr-card-v2');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleHover);
            el.addEventListener('mouseleave', handleLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleHover);
                el.removeEventListener('mouseleave', handleLeave);
            });
        };
    }, []);

    useScrollReveal('.reveal-on-scroll', 0.1, [courses]);

    const sendToGoogleSheets = async (applicationData) => {
        const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;
        if (!GOOGLE_SCRIPT_URL) return;

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });
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

    const showDeleteConfirm = (id) => {
        setDeleteConfirm({ show: true, id: id });
    };

    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });

        try {
            await deleteDoc(doc(db, 'courses', id));
            alert('수업이 삭제되었습니다.');
        } catch (error) {
            console.error('수업 삭제 실패:', error);
            alert('수업 삭제에 실패했습니다.');
        }
    };

    const handleSubmitCourse = async (e) => {
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

        try {
            if (editingCourse) {
                await updateDoc(doc(db, 'courses', editingCourse.id), {
                    title: newTitle,
                    description: newDesc,
                    teacher: newTeacher,
                    day: newDay,
                    time: newTime,
                    capacity,
                    updatedAt: new Date().toISOString()
                });
                alert('수업 정보가 수정되었습니다.');
            } else {
                await addDoc(collection(db, 'courses'), {
                    title: newTitle,
                    description: newDesc,
                    teacher: newTeacher,
                    day: newDay,
                    time: newTime,
                    capacity,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                alert('새 수업이 개설되었습니다.');
            }
            clearForm();
        } catch (error) {
            console.error('수업 저장 실패:', error);
            alert('수업 저장에 실패했습니다.');
        }
    };

    const handleApplyClick = (course) => {
        setSelectedCourse(course);
        setIsApplyModalVisible(true);
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();

        if (!studentName || !studentGrade || !studentPhone || !parentPhone) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (!phoneRegex.test(studentPhone) || !phoneRegex.test(parentPhone)) {
            alert('전화번호 형식이 올바르지 않습니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const applicationsSnapshot = await getDocs(collection(db, 'applications'));
            const savedApplications = applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const isDuplicate = savedApplications.some(
                app => app.studentPhone === studentPhone && app.courseId === selectedCourse.id && app.status !== 'waiting'
            );
            if (isDuplicate) {
                alert('이미 해당 수업에 신청하셨습니다.');
                return;
            }

            const courseApplications = savedApplications.filter(
                app => app.courseId === selectedCourse.id && app.status === 'confirmed'
            );
            const currentEnrollment = courseApplications.length;
            const courseCapacity = selectedCourse.capacity || 20;

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
                appliedDate: new Date().toLocaleString('ko-KR')
            };

            await addDoc(collection(db, 'applications'), newApplication);
            await sendToGoogleSheets(newApplication);

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
        } catch (error) {
            console.error('수강 신청 실패:', error);
            alert('수강 신청에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="cr-v2-page">
            <div className="custom-cursor-v2"></div>
            <div className="noise-overlay-v2"></div>

            <HeaderV2 />

            <main className="cr-v2-main">
                <div className="cr-v2-content">
                    <h1 className="cr-v2-title reveal-on-scroll">수강신청</h1>

                    {isAdmin && (
                        <div className="cr-v2-admin-actions">
                            <button onClick={() => { setEditingCourse(null); setIsCreateModalVisible(true); }} className="cr-v2-btn primary">
                                + 수업 개설
                            </button>
                        </div>
                    )}

                    <div className="cr-v2-grid">
                        {isLoading ? (
                            <div className="cr-v2-loading">수업 목록을 불러오는 중...</div>
                        ) : courses.length > 0 ? (
                            courses.map((course, index) => (
                                <div key={course.id} className="cr-card-v2 reveal-on-scroll" style={{ transitionDelay: `${index * 0.1}s` }}>
                                    <div className="cr-card-header">
                                        <h3 className="cr-card-title">{course.title}</h3>
                                        {isAdmin && (
                                            <div className="cr-card-actions">
                                                <button onClick={() => handleEditClick(course)}>수정</button>
                                                <button onClick={() => showDeleteConfirm(course.id)} className="delete">삭제</button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="cr-card-desc">{course.description}</p>
                                    <div className="cr-card-details">
                                        <div className="cr-detail-row">
                                            <span className="label">강사</span>
                                            <span className="value">{course.teacher}</span>
                                        </div>
                                        <div className="cr-detail-row">
                                            <span className="label">시간표</span>
                                            <span className="value">{course.day} {course.time}</span>
                                        </div>
                                        {isAdmin && (
                                            <div className="cr-detail-row">
                                                <span className="label">정원</span>
                                                <span className="value">{course.capacity || 20}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button className="cr-v2-btn secondary full-width" onClick={() => handleApplyClick(course)}>
                                        신청하기
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="cr-v2-empty">
                                <p>현재 개설된 수업이 없습니다.</p>
                                <button onClick={() => window.location.reload()} className="cr-v2-btn secondary">
                                    다시 시도
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            {isCreateModalVisible && (
                <Modal onClose={clearForm}>
                    <form onSubmit={handleSubmitCourse} className="cr-form-v2">
                        <h2>{editingCourse ? '수업 수정' : '새 수업 개설'}</h2>
                        <input type="text" placeholder="수업명" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                        <textarea placeholder="설명" value={newDesc} onChange={e => setNewDesc(e.target.value)} required></textarea>
                        <input type="text" placeholder="강사명" value={newTeacher} onChange={e => setNewTeacher(e.target.value)} required />
                        <input type="text" placeholder="요일 (예: 월, 수)" value={newDay} onChange={e => setNewDay(e.target.value)} required />
                        <input type="text" placeholder="시간 (예: 19:00 - 22:00)" value={newTime} onChange={e => setNewTime(e.target.value)} required />
                        <input type="number" placeholder="정원" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} min="1" required />
                        <button type="submit" className="cr-v2-btn primary full-width">{editingCourse ? '수정하기' : '개설하기'}</button>
                    </form>
                </Modal>
            )}

            {isApplyModalVisible && selectedCourse && (
                <Modal onClose={() => setIsApplyModalVisible(false)}>
                    <form onSubmit={handleApplicationSubmit} className="cr-form-v2">
                        <h2>{selectedCourse.title} 신청</h2>
                        <input type="text" placeholder="학생 이름" value={studentName} onChange={e => setStudentName(e.target.value)} required disabled={isSubmitting} />
                        <select value={studentGrade} onChange={e => setStudentGrade(e.target.value)} required disabled={isSubmitting}>
                            <option value="" disabled>학년 선택</option>
                            <option value="중1">중학교 1학년</option>
                            <option value="중2">중학교 2학년</option>
                            <option value="중3">중학교 3학년</option>
                            <option value="고1">고등학교 1학년</option>
                            <option value="고2">고등학교 2학년</option>
                            <option value="고3">고등학교 3학년</option>
                            <option value="N수">N수생</option>
                        </select>
                        <input type="tel" placeholder="학생 전화번호" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} required disabled={isSubmitting} />
                        <input type="tel" placeholder="학부모 전화번호" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required disabled={isSubmitting} />
                        <button type="submit" disabled={isSubmitting} className="cr-v2-btn primary full-width">
                            {isSubmitting ? '처리 중...' : '신청하기'}
                        </button>
                    </form>
                </Modal>
            )}

            {/* 삭제 확인 모달 */}
            {deleteConfirm.show && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <p>정말로 이 수업을 삭제하시겠습니까?</p>
                        <div className="confirm-modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteConfirm({ show: false, id: null })}>취소</button>
                            <button className="delete-btn" onClick={confirmDelete}>삭제</button>
                        </div>
                    </div>
                </div>
            )}

            <FooterV2 />
        </div>
    );
};

export default CourseRegistrationV2;

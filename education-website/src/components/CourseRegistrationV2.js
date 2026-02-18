import React, { useState, useEffect } from 'react';
import './CourseRegistrationV2.css';
import Modal from './Modal';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import FooterV2 from './FooterV2';
import useScrollReveal from '../hooks/useScrollReveal';
import { useToast } from '../context/ToastContext';
import HeaderV2 from './HeaderV2';

const CourseRegistrationV2 = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const { showToast } = useToast();
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
    const [newTags, setNewTags] = useState('');
    const [activeTag, setActiveTag] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
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

    useScrollReveal('.reveal-on-scroll', 0.1, [courses]);

    const sendToGoogleSheets = async (applicationData) => {
        const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;
        if (!GOOGLE_SCRIPT_URL) return;

        try {
            const formData = new URLSearchParams();
            for (const key in applicationData) {
                formData.append(key, applicationData[key]);
            }

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
        } catch (error) {
            console.error('Google Sheets 전송 실패:', error);
        }
    };

    const clearForm = () => {
        setNewTitle(''); setNewDesc(''); setNewTeacher(''); setNewDay(''); setNewTime(''); setNewCapacity('20'); setNewTags('');
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
        setNewTags(course.tags ? course.tags.join(', ') : '');
        setIsCreateModalVisible(true);
    };

    const showDeleteConfirm = (id) => {
        setDeleteConfirm({ show: true, id: id });
    };

    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });
        setIsSaving(true);

        try {
            await deleteDoc(doc(db, 'courses', id));
            showToast('수업이 삭제되었습니다.', 'success');
        } catch (error) {
            console.error('수업 삭제 실패:', error);
            showToast('수업 삭제에 실패했습니다.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        if (!newTitle || !newDesc || !newTeacher || !newDay || !newTime || !newCapacity) {
            showToast('모든 항목을 입력해주세요.', 'error');
            return;
        }

        const capacity = parseInt(newCapacity);
        if (isNaN(capacity) || capacity <= 0) {
            showToast('정원은 1 이상의 숫자여야 합니다.', 'error');
            return;
        }

        setIsSaving(true);
        const courseData = {
            title: newTitle,
            description: newDesc,
            teacher: newTeacher,
            day: newDay,
            time: newTime,
            capacity,
            tags: newTags.split(',').map(t => t.trim()).filter(t => t),
            updatedAt: new Date().toISOString()
        };

        try {
            if (editingCourse) {
                await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
                showToast('수업 정보가 수정되었습니다.', 'success');
            } else {
                courseData.createdAt = new Date().toISOString();
                await addDoc(collection(db, 'courses'), courseData);
                showToast('새 수업이 개설되었습니다.', 'success');
            }
            clearForm();
        } catch (error) {
            console.error('수업 저장 실패:', error);
            showToast('수업 저장에 실패했습니다.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApplyClick = (course) => {
        setSelectedCourse(course);
        setIsApplyModalVisible(true);
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();

        if (!studentName || !studentGrade || !studentPhone || !parentPhone) {
            showToast('모든 항목을 입력해주세요.', 'error');
            return;
        }

        const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (!phoneRegex.test(studentPhone) || !phoneRegex.test(parentPhone)) {
            showToast('전화번호 형식이 올바르지 않습니다.', 'error');
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
                showToast('이미 해당 수업에 신청하셨습니다.', 'error');
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
                showToast('현재 정원 초과로 대기 접수되었습니다. 공석 발생 시 연락드리겠습니다.', 'info');
            } else {
                showToast(`'${selectedCourse.title}' 수강신청이 완료되었습니다!`, 'success');
            }

            setStudentName('');
            setStudentGrade('');
            setStudentPhone('');
            setParentPhone('');
            setIsApplyModalVisible(false);
            setSelectedCourse(null);
        } catch (error) {
            console.error('수강 신청 실패:', error);
            showToast('수강 신청에 실패했습니다. 다시 시도해주세요.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const allTags = Array.from(new Set(courses.flatMap(c => c.tags || [])));

    return (
        <div className="cr-v2-page">
            <div className="noise-overlay-v2"></div>

            {isSaving && (
                <div className="saving-overlay">
                    <div className="saving-bar"><div className="saving-bar-inner"></div></div>
                </div>
            )}

            <HeaderV2 />

            <div className="cr-v2-container">
                <header className="cr-v2-header reveal-on-scroll">
                    <div className="cr-v2-header-badge">ENROLLMENT</div>
                    <h1 className="cr-v2-title">Course Registration</h1>
                    <p className="cr-v2-subtitle">원하는 수업을 확인하고 지금 바로 신청하세요.</p>
                </header>

                <div className="cr-v2-controls reveal-on-scroll">
                    <div className="cr-v2-tags">
                        <button
                            className={`tag-btn ${activeTag === null ? 'active' : ''}`}
                            onClick={() => setActiveTag(null)}
                        >
                            #전체보기
                        </button>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                className={`tag-btn ${activeTag === tag ? 'active' : ''}`}
                                onClick={() => setActiveTag(tag)}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>

                    {isAdmin && (
                        <button className="cr-v2-btn primary btn-admin-add" onClick={() => setIsCreateModalVisible(true)}>
                            새 수업 개설
                        </button>
                    )}
                </div>

                <div className="cr-v2-card-grid">
                    {isLoading ? (
                        <div className="cr-v2-loading">수업 목록을 불러오는 중...</div>
                    ) : courses.length > 0 ? (
                        courses
                            .filter(course => !activeTag || (course.tags && course.tags.includes(activeTag)))
                            .map((course, index) => (
                                <div
                                    key={course.id}
                                    className="cr-course-card reveal-on-scroll"
                                    style={{ transitionDelay: `${index * 0.06}s` }}
                                >
                                    <div className="cr-course-card-tape"></div>
                                    <div className="cr-course-card-header">
                                        <span className="cr-course-card-badge">{course.teacher}</span>
                                        <h2 className="cr-course-card-title">{course.title}</h2>
                                        <span className="cr-course-card-schedule">
                                            {course.day} {course.time}
                                        </span>
                                    </div>
                                    <div className="cr-course-card-body">
                                        <p className="cr-course-card-desc">{course.description}</p>
                                    </div>

                                    {course.tags && course.tags.length > 0 && (
                                        <div className="cr-course-card-tags">
                                            {course.tags.map((tag, i) => (
                                                <span key={i} className="tag">#{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    {isAdmin && (
                                        <div className="cr-course-card-admin">
                                            <button onClick={() => handleEditClick(course)}>수정</button>
                                            <button className="delete" onClick={() => showDeleteConfirm(course.id)}>삭제</button>
                                        </div>
                                    )}

                                    <div className="cr-course-card-footer">
                                        <button
                                            className="cr-v2-btn primary full-width"
                                            onClick={() => handleApplyClick(course)}
                                        >
                                            수강신청
                                        </button>
                                    </div>
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

            {/* 수강신청 모달 */}
            {isApplyModalVisible && (
                <Modal onClose={() => setIsApplyModalVisible(false)} title="수강 신청">
                    <div className="cr-v2-apply-info">
                        <strong>신청 수업:</strong> {selectedCourse?.title} ({selectedCourse?.teacher})
                    </div>
                    <form className="cr-v2-form" onSubmit={handleApplicationSubmit}>
                        <input type="text" placeholder="학생 성함" value={studentName} onChange={e => setStudentName(e.target.value)} required disabled={isSubmitting} />

                        <div className="grade-selector-v2">
                            <label>학년 선택</label>
                            <div className="grade-btn-group">
                                {['초등', '중1', '중2', '중3', '고1', '고2', '고3', 'N수'].map(grade => (
                                    <button
                                        key={grade}
                                        type="button"
                                        className={`grade-btn ${studentGrade === grade ? 'active' : ''}`}
                                        onClick={() => setStudentGrade(grade)}
                                        disabled={isSubmitting}
                                    >
                                        {grade}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <input type="tel" placeholder="학생 전화번호" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} required disabled={isSubmitting} />
                        <input type="tel" placeholder="학부모 전화번호" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required disabled={isSubmitting} />
                        <button type="submit" disabled={isSubmitting} className="cr-v2-btn primary full-width">
                            {isSubmitting ? '처리 중...' : '신청하기'}
                        </button>
                    </form>
                </Modal>
            )}

            {/* 새 수업/수정 모달 (관리자 전용) */}
            {isCreateModalVisible && (
                <Modal onClose={clearForm} title={editingCourse ? '수업 정보 수정' : '새 수업 개설'}>
                    <form className="cr-v2-form" onSubmit={handleSubmitCourse}>
                        <input type="text" placeholder="강좌명" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                        <textarea placeholder="강좌 설명" value={newDesc} onChange={e => setNewDesc(e.target.value)} required />
                        <input type="text" placeholder="담당 강사" value={newTeacher} onChange={e => setNewTeacher(e.target.value)} required />
                        <div className="form-row-2">
                            <input type="text" placeholder="수업 요일 (예: 월·목)" value={newDay} onChange={e => setNewDay(e.target.value)} required />
                            <input type="text" placeholder="수업 시간 (예: 19:30-22:00)" value={newTime} onChange={e => setNewTime(e.target.value)} required />
                        </div>
                        <input type="number" placeholder="수강 정원" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} required />
                        <input type="text" placeholder="태그 (쉼표로 구분: 예: 수학, 고등부)" value={newTags} onChange={e => setNewTags(e.target.value)} />
                        <button type="submit" className="cr-v2-btn primary full-width">
                            {editingCourse ? '수정 완료' : '수업 개설'}
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

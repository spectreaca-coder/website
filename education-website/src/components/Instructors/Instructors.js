import React, { useState, useEffect } from 'react';
import './Instructors.css';
import Modal from '../Modal';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const Instructors = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [instructors, setInstructors] = useState([]);
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

  // Firestore에서 강사 목록 실시간 가져오기
  useEffect(() => {
    const q = query(collection(db, 'instructors'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const instructorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInstructors(instructorsData);
    }, (error) => {
      console.error('강사 목록 가져오기 실패:', error);
    });

    return () => unsubscribe();
  }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 강사 정보를 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'instructors', id));
        alert('강사 정보가 삭제되었습니다.');
      } catch (error) {
        console.error('강사 삭제 실패:', error);
        alert('강사 삭제에 실패했습니다.');
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('이미지 파일 크기는 2MB 이하여야 합니다.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setNewPhoto(compressedDataUrl);
        };
        img.onerror = () => {
          alert('이미지 로딩에 실패했습니다.');
          e.target.value = '';
        };
        img.src = reader.result;
      };
      reader.onerror = () => {
        alert('파일 읽기에 실패했습니다.');
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newSubject || !newComment) { alert('모든 항목을 입력해주세요.'); return; }

    try {
      if (editingInstructor) {
        // Update - Firestore
        await updateDoc(doc(db, 'instructors', editingInstructor.id), {
          name: newName,
          subject: newSubject,
          comment: newComment,
          career: newCareer,
          photo: newPhoto,
          updatedAt: new Date().toISOString()
        });
        alert('강사 정보가 수정되었습니다.');
      } else {
        // Create - Firestore
        await addDoc(collection(db, 'instructors'), {
          name: newName,
          subject: newSubject,
          comment: newComment,
          career: newCareer,
          photo: newPhoto || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        alert('새 강사가 추가되었습니다.');
      }
      clearForm();
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장에 실패했습니다. 이미지 파일이 너무 클 수 있습니다. 더 작은 이미지를 사용해주세요.');
    }
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
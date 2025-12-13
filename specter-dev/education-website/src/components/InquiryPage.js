import React, { useState, useEffect } from 'react';
import './InquiryPage.css';
import Modal from './Modal';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import DOMPurify from 'dompurify';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

Quill.register('modules/imageResize', ImageResize);

const InquiryPage = () => {
  const [inquiries, setInquiries] = useState([]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form state
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  useEffect(() => {
    const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  // Firestore에서 공지사항 목록 실시간 가져오기
  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInquiries(noticesData);
    }, (error) => {
      console.error('공지사항 목록 가져오기 실패:', error);
    });

    return () => unsubscribe();
  }, []);

  const clearForm = () => {
    setAuthor('');
    setTitle('');
    setContent('');
    setEditingInquiry(null);
    setIsFormVisible(false);
  };

  const handleEditClick = (inquiry) => {
    setEditingInquiry(inquiry);
    setAuthor(inquiry.author);
    setTitle(inquiry.title);
    setContent(inquiry.content);
    setIsFormVisible(true);
  };

  const showDeleteConfirm = (id) => {
    setDeleteConfirm({ show: true, id: id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });

    try {
      await deleteDoc(doc(db, 'notices', id));
      alert('공지가 삭제되었습니다.');
    } catch (error) {
      console.error('공지 삭제 실패:', error);
      alert('공지 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author || !title || !content) {
      alert('이름, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    try {
      if (editingInquiry) {
        // Update existing inquiry
        await updateDoc(doc(db, 'notices', editingInquiry.id), {
          author,
          title,
          content,
          updatedAt: new Date().toISOString()
        });
        alert('공지가 수정되었습니다.');
      } else {
        // Create new inquiry
        await addDoc(collection(db, 'notices'), {
          author,
          title,
          content,
          createdAt: new Date().toISOString(),
          createdAtDisplay: new Date().toLocaleDateString(),
          views: 0,
          updatedAt: new Date().toISOString()
        });
        alert('새 공지가 작성되었습니다.');
      }
      clearForm();
    } catch (error) {
      console.error('공지 저장 실패:', error);
      alert('공지 저장에 실패했습니다.');
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  };

  const handleViewInquiry = async (id) => {
    const inquiry = inquiries.find(inq => inq.id === id);
    setSelectedInquiry(inquiry);

    // 관리자가 아닐 때만 조회수 증가
    if (!isAdmin && inquiry) {
      try {
        await updateDoc(doc(db, 'notices', id), {
          views: (inquiry.views || 0) + 1
        });
      } catch (error) {
        console.error('조회수 업데이트 실패:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedInquiry(null);
  };

  return (
    <div className="inquiry-page-container">
      <h1>공지</h1>
      {isAdmin && !isFormVisible && (
        <div className="write-btn-container">
          <button onClick={() => setIsFormVisible(true)} className="write-btn">글쓰기</button>
        </div>
      )}
      {isFormVisible && (
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <h2>{editingInquiry ? '글 수정' : '새 글 작성'}</h2>
          <div className="form-row">
            <input type="text" placeholder="이름" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>
          <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="quill-container">
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} />
          </div>
          <div className="form-actions">
            <button type="button" onClick={clearForm} className="cancel-btn">취소</button>
            <button type="submit">{editingInquiry ? '수정 완료' : '작성하기'}</button>
          </div>
        </form>
      )}
      <div className="inquiry-list">
        <table>
          <thead>
            <tr>
              <th className="col-index">번호</th>
              <th className="col-title">제목</th>
              <th className="col-author">작성자</th>
              <th className="col-date">작성일</th>
              <th className="col-views">조회수</th>
              {isAdmin && <th className="col-manage">관리</th>}
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item, index) => (
              <tr key={item.id}>
                <td className="col-index">{inquiries.length - index}</td>
                <td className="col-title"><button type="button" className="title-button" onClick={(e) => { e.preventDefault(); handleViewInquiry(item.id); }}>{item.title}</button></td>
                <td className="col-author">{item.author}</td>
                <td className="col-date">{item.createdAtDisplay || new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="col-views">{item.views || 0}</td>
                {isAdmin && (
                  <td className="col-manage">
                    <button onClick={() => handleEditClick(item)} className="edit-btn">수정</button>
                    <button onClick={() => showDeleteConfirm(item.id)} className="inquiry-delete-btn">삭제</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedInquiry && (
        <Modal onClose={handleCloseModal}>
          <div className="modal-header"><h2>{selectedInquiry.title}</h2><div className="modal-meta"><span>작성자: {selectedInquiry.author}</span><span>작성일: {selectedInquiry.createdAtDisplay || new Date(selectedInquiry.createdAt).toLocaleDateString()}</span></div></div>
          <div className="modal-body">
            <div className="ql-editor" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedInquiry.content, {
                ADD_TAGS: ['iframe'],
                ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'class', 'src']
              })
            }} />
          </div>
        </Modal>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirm.show && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>정말로 이 글을 삭제하시겠습니까?</p>
            <div className="confirm-modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteConfirm({ show: false, id: null })}>취소</button>
              <button className="delete-btn" onClick={confirmDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryPage;

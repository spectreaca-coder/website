import React, { useState, useEffect } from 'react';
import './InquiryPage.css';
import Modal from './Modal';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import DOMPurify from 'dompurify';

Quill.register('modules/imageResize', ImageResize);

const InquiryPage = () => {
  const [inquiries, setInquiries] = useState(() => {
    const savedInquiries = localStorage.getItem('inquiries');
    return savedInquiries ? JSON.parse(savedInquiries) : [];
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form state
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  useEffect(() => {
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

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

  const handleDeleteInquiry = (id) => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      setInquiries(inquiries.filter(inq => inq.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author || !title || !content) {
      alert('이름, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    if (editingInquiry) {
      // Update existing inquiry
      const updatedInquiries = inquiries.map(inq =>
        inq.id === editingInquiry.id
          ? { ...inq, author, title, content }
          : inq
      );
      setInquiries(updatedInquiries);
    } else {
      // Create new inquiry
      const newInquiry = {
        id: Date.now(), author, title, content,
        createdAt: new Date().toLocaleDateString(), views: 0,
      };
      setInquiries([newInquiry, ...inquiries]);
    }
    clearForm();
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

  const handleViewInquiry = (id) => {
    const updatedInquiries = inquiries.map(inq => {
      if (inq.id === id && !isAdmin) { // Views don't increase for admin
        return { ...inq, views: inq.views + 1 };
      }
      return inq;
    });
    setInquiries(updatedInquiries);
    setSelectedInquiry(updatedInquiries.find(inq => inq.id === id));
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
                <td className="col-date">{item.createdAt}</td>
                <td className="col-views">{item.views}</td>
                {isAdmin && (
                  <td className="col-manage">
                    <button onClick={() => handleEditClick(item)} className="edit-btn">수정</button>
                    <button onClick={() => handleDeleteInquiry(item.id)} className="inquiry-delete-btn">삭제</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedInquiry && (
        <Modal onClose={handleCloseModal}>
          <div className="modal-header"><h2>{selectedInquiry.title}</h2><div className="modal-meta"><span>작성자: {selectedInquiry.author}</span><span>작성일: {selectedInquiry.createdAt}</span></div></div>
          <div className="modal-body">
            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedInquiry.content) }} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InquiryPage;

import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './HeroImageManager.css';

const HeroImageManager = () => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check Admin Status
        const adminStatus = sessionStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);

        if (!adminStatus) {
            navigate('/');
            return;
        }

        // Fetch Images sorted by order
        const q = query(collection(db, 'hero_images'), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedImages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setImages(fetchedImages);
            // Reset current slide if needed
            if (currentSlide >= fetchedImages.length && fetchedImages.length > 0) {
                setCurrentSlide(fetchedImages.length - 1);
            }
        });

        return () => unsubscribe();
    }, [navigate, currentSlide]);

    // File selection with preview
    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload image
    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            // 1. Upload to Storage
            const storageRef = ref(storage, `hero-images/${Date.now()}_${selectedFile.name}`);
            const snapshot = await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save to Firestore with order
            const newOrder = images.length > 0 ? Math.max(...images.map(i => i.order || 0)) + 1 : 0;

            await addDoc(collection(db, 'hero_images'), {
                url: downloadURL,
                path: snapshot.metadata.fullPath,
                name: selectedFile.name,
                order: newOrder,
                createdAt: serverTimestamp()
            });

            // Reset
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('업로드 실패: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Delete image from Firestore AND Storage
    const handleDelete = async (image) => {
        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'hero_images', image.id));

            // 2. Delete from Storage (if path exists)
            if (image.path) {
                const imageRef = ref(storage, image.path);
                await deleteObject(imageRef).catch(err => {
                    console.warn('Storage delete failed:', err);
                });
            }

            setShowDeleteConfirm(null);

            // Adjust current slide
            if (currentSlide >= images.length - 1 && currentSlide > 0) {
                setCurrentSlide(currentSlide - 1);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('삭제 실패: ' + error.message);
        }
    };

    // Move image (up/down or to specific position)
    const handleMove = async (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= images.length) return;

        const newImages = [...images];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);

        // Update orders in batch
        const batch = writeBatch(db);
        newImages.forEach((img, index) => {
            const docRef = doc(db, 'hero_images', img.id);
            batch.update(docRef, { order: index });
        });

        try {
            await batch.commit();
            setCurrentSlide(toIndex);
        } catch (error) {
            console.error('Reorder failed:', error);
            alert('순서 변경 실패');
        }
    };

    // Drag and drop handlers
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex) => {
        if (draggedIndex !== null && draggedIndex !== targetIndex) {
            handleMove(draggedIndex, targetIndex);
        }
        setDraggedIndex(null);
    };

    // Slideshow navigation
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrev = () => {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const goToNext = () => {
        setCurrentSlide(prev => (prev < images.length - 1 ? prev + 1 : 0));
    };

    if (!isAdmin) return null;

    return (
        <div className="hero-manager-container-v2">
            {/* Header */}
            <header className="manager-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    ← 홈으로
                </button>
                <h1>🖼️ 메인 배경 이미지 관리</h1>
                <div className="image-count">{images.length}개의 이미지</div>
            </header>

            <div className="manager-main">
                {/* Left: Slideshow Preview */}
                <div className="slideshow-section">
                    <div className="slideshow-container">
                        {images.length > 0 ? (
                            <>
                                <div className="slideshow-main">
                                    <img
                                        src={images[currentSlide]?.url}
                                        alt={images[currentSlide]?.name}
                                        className="slideshow-image"
                                    />
                                    <div className="slideshow-overlay">
                                        <span className="slide-number">{currentSlide + 1} / {images.length}</span>
                                        <span className="slide-name">{images[currentSlide]?.name}</span>
                                    </div>

                                    {/* Navigation arrows */}
                                    <button className="nav-arrow prev" onClick={goToPrev}>‹</button>
                                    <button className="nav-arrow next" onClick={goToNext}>›</button>

                                    {/* Action buttons */}
                                    <div className="slide-actions">
                                        <button
                                            className="action-btn move-left"
                                            onClick={() => handleMove(currentSlide, currentSlide - 1)}
                                            disabled={currentSlide === 0}
                                            title="앞으로 이동"
                                        >
                                            ⬅️ 앞으로
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => setShowDeleteConfirm(images[currentSlide])}
                                            title="삭제"
                                        >
                                            🗑️ 삭제
                                        </button>
                                        <button
                                            className="action-btn move-right"
                                            onClick={() => handleMove(currentSlide, currentSlide + 1)}
                                            disabled={currentSlide === images.length - 1}
                                            title="뒤로 이동"
                                        >
                                            뒤로 ➡️
                                        </button>
                                    </div>
                                </div>

                                {/* Thumbnail strip */}
                                <div className="thumbnail-strip">
                                    {images.map((img, index) => (
                                        <div
                                            key={img.id}
                                            className={`thumbnail ${index === currentSlide ? 'active' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                                            onClick={() => goToSlide(index)}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDrop(index)}
                                        >
                                            <img src={img.url} alt={img.name} />
                                            <span className="thumb-number">{index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="no-images">
                                <span className="no-images-icon">📷</span>
                                <p>등록된 배경 이미지가 없습니다</p>
                                <p className="sub">오른쪽에서 이미지를 추가해주세요</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Upload Section */}
                <div className="upload-section-v2">
                    <h2>새 이미지 추가</h2>

                    <div
                        className={`upload-dropzone ${previewUrl ? 'has-preview' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="upload-preview" />
                        ) : (
                            <>
                                <span className="upload-icon">📁</span>
                                <p>클릭하여 이미지 선택</p>
                                <p className="sub">JPG, PNG, WEBP 지원</p>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {selectedFile && (
                        <div className="file-info">
                            <span>📄 {selectedFile.name}</span>
                            <button
                                className="clear-btn"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <button
                        className="upload-btn-v2"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? (
                            <>⏳ 업로드 중...</>
                        ) : (
                            <>➕ 이미지 추가</>
                        )}
                    </button>

                    <div className="tips">
                        <h3>💡 사용 안내</h3>
                        <ul>
                            <li>썸네일을 <strong>드래그앤드롭</strong>하여 순서 변경</li>
                            <li>화살표 버튼으로 순서 이동</li>
                            <li>삭제 시 DB에서 완전히 제거됨</li>
                            <li>권장 크기: 1920x1080 이상</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="delete-modal" onClick={e => e.stopPropagation()}>
                        <h3>🗑️ 이미지 삭제</h3>
                        <p>이 이미지를 삭제하시겠습니까?</p>
                        <p className="warning">삭제된 이미지는 복구할 수 없습니다.</p>
                        <img src={showDeleteConfirm.url} alt="Delete target" className="delete-preview" />
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setShowDeleteConfirm(null)}>
                                취소
                            </button>
                            <button className="confirm-delete-btn" onClick={() => handleDelete(showDeleteConfirm)}>
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroImageManager;

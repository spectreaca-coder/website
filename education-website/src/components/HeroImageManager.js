import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Header from './Header'; // Using Standard Header
import Footer from './Footer';
import './HeroImageManager.css';

const HeroImageManager = () => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check Admin Status
        const adminStatus = sessionStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);

        if (!adminStatus) {
            window.location.href = '/'; // Simple redirect if not admin
            return;
        }

        // Fetch Images sorted by order
        const q = query(collection(db, 'hero_images'), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setImages(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
        });

        return () => unsubscribe();
    }, []);

    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            // 1. Upload to Storage
            const storageRef = ref(storage, `hero-images/${Date.now()}_${selectedFile.name}`);
            const snapshot = await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save to Firestore with order
            // Default new image to end of list
            const newOrder = images.length > 0 ? Math.max(...images.map(i => i.order || 0)) + 1 : 0;

            await addDoc(collection(db, 'hero_images'), {
                url: downloadURL,
                path: snapshot.metadata.fullPath, // Saved for deletion
                name: selectedFile.name,
                order: newOrder, // Add order
                createdAt: serverTimestamp()
            });

            setSelectedFile(null);
            // Reset file input
            document.getElementById('file-input').value = '';
            alert('이미지가 성공적으로 업로드되었습니다.');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('업로드 실패: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (image) => {
        if (!window.confirm('정말 이 이미지를 삭제하시겠습니까?')) return;

        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'hero_images', image.id));

            // 2. Delete from Storage (if path exists)
            if (image.path) {
                const imageRef = ref(storage, image.path);
                await deleteObject(imageRef).catch(err => {
                    console.warn('Storage delete failed (might verify manual cleanup):', err);
                });
            }

            alert('삭제되었습니다.');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('삭제 실패: ' + error.message);
        }
    };

    const handleMove = async (image, direction) => {
        const currentIndex = images.findIndex(img => img.id === image.id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= images.length) return;

        const targetImage = images[targetIndex];

        // Swap orders
        const currentOrder = image.order || 0;
        const targetOrder = targetImage.order || 0;

        try {
            await updateDoc(doc(db, 'hero_images', image.id), { order: targetOrder });
            await updateDoc(doc(db, 'hero_images', targetImage.id), { order: currentOrder });
        } catch (error) {
            console.error('Reorder failed:', error);
            alert('순서 변경 실패');
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="hero-manager-container">
            <Header />
            <div className="manager-content">
                <h2>메인 배너 이미지 관리</h2>

                <div className="upload-section">
                    <input
                        type="file"
                        id="file-input"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="upload-btn"
                    >
                        {uploading ? '업로드 중...' : '이미지 추가'}
                    </button>
                </div>

                <div className="image-grid">
                    {images.map((img, index) => (
                        <div key={img.id} className="image-card">
                            <img src={img.url} alt={img.name} />
                            <div className="image-info">
                                <span>{img.name}</span>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => handleMove(img, 'up')}
                                        disabled={index === 0}
                                        className="move-btn"
                                    >
                                        ⬆
                                    </button>
                                    <button
                                        onClick={() => handleMove(img, 'down')}
                                        disabled={index === images.length - 1}
                                        className="move-btn"
                                    >
                                        ⬇
                                    </button>
                                    <button onClick={() => handleDelete(img)} className="delete-btn">삭제</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && <p className="no-data">등록된 이미지가 없습니다.</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HeroImageManager;

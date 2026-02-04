// Firebase에 배경 이미지 업로드 스크립트
// 사용법: node upload-hero-images.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCUCopmqHwekmrCxci3zVze6HOpywtzkOg",
    authDomain: "specter-13594.firebaseapp.com",
    projectId: "specter-13594",
    storageBucket: "specter-13594.firebasestorage.app",
    messagingSenderId: "302766022298",
    appId: "1:302766022298:web:e4b7ee570d466c3b3f4923"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 업로드할 이미지 목록 (1~5번만, 6,7번 제외)
const imagesToUpload = [
    { file: 'main-bg-v2.jpg', name: 'main-bg-v2.jpg' },
    { file: 'hero-bg-new-1.png', name: 'hero-bg-new-1.png' },
    { file: 'hero-bg-2.jpg', name: 'hero-bg-2.jpg' },
    { file: 'hero-bg-new-2.png', name: 'hero-bg-new-2.png' },
    { file: 'hero-bg-4.jpg', name: 'hero-bg-4.jpg' },
    // 6번 hero-bg-new-3.jpg 제외
    // 7번 hero-bg-new-4.jpg 제외
];

async function uploadImages() {
    console.log('🚀 이미지 업로드 시작...\n');

    const assetsDir = path.join(__dirname, 'src', 'assets');

    for (let i = 0; i < imagesToUpload.length; i++) {
        const img = imagesToUpload[i];
        const filePath = path.join(assetsDir, img.file);

        console.log(`[${i + 1}/${imagesToUpload.length}] ${img.file} 업로드 중...`);

        try {
            // 파일 읽기
            const fileBuffer = fs.readFileSync(filePath);
            const blob = new Uint8Array(fileBuffer);

            // Storage에 업로드
            const storageRef = ref(storage, `hero-images/${Date.now()}_${img.file}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Firestore에 저장
            await addDoc(collection(db, 'hero_images'), {
                url: downloadURL,
                path: snapshot.metadata.fullPath,
                name: img.name,
                order: i,
                createdAt: serverTimestamp()
            });

            console.log(`   ✅ 완료: ${downloadURL.substring(0, 50)}...`);
        } catch (error) {
            console.error(`   ❌ 실패: ${error.message}`);
        }
    }

    console.log('\n🎉 업로드 완료!');
    process.exit(0);
}

uploadImages();

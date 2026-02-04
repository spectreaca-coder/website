// Firebase 설정 및 초기화
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 구성 정보 (환경변수에서 가져옴)
// Firebase 구성 정보 (Vercel 환경변수 이슈로 인해 하드코딩 적용)
const firebaseConfig = {
  apiKey: "AIzaSyCUCopmqHwekmrCxci3zVze6HOpywtzkOg",
  authDomain: "specter-13594.firebaseapp.com",
  projectId: "specter-13594",
  storageBucket: "specter-13594.firebasestorage.app",
  messagingSenderId: "302766022298",
  appId: "1:302766022298:web:e4b7ee570d466c3b3f4923"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 인스턴스
export const db = getFirestore(app);

// Firebase Storage 인스턴스 (이미지 업로드용)
export const storage = getStorage(app);

export default app;

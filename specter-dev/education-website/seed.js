const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const courses = [
    {
        title: '고1 수학 정규반',
        description: '수학의 정석부터 심화까지, 내신 완벽 대비',
        teacher: '김철수',
        day: '월/수/금',
        time: '18:00 - 22:00',
        capacity: 20,
        createdAt: new Date().toISOString()
    },
    {
        title: '수능 영어 실전반',
        description: 'EBS 연계 교재 100% 분석 및 변형 문제 풀이',
        teacher: '이영희',
        day: '화/목',
        time: '19:00 - 22:00',
        capacity: 15,
        createdAt: new Date().toISOString()
    },
    {
        title: '과학 논술 특강',
        description: '대입 수시 논술 전형 대비, 대학별 기출 분석',
        teacher: '박민수',
        day: '토/일',
        time: '14:00 - 18:00',
        capacity: 10,
        createdAt: new Date().toISOString()
    }
];

async function seed() {
    try {
        for (const course of courses) {
            await addDoc(collection(db, 'courses'), course);
            console.log(`Added course: ${course.title}`);
        }
        console.log('Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();

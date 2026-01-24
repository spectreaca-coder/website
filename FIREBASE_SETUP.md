# Firebase 설정 가이드

이 가이드는 Specter Academy 프로젝트를 Firebase Firestore와 연동하는 방법을 설명합니다.

## 1. Firebase 프로젝트 생성

### 1-1. Firebase Console 접속
1. https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 클릭

### 1-2. 프로젝트 생성
1. 프로젝트 이름: `specter-academy` (원하는 이름 입력)
2. Google Analytics: **사용 안 함** (선택사항)
3. "프로젝트 만들기" 클릭

## 2. Firestore Database 설정

### 2-1. Firestore 생성
1. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
2. "데이터베이스 만들기" 클릭
3. **프로덕션 모드에서 시작** 선택
4. 위치: `asia-northeast3 (서울)` 선택
5. "사용 설정" 클릭

### 2-2. 보안 규칙 설정
Firestore Database → 규칙 탭으로 이동하여 다음 규칙을 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 강좌 정보 - 모든 사용자 읽기 가능, 관리자만 쓰기
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // 공지사항 - 모든 사용자 읽기 가능, 관리자만 쓰기
    match /notices/{noticeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // 강사 정보 - 모든 사용자 읽기 가능, 관리자만 쓰기
    match /instructors/{instructorId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // 수강 신청 - 모든 사용자 읽기/쓰기 가능
    match /applications/{applicationId} {
      allow read, write: if true;
    }
  }
}
```

**게시** 버튼을 클릭하여 규칙을 저장합니다.

## 3. Firebase Web 앱 등록

### 3-1. 앱 추가
1. 프로젝트 개요 → 톱니바퀴(⚙️) → 프로젝트 설정
2. "내 앱" 섹션에서 **웹 아이콘(</>)** 클릭
3. 앱 닉네임: `specter-web` 입력
4. **Firebase Hosting 설정 안 함** (Vercel 사용 중)
5. "앱 등록" 클릭

### 3-2. Firebase 구성 정보 복사
다음과 같은 구성 정보가 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "specter-academy.firebaseapp.com",
  projectId: "specter-academy",
  storageBucket: "specter-academy.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**이 정보를 복사해두세요!** (다음 단계에서 사용)

## 4. 프로젝트 환경변수 설정

### 4-1. 로컬 개발 환경 (.env 파일)
`education-website/.env` 파일을 생성하고 다음 내용을 입력:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=여기에_apiKey_붙여넣기
REACT_APP_FIREBASE_AUTH_DOMAIN=여기에_authDomain_붙여넣기
REACT_APP_FIREBASE_PROJECT_ID=여기에_projectId_붙여넣기
REACT_APP_FIREBASE_STORAGE_BUCKET=여기에_storageBucket_붙여넣기
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=여기에_messagingSenderId_붙여넣기
REACT_APP_FIREBASE_APP_ID=여기에_appId_붙여넣기

# Google Sheets (기존)
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_URL_HERE/exec
```

### 4-2. Vercel 환경변수 설정
1. Vercel Dashboard (https://vercel.com) 접속
2. `specter` 프로젝트 선택
3. **Settings** → **Environment Variables** 클릭
4. 다음 변수들을 **하나씩** 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase의 apiKey | Production, Preview, Development |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase의 authDomain | Production, Preview, Development |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase의 projectId | Production, Preview, Development |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase의 storageBucket | Production, Preview, Development |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase의 messagingSenderId | Production, Preview, Development |
| `REACT_APP_FIREBASE_APP_ID` | Firebase의 appId | Production, Preview, Development |

5. **Save** 클릭

### 4-3. Vercel 재배포
환경변수 추가 후 **반드시 재배포**해야 합니다:
- Vercel Dashboard → Deployments → 최신 배포 → 우측 ... 버튼 → **Redeploy**

## 5. 로컬에서 테스트

```bash
cd education-website
npm install  # Firebase SDK가 자동으로 설치됨
npm start
```

브라우저에서 `http://localhost:3000` 접속하여 테스트

## 6. 데이터 마이그레이션 (선택사항)

현재 localStorage에 있는 데이터를 Firebase로 옮기려면:

1. 관리자 모드로 로그인
2. 강좌, 공지사항, 강사 정보를 **하나씩 다시 추가**
3. Firebase Console → Firestore Database에서 데이터 확인

## 🔥 주요 변경사항

- ✅ **강좌 정보**: Firestore `courses` 컬렉션에 저장
- ✅ **공지사항**: Firestore `notices` 컬렉션에 저장
- ✅ **강사 정보**: Firestore `instructors` 컬렉션에 저장
- ✅ **수강 신청**: Firestore `applications` 컬렉션에 저장
- ✅ **실시간 동기화**: 관리자가 추가하면 모든 사용자에게 즉시 반영
- ✅ **무료**: 일일 읽기 50,000회, 쓰기 20,000회까지 무료

## 📊 Firebase 사용량 확인

Firebase Console → Firestore Database → 사용량 탭에서 확인 가능

**일일 무료 한도:**
- 읽기: 50,000회
- 쓰기: 20,000회
- 삭제: 20,000회
- 저장공간: 1GB

소규모 학원은 무료 한도 내에서 충분히 사용 가능합니다.

## ❗ 문제 해결

### 문제 1: "Missing or insufficient permissions" 오류
- Firebase Console → Firestore Database → 규칙 탭에서 보안 규칙 재확인
- 규칙 게시 버튼을 눌렀는지 확인

### 문제 2: 환경변수가 적용 안 됨
- `.env` 파일이 `education-website/` 폴더에 있는지 확인
- Vercel에서 재배포 했는지 확인
- 로컬에서는 `npm start` 재시작

### 문제 3: Firebase 초기화 실패
- Firebase 구성 정보가 정확한지 확인
- 따옴표나 공백이 없는지 확인

## 📞 지원

문제가 발생하면 Firebase Console → 왼쪽 메뉴 하단 → 지원 → 문서 참조

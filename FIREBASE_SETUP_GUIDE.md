# Firebase 백엔드 설정 가이드

## 1단계: Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인
3. **"프로젝트 추가"** 또는 **"Add project"** 클릭

### 1.2 프로젝트 설정
```
프로젝트 이름: specter-academy
Google Analytics: 사용 안 함 (선택사항)
```

## 2단계: Firestore Database 생성

### 2.1 Database 활성화
1. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
2. **"데이터베이스 만들기"** 클릭
3. **프로덕션 모드**로 시작 선택
4. 위치: **asia-northeast3 (Seoul)** 선택
5. **"사용 설정"** 클릭

### 2.2 보안 규칙 설정
1. **"규칙"** 탭 클릭
2. 아래 코드를 복사해서 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 강좌 정보 - 모든 사용자 읽기 가능, 인증된 사용자만 쓰기
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 공지사항 - 모든 사용자 읽기 가능, 인증된 사용자만 쓰기
    match /notices/{noticeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 강사 정보 - 모든 사용자 읽기 가능, 인증된 사용자만 쓰기
    match /instructors/{instructorId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 강의 정보 - 모든 사용자 읽기 가능, 인증된 사용자만 쓰기
    match /lectures/{lectureId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 수강 신청 - 모든 사용자 읽기/쓰기 가능 (공개 양식)
    match /applications/{applicationId} {
      allow read, write: if true;
    }
  }
}
```

3. **"게시"** 버튼 클릭

## 3단계: 웹 앱 등록 및 환경변수 발급

### 3.1 웹 앱 추가
1. 프로젝트 개요 → ⚙️ 아이콘 → **"프로젝트 설정"**
2. 아래로 스크롤하여 **"내 앱"** 섹션 찾기
3. **웹 아이콘 `</>`** 클릭
4. 앱 닉네임: `specter-web` 입력
5. **Firebase 호스팅 설정**: 체크하지 않음
6. **"앱 등록"** 클릭

### 3.2 환경변수 복사
앱 등록 후 다음과 같은 설정 정보가 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "specter-academy.firebaseapp.com",
  projectId: "specter-academy",
  storageBucket: "specter-academy.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:..."
};
```

**⚠️ 이 값들을 복사해서 저장해두세요!**

## 4단계: 로컬 환경변수 설정

### 4.1 .env 파일 생성 (권한 필요 시 수동)
`education-website/.env` 파일에 다음 내용 작성:

```bash
# Admin credentials
REACT_APP_ADMIN_USERNAME=specter123
REACT_APP_ADMIN_PASSWORD=admin1031!

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=여기에_apiKey_붙여넣기
REACT_APP_FIREBASE_AUTH_DOMAIN=여기에_authDomain_붙여넣기
REACT_APP_FIREBASE_PROJECT_ID=여기에_projectId_붙여넣기
REACT_APP_FIREBASE_STORAGE_BUCKET=여기에_storageBucket_붙여넣기
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=여기에_messagingSenderId_붙여넣기
REACT_APP_FIREBASE_APP_ID=여기에_appId_붙여넣기

# Google Sheets (선택사항)
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_URL_HERE/exec
```

**주의**: 값을 붙여넣을 때 **따옴표 없이** 붙여넣으세요!

## 5단계: Vercel 환경변수 설정

### 5.1 Vercel Dashboard 접속
1. https://vercel.com 로그인
2. **specter** 프로젝트 선택
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Environment Variables** 클릭

### 5.2 환경변수 추가
다음 6개 변수를 하나씩 추가:

| Name | Value (Firebase에서 복사) | Environment |
|------|--------------------------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | AIza... | Production |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | specter-academy.firebaseapp.com | Production |
| `REACT_APP_FIREBASE_PROJECT_ID` | specter-academy | Production |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | specter-academy.appspot.com | Production |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | 123456789012 | Production |
| `REACT_APP_FIREBASE_APP_ID` | 1:123456789012:web:... | Production |

**각 변수 추가 방법:**
1. Name 입력
2. Value 붙여넣기 (따옴표 없이!)
3. Environment: **Production만 체크**
4. **Add** 버튼 클릭

### 5.3 관리자 계정 환경변수 추가 (선택사항)
```
REACT_APP_ADMIN_USERNAME = specter123
REACT_APP_ADMIN_PASSWORD = admin1031!
```

## 6단계: Vercel 재배포

### 6.1 재배포 실행
1. Vercel → **Deployments** 탭
2. 최상단 배포 클릭
3. 우측 **...** 메뉴 → **Redeploy** 선택
4. 팝업에서 **Redeploy** 다시 클릭
5. 배포 완료 대기 (2-3분)

## 7단계: 테스트 데이터 추가 (선택사항)

### 7.1 Firestore Console에서 직접 추가
1. Firestore Database → **데이터** 탭
2. **컬렉션 시작** 클릭

#### 샘플 공지사항 추가
```
컬렉션 ID: notices
문서 ID: 자동 ID

필드:
- title (string): "2024년 봄학기 수강신청 안내"
- content (string): "3월 1일부터 수강신청이 시작됩니다."
- author (string): "관리자"
- createdAt (string): "2024.03.01"
- views (number): 0
```

#### 샘플 강사 추가
```
컬렉션 ID: instructors
문서 ID: 자동 ID

필드:
- name (string): "김민수"
- subject (string): "수학"
- career (string): "서울대 수학교육과 졸업\n10년 교육 경력"
- photo (string): ""
```

## 완료 체크리스트

- [ ] Firebase 프로젝트 생성
- [ ] Firestore Database 활성화
- [ ] 보안 규칙 설정
- [ ] 웹 앱 등록 및 환경변수 발급
- [ ] Vercel 환경변수 추가
- [ ] Vercel 재배포
- [ ] 사이트 접속 테스트
- [ ] Firebase 데이터 읽기/쓰기 테스트

## 문제 해결

### "Permission denied" 에러
→ Firestore 보안 규칙 확인 후 재게시

### "Firebase not initialized" 에러
→ Vercel 환경변수 확인 후 재배포

### 데이터가 표시되지 않음
→ Firestore에 테스트 데이터 추가 필요

## 비용 확인

### Firebase Spark Plan (무료)
- 저장 용량: 1GB
- 문서 읽기: 50,000/일
- 문서 쓰기: 20,000/일
- 문서 삭제: 20,000/일

**일일 방문자 200명 예상 사용량:**
- 읽기: ~6,000/일 ✅ 충분
- 쓰기: ~200/일 ✅ 충분

무료 플랜으로 충분히 운영 가능합니다!

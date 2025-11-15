# Vercel 배포 및 도메인 설정 가이드

## 현재 배포 URL
`specter-165y-7ydecerbd-hyunbin-codes-projects.vercel.app`

---

## 1. 배포를 Public으로 만들기

### Vercel에서 Deployment Protection 해제

1. https://vercel.com 접속 및 로그인
2. **specter** 프로젝트 클릭
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **General** 클릭
5. 아래로 스크롤하여 **"Deployment Protection"** 섹션 찾기
6. 다음 중 하나로 설정:
   - **Standard Protection** 선택 (추천)
   - 또는 **Off** 선택
7. **Save** 클릭

**결과:** 이제 로그인 없이 누구나 사이트에 접속 가능합니다.

---

## 2. Firebase 환경변수 설정

배포는 되었지만 Firebase 환경변수가 없으면 데이터를 불러올 수 없습니다.

### 2-1. Firebase 프로젝트 생성 (아직 안 했다면)

1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `specter-academy` 입력
4. Google Analytics: 사용 안 함
5. "프로젝트 만들기" 클릭

### 2-2. Firestore Database 생성

1. 왼쪽 메뉴 → **Firestore Database** 클릭
2. "데이터베이스 만들기" 클릭
3. **프로덕션 모드** 선택 → 다음
4. 위치: **asia-northeast3 (Seoul)** 선택 → 사용 설정

### 2-3. 보안 규칙 설정

1. Firestore Database → **규칙** 탭
2. 아래 내용 복사 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /applications/{applicationId} {
      allow read, write: if true;
    }
  }
}
```

3. **게시** 클릭

### 2-4. 웹 앱 등록

1. 프로젝트 개요 → ⚙️ → **프로젝트 설정**
2. 아래 "내 앱" → **웹 아이콘 (</>)** 클릭
3. 앱 닉네임: `specter-web` 입력
4. Firebase 호스팅: 체크 안 함
5. **앱 등록** 클릭

**다음 정보가 표시됩니다:**

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

**이 값들을 복사해두세요!**

### 2-5. Vercel에 환경변수 추가

1. Vercel → specter → **Settings** → **Environment Variables**
2. 다음 6개 변수를 하나씩 추가:

#### 변수 목록:

| Name | Value (Firebase에서 복사) |
|------|---------------------------|
| `REACT_APP_FIREBASE_API_KEY` | `AIza...` (apiKey 값) |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `specter-academy.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `specter-academy` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `specter-academy.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` (숫자만) |
| `REACT_APP_FIREBASE_APP_ID` | `1:123456789012:web:...` |

**각 변수 추가 시:**
- Name: 위 표의 Name 입력
- Value: Firebase에서 복사한 값 입력 (**따옴표 없이!**)
- Environment: **Production만 체크**
- **Add** 클릭

### 2-6. Vercel 재배포

환경변수 추가 후 반드시 재배포:

1. Vercel → **Deployments** 탭
2. 최상단 배포 클릭
3. 우측 **...** → **Redeploy** 클릭
4. 확인 팝업에서 **Redeploy** 다시 클릭
5. 배포 완료 대기 (2-3분)

---

## 3. 커스텀 도메인 연결 (선택사항)

### 3-1. 도메인 구매

**추천 사이트:**
- 가비아: https://www.gabia.com (한국, 한글 지원)
- Namecheap: https://www.namecheap.com (해외, 저렴)
- Cloudflare: https://www.cloudflare.com (최저가)

**예시:** `specter-academy.com` 구매 (연 15,000원~)

### 3-2. Vercel에 도메인 추가

1. Vercel → specter → **Settings** → **Domains**
2. **Add** 버튼 클릭
3. 구매한 도메인 입력 (예: `specter-academy.com`)
4. **Add** 클릭

Vercel이 DNS 설정 정보를 표시합니다.

### 3-3. DNS 설정

#### 방법 A: Vercel 네임서버 사용 (권장 - 간단)

**도메인 등록업체에서:**
1. 도메인 관리 페이지 접속
2. 네임서버 설정 찾기
3. 다음으로 변경:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. 저장

#### 방법 B: A 레코드 추가 (수동)

**도메인 등록업체 DNS 설정에서:**

| 타입 | 호스트 | 값 | TTL |
|------|--------|-----|-----|
| A | @ | 76.76.21.21 | 3600 |
| A | www | 76.76.21.21 | 3600 |

**적용 시간:** 10분~48시간 (보통 1시간 내)

---

## 4. 배포 확인

### 체크리스트:

- [ ] 시크릿 모드에서 사이트 접속 가능
- [ ] 로그인 없이 접속 가능
- [ ] 관리자 로그인 가능 (specter123 / admin1031!)
- [ ] 강좌, 공지, 강사 추가/삭제 가능
- [ ] 시크릿 모드에서 추가한 내용이 보임
- [ ] 도메인으로 접속 가능 (설정한 경우)
- [ ] HTTPS 활성화됨

---

## 5. 문제 해결

### "Failed to initialize Firebase" 에러
→ Vercel 환경변수 확인 후 재배포

### "Permission denied" 에러
→ Firebase Firestore 보안 규칙 확인 후 게시

### 도메인이 안 열림
→ DNS 전파 대기 (최대 48시간, 보통 1시간)
→ https://dnschecker.org 에서 확인

### 로그인 화면이 계속 나옴
→ Vercel Settings → General → Deployment Protection OFF

---

## 6. 유용한 링크

- Vercel 대시보드: https://vercel.com
- Firebase Console: https://console.firebase.google.com
- DNS 전파 확인: https://dnschecker.org
- SSL 확인: https://www.ssllabs.com/ssltest/

---

## 관리자 정보

- 아이디: `specter123`
- 비밀번호: `admin1031!`
- 로그인 방법: 우측 상단 로고 클릭 (데스크탑)

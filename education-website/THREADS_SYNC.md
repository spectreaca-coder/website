# Threads 동기화 설정

## 개요
쓰레드 데이터를 Firestore에 저장하고 자동으로 동기화하는 시스템입니다.

## 아키텍처
1. **Vercel Serverless Function** (`/api/sync-threads.js`): RSS 피드를 크롤링하여 Firestore에 저장
2. **Vercel Cron Job**: 매시간 자동으로 동기화 실행
3. **Frontend**: Firestore에서 빠르게 데이터 읽기

## 필수 환경 변수

Vercel Dashboard에서 다음 환경 변수들을 설정해야 합니다:

### Firebase Admin SDK
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### Firebase Admin SDK 생성 방법
1. Firebase Console > 프로젝트 설정 > 서비스 계정
2. "새 비공개 키 생성" 클릭
3. 다운로드된 JSON 파일에서 값 복사:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key`  → `FIREBASE_PRIVATE_KEY` (따옴표 포함)

## Firestore 규칙

`firestore.rules`에 다음 규칙 추가:

```
match /threads/{document=**} {
  allow read: if true;  // 모든 사용자가 읽기 가능
  allow write: if false; // 클라이언트에서는 쓰기 불가 (서버만 가능)
}
```

## 수동 동기화

필요시 수동으로 동기화할 수 있습니다:

```bash
curl https://your-domain.vercel.app/api/sync-threads
```

## 배포 후 확인

1. Vercel Dashboard > Deployments > Functions
2. `sync-threads` 함수 확인
3. Logs에서 실행 확인

## 문제 해결

### "Permission denied" 에러
→ Firestore 규칙에서 threads 컬렉션 읽기 권한 확인

### "Invalid credentials" 에러
→ 환경 변수가 올바르게 설정되었는지 확인

### 데이터가 업데이트되지 않음
→ Vercel Cron Jobs 페이지에서 실행 로그 확인

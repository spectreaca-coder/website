# 구글 스프레드시트 자동 연동 설정 가이드

수강 신청 데이터를 구글 스프레드시트에 자동으로 저장하는 기능입니다.

## 📋 기능 설명

- ✅ 수강 신청 시 구글 스프레드시트에 자동 기록
- ✅ 수업별로 시트가 자동 생성됨
- ✅ 최신 신청이 최상단에 표시 (시간 역순)
- ✅ 정원 관리 및 대기자 자동 등록
- ✅ 전체 통계 시트 자동 생성 및 업데이트
- ✅ 실시간 업데이트 (API 요금 무료)

## 🚀 설정 방법

### 1단계: 구글 스프레드시트 생성

1. [Google Drive](https://drive.google.com) 접속
2. 새로 만들기 → Google Sheets → 빈 스프레드시트
3. 파일 이름 변경 (예: "스펙터 학원 수강신청 관리")
4. URL에서 스프레드시트 ID 복사
   - URL 형식: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - 예시: `https://docs.google.com/spreadsheets/d/1abc123def456ghi789jkl/edit`
   - 이 경우 ID는 `1abc123def456ghi789jkl`

### 2단계: Google Apps Script 설정

1. 생성한 스프레드시트에서 **확장 프로그램** → **Apps Script** 클릭
2. 기존 코드 모두 삭제
3. `Code.gs` 파일의 내용을 복사하여 붙여넣기
4. **중요!** 코드 상단의 `SPREADSHEET_ID` 변수를 본인의 스프레드시트 ID로 변경:

```javascript
const SPREADSHEET_ID = '1abc123def456ghi789jkl'; // 여기에 본인의 ID 입력
```

5. 저장 버튼 클릭 (💾)
6. 프로젝트 이름 입력 (예: "수강신청 자동화")

### 3단계: 웹 앱 배포

1. Apps Script 편집기 오른쪽 상단의 **배포** → **새 배포** 클릭
2. 유형 선택: ⚙️ 아이콘 클릭 → **웹 앱** 선택
3. 설정:
   - 설명: "수강신청 자동 저장" (선택사항)
   - **실행 계정**: "나"
   - **액세스 권한**: "모든 사용자"
4. **배포** 버튼 클릭
5. 권한 승인:
   - "액세스 권한 검토" 클릭
   - Google 계정 선택
   - "고급" 클릭 → "프로젝트 이름(안전하지 않음)으로 이동" 클릭
   - "허용" 클릭
6. **웹 앱 URL 복사** (매우 중요!)
   - 형식: `https://script.google.com/macros/s/ABC...XYZ/exec`

### 4단계: React 앱에 URL 설정

#### 로컬 개발 환경

1. 프로젝트 루트의 `education-website` 폴더에 `.env` 파일이 없으면 생성
2. `.env` 파일에 다음 내용 추가:

```env
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec
REACT_APP_ADMIN_USERNAME=specter123
REACT_APP_ADMIN_PASSWORD=admin1031!
```

3. 앱 재시작

#### Vercel 배포 환경

1. [Vercel Dashboard](https://vercel.com) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 클릭
4. 새 변수 추가:
   - **Name**: `REACT_APP_GOOGLE_SCRIPT_URL`
   - **Value**: 복사한 웹 앱 URL
   - **Environment**: Production, Preview, Development 모두 체크
5. **Save** 클릭
6. 프로젝트 재배포

## 📊 스프레드시트 구조

### 수업별 시트

각 수업마다 자동으로 시트가 생성되며, 다음 정보가 기록됩니다:

| 신청일시 | 학생이름 | 학년 | 학생전화번호 | 부모님전화번호 | 수업명 | 강사명 | 요일 | 시간 | 상태 |
|---------|---------|------|-------------|---------------|--------|--------|------|------|------|
| 2025-01-15 14:30:25 | 홍길동 | 고2 | 010-1234-5678 | 010-9876-5432 | 수학 정규반 | 김현빈 | 월,수,금 | 19:00-22:00 | 확정 |

- **상태**:
  - 🟢 **확정**: 정원 내 신청 (연한 녹색 배경)
  - 🟠 **대기**: 정원 초과 신청 (연한 주황색 배경)

### 전체 통계 시트

"📊 전체 통계" 시트가 첫 번째 탭으로 자동 생성되며, 모든 수업의 통계를 한눈에 볼 수 있습니다:

| 수업명 | 확정 인원 | 대기 인원 | 총 신청 인원 |
|--------|----------|----------|------------|
| 2025학년도 6월 모의평가 대비 | 18 | 5 | 23 |
| 내신 대비 특별반 | 12 | 0 | 12 |

## 🔧 테스트 방법

1. Google Apps Script 편집기에서 **실행** 버튼 클릭
2. 함수 선택: `doGet`
3. 실행 → 오류 없이 완료되면 성공
4. 웹사이트에서 실제 수강 신청 테스트
5. 스프레드시트에 데이터가 추가되는지 확인

## ⚠️ 주의사항

1. **SPREADSHEET_ID를 반드시 변경하세요!**
   - 변경하지 않으면 작동하지 않습니다.

2. **배포 시 "모든 사용자" 액세스 권한 필요**
   - 웹사이트에서 접근하려면 공개 설정이 필요합니다.

3. **Apps Script 수정 후 재배포**
   - 코드를 수정했다면 "배포 관리" → "수정" → "버전" → "새 버전" → "배포"

4. **API 제한**
   - Google Apps Script는 하루 최대 20,000회 실행 가능
   - 일일 200명 예상이므로 충분합니다.

## 🆘 문제 해결

### 스프레드시트에 데이터가 추가되지 않음

1. 브라우저 개발자 도구(F12) → Console 탭 확인
2. `.env` 파일의 URL이 정확한지 확인
3. Apps Script 배포 URL이 올바른지 확인
4. 스프레드시트 ID가 올바른지 확인

### "권한이 없습니다" 오류

1. Apps Script 배포 설정에서 "모든 사용자" 액세스로 변경
2. 재배포 후 새 URL 사용

### 코드 수정 후 반영 안됨

1. Apps Script에서 코드 수정 → 저장
2. "배포" → "배포 관리" → 기존 배포 옆 연필 아이콘 → "버전" → "새 버전" → "배포"
3. 변경된 URL 사용 (URL이 바뀌지 않았다면 그대로 사용)

## 💡 추가 기능

원하는 경우 Google Apps Script에 다음 기능을 추가할 수 있습니다:

- 이메일 자동 발송
- SMS 알림 (외부 API 연동 필요)
- 데이터 백업
- 통계 차트 자동 생성

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. [Google Apps Script 문서](https://developers.google.com/apps-script)
2. [Vercel 환경 변수 가이드](https://vercel.com/docs/concepts/projects/environment-variables)

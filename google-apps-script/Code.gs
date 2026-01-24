/**
 * 구글 스프레드시트 자동 업데이트 스크립트
 *
 * 설정 방법:
 * 1. Google Drive에서 새 스프레드시트 생성
 * 2. 도구 > 스크립트 편집기 클릭
 * 3. 이 코드를 복사하여 붙여넣기
 * 4. 아래 SPREADSHEET_ID를 본인의 스프레드시트 ID로 변경
 * 5. 배포 > 새 배포 > 유형: 웹 앱
 * 6. 실행 계정: 나
 * 7. 액세스 권한: 모든 사용자
 * 8. 배포 후 URL을 복사하여 .env 파일의 REACT_APP_GOOGLE_SCRIPT_URL에 추가
 */

// 본인의 스프레드시트 ID로 변경하세요
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/**
 * POST 요청 처리 함수
 */
function doPost(e) {
  try {
    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 스프레드시트 열기
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // 수업별 시트 가져오기 또는 생성
    const sheetName = sanitizeSheetName(data.courseTitle);
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      // 시트가 없으면 생성
      sheet = ss.insertSheet(sheetName);

      // 헤더 행 추가
      const headers = [
        '신청일시',
        '학생이름',
        '학년',
        '학생전화번호',
        '부모님전화번호',
        '수업명',
        '강사명',
        '요일',
        '시간',
        '상태'
      ];

      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // 헤더 스타일 설정
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#4285F4')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');

      // 열 너비 자동 조정
      for (let i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
      }
    }

    // 새 데이터 행 추가 (최상단에 추가)
    const newRow = [
      data.appliedDate || new Date().toLocaleString('ko-KR'),
      data.studentName,
      data.studentGrade,
      data.studentPhone,
      data.parentPhone,
      data.courseTitle,
      data.courseTeacher || '',
      data.courseDay || '',
      data.courseTime || '',
      data.status === 'waiting' ? '대기' : '확정'
    ];

    // 2번째 행에 삽입 (헤더 다음)
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, newRow.length).setValues([newRow]);

    // 상태에 따라 색상 지정
    if (data.status === 'waiting') {
      sheet.getRange(2, 10).setBackground('#FFF4E5'); // 대기: 연한 주황색
    } else {
      sheet.getRange(2, 10).setBackground('#E8F5E9'); // 확정: 연한 녹색
    }

    // 전체 시트 통계 업데이트
    updateSummarySheet(ss);

    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET 요청 처리 함수 (테스트용)
 */
function doGet(e) {
  return ContentService.createTextOutput('Google Sheets API is working!');
}

/**
 * 시트 이름 정제 함수
 */
function sanitizeSheetName(name) {
  // 시트 이름에 사용할 수 없는 문자 제거
  let sanitized = name.replace(/[:\\/\?\*\[\]]/g, '');
  // 최대 길이 제한 (31자)
  if (sanitized.length > 31) {
    sanitized = sanitized.substring(0, 31);
  }
  return sanitized;
}

/**
 * 전체 통계 시트 업데이트
 */
function updateSummarySheet(ss) {
  const summarySheetName = '📊 전체 통계';
  let summarySheet = ss.getSheetByName(summarySheetName);

  if (!summarySheet) {
    summarySheet = ss.insertSheet(summarySheetName, 0); // 첫 번째 위치에 생성
  } else {
    summarySheet.clear();
  }

  // 헤더
  const headers = ['수업명', '확정 인원', '대기 인원', '총 신청 인원'];
  summarySheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  summarySheet.getRange(1, 1, 1, headers.length)
    .setBackground('#34A853')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // 모든 시트 순회
  const sheets = ss.getSheets();
  let rowIndex = 2;

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();

    // 통계 시트 자체는 건너뛰기
    if (sheetName === summarySheetName) return;

    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    if (values.length <= 1) return; // 헤더만 있으면 건너뛰기

    let confirmedCount = 0;
    let waitingCount = 0;

    // 첫 번째 행(헤더) 제외하고 데이터 카운트
    for (let i = 1; i < values.length; i++) {
      const status = values[i][9]; // 상태 컬럼 (J열, 인덱스 9)
      if (status === '확정') {
        confirmedCount++;
      } else if (status === '대기') {
        waitingCount++;
      }
    }

    const totalCount = confirmedCount + waitingCount;

    summarySheet.getRange(rowIndex, 1, 1, 4).setValues([[
      sheetName,
      confirmedCount,
      waitingCount,
      totalCount
    ]]);

    rowIndex++;
  });

  // 열 너비 자동 조정
  for (let i = 1; i <= headers.length; i++) {
    summarySheet.autoResizeColumn(i);
  }
}

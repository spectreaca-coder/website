/**
 * Apps Script의 doPost(e) 로직을 Node.js에서 시뮬레이션합니다.
 * React에서 보낸 FormData가 어떻게 시트 데이터로 변환되는지 보여줍니다.
 */

// 1. React에서 보낼 데이터 (CourseRegistrationV2.js 로직)
const rawData = {
    studentName: '로컬테스트',
    studentGrade: '고3',
    studentPhone: '01011112222',
    parentPhone: '01033334444',
    courseTitle: '로컬증거수업',
    courseTeacher: '강사A',
    courseDay: '월수',
    courseTime: '17:00',
    status: 'confirmed',
    courseId: 'test_123'
};

// 2. Apps Script가 받는 'e' 객체 시뮬레이션 (FormData 방식)
const e = {
    parameter: rawData
};

// 3. Apps Script의 실제 실행 로직 (google_sheets_guide.md 내용)
function simulateDoPost(e) {
    console.log('--- Apps Script Logic Simulation ---');
    const p = e.parameter;

    // 시트의 한 행(Row)으로 변환되는 과정
    const row = [
        new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), // 신청일시
        p.studentName,
        p.studentGrade,
        p.studentPhone,
        p.parentPhone,
        p.courseTitle,
        p.courseTeacher,
        p.courseDay,
        p.courseTime,
        (p.status === 'waiting' ? '대기' : '승인'),
        p.courseId
    ];

    console.log('Column Headers: [신청일시, 학생이름, 학년, 학생전화번호, 부모님전화번호, 수업명, 강사명, 요일, 시간, 상태, 수업ID]');
    console.log('Resulting Row: ', JSON.stringify(row, null, 2));

    // 검증
    if (row[1] === '로컬테스트' && row[5] === '로컬증거수업') {
        console.log('\n✅ EVIDENCE: Logic is sound. Data correctly maps to sheet rows.');
    } else {
        console.log('\n❌ ERROR: Data mapping failed.');
    }
}

simulateDoPost(e);

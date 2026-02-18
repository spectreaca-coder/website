
const https = require('https');
const { URL } = require('url');

const scriptUrl = 'https://script.google.com/macros/s/AKfycbwOxUMQC3US41W3BYCHTedXHjs6_E3bDR78iAJ8Qqnpf2lPifIfuda7bUwenPUfiXfO/exec';

function testGoogleScript() {
    console.log('Testing Google Apps Script URL...');
    console.log('URL:', scriptUrl);

    const data = new URLSearchParams({
        studentName: 'TestBot',
        studentGrade: 'TestGrade',
        studentPhone: '01000000000',
        parentPhone: '01000000000',
        courseTitle: 'ConnectivityTest',
        status: 'waiting'
    }).toString();

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = https.request(scriptUrl, options, (res) => {
        console.log(`\nStatus Code: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);

        if (res.statusCode === 302) {
            console.log('\n✅ SUCCESS: Google Apps Script accepted the request (302 Redirect).');
            console.log('Redirect Location:', res.headers.location);
            console.log('This confirms the URL is valid and the Web App is running.');
        } else if (res.statusCode === 200) {
            // Sometimes it returns 200 directly if not using ContentService correctly
            console.log('\n✅ SUCCESS: Google Apps Script returned 200 OK.');
        } else {
            console.log('\n❌ FAILED: Unexpected status code.');

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        }
    });

    req.on('error', (e) => {
        console.error(`\n❌ ERROR: ${e.message}`);
    });

    req.write(data);
    req.end();
}

testGoogleScript();

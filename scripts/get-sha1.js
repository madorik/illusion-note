const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('SHA-1 키 찾기 도구');
console.log('=================');
console.log('이 스크립트는 Google Sign-In에 필요한 SHA-1 키를 찾습니다.');
console.log('찾은 SHA-1 키는 Firebase 콘솔에 등록해야 합니다.');
console.log('\n');

// 안드로이드 프로젝트 경로 확인
const androidPath = path.join(__dirname, '..', 'android');
if (!fs.existsSync(androidPath)) {
  console.error('안드로이드 프로젝트 폴더를 찾을 수 없습니다.');
  process.exit(1);
}

// 운영체제 확인
const isWindows = os.platform() === 'win32';
const gradleCommand = isWindows ? '.\\gradlew.bat' : './gradlew';

// Signing Report 실행
console.log('Signing Report 실행 중...');
console.log('\n');

const command = `cd "${androidPath}" && ${gradleCommand} signingReport`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`오류 발생: ${error.message}`);
    console.error('안드로이드 프로젝트에서 gradlew signingReport 명령을 실행할 수 없습니다.');
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  
  // SHA-1 키 찾기
  const sha1Regex = /SHA1: ([0-9A-F:]+)/g;
  const matches = stdout.matchAll(sha1Regex);
  
  const shaKeys = [];
  for (const match of matches) {
    if (match[1]) {
      shaKeys.push(match[1]);
    }
  }
  
  if (shaKeys.length === 0) {
    console.log('SHA-1 키를 찾을 수 없습니다.');
    console.log('전체 출력:');
    console.log(stdout);
  } else {
    console.log('찾은 SHA-1 키:');
    console.log('=================');
    
    shaKeys.forEach((key, index) => {
      console.log(`${index + 1}. ${key}`);
    });
    
    console.log('\n');
    console.log('위 SHA-1 키를 Firebase 콘솔에 등록하세요:');
    console.log('1. Firebase 콘솔(https://console.firebase.google.com)에 로그인');
    console.log('2. 프로젝트 선택 > 설정 > 프로젝트 설정');
    console.log('3. 아래로 스크롤하여 "SHA 인증서 지문" 섹션으로 이동');
    console.log('4. "지문 추가" 버튼 클릭 후 위의 SHA-1 키 입력');
    console.log('5. 변경사항 저장 후 google-services.json 파일 새로 다운로드');
    console.log('6. 다운로드한 파일을 android/app/ 폴더에 복사');
  }
}); 
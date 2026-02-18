import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// 환경 변수 로드
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

/**
 * ads.txt 파일을 자동으로 생성합니다.
 * 환경 변수 NEXT_PUBLIC_ADSENSE_PUBLISHER_ID에서 게시자 ID를 가져옵니다.
 */
function generateAdsTxt() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'pub-YOUR_PUBLISHER_ID';
  
  const adsTxtContent = `# Google AdSense ads.txt
# 구글 애드센스 승인 후 발급받은 게시자 ID를 사용합니다.
# 환경 변수 NEXT_PUBLIC_ADSENSE_PUBLISHER_ID에서 자동으로 가져옵니다.

google.com, ${publisherId}, DIRECT, f08c47fec0942fa0
`;

  const adsTxtPath = path.join(process.cwd(), 'public', 'ads.txt');
  
  try {
    fs.writeFileSync(adsTxtPath, adsTxtContent, 'utf-8');
    console.log('✅ ads.txt 파일이 성공적으로 생성되었습니다.');
    console.log(`📄 위치: ${adsTxtPath}`);
    console.log(`🆔 게시자 ID: ${publisherId}`);
  } catch (error) {
    console.error('❌ ads.txt 파일 생성 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트로 직접 실행할 때
if (require.main === module) {
  generateAdsTxt();
}

export { generateAdsTxt };


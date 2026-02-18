import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침 - 물리치료 병원 정보',
  description: '물리치료 병원 정보 서비스의 개인정보처리방침입니다.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-50 mb-8'>
          개인정보처리방침
        </h1>
        
        <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6'>
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              1. 개인정보의 처리 목적
            </h2>
            <p>
              물리치료 병원 정보 서비스(이하 "서비스")는 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
              개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>서비스 제공: 병원 정보 검색 및 조회 서비스 제공</li>
              <li>서비스 개선: 사용자 경험 향상을 위한 통계 분석</li>
              <li>고객 지원: 문의사항 처리 및 답변</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              2. 개인정보의 처리 및 보유기간
            </h2>
            <p>
              서비스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
              개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <p>
              각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>서비스 이용 기록: 서비스 종료 시까지</li>
              <li>문의사항: 문의 처리 완료 후 3년</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              3. 처리하는 개인정보의 항목
            </h2>
            <p>
              서비스는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>자동 수집 항목: IP 주소, 쿠키, 접속 로그, 기기 정보</li>
              <li>선택 항목: 이메일 주소(문의 시), 이름(문의 시)</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              4. 개인정보의 제3자 제공
            </h2>
            <p>
              서비스는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>정보주체가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              5. 개인정보처리의 위탁
            </h2>
            <p>
              서비스는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>데이터 저장: Supabase (클라우드 데이터베이스 서비스)</li>
              <li>웹 호스팅: Vercel (웹사이트 호스팅 서비스)</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              6. 정보주체의 권리·의무 및 행사방법
            </h2>
            <p>
              정보주체는 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
              권리 행사는 서비스의 문의하기 페이지를 통해 요청하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              7. 개인정보의 파기
            </h2>
            <p>
              서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다. 파기의 절차 및 방법은 다음과 같습니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>파기 절차: 불필요한 개인정보에 대해 파기 결정을 하고, 내부 방침에 따라 파기합니다.</li>
              <li>파기 방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              8. 개인정보 보호책임자
            </h2>
            <p>
              서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
              불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <p>
              문의사항이 있으시면 문의하기 페이지를 통해 연락주시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              9. 개인정보 처리방침 변경
            </h2>
            <p>
              이 개인정보처리방침은 2024년 1월 1일부터 적용되며, 법령·정책 또는 보안기술의 변경에 따라
              내용의 추가·삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 서비스의 공지사항을 통하여
              고지할 것입니다.
            </p>
          </section>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <Link
            href='/'
            className='text-blue-600 dark:text-blue-400 hover:underline'>
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}


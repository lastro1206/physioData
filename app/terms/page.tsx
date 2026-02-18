import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관 - 물리치료 병원 정보',
  description: '물리치료 병원 정보 서비스의 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-50 mb-8'>
          이용약관
        </h1>
        
        <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6'>
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제1조 (목적)
            </h2>
            <p>
              본 약관은 물리치료 병원 정보 서비스(이하 "서비스")가 제공하는 온라인 서비스의 이용과 관련하여
              서비스와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제2조 (정의)
            </h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>"서비스"란 물리치료 병원 정보를 제공하는 웹사이트 및 관련 서비스를 의미합니다.</li>
              <li>"이용자"란 본 약관에 따라 서비스를 이용하는 자를 의미합니다.</li>
              <li>"콘텐츠"란 서비스를 통해 제공되는 모든 정보, 자료, 데이터 등을 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제3조 (약관의 효력 및 변경)
            </h2>
            <p>
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
              서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며,
              변경된 약관은 공지사항을 통해 공지함으로써 효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제4조 (서비스의 제공 및 변경)
            </h2>
            <p>
              서비스는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>전국 물리치료 병원 정보 검색 및 조회</li>
              <li>병원별 상세 정보 제공 (주소, 전화번호, 진료과목 등)</li>
              <li>지역별 병원 필터링 및 정렬 기능</li>
              <li>물리치료 비용 정보 및 가이드 제공</li>
            </ul>
            <p>
              서비스는 운영상, 기술상의 필요에 따라 제공하는 서비스의 내용을 변경할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제5조 (서비스의 중단)
            </h2>
            <p>
              서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는
              서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 서비스는 사전에 공지하거나,
              사후에 통지할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제6조 (이용자의 의무)
            </h2>
            <p>
              이용자는 다음 행위를 하여서는 안 됩니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>서비스에 허위 정보를 등록하거나 게시하는 행위</li>
              <li>서비스의 운영을 방해하거나 서비스의 명예를 훼손하는 행위</li>
              <li>다른 이용자의 서비스 이용을 방해하는 행위</li>
              <li>서비스가 제공하는 정보를 무단으로 복제, 배포하는 행위</li>
              <li>관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제7조 (면책조항)
            </h2>
            <p>
              서비스는 다음의 경우에 대해 책임을 지지 않습니다:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>서비스에 게시된 병원 정보의 정확성, 신뢰성, 완전성에 대한 보장</li>
              <li>이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대한 책임</li>
              <li>이용자의 귀책사유로 인한 서비스 이용의 장애</li>
              <li>천재지변 또는 이에 준하는 불가항력으로 인한 서비스의 중단</li>
            </ul>
            <p>
              서비스에 제공되는 병원 정보는 공공데이터를 기반으로 하며, 실제 병원 방문 시 정보가 다를 수 있습니다.
              정확한 정보는 해당 병원에 직접 문의하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              제8조 (분쟁의 해결)
            </h2>
            <p>
              서비스와 이용자 간에 발생한 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고,
              주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4'>
              부칙
            </h2>
            <p>
              본 약관은 2024년 1월 1일부터 시행됩니다.
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


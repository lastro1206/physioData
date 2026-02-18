import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '물리치료 효과를 높이는 방법 - PhysioData 가이드',
  description: '물리치료의 효과를 극대화하기 위해서는 정기적인 방문뿐만 아니라 집에서의 운동, 생활 습관 개선 등이 중요합니다.',
};

export default function MaximizingEffectivenessPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4'>
            물리치료 효과를 높이는 방법
          </h1>
        </div>

        <article className='prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'>
          <h2>정기적인 방문</h2>
          <p>
            물리치료의 효과를 극대화하기 위해서는 정기적인 방문뿐만 아니라, 병원에서 배운 운동을 집에서도 꾸준히 실시하는 것이 중요합니다. 
            치료사가 권장하는 운동을 매일 실시하면 치료 효과가 크게 향상됩니다.
          </p>

          <h2>집에서의 운동</h2>
          <p>
            병원에서 배운 운동을 집에서도 꾸준히 실시하는 것이 중요합니다. 치료사가 제공하는 운동 가이드를 따르고, 
            정확한 자세로 운동을 수행하는 것이 치료 효과를 높이는 핵심입니다.
          </p>

          <h2>생활 습관 개선</h2>
          <p>
            생활 습관 개선, 올바른 자세 유지, 충분한 휴식 등도 치료 효과에 큰 영향을 미칩니다. 
            특히 장시간 앉아있는 직장인이나 잘못된 자세로 인한 통증의 경우, 생활 습관 개선이 치료의 핵심입니다.
          </p>

          <h2>치료사와의 소통</h2>
          <p>
            치료사와의 소통을 통해 개인 맞춤형 치료 계획을 수립하는 것이 좋습니다. 
            통증이나 불편함이 있을 때 즉시 치료사에게 알리고, 치료 과정에서의 변화를 공유하는 것이 중요합니다.
          </p>

          <h2>인내심과 꾸준함</h2>
          <p>
            물리치료는 즉각적인 효과보다는 장기적인 개선을 목표로 합니다. 
            인내심을 가지고 꾸준히 치료를 받으면 점진적으로 개선되는 것을 느낄 수 있습니다.
          </p>

          <h2>추가 팁</h2>
          <ul>
            <li>치료 전후 충분한 준비운동과 마무리 운동</li>
            <li>통증이 심할 때는 무리하지 않기</li>
            <li>치료사가 권장하는 보조 장비 사용</li>
            <li>충분한 수면과 영양 섭취</li>
          </ul>

          <div className='mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              치료 효과는 개인차가 있으므로, 자신의 상태에 맞는 속도로 치료를 진행하는 것이 중요합니다.
            </p>
          </div>
        </article>

        <div className='mt-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium'>
            병원 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}


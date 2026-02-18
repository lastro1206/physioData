'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // 실제로는 API 엔드포인트로 전송하거나 이메일 서비스를 연동해야 합니다
    // 여기서는 시뮬레이션만 합니다
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-50 mb-8'>
          문의하기
        </h1>

        <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-8'>
          <p>
            서비스 이용 중 궁금한 점이나 문의사항이 있으시면 아래 양식을 작성해 주세요.
            최대한 빠른 시간 내에 답변드리겠습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              이름 <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='name'
              name='name'
              required
              value={formData.name}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              이메일 <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              id='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label htmlFor='subject' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              문의 유형 <span className='text-red-500'>*</span>
            </label>
            <select
              id='subject'
              name='subject'
              required
              value={formData.subject}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option value=''>선택해주세요</option>
              <option value='service'>서비스 이용 문의</option>
              <option value='data'>데이터 오류 신고</option>
              <option value='suggestion'>개선 제안</option>
              <option value='other'>기타</option>
            </select>
          </div>

          <div>
            <label htmlFor='message' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              문의 내용 <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='message'
              name='message'
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='문의하실 내용을 자세히 작성해주세요.'
            />
          </div>

          {submitStatus === 'success' && (
            <div className='p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg'>
              <p className='text-green-800 dark:text-green-200'>
                문의가 성공적으로 전송되었습니다. 빠른 시간 내에 답변드리겠습니다.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className='p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg'>
              <p className='text-red-800 dark:text-red-200'>
                전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </div>
          )}

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors'>
            {isSubmitting ? '전송 중...' : '문의하기'}
          </button>
        </form>

        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-50'>
              기타 연락처
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              긴급한 문의사항이 있으시면 이메일로 연락주시기 바랍니다.
            </p>
          </div>
        </div>

        <div className='mt-8'>
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


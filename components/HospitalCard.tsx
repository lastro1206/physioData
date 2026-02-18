import Link from "next/link";
import Image from "next/image";
import { Hospital } from "@/types/hospital";
import { formatCost } from "@/lib/utils";

interface HospitalCardProps {
  hospital: Hospital;
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Link
      href={`/hospitals/${hospital.id}`}
      className='block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400'>
      {hospital.image && (
        <div className='aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900 relative'>
          <Image
            src={hospital.image}
            alt={hospital.name}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      )}
      <div className='p-5'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2 line-clamp-2'>
          {hospital.name}
        </h3>

        {hospital.description && (
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
            {hospital.description}
          </p>
        )}

        <div className='space-y-2 mb-4'>
          <div className='flex items-start gap-2'>
            <svg
              className='w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            <span className='text-sm text-gray-600 dark:text-gray-400 flex-1'>
              {hospital.address}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
            </svg>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {hospital.phone}
            </span>
          </div>
        </div>

        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {hospital.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs'>
                {specialty}
              </span>
            ))}
            {hospital.specialties.length > 3 && (
              <span className='px-2 py-1 text-gray-500 dark:text-gray-400 text-xs'>
                +{hospital.specialties.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

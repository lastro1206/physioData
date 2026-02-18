import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getHospitalById, getAllHospitalIdsPaginated } from "@/lib/hospitals";
import { Hospital } from "@/types/hospital";
import AdPlaceholder from "@/components/AdPlaceholder";
import AdsUnit from "@/components/AdsUnit";
import AdBanner from "@/components/common/AdBanner";
import TreatmentPriceDashboard from "@/components/TreatmentPriceDashboard";
import PriceGuide from "@/components/PriceGuide";
import ThemeToggle from "@/components/ThemeToggle";
import { getRegionalAveragePriceForAddress } from "@/lib/calculate-regional-average";
import { extractRegion } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const hospital = await getHospitalById(parseInt(id, 10));

  if (!hospital) {
    return {
      title: "병원을 찾을 수 없습니다",
      description: "요청하신 병원 정보를 찾을 수 없습니다.",
    };
  }

  // 지역 추출
  const region = extractRegion(hospital.address) || '전국';
  
  // 제목 최적화: [병원명] - [지역] 도수치료 및 재활 정보 | PhysioData
  const title = `${hospital.name} - ${region} 도수치료 및 재활 정보 | PhysioData`;
  
  const description = hospital.description
    ? hospital.description
    : `${hospital.name}은(는) ${hospital.address}에 위치한 물리치료 및 재활 병원입니다. ${region} 지역의 도수치료 및 재활 치료 정보를 제공합니다.`;

  // BASE_URL 고정: https:// 프로토콜 포함
  const baseUrl = 'https://physio-data.vercel.app';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      siteName: "PhysioData",
      url: `${baseUrl}/hospitals/${id}`,
      ...(hospital.image && {
        images: [
          {
            url: hospital.image,
            width: 1200,
            height: 630,
            alt: hospital.name,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(hospital.image && {
        images: [hospital.image],
      }),
    },
    alternates: {
      canonical: `${baseUrl}/hospitals/${id}`,
    },
  };
}

function generateStructuredData(hospital: Hospital, id: string) {
  // BASE_URL 고정: https:// 프로토콜 포함
  const baseUrl = 'https://physio-data.vercel.app';
  
  const region = extractRegion(hospital.address) || '전국';

  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${baseUrl}/hospitals/${id}`,
    "name": hospital.name,
    "description": hospital.description || `${hospital.name}은(는) ${hospital.address}에 위치한 물리치료 및 재활 병원입니다.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hospital.address,
      "addressCountry": "KR",
      "addressRegion": region,
    },
    "telephone": hospital.phone,
    "medicalSpecialty": [
      "물리치료",
      "도수치료",
      "재활 치료",
      ...(hospital.specialties || [])
    ],
    ...(hospital.image && {
      "image": hospital.image,
    }),
    ...(hospital.latitude &&
      hospital.longitude && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": hospital.latitude,
          "longitude": hospital.longitude,
        },
      }),
    ...(hospital.operatingHours && {
      "openingHoursSpecification": Object.entries(hospital.operatingHours).map(
        ([day, hours]) => {
          const [open, close] = hours.split("-");
          return {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": day,
            "opens": open?.trim(),
            "closes": close?.trim(),
          };
        }
      ),
    }),
    "url": `${baseUrl}/hospitals/${id}`,
    "areaServed": {
      "@type": "City",
      "name": region
    }
  };
}

export default async function HospitalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const hospital = await getHospitalById(parseInt(id, 10));

  if (!hospital) {
    notFound();
  }

  // 지역 평균 가격 조회 (병원 가격이 없을 경우 사용)
  const regionalData =
    hospital.treatment_price === null || hospital.treatment_price === undefined
      ? await getRegionalAveragePriceForAddress(hospital.address, "N0001")
      : null;

  // 타입 변환 (averagePrice -> avgPrice)
  const areaAveragePrice = regionalData
    ? {
        region: regionalData.region,
        avgPrice: regionalData.averagePrice,
        maxPrice: regionalData.maxPrice,
        minPrice: regionalData.minPrice,
      }
    : null;

  const structuredData = generateStructuredData(hospital, id);

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className='min-h-screen bg-white dark:bg-black'>
        <header className='border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black'>
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4'>
                  {hospital.name}
                </h1>
                {hospital.description && (
                  <p className='text-lg text-gray-600 dark:text-gray-400'>
                    {hospital.description}
                  </p>
                )}
              </div>
              {/* 다크모드 토글 버튼 */}
              <div className='flex-shrink-0 ml-4'>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* 광고: 상단 (병원 이름 바로 아래) */}
          <AdsUnit slot="YOUR_SLOT_ID_1" className="mb-8" />

          <div className='mb-8'>
            <AdPlaceholder position='top' />
          </div>

          {hospital.image && (
            <section className='mb-8'>
              <div className='relative w-full h-auto aspect-video rounded-lg shadow-lg overflow-hidden'>
                <Image
                  src={hospital.image}
                  alt={hospital.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
                  priority
                />
              </div>
            </section>
          )}

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4'>
              기본 정보
            </h2>
            <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  주소
                </dt>
                <dd className='mt-1 text-base text-gray-900 dark:text-gray-50'>
                  <address className='not-italic'>{hospital.address}</address>
                </dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  전화번호
                </dt>
                <dd className='mt-1 text-base text-gray-900 dark:text-gray-50'>
                  <a
                    href={`tel:${hospital.phone}`}
                    className='text-blue-600 dark:text-blue-400 hover:underline'>
                    {hospital.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          {/* 배너 광고: 가격 정보 섹션 바로 위 */}
          <AdBanner slot="YOUR_BANNER_SLOT_ID" className="mb-6" />

          {/* 비용 대시보드 */}
          <TreatmentPriceDashboard
            hospital={hospital}
            areaAveragePrice={areaAveragePrice}
          />

          {/* 광고: 비용 정보 바로 아래 */}
          <AdsUnit slot="YOUR_SLOT_ID_3" className="mb-6" />

          <div className='mb-8'>
            <AdPlaceholder position='middle' />
          </div>

          {hospital.operatingHours &&
            Object.keys(hospital.operatingHours).length > 0 && (
              <section className='mb-8'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4'>
                  운영시간
                </h2>
                <dl className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                  {Object.entries(hospital.operatingHours).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className='flex justify-between'>
                        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                          {day}
                        </dt>
                        <dd className='text-base text-gray-900 dark:text-gray-50'>
                          <time dateTime={hours}>{hours}</time>
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </section>
            )}

          {hospital.specialties && hospital.specialties.length > 0 && (
            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4'>
                진료과목
              </h2>
              <ul className='flex flex-wrap gap-2'>
                {hospital.specialties.map((specialty, index) => (
                  <li
                    key={index}
                    className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                    {specialty}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* SEO 최적화: PriceGuide 컴포넌트 (데이터 있으면 통계치, 없으면 전문가 가이드) */}
          <PriceGuide
            hospitalAddress={hospital.address}
            itemCd='N0001'
          />

          <div className='mb-8 mt-8'>
            <AdPlaceholder position='bottom' />
          </div>
        </main>
      </article>
    </>
  );
}

/**
 * 정적 페이지 생성을 위한 파라미터를 생성합니다.
 * 빌드 타임에 모든 병원 상세 페이지를 미리 생성합니다.
 */
export async function generateStaticParams() {
  try {
    // 페이지네이션을 사용하여 대량 데이터 처리
    const ids = await getAllHospitalIdsPaginated(1000);

    if (ids.length === 0) {
      console.warn("No hospital IDs found. Static generation will be skipped.");
      return [];
    }

    console.log(`Generating static params for ${ids.length} hospitals`);

    return ids.map((id) => ({
      id: id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // 빌드 실패를 방지하기 위해 빈 배열 반환
    // 프로덕션에서는 에러를 로깅하고 빈 배열을 반환하여
    // 빌드가 계속 진행되도록 합니다.
    return [];
  }
}

/**
 * ISR 설정: 1시간마다 페이지를 재생성합니다.
 * 데이터가 변경되면 최대 1시간 내에 자동으로 업데이트됩니다.
 */
export const revalidate = 3600; // 1시간 (초 단위)

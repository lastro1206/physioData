interface AdPlaceholderProps {
  position: "top" | "middle" | "bottom";
  className?: string;
}

export default function AdPlaceholder({
  position,
  className = "",
}: AdPlaceholderProps) {
  // 위치별 최적화된 크기 설정
  const getAdSize = () => {
    switch (position) {
      case "top":
        return "w-full h-24 sm:h-32 md:h-40"; // 상단: 가로 배너형
      case "middle":
        return "w-full h-64 sm:h-80 md:h-96"; // 중간: 큰 광고 영역
      case "bottom":
        return "w-full h-24 sm:h-32 md:h-40"; // 하단: 가로 배너형
      default:
        return "w-full h-32";
    }
  };

  const getLabel = () => {
    switch (position) {
      case "top":
        return "상단 광고 영역";
      case "middle":
        return "본문 중간 광고 영역";
      case "bottom":
        return "하단 광고 영역";
      default:
        return "광고 영역";
    }
  };

  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg ${getAdSize()} ${className}`}
      aria-label={getLabel()}
      role='region'>
      <div className='text-center px-4'>
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
          {getLabel()}
        </p>
        <p className='text-xs text-gray-400 dark:text-gray-500'>
          Google AdSense 광고가 여기에 표시됩니다
        </p>
        {/* 실제 광고 코드는 여기에 삽입 */}
        {/* 
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
        ></ins>
        <script>
          {(adsbygoogle = window.adsbygoogle || []).push({})}
        </script>
        */}
      </div>
    </div>
  );
}

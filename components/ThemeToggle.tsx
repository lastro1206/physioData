"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // hydration mismatch 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테마 전환 핸들러
  const handleToggle = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // HTML 태그에 직접 클래스 추가/제거 (확실한 방법)
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      // 기존 클래스 제거
      html.classList.remove("light", "dark");
      // 새 클래스 추가
      html.classList.add(newTheme);
      
      // 강제로 스타일 재계산
      html.style.colorScheme = newTheme === "dark" ? "dark" : "light";
    }
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="테마 전환"
      title={currentTheme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}>
      {currentTheme === "dark" ? (
        // 라이트 모드 아이콘 (태양)
        <svg
          className="w-5 h-5 text-yellow-500 dark:text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // 다크 모드 아이콘 (달)
        <svg
          className="w-5 h-5 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}


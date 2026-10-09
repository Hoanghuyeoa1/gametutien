// lib/navigation-utils.ts
// Tiện ích điều hướng mượt mà và làm nổi bật phần tử giao diện người dùng

/**
 * Cuộn mượt mà khung nhìn đến elementId và kích hoạt hiệu ứng hào quang phát sáng trong 1.5 giây
 */
export function scrollToElementWithHighlight(elementId: string): void {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(elementId);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const highlightClasses = [
    'ring-2',
    'ring-amber-400',
    'shadow-[0_0_20px_rgba(251,191,36,0.5)]',
    'transition-all',
    'duration-500'
  ];

  el.classList.add(...highlightClasses);
  setTimeout(() => {
    el.classList.remove('ring-2', 'ring-amber-400', 'shadow-[0_0_20px_rgba(251,191,36,0.5)]');
  }, 1500);
}

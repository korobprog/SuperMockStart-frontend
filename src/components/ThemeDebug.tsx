import { useTheme } from '@/hooks/useTheme';

export function ThemeDebug() {
  const { theme, getCurrentTheme, isDark, isLight, isSystem } = useTheme();

  return (
    <div className="theme-debug">
      <div>Theme: {theme}</div>
      <div>Current: {getCurrentTheme()}</div>
      <div>Is Dark: {isDark() ? 'Yes' : 'No'}</div>
      <div>Is Light: {isLight() ? 'Yes' : 'No'}</div>
      <div>Is System: {isSystem() ? 'Yes' : 'No'}</div>
      <div>HTML Classes: {document.documentElement.className}</div>
    </div>
  );
}

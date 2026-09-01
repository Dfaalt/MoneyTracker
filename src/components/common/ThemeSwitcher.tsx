import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_OPTIONS, ThemeAccent } from '../../context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold shadow-sm"
        title="Ganti Tema Warna (Hijau / Biru / Indigo)"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white/20 transition-transform scale-110"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />
        <span className="hidden sm:inline">{currentTheme.name}</span>
        <Palette className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl glass-modal border border-slate-700/80 shadow-2xl z-50 animate-scale-in space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-theme" />
              <span>Pilih Aksen Tema</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Live Accent</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id as ThemeAccent);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border border-slate-600 shadow-sm text-white'
                      : 'hover:bg-slate-800/50 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${opt.gradientFrom}, ${opt.gradientTo})`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate leading-tight">{opt.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{opt.label}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: opt.primaryColor }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

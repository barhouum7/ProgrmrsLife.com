import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import toast from 'react-hot-toast';

export default function ColorConverter() {
  const [hexInput, setHexInput] = useState('#8B5CF6');
  const [rgbR, setRgbR] = useState(139);
  const [rgbG, setRgbG] = useState(92);
  const [rgbB, setRgbB] = useState(246);

  const hex = useMemo(() => {
    const r = Math.max(0, Math.min(255, rgbR));
    const g = Math.max(0, Math.min(255, rgbG));
    const b = Math.max(0, Math.min(255, rgbB));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  }, [rgbR, rgbG, rgbB]);

  const hsl = useMemo(() => {
    const r = rgbR / 255;
    const g = rgbG / 255;
    const b = rgbB / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, [rgbR, rgbG, rgbB]);

  const handleHexChange = useCallback((val) => {
    setHexInput(val);
    const clean = val.replace('#', '');
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      setRgbR(parseInt(clean.substr(0, 2), 16));
      setRgbG(parseInt(clean.substr(2, 2), 16));
      setRgbB(parseInt(clean.substr(4, 2), 16));
    } else if (/^[0-9a-fA-F]{3}$/.test(clean)) {
      setRgbR(parseInt(clean[0] + clean[0], 16));
      setRgbG(parseInt(clean[1] + clean[1], 16));
      setRgbB(parseInt(clean[2] + clean[2], 16));
    }
  }, []);

  const copyValue = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`, { duration: 1500 });
    } catch { /* ignore */ }
  }, []);

  // Generate complementary palette
  const palette = useMemo(() => {
    const baseH = hsl.h;
    const colors = [
      { h: baseH, s: hsl.s, l: hsl.l, label: 'Base' },
      { h: (baseH + 30) % 360, s: hsl.s, l: hsl.l, label: 'Analogous' },
      { h: (baseH + 180) % 360, s: hsl.s, l: hsl.l, label: 'Complement' },
      { h: (baseH + 120) % 360, s: hsl.s, l: hsl.l, label: 'Triadic' },
      { h: baseH, s: hsl.s, l: Math.min(90, hsl.l + 20), label: 'Lighter' },
      { h: baseH, s: hsl.s, l: Math.max(10, hsl.l - 20), label: 'Darker' },
    ];
    return colors;
  }, [hsl]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Color Converter",
    "description": "Free online color converter. Convert between HEX, RGB, and HSL formats with live preview and palette generator.",
    "url": "https://www.progrmrslife.com/tools/color-converter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="color-converter" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Color Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert between HEX, RGB, and HSL. Includes live preview and a harmony palette generator.
          </p>
        </div>

        {/* Color Preview */}
        <div
          className="color-swatch shadow-lg"
          style={{ background: hex }}
        />

        {/* Color Picker (native) */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pick a color:</label>
          <input
            type="color"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* HEX */}
          <div className="tool-glass p-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">HEX</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                className="tool-editor flex-1 py-2 text-center font-mono font-bold"
                style={{ minHeight: 'auto', resize: 'none' }}
                maxLength={7}
              />
              <button onClick={() => copyValue(hex)} className="tool-btn tool-btn-secondary py-1 px-2" type="button" title="Copy">
                📋
              </button>
            </div>
          </div>

          {/* RGB */}
          <div className="tool-glass p-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">RGB</label>
            <div className="flex gap-1 items-center">
              <input type="number" value={rgbR} min={0} max={255}
                onChange={(e) => { setRgbR(Number(e.target.value)); setHexInput(''); }}
                className="tool-editor flex-1 py-2 text-center font-mono text-sm" style={{ minHeight: 'auto', resize: 'none' }} />
              <input type="number" value={rgbG} min={0} max={255}
                onChange={(e) => { setRgbG(Number(e.target.value)); setHexInput(''); }}
                className="tool-editor flex-1 py-2 text-center font-mono text-sm" style={{ minHeight: 'auto', resize: 'none' }} />
              <input type="number" value={rgbB} min={0} max={255}
                onChange={(e) => { setRgbB(Number(e.target.value)); setHexInput(''); }}
                className="tool-editor flex-1 py-2 text-center font-mono text-sm" style={{ minHeight: 'auto', resize: 'none' }} />
              <button onClick={() => copyValue(`rgb(${rgbR}, ${rgbG}, ${rgbB})`)} className="tool-btn tool-btn-secondary py-1 px-2" type="button" title="Copy">
                📋
              </button>
            </div>
          </div>

          {/* HSL */}
          <div className="tool-glass p-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">HSL</label>
            <div className="flex items-center gap-2">
              <code className="tool-output flex-1 py-2 text-center font-mono text-sm" style={{ minHeight: 'auto' }}>
                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
              </code>
              <button onClick={() => copyValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="tool-btn tool-btn-secondary py-1 px-2" type="button" title="Copy">
                📋
              </button>
            </div>
          </div>
        </div>

        {/* Palette */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            🎨 Color Harmony Palette
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {palette.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  // Convert HSL back to RGB approximately
                  const hslStr = `hsl(${c.h}, ${c.s}%, ${c.l}%)`;
                  copyValue(hslStr);
                }}
                type="button"
                className="group"
              >
                <div
                  className="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-700 
                             transition-transform group-hover:scale-105 shadow-sm"
                  style={{ background: `hsl(${c.h}, ${c.s}%, ${c.l}%)` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-center">
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CSS Variables output */}
        <div className="tool-glass p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">CSS Ready</h3>
          <pre className="tool-output text-xs" style={{ minHeight: 'auto' }}>
{`--color-primary: ${hex};
--color-primary-rgb: ${rgbR}, ${rgbG}, ${rgbB};
--color-primary-hsl: ${hsl.h}, ${hsl.s}%, ${hsl.l}%;`}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

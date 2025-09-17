import React from 'react';

export const ColorPalettePreview = ({ colors, label }: { colors: string[]; label?: string }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex space-x-2">
        {colors.map((c) => (
          <div key={c} className="w-8 h-8 rounded-sm border" style={{ backgroundColor: c }} aria-hidden />
        ))}
      </div>
      {label ? (
        <div>
          <div className="mb-1"><strong>{label}</strong></div>
          <div className="text-xs font-mono text-muted-foreground">{colors.join(' • ')}</div>
        </div>
      ) : null}
    </div>
  );
};

export default ColorPalettePreview;

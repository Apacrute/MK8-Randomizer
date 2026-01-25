// src/components/Selector.tsx

interface SelectorProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function Selector({ label, checked, onChange }: SelectorProps) {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

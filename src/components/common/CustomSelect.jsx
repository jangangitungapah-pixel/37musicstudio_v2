import { useEffect, useRef, useState } from "react";

export default function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Pilih opsi",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = value || placeholder;

  return (
    <div className={`custom-select ${isOpen ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedLabel}</span>
        <span className="custom-select-arrow" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="custom-select-menu" role="listbox" aria-label={label}>
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${isSelected ? "is-selected" : ""}`}
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span>{option}</span>
                {isSelected && <span className="custom-select-check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AdminSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Pilih opsi",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <label className={`admin-custom-select-field ${className}`} ref={rootRef}>
      {label && <span>{label}</span>}

      <button
        type="button"
        className={`admin-custom-select-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <strong>{selectedOption?.label || placeholder}</strong>
          {selectedOption?.description && <small>{selectedOption.description}</small>}
        </span>

        <ChevronDown size={18} />
      </button>

      {isOpen && (
        <div className="admin-custom-select-popover">
          <div className="admin-custom-select-list">
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={option.value === value ? "is-selected" : ""}
                onClick={() => handleSelect(option.value)}
              >
                <span>
                  <strong>{option.label}</strong>
                  {option.description && <small>{option.description}</small>}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </label>
  );
}
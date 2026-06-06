import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

function getPopoverPosition(triggerElement) {
  if (!triggerElement || typeof window === "undefined") {
    return {
      left: 0,
      top: 0,
      width: 240,
      maxHeight: 280,
    };
  }

  const rect = triggerElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const gutter = 10;
  const preferredTop = rect.bottom + 8;
  const availableBottom = viewportHeight - preferredTop - gutter;
  const availableTop = rect.top - gutter;
  const shouldOpenUp = availableBottom < 180 && availableTop > availableBottom;

  const width = Math.min(Math.max(rect.width, 220), viewportWidth - gutter * 2);
  const left = Math.min(Math.max(rect.left, gutter), viewportWidth - width - gutter);
  const top = shouldOpenUp
    ? Math.max(gutter, rect.top - Math.min(320, availableTop) - 8)
    : preferredTop;

  const maxHeight = shouldOpenUp
    ? Math.max(160, Math.min(320, availableTop - 8))
    : Math.max(160, Math.min(320, availableBottom));

  return {
    left,
    top,
    width,
    maxHeight,
    transformOrigin: shouldOpenUp ? "bottom center" : "top center",
  };
}

export default function AdminSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Pilih opsi",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const updatePopoverPosition = useCallback(() => {
    setPopoverStyle(getPopoverPosition(triggerRef.current));
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;

      if (rootRef.current?.contains(target) || popoverRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePopoverPosition();

    const handleReposition = () => {
      updatePopoverPosition();
    };

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, updatePopoverPosition]);

  const handleToggle = () => {
    if (!isOpen) {
      setPopoverStyle(getPopoverPosition(triggerRef.current));
    }

    setIsOpen((current) => !current);
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const popover = isOpen && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={popoverRef}
          className="admin-custom-select-popover is-portal"
          style={{
            left: popoverStyle?.left ?? 0,
            top: popoverStyle?.top ?? 0,
            width: popoverStyle?.width ?? 240,
            maxHeight: popoverStyle?.maxHeight ?? 280,
            transformOrigin: popoverStyle?.transformOrigin ?? "top center",
          }}
        >
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
        </div>,
        document.body
      )
    : null;

  return (
    <label className={`admin-custom-select-field ${isOpen ? "is-open" : ""} ${className}`} ref={rootRef}>
      {label && <span>{label}</span>}

      <button
        ref={triggerRef}
        type="button"
        className={`admin-custom-select-trigger ${isOpen ? "is-open" : ""}`}
        onClick={handleToggle}
      >
        <span>
          <strong>{selectedOption?.label || placeholder}</strong>
          {selectedOption?.description && <small>{selectedOption.description}</small>}
        </span>

        <ChevronDown size={18} />
      </button>

      {popover}
    </label>
  );
}

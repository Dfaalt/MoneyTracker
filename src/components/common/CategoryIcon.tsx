import React, { useRef, useEffect } from "react";
import { ALL_CATEGORIES } from "../../lib/constants";
import { Tag } from "lucide-react";

interface CategoryIconProps {
  category?: string;
  icon?: string;
  size?: number | string;
  trigger?:
    | "hover"
    | "click"
    | "loop"
    | "loop-on-hover"
    | "morph"
    | "in"
    | "boomerang"
    | "sequence";
  target?: string;
  colors?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  icon,
  size = 22,
  trigger = "hover",
  target,
  colors,
  className = "",
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<any>(null);

  // Lookup category if not fully specified
  const matchedCategory = category
    ? ALL_CATEGORIES.find(
        (c) => c.name.toLowerCase() === category.toLowerCase(),
      )
    : undefined;

  const targetIcon =
    icon || matchedCategory?.icon || "https://cdn.lordicon.com/nocovwne.json";

  const isLordIcon =
    typeof targetIcon === "string" &&
    (targetIcon.startsWith("http") ||
      targetIcon.startsWith("/") ||
      targetIcon.startsWith("./") ||
      targetIcon.endsWith(".json") ||
      /^[a-z0-9]{8}$/.test(targetIcon));

  const lordIconSrc = isLordIcon
    ? targetIcon.startsWith("http") ||
      targetIcon.startsWith("/") ||
      targetIcon.startsWith("./")
      ? targetIcon
      : `https://cdn.lordicon.com/${targetIcon.replace(/\.json$/, "")}.json`
    : null;

  const dimension = typeof size === "number" ? `${size}px` : size;

  // Trigger animation when parent container (e.g. table row, card, button, legend item) is hovered or clicked
  useEffect(() => {
    const span = containerRef.current;
    if (!span || !lordIconSrc) return;

    // Find the closest interactive/item container
    const parentContainer = span.closest<HTMLElement>(
      'button, tr, a, .group, [role="button"], .cursor-pointer, .glass-card, div',
    );

    if (parentContainer) {
      const triggerIconAnimation = () => {
        const iconEl = iconRef.current;
        if (!iconEl) return;

        // Try standard Lordicon player APIs or dispatch event
        if (typeof iconEl.playAnimation === "function") {
          iconEl.playAnimation();
        } else if (iconEl.player && typeof iconEl.player.play === "function") {
          iconEl.player.play();
        } else {
          try {
            iconEl.dispatchEvent(
              new MouseEvent("mouseenter", { bubbles: true }),
            );
          } catch (e) {
            // Ignore if dispatch fails
          }
        }
      };

      parentContainer.addEventListener("mouseenter", triggerIconAnimation);
      parentContainer.addEventListener("click", triggerIconAnimation);

      return () => {
        parentContainer.removeEventListener("mouseenter", triggerIconAnimation);
        parentContainer.removeEventListener("click", triggerIconAnimation);
      };
    }
  }, [lordIconSrc]);

  if (lordIconSrc) {
    return (
      <span
        ref={containerRef}
        className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        <lord-icon
          ref={iconRef}
          src={lordIconSrc}
          trigger={trigger}
          target={
            target ||
            'button, tr, a, .group, [role="button"], .cursor-pointer, div'
          }
          colors={colors}
          style={{ width: dimension, height: dimension, display: "block" }}
        />
      </span>
    );
  }

  // Fallback to Tag icon
  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center justify-center flex-shrink-0 text-slate-400 ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <Tag className="w-4 h-4" />
    </span>
  );
};

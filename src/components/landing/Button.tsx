import type { ButtonHTMLAttributes, ReactNode, MouseEventHandler } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ink" | "link";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  asAnchor?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  asAnchor = false,
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = `sv-btn sv-btn-${variant} sv-btn-${size} ${className}`;

  if (asAnchor && href) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel}
        onClick={props.onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
      >
        <span className="sv-btn-slide" aria-hidden="true" />
        <span className="sv-btn-content">{children}</span>
      </a>
    );
  }

  if (variant === "link") {
    return (
      <button type="button" className={`sv-link-underline ${className}`} {...props}>
        {children}
      </button>
    );
  }

  return (
    <button className={classes} {...props}>
      <span className="sv-btn-slide" aria-hidden="true" />
      <span className="sv-btn-content">{children}</span>
    </button>
  );
}

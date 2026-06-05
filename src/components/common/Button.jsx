import { Link } from "react-router-dom";
import clsx from "clsx";

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const classes = clsx("btn", `btn-${variant}`, `btn-${size}`, className);
  const isInternalRoute =
    typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

  if (isInternalRoute) {
    return (
      <Link className={classes} to={href} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

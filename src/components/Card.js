"use client";

export default function Card({
  children,
  onClick,
  className = "",
  padding = "p-6",
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className={padding}>{children}</div>
    </div>
  );
}

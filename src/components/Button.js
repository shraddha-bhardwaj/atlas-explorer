"use client";

const VARIANTS = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white border-gray-600",
  danger: "bg-red-600 hover:bg-red-700 text-white border-red-600",
  outline:
    "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800 border-transparent",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  ...props
}) {
  const baseClasses =
    "font-medium cursor-pointer rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center justify-center";
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeClasses = SIZES[size] || SIZES.md;
  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

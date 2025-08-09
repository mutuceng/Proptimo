
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    fullWidth?: boolean;
  }
  
  export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    fullWidth = false,
  }) => {
    const baseClasses =
      "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em]";
    const variantClasses =
      variant === "primary"
        ? "bg-[#0d80f2] text-slate-50"
        : "bg-[#e7edf4] text-[#0d141c]";
  
    return (
      <button
        className={`${baseClasses} ${variantClasses} ${
          fullWidth ? "flex-1" : ""
        }`}
        onClick={onClick}
      >
        <span className="truncate">{children}</span>
      </button>
    );
  };
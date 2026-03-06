type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const Button = ({ children, variant = "primary" }: ButtonProps) => {
  if (variant === "secondary") {
    return (
      <button
        className="
          rounded-full
          border
          border-white/30
          px-6
          py-3
          text-sm
          font-semibold
          text-white
          hover:bg-white/10
          transition
        "
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className="
        flex
        items-center
        gap-2
        rounded-full
        bg-red-600
        px-6
        py-3
        text-sm
        font-semibold
        text-white
        hover:bg-red-700
        transition
      "
    >
      {children}
    </button>
  );
};

export default Button;

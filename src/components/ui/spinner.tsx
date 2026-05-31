interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "neutral";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "primary",
  className = "",
}) => {
  // Map size to actual pixel values
  const sizeMap = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  // Map color to actual color values
  const colorMap = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    neutral: "border-black dark:border-white border-t-transparent",
  };

  return (
    <div className={`${className} inline-block`}>
      <div
        className={`
            ${sizeMap[size]}
            ${colorMap[color]}
            border-4
            rounded-full
            animate-spin
          `}
        role="status"
        aria-label="loading"
      ></div>
    </div>
  );
};

export default Spinner;

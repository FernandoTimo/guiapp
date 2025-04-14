interface NodgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: string;
  className?: string;
}
export default function Nodge({
  children,
  color = "#d1d5db",
  className,
  ...props
}: NodgeProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ backgroundColor: color }}
      {...props}
    >
      <svg
        viewBox="0 0 71 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-1 transform -translate-x-full h-full"
      >
        <g clip-path="url(#clip0_303_8)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M70.7431 80.64C47.501 79.2253 27.8968 71.141 18.8021 44.4632C11.1221 26.2737 24.461 4.0421 0.208374 0.202103H70.9452V80.8421L70.7431 80.64Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_303_8">
            <rect width="70.7494" height="80.64" fill="white" />
          </clipPath>
        </defs>
      </svg>

      {children}
      <svg
        viewBox="0 0 71 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "scaleX(-1)" }}
        className="absolute right-1 transform -translate-x-[-100%] h-full"
      >
        <g clip-path="url(#clip0_303_8)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M70.7431 80.64C47.501 79.2253 27.8968 71.141 18.8021 44.4632C11.1221 26.2737 24.461 4.0421 0.208374 0.202103H70.9452V80.8421L70.7431 80.64Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_303_8">
            <rect width="70.7494" height="80.64" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

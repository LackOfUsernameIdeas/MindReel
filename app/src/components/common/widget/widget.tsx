import { LucideCircleHelp } from "lucide-react";
import type { FC, ReactNode } from "react";

const Widget: FC<{
  icon: ReactNode;
  title: string;
  value: string | number;
  className?: string;
  help?: boolean;
}> = ({ icon, title, value, className, help }) => {
  const handleHelpClick = () => {
    window.dispatchEvent(new Event("scrollToTerms"));
  };

  return (
    <div
      className={`bg-white dark:bg-bodybg2 dark:text-white/80 p-4 rounded-lg transition-all duration-300 hover:shadow-md dark:hover:shadow-primary flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start mb-2 min-w-0">
        <div className="flex items-start flex-shrink-0 w-8 h-8 mr-2">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-sm sm:text-base goodTiming font-semibold leading-snug break-words"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word"
            }}
            title={title}
          >
            {title.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </h3>
        </div>

        {help && (
          <button
            onClick={handleHelpClick}
            className="ml-1 mt-0.5 flex-shrink-0"
          >
            <LucideCircleHelp
              strokeWidth={2.5}
              className="w-5 h-5 dark:text-defaulttextcolor/85 cursor-pointer transition-transform duration-200 hover:scale-110 rounded-full"
            />
          </button>
        )}
      </div>

      <div className="flex-grow" />
      <p className="text-2xl font-bold text-left break-words">{value}</p>
    </div>
  );
};

export default Widget;

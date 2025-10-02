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
      <div className="flex items-start mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 text-base goodTiming font-semibold">
            {title.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </h3>
        </div>
        {help && (
          <div className="ml-1 mt-0.5">
            <LucideCircleHelp
              strokeWidth={2.5}
              className="w-6 h-6 dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10"
              onClick={handleHelpClick}
            />
          </div>
        )}
      </div>
      <div className="flex-grow" />
      <p className="text-2xl font-bold text-left">{value}</p>
    </div>
  );
};

export default Widget;

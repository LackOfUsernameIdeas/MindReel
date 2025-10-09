import { FC } from "react";
import { Progress } from "@/components/ui/progress";

const MainMetricsWidget: FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  progress?: number;
  className?: string;
}> = ({ icon, title, value, description, progress, className }) => (
  <div
    className={`bg-white dark:bg-bodybg2 dark:text-white/80 p-4 rounded-lg transition-all duration-300 flex flex-col h-full hover:shadow-md dark:hover:shadow-primary ${className}`}
  >
    <div className="flex items-start mb-2 min-w-0">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        {icon}
      </div>

      <h3
        className="ml-2 text-sm sm:text-base goodTiming font-semibold flex-1 min-w-0"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}
        title={title}
      >
        {title}
      </h3>
    </div>

    <div className="flex-grow"></div>

    <p className="text-2xl font-bold mb-2">{value}</p>
    <p className="text-xs text-muted-foreground break-words">{description}</p>

    {progress && (
      <div className="mt-2">
        <Progress value={progress} />
      </div>
    )}
  </div>
);

export default MainMetricsWidget;

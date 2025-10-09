import Infobox from "@/components/common/infobox/infobox";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SecondaryMetricsWidgetProps {
  title: string;
  value: number | undefined;
  description: string;
  modalText: string | JSX.Element;
  onClick: () => void;
  isActive: boolean;
}

const SecondaryMetricsWidget = ({
  title,
  value,
  description,
  modalText,
  onClick,
  isActive
}: SecondaryMetricsWidgetProps) => {
  const [opened, setOpened] = useState<boolean>(false);

  const toggle = () => {
    setOpened((prev) => !prev);
  };

  return (
    <>
      <div
        className={`
          rounded-lg p-4 cursor-pointer h-full flex flex-col
          transition-all duration-200 ease-in-out min-w-0
          ${
            isActive
              ? "border-l-4 border-primary shadow-lg bg-primary/20 dark:bg-primary/10 scale-[1.05] hover:shadow-xl hover:bg-primary/25 dark:hover:bg-primary/15"
              : "border border-transparent hover:border-primary/30 hover:shadow-md hover:scale-[1.02] hover:bg-primary/15 dark:hover:bg-primary/25 bg-white dark:bg-bodybg2"
          }
        `}
        onClick={onClick}
      >
        <div className="flex items-start gap-2 mb-2 min-w-0">
          <Badge
            variant={isActive ? "default" : "outline"}
            className={`goodTiming text-xs sm:text-sm whitespace-normal break-words ${
              isActive
                ? "text-white"
                : "border-defaulttextcolor text-defaulttextcolor"
            }`}
          >
            {title}
          </Badge>
          <Infobox onClick={toggle} />
        </div>

        <div
          className="text-base sm:text-lg goodTiming text-defaulttextcolor dark:text-white/80 mb-2 flex-grow break-words leading-snug"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
          title={description}
        >
          {description}
        </div>

        <div
          className={`text-2xl sm:text-3xl font-bold mt-auto truncate ${
            isActive
              ? "text-primary"
              : "text-defaulttextcolor dark:text-white/80"
          }`}
        >
          {value !== undefined ? `${value}%` : "N/A"}
        </div>
      </div>

      <InfoboxModal
        onClick={toggle}
        isModalOpen={opened}
        title={title}
        description={modalText}
      />
    </>
  );
};

export default SecondaryMetricsWidget;

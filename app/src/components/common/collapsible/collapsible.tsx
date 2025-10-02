import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="border dark:border-defaultborder/10 rounded-lg overflow-hidden"
      >
        <AccordionTrigger className="px-4 py-2 dark:bg-bodybg2 bg-white hover:dark:bg-white/10 transition-colors duration-200">
          <span className="font-semibold text-base goodTiming dark:text-white/80">
            {title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-white/50 dark:bg-white/10">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Collapsible;

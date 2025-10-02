import { Card, CardContent } from "@/components/ui/card";
import { Clapperboard, Tv } from "lucide-react";
import { Adaptations } from "../landing-types";

interface BookAdaptationsProps {
  booksAdaptationsCount: Adaptations;
}

export default function BookAdaptations({
  booksAdaptationsCount
}: BookAdaptationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
      <Card className="overflow-hidden border-2 !border-primary flex flex-col">
        <CardContent className="p-6 bg-gradient-to-br dark:from-primary/5 dark:to-primary/25 from-primary/10 to-primary/30 flex flex-col justify-between h-full">
          <div className="flex items-center mb-4">
            <div className="bg-primary p-3 rounded-full mr-4">
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg goodTiming font-semibold text-defaulttextcolor dark:text-white">
              Филмови адаптации
            </h3>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-defaulttextcolor/70 dark:text-white/70 mb-2">
              Брой книги, адаптирани във филми
            </p>
            <p className="text-5xl font-bold text-defaulttextcolor dark:text-white font-mono">
              {booksAdaptationsCount.movies}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-2 !border-secondary flex flex-col">
        <CardContent className="p-6 bg-gradient-to-br dark:from-secondary/5 dark:to-secondary/25 from-secondary/10 to-secondary/30 flex flex-col justify-between h-full">
          <div className="flex items-center mb-4">
            <div className="bg-secondary p-3 rounded-full mr-4">
              <Tv className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg goodTiming font-semibold text-defaulttextcolor dark:text-white">
              Сериални адаптации
            </h3>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-defaulttextcolor/70 dark:text-white/70 mb-2">
              Брой книги, адаптирани в сериали
            </p>
            <p className="text-5xl font-bold text-defaulttextcolor dark:text-white font-mono">
              {booksAdaptationsCount.series}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-2 !border-tertiary flex flex-col">
        <CardContent className="p-6 bg-gradient-to-br dark:from-tertiary/5 dark:to-tertiary/25 from-tertiary/10 to-tertiary/30 flex flex-col justify-between h-full">
          <div className="flex items-center mb-4">
            <div className="bg-tertiary p-3 rounded-full mr-4">
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg goodTiming font-semibold text-defaulttextcolor dark:text-white">
              Всички адаптации
            </h3>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-defaulttextcolor/70 dark:text-white/70 mb-2">
              Общ брой адаптации
            </p>
            <p className="text-5xl font-bold text-defaulttextcolor dark:text-white font-mono">
              {booksAdaptationsCount.all}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

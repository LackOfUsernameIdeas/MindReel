import React, { Fragment, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Check,
  X,
  Clapperboard,
  Clock,
  Pen,
  Target,
  Smile,
  ListIcon as Category
} from "lucide-react";
import Infobox from "../infobox/infobox";
import { InfoboxModal } from "../infobox/InfoboxModal";
import { RelevantRecommendationsProps } from "../recommendationsAnalyses/recommendationsAnalyses-types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

const RelevantRecommendations: React.FC<RelevantRecommendationsProps> = ({
  relevantRecommendations,
  currentIndex,
  title_en,
  title_bg
}) => {
  if (
    relevantRecommendations.length === 0 ||
    !relevantRecommendations[currentIndex]
  ) {
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const recommendation = relevantRecommendations[currentIndex];

  const criteriaIcons = {
    genres: Category,
    type: Clapperboard,
    mood: Smile,
    timeAvailability: Clock,
    preferredAge: Pen,
    targetGroup: Target
  };

  const criteriaNamesInBulgarian = {
    genres: "Жанрове",
    type: "Тип",
    mood: "Настроение",
    timeAvailability: "Време за гледане",
    preferredAge: "Време на създаване",
    targetGroup: "Целева група"
  };

  const getProgressValue = (value: number, isGenre: boolean) => {
    return isGenre ? (value / 2) * 100 : value * 100;
  };

  const handleInfoButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <Card className="w-full">
        <CardContent className="p-6 bg-white dark:bg-bodybg2 rounded-lg">
          <Card className="dark:border-black/10 bg-white dark:bg-bodybg2 font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <Clapperboard className="h-5 w-5 self-center sm:self-auto" />
              <span className="order-2 sm:order-none">{title_bg}</span>
              <span className="order-3 sm:order-none">({title_en}):</span>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
            <div className="flex items-center">
              <Badge
                variant={recommendation.isRelevant ? "success" : "destructive"}
                className="text-xl py-1 px-3 mr-4"
              >
                {recommendation.isRelevant ? (
                  <Check className="mr-2 h-5 w-5" />
                ) : (
                  <X className="mr-2 h-5 w-5" />
                )}
                {recommendation.isRelevant ? "Релевантен" : "Нерелевантен"}
              </Badge>
              <Infobox onClick={handleInfoButtonClick} />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
              <div className="text-sm md:text-lg font-bold">
                Релевантност: {recommendation.relevanceScore}/7 т.
              </div>
              <Progress
                value={(recommendation.relevanceScore / 7) * 100}
                className="h-2 mt-2 sm:mt-0 sm:w-32"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(recommendation.criteriaScores).map(
              ([key, value]) => {
                const Icon = criteriaIcons[key as keyof typeof criteriaIcons];
                const isGenre = key === "genres";
                return (
                  <Card key={key} className="bg-primary/10 overflow-hidden">
                    <CardContent className="p-3 flex items-center">
                      <Icon className="h-6 w-6 mr-3 text-primary flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <div className="font-semibold text-sm mb-1 truncate">
                          {
                            criteriaNamesInBulgarian[
                              key as keyof typeof criteriaNamesInBulgarian
                            ]
                          }
                        </div>
                        <div className="flex items-center">
                          <Progress
                            value={getProgressValue(value, isGenre)}
                            className="h-2 flex-grow mr-2"
                          />
                          <div className="text-sm font-bold whitespace-nowrap">
                            {value}/{isGenre ? 2 : 1} т.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      <InfoboxModal
        onClick={handleInfoButtonClick}
        isModalOpen={isModalOpen}
        title="Алгоритъм за релевантност"
        description={
          <>
            <p>
              <span className="font-semibold">Алгоритъмът за релевантност</span>{" "}
              е сърцето на препоръчителната система, който анализира{" "}
              <span className="font-semibold">последно регистрираните </span>
              предпочитания на потребителя и определя доколко даден филм или
              сериал съвпада с неговите изисквания. Той използва подход,
              включващ няколко критерия за оценка и изчислява общ резултат,
              който се нарича{" "}
              <span className="font-semibold">релевантност</span>.
            </p>

            <Accordion type="single" collapsible className="space-y-4 pt-5">
              <AccordionItem value="concept">
                <AccordionTrigger>🔍 Как работи алгоритъмът?</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    <li>
                      <strong>✅ Предпочитани жанрове</strong> – Проверява се
                      дали жанровете на предложеното съдържание съвпадат с тези,
                      които потребителят харесва. Ако има съвпадение, то се
                      оценява с висока тежест.
                    </li>
                    <li>
                      <strong>✅ Тип съдържание (филм или сериал)</strong> –
                      Системата преобразува избора на потребителя в
                      стандартизиран формат (напр. "Филм" → "movie") и го
                      сравнява с типа на препоръчаното заглавие.
                    </li>
                    <li>
                      <strong>✅ Настроение на потребителя</strong> – В
                      зависимост от настроението, в което се намира
                      потребителят, се извършва съпоставяне с жанрове, които
                      типично се свързват с това усещане.
                    </li>
                    <li>
                      <strong>✅ Наличност на време</strong> – Алгоритъмът
                      оценява дали продължителността на филма или средната
                      продължителност на епизодите на сериала се вписват в
                      свободното време на потребителя, като използва разумен
                      толеранс за разлики от няколко минути.
                    </li>
                    <li>
                      <strong>✅ Година на издаване</strong> – Ако потребителят
                      има предпочитания за определен времеви период (напр.
                      „публикуван в последните 10 години“), препоръките се
                      филтрират според този критерий.
                    </li>
                    <li>
                      <strong>✅ Целева аудитория</strong> – Системата сравнява
                      таргетираната възрастова група на съдържанието със
                      заявените предпочитания на потребителя.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="calculation">
                <AccordionTrigger>
                  🎯 Как се изчислява крайният резултат?
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    <li>
                      Всеки критерий има индивидуален принос към крайния
                      резултат, като по-важните фактори (като жанр) получават
                      по-голяма брой точки при съвпадение. Системата изчислява
                      сборна оценка, която показва до каква степен филмът или
                      сериалът е релевантен за потребителя.
                    </li>
                    <li>
                      <strong>
                        {" "}
                        📌 Ако резултатът премине прагът от 5 точки, препоръката
                        се счита за подходяща и се предлага на потребителя.
                      </strong>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        }
      />
    </Fragment>
  );
};

export default RelevantRecommendations;

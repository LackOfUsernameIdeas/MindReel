import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Users,
  Zap,
  Brain,
  Globe,
  Calendar,
  Clock2,
  Smile,
  Clapperboard,
  Pen,
  Target,
  MessageSquareHeart,
  List
} from "lucide-react";
import { MovieSeriesUserPreferencesAfterSaving } from "@/container/types_common";

interface Preference {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function UserPreferences({
  preferences
}: {
  preferences: MovieSeriesUserPreferencesAfterSaving;
}) {
  const preferenceItems: Preference[] = [
    {
      label: "Жанрове",
      value: preferences.preferred_genres_bg,
      icon: <List className="h-4 w-4" />
    },
    {
      label: "Настроение",
      value: preferences.mood,
      icon: <Smile className="h-4 w-4" />
    },
    {
      label: "Време за гледане",
      value: preferences.timeAvailability,
      icon: <Clock className="h-4 w-4" />
    },
    {
      label: "Време на създаване",
      value: preferences.preferred_age,
      icon: <Pen className="h-4 w-4" />
    },
    {
      label: "Тип",
      value: preferences.preferred_type,
      icon: <Clapperboard className="h-4 w-4" />
    },
    {
      label: "Актьори",
      value: preferences.preferred_actors,
      icon: <Users className="h-4 w-4" />
    },
    {
      label: "Режисьори",
      value: preferences.preferred_directors,
      icon: <Users className="h-4 w-4" />
    },
    {
      label: "Държави",
      value: preferences.preferred_countries,
      icon: <Globe className="h-4 w-4" />
    },
    {
      label: "Темпо на развитие на сюжета",
      value: preferences.preferred_pacing,
      icon: <Zap className="h-4 w-4" />
    },
    {
      label: "Ниво на задълбочаване",
      value: preferences.preferred_depth,
      icon: <Brain className="h-4 w-4" />
    },
    {
      label: "Целева група",
      value: preferences.preferred_target_group,
      icon: <Target className="h-4 w-4" />
    },
    {
      label: "Интереси",
      value: preferences.interests || "Не е зададено",
      icon: <MessageSquareHeart className="h-4 w-4" />
    }
  ];

  return (
    <Card className="w-full mx-auto my-4 bg-bodybg dark:border-black/10 shadow-lg dark:shadow-xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-3">
        <div>
          <CardTitle className="text-3xl font-bold goodTiming text-defaulttextcolor dark:text-white/80">
            Последно регистрирани предпочитания
          </CardTitle>
          <div className="flex flex-wrap text-sm goodTiming text-muted-foreground gap-x-1 gap-y-1 sm:hidden">
            <div className="flex items-center gap-1">
              <Calendar className="w-3" />
              <span>
                {new Date(preferences.date).toLocaleDateString("bg-BG")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock2 className="w-3" />
              <span>
                {new Date(preferences.date).toLocaleTimeString("bg-BG")}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-wrap text-sm goodTiming text-muted-foreground gap-x-1 gap-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3" />
            <span>
              {new Date(preferences.date).toLocaleDateString("bg-BG")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock2 className="w-3" />
            <span>
              {new Date(preferences.date).toLocaleTimeString("bg-BG")}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid gap-2">
          {preferenceItems.map((item, index) => (
            <div
              key={index}
              className="bg-white outline outline-transparent hover:outline-1 dark:hover:outline-primary hover:outline-black/25 dark:bg-bodybg2 p-3 rounded-md flex items-center justify-between transition-all duration-300"
            >
              <div className="flex items-center goodTiming w-2/3 sm:w-1/3 max-w-[65%] pr-2 min-w-[100px]">
                {item.icon}
                <span className="ml-2 font-semibold text-sm">{item.label}</span>
              </div>

              <div
                title={item.value || "Не е зададено"}
                className="w-2/3 max-w-[65%] text-sm text-defaulttextcolor dark:text-white/80 break-words overflow-hidden text-ellipsis"
              >
                {item.value || "Не е зададено"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

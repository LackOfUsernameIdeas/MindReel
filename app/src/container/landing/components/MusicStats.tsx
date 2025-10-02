import { Card, CardContent } from "@/components/ui/card";
import {
  AudioLines,
  ThumbsUp,
  Eye,
  MessageCircle,
  Radio,
  Headphones
} from "lucide-react";
import { formatNumber } from "../helper_functions";

interface MusicStatsData {
  spotifyPopularity: number;
  youtubeViews: number;
  youtubeLikes: number;
  youtubeComments: number;
}

interface MusicStatsProps {
  musicStatsData: MusicStatsData;
}

export default function MusicStats({ musicStatsData }: MusicStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto">
      {/* Spotify Card on first row, full width on large screens */}
      <Card className="lg:col-span-3 overflow-hidden border-2 !border-primary relative">
        <CardContent className="p-6 bg-gradient-to-br dark:from-primary/5 dark:to-primary/25 from-primary/10 to-primary/30 relative">
          <div className="flex items-start justify-between">
            {/* Left side: Icon + Title */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary p-3 rounded-xl relative">
                <AudioLines className="h-5 w-5 text-white" />
                <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg goodTiming font-semibold text-defaulttextcolor dark:text-white mb-1">
                  Spotify популярност
                </h3>
                <p className="text-xs text-defaulttextcolor/70 dark:text-white/70">
                  Средна стойност на популярност в Spotify (0-100)
                </p>
              </div>
            </div>

            {/* Right side: Value aligned top-right */}
            <div className="text-right">
              <p className="text-4xl font-bold text-defaulttextcolor dark:text-white font-mono mb-2">
                {musicStatsData.spotifyPopularity}
              </p>
              <div className="flex items-center justify-end space-x-2 text-xs text-defaulttextcolor/60 dark:text-white/60">
                <Radio className="h-3 w-3" />
                <span>от 100 точки</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YouTube Stats Row */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Views */}
        <Card className="overflow-hidden border-2 !border-secondary">
          <CardContent className="p-6 bg-gradient-to-br dark:from-secondary/5 dark:to-secondary/25 from-secondary/10 to-secondary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary p-3 rounded-xl">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-defaulttextcolor dark:text-white font-mono">
                  {formatNumber(musicStatsData.youtubeViews)}
                </p>
                <p className="text-xs text-defaulttextcolor/60 dark:text-white/60">
                  гледания
                </p>
              </div>
            </div>
            <h4 className="text-sm goodTiming font-semibold text-defaulttextcolor dark:text-white">
              YouTube гледания
            </h4>
          </CardContent>
        </Card>

        {/* Likes */}
        <Card className="overflow-hidden border-2 !border-secondary">
          <CardContent className="p-6 bg-gradient-to-br dark:from-secondary/5 dark:to-secondary/25 from-secondary/10 to-secondary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary p-3 rounded-xl">
                <ThumbsUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-defaulttextcolor dark:text-white font-mono">
                  {formatNumber(musicStatsData.youtubeLikes)}
                </p>
                <p className="text-xs text-defaulttextcolor/60 dark:text-white/60">
                  харесвания
                </p>
              </div>
            </div>
            <h4 className="text-sm goodTiming font-semibold text-defaulttextcolor dark:text-white">
              YouTube харесвания
            </h4>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="overflow-hidden border-2 !border-primary">
          <CardContent className="p-6 bg-gradient-to-br dark:from-primary/5 dark:to-primary/25 from-primary/10 to-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary p-3 rounded-xl">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-defaulttextcolor dark:text-white font-mono">
                  {formatNumber(musicStatsData.youtubeComments)}
                </p>
                <p className="text-xs text-defaulttextcolor/60 dark:text-white/60">
                  коментари
                </p>
              </div>
            </div>
            <h4 className="text-sm goodTiming font-semibold text-defaulttextcolor dark:text-white">
              YouTube коментари
            </h4>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

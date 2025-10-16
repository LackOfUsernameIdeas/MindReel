import { FC, useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { FilterSidebarProps } from "../listenlist-types";

const FilterSidebar: FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  data,
  setFilteredData,
  setCurrentPage
}) => {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedAlbumTypes, setSelectedAlbumTypes] = useState<string[]>([]);
  const [selectedPopularity, setSelectedPopularity] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);

  // Извличане на уникални артисти
  const uniqueArtists = Array.from(
    new Set(
      data.flatMap((item) => {
        if (Array.isArray(item.artists)) return item.artists;
        if (typeof item.artists === "string") return [item.artists];
        return [];
      })
    )
  ).sort((a, b) => a.localeCompare(b));

  // Извличане на уникални типове албуми
  const uniqueAlbumTypes = Array.from(
    new Set(data.map((item) => item.albumType).filter(Boolean))
  ).sort();

  const isLatin = (str: string) => /[a-zA-Z]/.test(str);

  const sortNames = (a: string, b: string) => {
    const isALatin = isLatin(a);
    const isBLatin = isLatin(b);
    if (isALatin === isBLatin) return a.localeCompare(b);
    return isALatin ? 1 : -1;
  };

  const sortedArtists = [...uniqueArtists].sort(sortNames);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleResetFilters = () => {
    setSelectedArtists([]);
    setSelectedAlbumTypes([]);
    setSelectedPopularity([]);
    setSelectedDuration([]);
    setSelectedYear([]);
    setFilteredData(data);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Филтриране по артисти
    if (selectedArtists.length > 0) {
      filtered = filtered.filter((item) => {
        const itemArtists = Array.isArray(item.artists)
          ? item.artists
          : typeof item.artists === "string"
          ? [item.artists]
          : [];
        return itemArtists.some((artist) => selectedArtists.includes(artist));
      });
    }

    // Филтриране по тип продукция
    if (selectedAlbumTypes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedAlbumTypes.includes(item.albumType || "")
      );
    }

    // Филтриране по популярност
    if (selectedPopularity.length > 0) {
      filtered = filtered.filter((item) => {
        const pop = item.spotifyPopularity || 0;
        return selectedPopularity.some((range) => {
          if (range === "Под 30") return pop < 30;
          if (range === "30 до 50") return pop >= 30 && pop < 50;
          if (range === "50 до 70") return pop >= 50 && pop < 70;
          if (range === "70 до 85") return pop >= 70 && pop < 85;
          if (range === "Над 85") return pop >= 85;
          return false;
        });
      });
    }

    // Филтриране по продължителност
    if (selectedDuration.length > 0) {
      filtered = filtered.filter((item) => {
        const duration = item.durationMs || 0;
        const minutes = duration / 60000;
        return selectedDuration.some((range) => {
          if (range === "Под 2 минути") return minutes < 2;
          if (range === "2 до 4 минути") return minutes >= 2 && minutes < 4;
          if (range === "4 до 6 минути") return minutes >= 4 && minutes < 6;
          if (range === "Над 6 минути") return minutes >= 6;
          return false;
        });
      });
    }

    // Филтриране по година
    if (selectedYear.length > 0) {
      filtered = filtered.filter((item) => {
        const yearStr = item.albumReleaseDateInSpotify || "";
        const year = parseInt(yearStr.split("-")[0]);
        if (isNaN(year)) return false;
        return selectedYear.some((range) => {
          if (range === "Преди 2000") return year < 2000;
          if (range === "2000 до 2010") return year >= 2000 && year < 2010;
          if (range === "2010 до 2015") return year >= 2010 && year < 2015;
          if (range === "2015 до 2020") return year >= 2015 && year < 2020;
          if (range === "След 2020") return year >= 2020;
          return false;
        });
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
    onClose();
  };

  const handleArtistChange = (artist: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artist)
        ? prev.filter((a) => a !== artist)
        : [...prev, artist]
    );
  };

  const handleAlbumTypeChange = (type: string) => {
    setSelectedAlbumTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePopularityChange = (range: string) => {
    setSelectedPopularity((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleDurationChange = (range: string) => {
    setSelectedDuration((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleYearChange = (range: string) => {
    setSelectedYear((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-bodybg dark:bg-bodybg shadow-lg transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-[40rem]"
      } z-50 p-4 overflow-y-auto`}
    >
      <button
        className="absolute top-4 right-4 dark:text-white hover:text-black"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <h3 className="text-lg font-bold goodTiming mb-4">Филтриране</h3>
      <div className="space-y-4">
        {/* Филтрация за артисти */}
        <Accordion type="single" collapsible>
          <AccordionItem value="artists">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Артисти
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {sortedArtists.map((artist) => (
                  <div key={artist} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedArtists.includes(artist)}
                      onChange={() => handleArtistChange(artist)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{artist}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за тип продукция */}
        <Accordion type="single" collapsible>
          <AccordionItem value="albumType">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Тип продукция
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {uniqueAlbumTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!type && selectedAlbumTypes.includes(type)}
                      onChange={() => type && handleAlbumTypeChange(type)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за популярност */}
        <Accordion type="single" collapsible>
          <AccordionItem value="popularity">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Популярност
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {["Под 30", "30 до 50", "50 до 70", "70 до 85", "Над 85"].map(
                  (option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPopularity.includes(option)}
                        onChange={() => handlePopularityChange(option)}
                        className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <span className="goodTiming text-sm">{option}</span>
                    </div>
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за продължителност */}
        <Accordion type="single" collapsible>
          <AccordionItem value="duration">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Продължителност
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Под 2 минути",
                  "2 до 4 минути",
                  "4 до 6 минути",
                  "Над 6 минути"
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDuration.includes(option)}
                      onChange={() => handleDurationChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за година */}
        <Accordion type="single" collapsible>
          <AccordionItem value="year">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Година на излизане
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Преди 2000",
                  "2000 до 2010",
                  "2010 до 2015",
                  "2015 до 2020",
                  "След 2020"
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedYear.includes(option)}
                      onChange={() => handleYearChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Бутони */}
        <div className="flex flex-col gap-2">
          <button
            className="bg-gray-400 hover:bg-gray-400/75 text-gray-800 px-4 py-2 rounded-md transition w-full"
            onClick={handleResetFilters}
          >
            Нулиране на филтрите
          </button>
          <button
            className="bg-primary hover:bg-primary/75 text-white px-4 py-2 rounded-md transition w-full"
            onClick={applyFilters}
          >
            Приложи
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

import { FC } from "react";

interface GenresProps {
  genres: string[]; // Жанровете
}

const Genres: FC<GenresProps> = ({ genres }) => {
  // Източник на информация за книгата
  const source = import.meta.env.VITE_BOOKS_SOURCE;
  return (
    <p className="mb-2">
      <strong className="text-primary text-sm">Жанрове:</strong>
      <div className="text-white">
        {/*Ако източникът е Google Books*/}
        {source === "GoogleBooks" ? (
          <div className="flex flex-wrap gap-4">
            {genres.map((genre, index) => {
              const [mainCategory, subGenres] = genre.split(": ");
              return (
                <div
                  key={index}
                  className="relative group w-full flex flex-col items-start"
                >
                  {/*Главна категория*/}
                  <div className="bg-primary/70 dark:bg-primary/25 rounded-md px-2 py-1 shadow-md inline-block transition-transform duration-200 transform group-hover:scale-105">
                    <span className="flex items-center text-base text-primary dark:text-primary/90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1 transition-transform duration-200 transform group-hover:rotate-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {mainCategory}
                    </span>
                  </div>
                  {/*Поджанрове*/}
                  {subGenres && (
                    <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-300 ease-in-out w-full">
                      <ul className="mt-2 flex flex-wrap">
                        <div className="flex flex-wrap gap-2">
                          <li className="items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="28"
                              height="28"
                              viewBox="0 0 28 28"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-corner-down-right text-primary dark:text-primary/90"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M6 6v6a3 3 0 0 0 3 3h10l-4 -4m0 8l4 -4" />
                            </svg>
                          </li>

                          {subGenres.split(", ").map((subGenre, subIndex) => (
                            <li
                              key={subIndex}
                              className="bg-primary/50 dark:bg-primary/40 px-3 py-1 rounded-md text-sm text-secondary dark:text-secondary/90 shadow-md transform hover:scale-105 transition-transform duration-150 cursor-pointer"
                            >
                              {subGenre}
                            </li>
                          ))}
                        </div>
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {/*Ако източникът е Goodreads, всеки жанр в bubble*/}
            {genres.map((genre, index) => (
              <span
                key={index}
                className="inline-block text-white dark:text-primary bg-primary/80 dark:bg-primary/25 px-3 py-1 rounded-md text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </p>
  );
};

export default Genres;

import { FC } from "react";

const VRControlsInfo: FC = () => {
  return (
    <div className="flex justify-center mt-6 mb-8">
      <div className="box p-6 max-w-4xl w-full border-2 border-primary">
        <h3 className="text-xl font-bold text-center mb-4 text-primary">
          Контроли във VR сцената - клавиатура и мишка
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Movement Controls */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 2v20" />
                <path d="m15 19-3 3-3-3" />
                <path d="m19 9 3 3-3 3" />
                <path d="M2 12h20" />
                <path d="m5 9-3 3 3 3" />
                <path d="m9 5 3-3 3 3" />
              </svg>
              <span className="font-semibold">Разхождане из сцената</span>
            </div>

            <div className="space-y-3 text-center">
              <div className="flex justify-center gap-2">
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  W
                </kbd>
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  A
                </kbd>
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  S
                </kbd>
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  D
                </kbd>
              </div>
              <div className="flex justify-center gap-2">
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  ↑
                </kbd>
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  ←
                </kbd>

                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  ↓
                </kbd>
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 dark:bg-transparent text-white rounded border border-gray-600">
                  →
                </kbd>
              </div>
              <p className="text-sm text-defaulttextcolor/70 dark:text-white/50">
                Напред / Наляво / Назад / Надясно
              </p>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <circle cx="12" cy="12" r="1" />
                <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
              </svg>
              <span className="font-semibold">Въртене</span>
            </div>

            <div className="space-y-2 text-center">
              <div className="flex justify-center items-center gap-3">
                <svg
                  fill="currentColor"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 450.47 450.47"
                  width="40"
                  height="40"
                  className="text-primary"
                >
                  <path d="M237.298,99.533c-0.301-0.34-0.562-0.677-0.916-0.999c-3.937-3.535-4.043-2.491,0.266-6.463 c3.192-2.929,7.063-5.222,10.574-7.755c9.286-6.711,15.398-15.699,19.529-26.356C276.02,34.033,248.707,17.503,235,3.344 c-9.904-10.247-25.496,5.382-15.604,15.604c7.643,7.912,17.489,14.328,24.14,23.123c7.453,9.848-3.901,20.712-11.68,26.194 c-12.026,8.473-22.423,19.727-20.02,31.794c-53.971,5.042-103.87,34.623-103.87,86.767V333.2c0,64.664,52.603,117.27,117.27,117.27 c64.663,0,117.27-52.605,117.27-117.27V186.817C342.51,129.888,289.543,102.317,237.298,99.533z M130.044,186.817 c0-38.707,42.017-61.117,85.535-64.841v135.005c-39.697-1.998-71.928-11.042-85.535-15.457V186.817z M320.433,333.194 c0,52.5-42.705,95.199-95.192,95.199c-52.488,0-95.196-42.699-95.196-95.199V264.73c19.713,5.958,56.817,14.995,100.676,14.995 c28.088,0,58.93-3.759,89.713-14.352V333.194z M320.433,241.896c-27.916,10.675-56.424,14.849-82.78,15.415v-135.66 c42.569,2.553,82.78,22.969,82.78,65.175V241.896z M206.072,133.429v111.973c-17.153,3.027-67.583-11.094-67.583-11.094 C131.049,155.812,160.429,142.005,206.072,133.429z" />
                </svg>
              </div>
              <p className="text-sm font-semibold">
                Ляв бутон на мишката + движение
              </p>
              <p className="text-sm text-defaulttextcolor/70 dark:text-white/50">
                Задръжте левия бутон и движете мишката
                <br />
                за да завъртите изгледа
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-center text-sm text-defaulttextcolor/70 dark:text-white/50">
            <span className="font-semibold text-primary">Съвет:</span>{" "}
            Използвайте мишката за да кликнете върху елементи в сцената
          </p>
        </div>
      </div>
    </div>
  );
};

export default VRControlsInfo;

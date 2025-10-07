import { FC } from "react";
import { ConfirmationModalProps } from "../booksRecommendations-types";

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  setNotification,
  setLoading,
  setSubmitted,
  setIsModalOpen,
  handleSubmit,
  setSubmitCount,
  setRecommendationList,
  setBookmarkedBooks,
  booksUserPreferences,
  token,
  submitCount
}) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="question p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">
          Сигурни ли сте, че искате да изпратите въпросника?
        </h2>
        <p className="text-sm text-gray-600 italic">
          След като го изпратите, ще ви се премахнат миналите препоръчвания и ще
          бъдат генерирани нови.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCloseModal}
            className="bg-primary hover:bg-secondary px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400"
          >
            Отказ
          </button>
          <button
            onClick={() => {
              handleSubmit(
                setNotification,
                setLoading,
                setSubmitted,
                setSubmitCount,
                setRecommendationList,
                setBookmarkedBooks,
                token,
                submitCount,
                booksUserPreferences
              );
              handleCloseModal();
            }}
            className="bg-primary hover:bg-secondary px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Потвърди
          </button>
        </div>
      </div>
    </div>
  );
};

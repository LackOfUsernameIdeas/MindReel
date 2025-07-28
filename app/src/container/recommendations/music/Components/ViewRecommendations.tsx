import { FC } from "react";
import { ViewRecommendationsProps } from "../musicRecommendations-types";
import { handleViewRecommendations } from "../helper_functions";

export const ViewRecommendations: FC<ViewRecommendationsProps> = ({
  setLoading,
  setSubmitted,
  setShowQuestion
}) => {
  return (
    <div className="m-6 text-center">
      <p className="text-lg text-gray-600">
        Искате да се върнете при препоръките?{" "}
        <button
          onClick={() => {
            handleViewRecommendations(
              setShowQuestion,
              setLoading,
              setSubmitted
            );
          }}
          className="text-primary font-semibold hover:text-secondary transition-colors underline"
        >
          Върнете се
        </button>
      </p>
    </div>
  );
};

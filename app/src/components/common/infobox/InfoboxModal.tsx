import { type FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

interface InfoboxModalProps {
  onClick: () => void;
  isModalOpen: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
}

export const InfoboxModal: FC<InfoboxModalProps> = ({
  onClick,
  isModalOpen,
  title,
  description
}) => {
  const [animationState, setAnimationState] = useState({
    opacity: 0,
    transform: "scale(0.9)"
  });

  useEffect(() => {
    if (isModalOpen) {
      setAnimationState({ opacity: 1, transform: "scale(1)" });
    } else {
      setAnimationState({ opacity: 0, transform: "scale(0.9)" });
    }
  }, [isModalOpen]);

  return (
    <CSSTransition
      in={isModalOpen}
      timeout={300}
      classNames="modal"
      unmountOnExit
    >
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40"></div>
        <div
          className="modal m-4 sm:m-0 relative z-[10000]"
          style={{
            ...animationState,
            transition: "opacity 300ms, transform 300ms"
          }}
        >
          <div className="max-h-[40rem] overflow-y-auto p-2">
            <h2 className="text-2xl font-semibold goodTiming mb-5">{title}</h2>
            <p className="text-sm">{description}</p>
          </div>
          <div className="flex justify-end p-2">
            <button
              onClick={onClick}
              className="bg-primary hover:bg-primary/90 text-white text-sm font-medium goodTiming rounded-lg px-5 py-2.5 text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Затвори
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

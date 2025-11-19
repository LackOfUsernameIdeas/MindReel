import { FC } from "react";
import { CSSTransition } from "react-transition-group";
import logo_loader from "../../../assets/images/brand-logos/logo_loader.svg";
import logo_loader_dark from "../../../assets/images/brand-logos/logo_loader_dark.svg";
import logo_loader_head from "../../../assets/images/brand-logos/logo_loader_head.svg";
import logo_loader_head_dark from "../../../assets/images/brand-logos/logo_loader_head_dark.svg";
import logo_loader_vr from "../../../assets/images/brand-logos/logo_loader_vr.svg";
import logo_loader_vr_dark from "../../../assets/images/brand-logos/logo_loader_vr_dark.svg";

interface LoaderProps {
  brainAnalysis?: boolean;
  vrExperience?: boolean;
  loadingMessage?: string;
}

const Loader: FC<LoaderProps> = ({
  brainAnalysis = false,
  vrExperience = false,
  loadingMessage = "Зареждане..."
}) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] w-full">
      {brainAnalysis ? (
        <CSSTransition in={true} appear timeout={300} unmountOnExit>
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Light theme logo */}
            <img
              src={logo_loader_head}
              alt="loading"
              className="dark:hidden fade-loop !w-[7rem] !h-[7rem]"
            />
            {/* Dark theme logo */}
            <img
              src={logo_loader_head_dark}
              alt="loading"
              className="hidden dark:block fade-loop !w-[7rem] !h-[7rem]"
            />
            <p className="text-xl">{loadingMessage}</p>
          </div>
        </CSSTransition>
      ) : vrExperience ? (
        <CSSTransition in={true} appear timeout={300} unmountOnExit>
          <div className="flex flex-col items-center justify-center space-y-0">
            {/* Light theme logo */}
            <img
              src={logo_loader_vr}
              alt="loading"
              className="dark:hidden fade-loop !w-[7rem] !h-[7rem]"
            />
            {/* Dark theme logo */}
            <img
              src={logo_loader_vr_dark}
              alt="loading"
              className="hidden dark:block fade-loop !w-[7rem] !h-[7rem]"
            />
            <p className="text-xl">{loadingMessage}</p>
          </div>
        </CSSTransition>
      ) : (
        <CSSTransition in={true} appear timeout={300} unmountOnExit>
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Light theme logo */}
            <img
              src={logo_loader}
              alt="loading"
              className="dark:hidden spinner"
            />
            {/* Dark theme logo */}
            <img
              src={logo_loader_dark}
              alt="loading"
              className="hidden dark:block spinner"
            />
            <p className="text-xl">{loadingMessage}</p>
          </div>
        </CSSTransition>
      )}
    </div>
  );
};

export default Loader;

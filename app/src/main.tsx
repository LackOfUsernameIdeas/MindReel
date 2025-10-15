import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/App.tsx";
import Signincover from "./container/authentication/signin/Signin.tsx";
import Authenticationlayout from "./pages/AuthenticationRoute.tsx";
import Resetcover from "./container/authentication/resetpassword/Resetpassword.tsx";
import Signupcover from "./container/authentication/signup/Signup.tsx";
import Twostepcover from "./container/authentication/twostepverification/Twostepverification.tsx";
import MoviesSeriesRecommendations from "./container/recommendations/movies_series/MoviesSeriesRecommendations.tsx";
import BooksRecommendations from "./container/recommendations/books/BooksRecommendations.tsx";
import "./index.scss";
import ResetRequest from "./container/authentication/resetpassword/Resetrequest.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";
import MoviesSeriesIndividualStats from "./container/individualStats/movies_series/MoviesSeriesIndividualStats.tsx";
import Watchlist from "./container/saveLists/movies_series/Watchlist.tsx";
import Readlist from "./container/saveLists/books/Readlist.tsx";
import Listenlist from "./container/saveLists/music/Listenlist.tsx";
import Contact from "./container/contact/Contact.tsx";
import ChooseRecommendations from "./container/recommendations/choose/ChooseRecommendations.tsx";
import AIAnalysator from "./container/aiAnalysator/AIAnalysator.tsx";
import Landing from "./container/landing/Landing.tsx";
import LandingLayout from "./pages/LandingLayout.tsx";
import MusicRecommendations from "./container/recommendations/music/MusicRecommendations.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense fallback={<div>Зареждане...</div>}>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          >
            {/* Default route */}
            <Route path="recommendations" element={<ChooseRecommendations />} />
            <Route
              path="recommendations/movies_series"
              element={<MoviesSeriesRecommendations />}
            />
            <Route
              path="recommendations/books"
              element={<BooksRecommendations />}
            />
            <Route
              path="recommendations/music"
              element={<MusicRecommendations />}
            />
            <Route index path="aiAnalysator" element={<AIAnalysator />} />
            <Route
              path="individualStats/movies_series"
              element={<MoviesSeriesIndividualStats />}
            />
            <Route path="saveLists/movies_series" element={<Watchlist />} />
            <Route path="saveLists/books" element={<Readlist />} />
            <Route path="saveLists/music" element={<Listenlist />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          <Route path="/" element={<Authenticationlayout />}>
            <Route
              path="resetpassword/resetcover/:token"
              element={<Resetcover />}
            />
            <Route path="resetpassword" element={<ResetRequest />} />
            <Route path="signup" element={<Signupcover />} />
            <Route path="signin" element={<Signincover />} />
            <Route path="twostepverification" element={<Twostepcover />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
);

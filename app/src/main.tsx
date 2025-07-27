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
import Contact from "./container/contact/Contact.tsx";
import ChooseRecommendations from "./container/recommendations/choose/ChooseRecommendations.tsx";
import MoviesByProsperityBubbleChart from "./container/platformStats/MoviesByProsperity/MoviesByProsperity.tsx";
import ActorsDirectorsWritersTable from "./container/platformStats/ActorsDirectorsWritersTable/ActorsDirectorsWritersTable.tsx";
import GenrePopularityOverTime from "./container/platformStats/GenrePopularityOverTime/GenrePopularityOverTime.tsx";
import TopRecommendations from "./container/platformStats/TopRecommendations/TopRecommendations.tsx";
import MoviesAndSeriesByRatings from "./container/platformStats/MoviesAndSeriesByRatings/MoviesAndSeriesByRatings.tsx";
import TopCountries from "./container/platformStats/TopCountries/TopCountries.tsx";
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
            <Route
              index
              path="platformStats/moviesByProsperityBubbleChart"
              element={<MoviesByProsperityBubbleChart />}
            />
            <Route
              index
              path="platformStats/actorsDirectorsWritersTable"
              element={<ActorsDirectorsWritersTable />}
            />
            <Route
              index
              path="platformStats/genrePopularityOverTime"
              element={<GenrePopularityOverTime />}
            />
            <Route
              index
              path="platformStats/topRecommendations"
              element={<TopRecommendations />}
            />
            <Route
              index
              path="platformStats/moviesAndSeriesByRatings"
              element={<MoviesAndSeriesByRatings />}
            />
            <Route
              index
              path="platformStats/topCountries"
              element={<TopCountries />}
            />
            <Route index path="aiAnalysator" element={<AIAnalysator />} />
            <Route
              path="individualStats/movies_series"
              element={<MoviesSeriesIndividualStats />}
            />
            <Route path="saveLists/movies_series" element={<Watchlist />} />
            <Route path="saveLists/books" element={<Readlist />} />
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

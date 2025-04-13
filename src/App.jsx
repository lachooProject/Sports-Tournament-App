import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Matches from "./pages/Matches";
import Analytics from "./pages/Analytics";
import PlayerDetails from "./pages/PlayerDetails";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import CricketMatches from "./pages/CricketMatches";
import AddPlayer from "./pages/AddPlayer";
import TeamPage from "./pages/TeamPage";
import Profile from "./pages/profile";
import AddMatch from "./pages/AddMatch";
import MatchScoreMaintain from "./pages/matchScoreMaintain";
import Status from "./pages/AdminPage/matchScoreEdit/Status";
import CricketLiveScore from "./pages/CricketLiveScore";
import FootballLiveScore from "./pages/FootballLiveScore";
import BadmintonLiveScore from "./pages/BadmintonLiveScore";
import Cricket_Edit from "./pages/AdminPage/matchScoreEdit/Cricket-Edit";
import Football_Edit from "./pages/AdminPage/matchScoreEdit/Football-Edit";
import Batminton_Edit from "./pages/AdminPage/matchScoreEdit/Batminton-Edit";
import CricketScore from "./pages/CricketScore";
import FootballScore from "./pages/FootballScore";
import BatmintonScore from "./pages/BatmintonScore";
import TeamDetails from "./pages/TeamDetails";
import Score from "./pages/Score";
import PlayerProfile from "./pages/profile";

const ProtectedRoute = () => {
  const token = Cookies.get("token");
  const userType = Cookies.get("userType");
  const location = useLocation();

  const adminRoutes = [
    "/admin",
    "/admin/teams",
    "/admin/add-player",
    "/admin/addmatch",
    "/admin/matchScoreMaintain",
    "/admin/matchscoremaintain/status/:matchId?",
    "/admin/matchscoremaintain/Badminton_Edit/:matchId?",
    "/admin/matchscoremaintain/Football_Edit/:matchId?",
    "/admin/matchscoremaintain/Cricket_Edit/:matchId?",
  ];

  const isAdminRoute = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Redirect non-admin users trying to access admin routes
  if (isAdminRoute && userType !== "high") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

const PublicRoute = ({ children }) => {
  const token = Cookies.get("token");

  if (token) {
    const userType = Cookies.get("userType");
    return <Navigate to={userType === "high" ? "/admin" : "/home"} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarFooter = [
    "/",
    "/signup",
    "/landing",
    "/admin",
    "/admin/teams",
    "/admin/add-player",
    "/admin/cricket-matches",
    "/admin/cricket-live-score",
    "/admin/football-live-score",
    "/cricket-live-score",
    "/football-live-score",
    "/admin/badminton-live-score",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/landing"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetails />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/players/:playerid" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/cricket-matches" element={<CricketMatches />} />
          <Route path="/admin/add-player" element={<AddPlayer />} />
          <Route path="/admin/teams" element={<TeamPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/addmatch" element={<AddMatch />} />
          <Route
            path="/match/cricketscore/:matchId"
            element={<CricketScore />}
          />
          <Route
            path="/match/footballscore/:matchId"
            element={<FootballScore />}
          />
          <Route
            path="/match/batmintonscore/:matchId"
            element={<BatmintonScore />}
          />
          <Route
            path="/admin/matchscoremaintain"
            element={<MatchScoreMaintain />}
          />

          <Route
            path="/admin/live-score/:matchId?"
            element={<CricketLiveScore />}
          />
          <Route path="/cricket-live-score" element={<CricketLiveScore />} />
          <Route
            path="/football-live-score-football/:matchId?"
            element={<FootballLiveScore />}
          />

          {/* Cricket Live Score Routes */}
          <Route
            path="/admin/cricket-live-score/:matchId?"
            element={<CricketLiveScore />}
          />
          <Route
            path="/cricket-live-score/:matchId?"
            element={<CricketLiveScore />}
          />

          {/* Football Live Score Routes */}
          <Route
            path="/admin/football-live-score/:matchId?"
            element={<FootballLiveScore />}
          />
          <Route
            path="/football-live-score/:matchId?"
            element={<FootballLiveScore />}
          />

          {/* Badminton Live Score Route */}
          <Route path="/badminton/:matchId" element={<BadmintonLiveScore />} />

          {/* Badminton Live Score Routes */}
          <Route
            path="/admin/badminton-live-score/:matchId?"
            element={<BadmintonLiveScore />}
          />
          <Route
            path="/badminton-live-score/:matchId?"
            element={<BadmintonLiveScore />}
          />
          <Route
            path="/admin/matchscoremaintain/status/:matchId?"
            element={<Status />}
          />
          <Route
            path="/admin/matchscoremaintain/Cricket_Edit/:matchId?"
            element={<Cricket_Edit />}
          />
          <Route
            path="/admin/matchscoremaintain/Football_Edit/:matchId?"
            element={<Football_Edit />}
          />
          <Route
            path="/admin/matchscoremaintain/Badminton_Edit/:matchId?"
            element={<Batminton_Edit />}
          />

          {/* Score Route */}
          <Route path="/scores" element={<Score />} />

          {/* Player Profile Route */}
          <Route path="/players/:playerId" element={<PlayerProfile />} />
        </Route>

        {/* Catch all route - Redirect to home or landing based on auth status */}
        <Route
          path="*"
          element={
            <Navigate to={Cookies.get("token") ? "/home" : "/"} replace />
          }
        />
      </Routes>
    </div>
  );
};

// Main App component - Remove the Router here since it's likely already provided at a higher level
function App() {
  return <AppRoutes />;
}

export default App;

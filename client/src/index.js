
import ReactDOM from 'react-dom/client';
import '../src/assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './Pages/Home/Home'
import Games from './Pages/Games/Games'
import SearchPage from './Pages/SearchPage/SearchPage';
import LeadBoard from './Pages/LeadBoard/LeadBoard'
import Minesweeper from './Pages/MinesweeperPage/Minesweeper';
import Chess from './Pages/Chess/Chess'
import Sudoku from './Pages/Sudoku/Sudoku'
import Caro from './Pages/Caro/Caro'
import FastFinger from './Pages/FastFinger/FastFinger'
import Memory from './Pages/Memory/Memory';
import Wordle from './Pages/Wordle/Wordle'
import Snake from './Pages/Snake/Snake'
import Chat from "./Pages/Chat/Chat"
import Profile from "./Pages/Profile/Profile"
import Notification from './Pages/Notification/Notification';
import Protected from './ProtectedRouter/Protected'
import NotFoundPage from './Pages/NotFound/NotFound'
import ErrorPage from './Pages/ErrorPage/ErrorPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "games",
        element: <Games />,
      },
      {
        path: "leaderboard",
        element: (
          <Protected>
            <LeadBoard />
          </Protected>
        )
      },
      {
        path: "minesweeper",
        element: <Minesweeper />
      },
      {
        path: "chess",
        element: <Chess />,
        children: [
          {
            index: true,
            path: "online",
            element: (
              <Protected path="/chess">
                <Chess />
              </Protected>
            ),
          }
        ]
      },
      {
        path: "sudoku",
        element: <Sudoku />
      },
      {
        path: "caro",
        element: <Caro />
      },
      {
        path: "fastfinger",
        element: <FastFinger />
      },
      {
        path: "memorygame",
        element: <Memory />
      },
      {
        path: "wordle",
        element: <Wordle />
      },
      {
        path: "snakegame",
        element: <Snake />
      },
      {
        path: "search",
        element: <SearchPage />
      },
      {
        path: "chat",
        element: (
          <Protected>
            <Chat />
          </Protected>
        )
      },
      {
        path: "notification",
        element: (
          <Protected>
            <Notification />
          </Protected>
        )
      },
      {
        path: "profile/:id?",
        element: (
          <Protected>
            <Profile />
          </Protected>
        )
      },
      {
        path: "*",
        element: <NotFoundPage />
      },
    ]
  }
])

console.log(process.env)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

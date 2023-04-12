import React from "react";
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./index.css";
import App from "./App";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

// import reportWebVitals from "./reportWebVitals";
import Home from "./pages/Home";
import Error404 from "./components/Error404";
import Loading from "./components/Loading";

import Login from "./components/Login";
import WithGuard from "./components/WithGuard";
import WithGuardAdmin from "./components/WithGuardAdmin";
// end imports
// disable react div tools
if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}
// start lazyLodaing
const UserIF = React.lazy(() => import("./components/UserIF"));
const AddArticle = React.lazy(() => import("./components/AddArticle"));
const Article = React.lazy(() => import("./components/Article"));
const EditableArticle = React.lazy(() =>
  import("./components/EditableArticle")
);
const OneSection = React.lazy(() => import("./components/OneSection"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const UsersRoot = React.lazy(() => import("./pages/UsersRoot"));
const Sections = React.lazy(() => import("./pages/Sections"));
const PostsView = React.lazy(() => import("./pages/PostsView"));
const Contact = React.lazy(() => import("./components/Contact"));
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "sections",
        element: (
          <Suspense fallback={<Loading />}>
            <Sections />
          </Suspense>
        ),
      },
      {
        path: "sections/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <OneSection />
          </Suspense>
        ),
      },
      {
        path: "all-articles",
        element: (
          <Suspense fallback={<Loading />}>
            <PostsView />
          </Suspense>
        ),
      },
      {
        path: "articles/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <Article />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<Loading />}>
            <Contact />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/users",
    element: (
      <Suspense fallback={<Loading />}>
        <UsersRoot />
      </Suspense>
    ),
    errorElement: <Error404 />,

    children: [
      {
        element: <Login />,
        index: true,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "adminif",
        element: (
          <Suspense fallback={<Loading />}>
            <WithGuardAdmin>
              <AdminPage />
            </WithGuardAdmin>
          </Suspense>
        ),
      },
      {
        path: "userif",
        element: (
          <Suspense fallback={<Loading />}>
            <WithGuard>
              <UserIF />
            </WithGuard>
          </Suspense>
        ),
      },
      {
        path: "my-articles/editable/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <WithGuard>
              <EditableArticle />
            </WithGuard>
          </Suspense>
        ),
      },
      {
        path: "add-article",
        element: (
          <Suspense fallback={<Loading />}>
            <WithGuard>
              <AddArticle />
            </WithGuard>
          </Suspense>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

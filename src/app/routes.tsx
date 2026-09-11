import { createBrowserRouter } from "react-router";
import { Splash } from "./screens/Splash";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { ForgotPassword } from "./screens/ForgotPassword";
import { DeleteAccount } from "./screens/DeleteAccount";
import { Home } from "./screens/Home";
import { ClothingInterface } from "./screens/ClothingInterface";
import { ItemRegistration } from "./screens/ItemRegistration";
import { LookBuilder } from "./screens/LookBuilder";
import { LookRegistry } from "./screens/LookRegistry";
import { PredefinedLooks } from "./screens/PredefinedLooks";
import { Filters } from "./screens/Filters";
import { StyleAssistant } from "./screens/StyleAssistant";
import { TrendMatcher } from "./screens/TrendMatcher";
import { ConsciousBuyer } from "./screens/ConsciousBuyer";
import { About } from "./screens/About";
import { MainLayout } from "./components/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/delete-account",
    Component: DeleteAccount,
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "closet", Component: ClothingInterface },
      { path: "add-item", Component: ItemRegistration },
      { path: "edit-item/:id", Component: ItemRegistration },
      { path: "look-builder", Component: LookBuilder },
      { path: "looks", Component: LookRegistry },
      { path: "predefined-looks", Component: PredefinedLooks },
      { path: "filters", Component: Filters },
      { path: "style-assistant", Component: StyleAssistant },
      { path: "trends", Component: TrendMatcher },
      { path: "conscious-buyer", Component: ConsciousBuyer },
      { path: "about", Component: About },
    ],
  },
]);

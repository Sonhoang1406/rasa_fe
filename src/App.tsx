import "./App.css";
import { ThemeProvider } from "./components";
import { Toaster } from "react-hot-toast";
import AppRouter from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AppRouter />
        <Toaster />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

import { useState } from "react";
import Header from "./components/Header";
import ContentBox from "./components/ContentBox";
import SidebarBox from "./components/SidebarBox";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-macchiato-base">
      <div className="flex flex-col min-w-4xl max-w-4xl items-center m-5 p-5 rounded-sm bg-macchiato-crust">
        <Header />
        <div className="text-xl max-w-4xl min-w-3xl w-full flex flex-row justify-between items-start">
          <ContentBox />
          <SidebarBox />
        </div>
      </div>
    </div>
  );
}

export default App;

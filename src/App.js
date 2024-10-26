import AudioTalk from "./AudioTalk";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./i18n";

function App() {
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleSettingsSidebar = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  return (
    <Provider store={store}>
      <div className="App">
        <Navbar onMenuClick={toggleSettingsSidebar} />
        <Sidebar open={isSettingsOpen} onClose={toggleSettingsSidebar} />
        <div style={{ padding: "16px" }}>
          <AudioTalk />
        </div>
      </div>
    </Provider>
  );
}

export default App;

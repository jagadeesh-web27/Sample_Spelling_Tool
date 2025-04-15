import React, { useState, useEffect } from "react";
import "../Styles/Settings.css"; // Make sure to import the updated CSS

// Define a type for Notifications and Privacy
interface Notifications {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface Privacy {
  profilePublic: boolean;
  activityVisible: boolean;
}

// Define a type for Settings
interface SettingsType {
  fontSize: string;
  darkMode: boolean;
  notifications: Notifications;
  privacy: Privacy;
}

const Settings: React.FC = () => {
  // Initialize settings state with proper types
  const [settings, setSettings] = useState<SettingsType>({
    fontSize: "medium",
    darkMode: localStorage.getItem("darkMode") === "true",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profilePublic: false,
      activityVisible: true,
    },
  });

  // Function to update top-level settings
  const handleSettingChange = (key: keyof SettingsType, value: any) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  // Function to update nested settings (notifications or privacy)
  const handleNestedSettingChange = <T extends keyof Notifications | keyof Privacy>(
    category: keyof SettingsType,
    key: T,
    value: any
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...(prevSettings[category] as Record<T, any>), // Ensure TypeScript understands dynamic keys
        [key]: value,
      },
    }));
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    setSettings((prevSettings) => ({ ...prevSettings, darkMode: newDarkMode }));
    document.documentElement.setAttribute("data-theme", newDarkMode ? "dark" : "light");
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  // Apply saved theme and font size on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");
    document.documentElement.style.fontSize = settings.fontSize;
  }, [settings.darkMode, settings.fontSize]);

  // Save changes
  const handleSaveChanges = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-container" role="main" aria-labelledby="settings-heading">
      <h1 id="settings-heading">Settings</h1>

      {/* Appearance Settings */}
      <div className="settings-section" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading">Appearance</h2>
        <div className="setting-item">
          <label htmlFor="font-size-selector">Font Size</label>
          <select
            id="font-size-selector"
            value={settings.fontSize}
            onChange={(e) => handleSettingChange("fontSize", e.target.value)}
            aria-live="polite"
            aria-label={`Font Size, currently ${settings.fontSize}`}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="setting-item">
          <label htmlFor="dark-mode-toggle">
            Dark Mode, currently {settings.darkMode ? "enabled" : "disabled"}
          </label>
          <input
            id="dark-mode-toggle"
            type="checkbox"
            checked={settings.darkMode}
            onChange={toggleDarkMode}
            aria-checked={settings.darkMode}
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="settings-section" aria-labelledby="notifications-heading">
        <h2 id="notifications-heading">Notifications</h2>
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div className="setting-item" key={key}>
            <label htmlFor={`notification-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)} Notifications, currently{" "}
              {value ? "enabled" : "disabled"}
            </label>
            <input
              id={`notification-${key}`}
              type="checkbox"
              checked={value}
              onChange={() =>
                handleNestedSettingChange("notifications", key as keyof Notifications, !value)
              }
              aria-checked={value}
            />
          </div>
        ))}
      </div>

      {/* Privacy Settings */}
      <div className="settings-section" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacy</h2>
        {Object.entries(settings.privacy).map(([key, value]) => (
          <div className="setting-item" key={key}>
            <label htmlFor={`privacy-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}, currently {value ? "enabled" : "disabled"}
            </label>
            <input
              id={`privacy-${key}`}
              type="checkbox"
              checked={value}
              onChange={() =>
                handleNestedSettingChange("privacy", key as keyof Privacy, !value)
              }
              aria-checked={value}
            />
          </div>
        ))}
      </div>

      {/* Save Changes */}
      <button
        className="save-button"
        onClick={handleSaveChanges}
        aria-label="Save all changes"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
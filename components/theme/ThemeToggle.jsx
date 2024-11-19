import React, { useState } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';
import { Tooltip } from 'flowbite-react';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isToggleSwitched, setIsToggleSwitched] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  
  const currentTheme = theme === "system" ? systemTheme : theme;
  
  return (
    <Tooltip 
      content={currentTheme === "dark" ? "Switch to Light Mode!🌞" : "Dark Mode is better!🌚🤩"}
      placement="left" 
      style="dark"
      className='transition duration-700 ease-in-out'
    >
      <button className={currentTheme === "dark" ? "" : "starry-background -mb-4"}>
        {currentTheme === "dark" ? (
          <HiSun
            id='sun-icon'
            className="rounded-lg p-2 mt-1 w-9 h-9 text-yellow-400 animate-spin hover:animate-none"
            role="button"
            onClick={() => setTheme('light')}
            style={{
              backgroundColor: isHovered ? "#4B5563" : "transparent",
              color: isHovered ? "#F3F4F6" : !isToggleSwitched ? "yellow" : "#9CA3AF",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onChange={() => setIsToggleSwitched(!isToggleSwitched)}
          />
        ) : (
          <HiMoon
            id='moon-icon'
            className="rounded-lg p-2 mt-1 w-9 h-9 animate-spin hover:animate-none"
            role="button"
            onClick={() => setTheme('dark')}
            style={{
              backgroundColor: "transparent",
              color: isHovered ? "rgba(90, 95, 91, 1)" : "#D3F4F6",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        )}
      </button>
    </Tooltip>
  );
};
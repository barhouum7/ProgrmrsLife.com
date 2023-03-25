import {NinjaKeys} from "ninja-keys";
// import {NinjaKeys} from 'https://unpkg.com/ninja-keys?module';
import { useState, useRef, useEffect } from "react";

export default function NinjaKey() {
  const ninjaKeys = useRef(null);
  const [hotkeys, setHotkeys] = useState([
    {
      id: "Home",
      title: "Open Home",
      hotkey: "cmd+h",
      mdIcon: "",
      handler: () => {
        console.log("navigation to home");
      }
    },
    {
      id: "Open Projects",
      title: "Open Projects",
      hotkey: "cmd+p",
      mdIcon: "",
      handler: () => {
        console.log("navigation to projects");
      }
    },
    {
      id: "Theme",
      title: "Change theme...",
      mdIcon: "",
      children: [
        {
          id: "Light Theme",
          title: "Change theme to Light",
          mdIcon: "",
          handler: () => {
            console.log("theme light");
          }
        },
        {
          id: "Dark Theme",
          title: "Change theme to Dark",
          mdIcon: "",
          keywords: "lol",
          handler: () => {
            console.log("theme dark");
          }
        }
      ]
    }
  ]);

  useEffect(() => {
    if (ninjaKeys.current) {
      ninjaKeys.current.data = hotkeys;
    }
  }, []);

  return (
    <div>
      <NinjaKeys 
      ref={ninjaKeys}
      data={hotkeys}
      theme="dark"
      />
    </div>
  );
}

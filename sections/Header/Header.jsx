import React, {useState, useEffect} from 'react'

import { useRouter } from "next/router";
import Logo from "../../components/Logo";
import {useTheme} from "next-themes";
import { DarkThemeToggle, Navbar, Dropdown, Tooltip } from "flowbite-react";
import { Flowbite } from "flowbite-react";
import{ SunIcon, MoonIcon } from "@heroicons/react/20/solid";

import SearchBar from "./SearchBar";
import useThemeActions from '../../hooks/useThemeActions';

import Link from "next/link";
import { getCategories } from '../../services'

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isItemHovered, setIsItemHovered] = useState("");
  const [ isToggleSwitched, setIsToggleSwitched] = useState(false);
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    const link = e.target.getAttribute("href");
    router.push(link);
  };
  
  const [categories, setCategories] = useState([])
    useEffect(() => {
      getCategories()
        .then((newCategories) => setCategories(newCategories))
        .catch((err) => console.log(err))
  }, [])

  const {systemTheme , theme, setTheme} = useTheme ();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() =>{
    setMounted(true);
  },[])
  
  const isKbarDarkThemeChanged = () => {
    
    const html = typeof window !== 'undefined' && window.document.documentElement;
    if (html) {
      // console.log(html.classList.contains('dark'));
      return html.classList.contains('dark');
    } else {
      return false;
    }
  }

  const isMoonIcon = () => {
    const moonIcon = typeof window !== 'undefined' && window.document.getElementById('moon-icon');
    if (moonIcon) {
      return true;
    } else {
      return false;
    }
  }

  const isSunIcon = () => {
    const sunIcon = typeof window !== 'undefined' && window.document.getElementById('sun-icon');
    if (sunIcon) {
      return true;
    } else {
      return false;
    }
  }

  const renderSunIcon = () => {
    return (
      <SunIcon id='sun-icon' className="rounded-lg p-2 w-10 h-10 text-yellow-400" role="button" onClick={() => setTheme('light')}
      style={{
        backgroundColor: isHovered ? "#4B5563" : "transparent",
        color: isHovered ? "#F3F4F6" : !isToggleSwitched ? "yellow" : "#9CA3AF",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onChange={() => setIsToggleSwitched(!isToggleSwitched)}
      />
    )
  }

  const renderThemeChanger = () => {
    if(!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;
    
    if(currentTheme === "dark" || isKbarDarkThemeChanged() === true) {
      return (
        <SunIcon id='sun-icon' className="rounded-lg p-2 w-10 h-10 text-yellow-400" role="button" onClick={() => setTheme('light')} 
        style={{
          backgroundColor: isHovered ? "#4B5563" : "transparent",
          color: isHovered ? "#F3F4F6" : !isToggleSwitched ? "yellow" : "#9CA3AF",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onChange={() => setIsToggleSwitched(!isToggleSwitched)}
        />
      )
    }

    else {
      return (
        <MoonIcon id='moon-icon' className="rounded-lg p-2 w-10 h-10 text-gray-900" role="button" onClick={() => setTheme('dark')} 
        style={{
          backgroundColor: isHovered ? "#4B5563" : "transparent",
          color: isHovered ? "#F3F4F6" : "rgba(55, 65, 81, 1)",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        />
      )
    }
};
  
  const renderKbarThemeChanger = () => {
        if(!mounted) return null;
        
        if(isKbarDarkThemeChanged === true) {
          return (
            <SunIcon id='sun-icon' className="rounded-lg p-2 w-10 h-10 text-yellow-400" role="button" onClick={() => setTheme('light')}
            style={{
              backgroundColor: isHovered ? "#4B5563" : "transparent",
              color: isHovered ? "#F3F4F6" : !isToggleSwitched ? "yellow" : "#9CA3AF",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onChange={() => setIsToggleSwitched(!isToggleSwitched)}
            />
          )
        }

        else {
          return (
            <DarkThemeToggle id='moon-icon' className="w-10 h-10 text-gray-900" role="button" onClick={() => setTheme('dark')}
            style={{
              backgroundColor: isHovered ? "#4B5563" : "transparent",
              color: isHovered ? "#F3F4F6" : "rgba(55, 65, 81, 1)",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            />
          )
        }
  };

  const darkMode = function () {
    
    if (theme === "dark") {
        
        // console.log('Dark: '+ theme);
        return true;
    } else {

      // console.log('Light: '+ theme);
      return false;
    }
  }

  useThemeActions(isScrolled, darkMode());


  // useEffect(() => {
  //   const navbar = document.querySelector('nav');
  //   const html = document.querySelector('html');
  //     // if (!isScrolled) {
  //         if ((darkMode() && document.querySelector('nav').style.backgroundColor.includes('rgba(255, 255, 255, 0.9)') || !isScrolled) || isHovered || !isHovered) {
  //           navbar.style.backgroundColor = 'rgba(28, 35, 43, 0.8)';
  //         } else if (!(darkMode() && document.querySelector('nav').style.backgroundColor.includes('rgba(255, 255, 255, 0.9)')) || isHovered || !isHovered) {
  //           navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  //         } else {
  //           navbar.style.backgroundColor = '';
  //         }
  //         // if (navbar.style.backgroundColor.includes('rgba')) {
  //         //   navbar.style.backgroundColor = '';
  //         // }
  //     // }
  // }, []);

  return (
      <header className="relative h-32">
        {/* <Navbar fluid className="w-full backdrop-filter backdrop-blur-lg fixed top-0 h-16 z-30  duration-500"> */}
        {/* <nav className={`w-full h-16 z-10 fixed top-0 left-0 backdrop-filter backdrop-blur-lg dark:bg-gray-800 flex-grow sm:px-6 rounded-b shadow-lg dark:border-gray-700 transition ease-in-out transition-all duration-500
              bg-transparent ${isScrolled ? "bg-transparent" : "bg-white"}`}> */}
          <Flowbite>
            <Navbar
            fluid={true} 
            className={`w-full h-16 z-10 fixed top-0 left-0 flex-grow sm:px-6 rounded-b shadow-lg
              dark:bg-opacity-90 dark:bg-gray-800 bg-opacity-90
            `}
            style={{
              backgroundColor: isScrolled
              ? "transparent"
              : (isKbarDarkThemeChanged() ? "rgba(28, 35, 43, 0.8)" : "rgba(255, 255, 255, 0.9)"),
              backdropFilter: isScrolled ? "blur(10px)" : "none",
            }}
            >
              <Navbar.Brand href="/">
                <div className="lg:w-0 lg:flex-1 sm:px-6 flex justify-between items-center">
                  <Logo />
                  <span className="self-center whitespace-nowrap px-3 ml-1 text-md font-semibold bg-gradient-to-r from-pink-500 to-transparent rounded-lg">
                    Programmers Life
                  </span>
                </div>
                </Navbar.Brand>
                
                <Navbar.Collapse 
                  // className={`${darkMode() ? "text-gray-400" : "text-gray-700"}`}
                  style={{
                    color: isScrolled ? "#bd6FF6" : "inherit",
                  }}
                >
                  <Navbar.Link className='navbar-item' href="/" active={router.pathname === "/"}
                  onClick={handleClick}
                  onMouseLeave={() => setIsItemHovered("")}
                  onMouseEnter={() => setIsItemHovered("home")}
                  style={{
                    position: 'relative',
                    color: isItemHovered === "home" ? "#8B5CF6" : router.pathname === "/" ? isScrolled ? "#8B5CF6" : "#8B5CF6" : "inherit",
                  }}
                  >
                    Home
                    <span 
                      style={{
                        content: "''",
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: isItemHovered === "home" ? '100%' : '0%',
                        height: '2px',
                        backgroundColor: 'violet',
                        transition: 'width 0.3s ease-out',
                      }}
                    />
                  </Navbar.Link>
                  <Navbar.Link className='navbar-item' href="/AboutUs" active={router.pathname === "/AboutUs"}
                  onClick={handleClick}
                  onMouseLeave={() => setIsItemHovered("")}
                  onMouseEnter={() => setIsItemHovered("about")}
                  style={{
                    position: 'relative',
                    color: isItemHovered === "about" ? "#8B5CF6" : router.pathname === "/AboutUs" ? isScrolled ? "#8B5CF6" : "#8B5CF6" : "inherit",
                  }}
                  >
                    About
                    <span 
                      style={{
                        content: "''",
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: isItemHovered === "about" ? '100%' : '0%',
                        height: '2px',
                        backgroundColor: 'violet',
                        transition: 'width 0.3s ease-out',
                      }}
                    />
                  </Navbar.Link>
                  <Navbar.Link className='navbar-item' href="/Services" target="_top" active={router.pathname === "/Services"}
                  onClick={handleClick}
                  onMouseLeave={() => setIsItemHovered("")}
                  onMouseEnter={() => setIsItemHovered("services")}
                  style={{
                    position: 'relative',
                    color: isItemHovered === "services" ? "#8B5CF6" : router.pathname === "/Services" ? isScrolled ? "#8B5CF6" : "#8B5CF6" : "inherit",
                  }}
                  >
                    Services
                    <span 
                      style={{
                        content: "''",
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: isItemHovered === "services" ? '100%' : '0%',
                        height: '2px',
                        backgroundColor: 'violet',
                        transition: 'width 0.3s ease-out',
                      }}
                    />
                  </Navbar.Link>
                  
                    <Dropdown label="Categories" inline={true} trigger="hover" className="transition duration-700 ease-in-out transition-all">
                        {categories.map((category) => (
                      <Dropdown.Item key={category.slug} className='navbar-item'>
                          <Link active={router.pathname === category.name ? category.name : undefined } onClick={handleClick} href={`/category/${category.slug}`}
                          onMouseLeave={() => setIsItemHovered("")}
                          onMouseEnter={() => setIsItemHovered(category.name)}
                          style={{
                            position: 'relative',
                            color: isItemHovered === category.name ? "#8B5CF6" : router.pathname === category.name ? isScrolled ? "#8B5CF6" : "#8B5CF6" : "inherit",
                          }}
                          >
                            {category.name}
                            <span
                              style={{
                                content: "''",
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: isItemHovered === category.name ? '100%' : '0%',
                                height: '2px',
                                backgroundColor: 'violet',
                                transition: 'width 0.3s ease-out',
                              }}
                            />
                          </Link>
                      </Dropdown.Item>
                        ))}
                    </Dropdown>
                  
                  <Navbar.Link className='navbar-item' href="/ContactUs" active={router.pathname === "/ContactUs"}
                  onClick={handleClick}
                  onMouseLeave={() => setIsItemHovered("")}
                  onMouseEnter={() => setIsItemHovered("contact")}
                  style={{
                    position: 'relative',
                    color: isItemHovered === "contact" ? "#8B5CF6" : router.pathname === "/ContactUs" ? isScrolled ? "#8B5CF6" : "#8B5CF6" : "inherit",
                  }}
                  >
                    Contact
                    <span 
                      style={{
                        content: "''",
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: isItemHovered === "contact" ? '100%' : '0%',
                        height: '2px',
                        backgroundColor: 'violet',
                        transition: 'width 0.3s ease-out',
                      }}
                    />
                  </Navbar.Link>
                </Navbar.Collapse>
                
                <div className="flex md:order-2">
                  <Navbar.Toggle 
                  />
                  <Tooltip content={
                    isSunIcon() ?
                    "Switch to Light Mode!🌞" : "Dark Mode is better!🌚🤩"
                    
                  } placement="left" style="dark" className='transition duration-700 ease-in-out'>
                    {
                      // darkMode() ?
                      //   isMoonIcon() ?
                      //     renderKbarThemeChanger() : renderThemeChanger() 
                      // : 
                      //   isMoonIcon() ?
                      //     renderThemeChanger() : renderKbarThemeChanger()
                      // isKbarDarkThemeChanged() ? renderThemeChanger() : renderKbarThemeChanger()

                      // !isMoonIcon ?
                      //   !isKbarDarkThemeChanged() ?
                      //     renderKbarThemeChanger()  : renderThemeChanger() 
                      // :
                      // !isSunIcon ?
                      //   isKbarDarkThemeChanged() ?
                      //     renderKbarThemeChanger()  : renderThemeChanger()
                      // :
                      //   !isKbarDarkThemeChanged() ?
                      //     renderThemeChanger() : renderSunIcon()

                      // isKbarDarkThemeChanged() ? renderThemeChanger() : renderKbarThemeChanger()
                      // isKbarDarkThemeChanged() ? !isMoonIcon() ? renderThemeChanger() : renderKbarThemeChanger() : !isMoonIcon() ? renderKbarThemeChanger() : renderThemeChanger()
                      renderThemeChanger()
                    }
                  </Tooltip>
                  {/* <Flowbite>
                    <Tooltip content="Dark Mode is better!🤩" placement="left" style="dark" className='transition duration-700 ease-in-out'>
                        <DarkThemeToggle />
                    </Tooltip>
                  </Flowbite> */}
                  <SearchBar isScrolled={isScrolled}/>
                </div>
              </Navbar>
            </Flowbite>
        {/* </nav> */}
      </header>
  );
};

export default Header;
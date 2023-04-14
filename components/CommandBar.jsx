import React, { useEffect, useState } from "react"
import {
    KBarPortal,
    KBarPositioner,
    KBarAnimator,
    KBarSearch,
    KBarResults,
    useMatches,
    createAction,
    useRegisterActions,
    ActionId,
    ActionImpl,
    NO_GROUP
  } from "kbar";

import usePostsActions from "../hooks/usePostsActions";
import useCategoriesActions from "../hooks/useCategoriesActions";
import useThemeActions from "../hooks/useThemeActions";

const searchStyle = {
    padding: "12px 16px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    border: "none",
    background: "var(--background)",
    color: "var(--foreground)",
    
  };
  // TailwindCSS equivalent
  // const searchStyle = "p-3 text-base w-full box-border outline-none border-none bg-gray-900 text-gray-100";
  
  const animatorStyle = {
    maxWidth: "600px",
    width: "100%",
    // background: "rgba(23, 23, 23, 0.9)",
    background: "#1a202c",
    // background: "#1c1c1c",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "var(--shadow)",
  };
  
  // TailwindCSS equivalent
  // const animatorStyle = "max-w-600 w-full bg-gray-100 dark:bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg";
  
  const groupNameStyle = {
    padding: "8px 16px",
    fontSize: "10px",
    textTransform: "uppercase",
    opacity: 0.5,
  };
  
  const RenderResults = () => {
    const { results, rootActionId } = useMatches();
    
    return (
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === "string" ? (
            <div style={groupNameStyle}>{item}</div>
          ) : (
            <ResultItem
              action={item}
              active={active}
              currentRootActionId={rootActionId}
            />
          )
        }
      />
    )
  }
  
  const ResultItem = React.forwardRef(
    (
      {
        action = ActionImpl.NO_ACTION,
        active,
        currentRootActionId,
      },
      ref
    ) => {
      const ancestors = React.useMemo(() => {
        if (!currentRootActionId) return action.ancestors;
        const index = action.ancestors.findIndex(
          (ancestor) => ancestor.id === currentRootActionId
        );
        // +1 removes the currentRootAction; e.g.
        // if we are on the "Set theme" parent action,
        // the UI should not display "Set theme… > Dark"
        // but rather just "Dark"
        return action.ancestors.slice(index + 1);
      }, [action.ancestors, currentRootActionId]);
  
      return (
        <div
          ref={ref}
          style={{
            // padding: "12px 16px",
            // background: active ? "rgba(0 0 0 / .1)" : "transparent",
            // borderLeft: `2px solid ${
            //   active ? "white" : "transparent"
            // }`,
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "space-between",
            // cursor: "pointer",
          }}
          className={`dark:hover:bg-transparent dark:bg-black dark:bg-opacity-10 flex justify-between items-center cursor-pointer p-3 border-l-2 border-black dark:border-white border-opacity-0 dark:border-opacity-0
            ${active ? "bg-gray-100 text-gray-900 dark:text-gray-100 dark:bg-transparent dark:bg-opacity-10 border-opacity-100 dark:border-opacity-100" : "bg-white text-gray-900 dark:text-white"}
            `}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            {action.icon && action.icon}
            <div style={{ display: "flex", flexDirection: "column",
              gap: "4px",
              padding: "8px",
              borderRadius: "8px",
            }}>
              <div>
                {ancestors.length > 0 &&
                  ancestors.map((ancestor) => (
                    <React.Fragment key={ancestor.id}>
                      <span
                        // style={{
                        //   opacity: 0.5,
                        //   marginRight: 8,
                        //   background: "rgba(0 0 0 / .1)",
                        //   padding: "4px 6px",
                        //   borderRadius: "4px",
                        //   color: "rgba(255, 255, 255, 0.7)",
                        // }}
                        className="mr-2 bg-gray-800 bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
                      >
                        {ancestor.name}
                      </span>
                      <span
                        style={{
                          marginRight: 8,
                        }}
                      >
                        &rsaquo;
                      </span>
                    </React.Fragment>
                  ))}
                <span>{action.name}</span>
              </div>
              {action.subtitle && (
                <span style={{ fontSize: 12,
                  opacity: 0.7,
                  marginTop: 4,
                }}>{action.subtitle}</span>
              )}
            </div>
          </div>
          {action.shortcut?.length ? (
            <div
              aria-hidden
              style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
            >
              {action.shortcut.map((sc) => (
                <kbd
                  key={sc}
                  // style={{
                  //   padding: "4px 6px",
                  //   background: "rgba(0 0 0 / .1)",
                  //   borderRadius: "4px",
                  //   fontSize: 14,
                  // }}
                  // className="bg-gray-800 bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
                  className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-2 my-1 text-sm tracking-normal border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white"
                >
                  {sc}
                </kbd>
              ))}
            </div>
          ) : null}
        </div>
      );
    }
  );

export default function CommandBar() {
    usePostsActions();
    useCategoriesActions();
    useThemeActions();
    return (
      <KBarPortal> 
      {/* Renders the content outside the root node */}
      <KBarPositioner>
        {/* Position the KBar, Centers the content by default */}
        <KBarAnimator
          // style={animatorStyle}
          className="bg-white dark:bg-gray-800 dark:text-white text-black rounded-lg overflow-hidden shadow-lg sm:max-w-4xl sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl"
          // className={`${animatorStyle} dark:${animatorStyle["--background"]} dark:${animatorStyle["--foreground"]}`}
        >
          {/* Handles the show/hide and height animations */}
          <KBarSearch
            style={searchStyle}
            // className="bg-white dark:bg-gray-800 dark:text-white text-black"
            // className={`${searchStyle} dark:${searchStyle["--background"]} dark:${searchStyle["--foreground"]}`}
          />
          {/* Renders the search input */}
          <RenderResults />
          {/* Renders the results */}
            <div>
                <div className="flex items-center justify-center w-full py-2 px-2 rounded border-t border-l border-r border-white dark:border-transparent leading-none">
                  <span className="text-xs tracking-tighter">
                    <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                      Enter ↩
                    </kbd>
                  </span>
                  <span className="text-xs mr-4 tracking-normal text-gray-600 dark:text-gray-400">
                    to select
                  </span>
                  <span className="text-xs tracking-tighter">
                    <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                      ↑
                    </kbd>
                    <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                      ↓
                    </kbd>
                  </span>
                  <span className="text-xs mr-4 tracking-normal text-gray-600 dark:text-gray-400">
                    to navigate
                  </span>
                  <span className="text-xs tracking-tighter">
                    <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                      Esc
                    </kbd>
                  </span>
                  <span className="text-xs mr-4 tracking-normal text-gray-600 dark:text-gray-400">
                    to close the search
                  </span>
                </div>
            </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
    )
  }
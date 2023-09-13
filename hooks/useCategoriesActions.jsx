import React from "react";
import { AiFillGithub, AiFillTwitterCircle } from "react-icons/ai";
import { BsFacebook, BsLinkedin } from "react-icons/bs";
import { useRegisterActions, createAction } from "kbar";

export default function useCategoriesActions() {
    useRegisterActions(
        [
            {
                id: "contact",
                name: "Contact",
                shortcut: ["c"],
                section: "Navigation",
                keywords: ["contact, contact us, contact us page, contact page, email, email us, email us page, email page"],
                perform: () => {
                    window.location.href = "/ContactUs"
                },
                subtitle: "Go to the contact page",
                icon: <ContactIcon />,
            },
            {
            id: "categories",
            name: "Categories",
            shortcut: ["g", "r"],
            keywords: "categories, categories page, category, category page",
            section: "Navigation",
            subtitle: "Go to the categories pages",
            icon: <CategoriesIcon />,
            },
                {
                id: "free-online-resources",
                name: "Free Online Resources",
                shortcut: ["f", "o", "r"],
                keywords: ["free, free online resources, free online resources page, free resources, free resources page, free online, free online page, free page, online resources, online resources page, online, online page, resources, resources page"],
                section: "",
                perform: () => {
                    window.location.href = "/category/free-online-resources"
                },
                subtitle: "Go to the free online resources category page",
                parent: "categories",
                },
                {
                id: "tech-guides",
                name: "Tech Guides",
                shortcut: ["t", "g"],
                keywords: ["tech, tech guides, tech guides page, guides, guides page, tech page, guides page"],
                section: "",
                perform: () => {
                    window.location.href = "/category/tech-guides"
                },
                subtitle: "Go to the tech guides category page",
                parent: "categories",
                },
                {
                id: "web-dev",
                name: "Web Development",
                shortcut: ["w", "d"],
                keywords: ["web, web dev, web development, web development page, web dev page, development, development page, dev, dev page"],
                section: "",
                perform: () => {
                    window.location.href = "/category/web-dev"
                },
                subtitle: "Go to the web development category page",
                parent: "categories",
                },
                {
                    id: "tips-and-tricks",
                    name: "Tips & Tricks",
                    shortcut: ["t"],
                    keywords: ["tips, tricks, tips and tricks, tips & tricks, tips and tricks page, tips & tricks page, tips page, tricks page"],
                    section: "",
                    perform: () => {
                        window.location.href = "/category/tips-and-tricks"
                    },
                    subtitle: "Go to the tips and tricks category page",
                    parent: "categories",
                },
                {
                    id: "linux-sys-admin",
                    name: "Linux Sys Admin",
                    shortcut: ["l", "a"],
                    keywords: ["linux, linux sys admin, linux sys admin page, linux system admin, linux system admin page, linux system administration, linux system administration page, linux administration, linux administration page, linux admin, linux admin page, linux administration, linux administration page, linux sys, linux sys page, linux system, linux system page, linux system administration, linux system administration page, linux administration, linux administration page, linux admin, linux admin page, linux administration, linux administration page, sys admin, sys admin page, system admin, system admin page, system administration, system administration page, administration, administration page, admin, admin page, administration, administration page, sys, sys page, system, system page, system administration, system administration page, administration, administration page, admin, admin page, administration, administration page"],
                    section: "",
                    perform: () => {
                        window.location.href = "/category/linux-sys-admin"
                    },
                    subtitle: "Go to the linux sys admin category page",
                    parent: "categories",
                },
                {
                    id: "news-and-events",
                    name: "News & Events",
                    shortcut: ["n", "e"],
                    keywords: ["news, events, news and events, news & events, news and events page, news & events page, news page, events page"],
                    section: "",
                    perform: () => {
                        window.location.href = "/category/news-and-events"
                    },
                    subtitle: "Go to the news and events category page",
                    parent: "categories",
                },
                {
                    id: "web3",
                    name: "Blockchain technology",
                    shortcut: ["w", "3"],
                    keywords: ["web3, web3 page, blockchain, blockchain page, blockchain technology, blockchain technology page, blockchain tech, blockchain tech page, blockchain technology, blockchain technology page, blockchain technology, blockchain technology page, blockchain tech, blockchain tech page, blockchain technology, blockchain technology page, blockchain technology, blockchain technology page, blockchain tech, blockchain tech page, blockchain technology, blockchain technology page, blockchain technology, blockchain technology page, blockchain tech, blockchain tech page, blockchain technology, blockchain technology page, blockchain technology, blockchain technology page, blockchain tech, blockchain tech page, blockchain technology, blockchain technology page, blockchain technology, blockchain technology page, blockchain tech, blockchain tech page, blockchain technology, blockchain technology page, blockchain technology, blockchain technology page, blockchain tech, blockchain tech page"],
                    section: "",
                    perform: () => {
                        window.location.href = "/category/web3"
                    },
                    subtitle: "Go to the blockchain technology category page",
                    parent: "categories",
                },
            createAction({
                name: "LinkedIn",
                shortcut: ["g", "l"],
                keywords: "social contact dm",
                section: "Social Media",
                perform: () => window.open("https://www.linkedin.com/in/ibrahimbs", "_blank"),
                subtitle: "Go to our LinkedIn profile",
                icon: <BsLinkedin className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white w-5 h-5" />,
            }),
            createAction({
                name: "Facebook Page",
                shortcut: ["g", "f"],
                keywords: "social contact dm",
                section: "Social Media",
                perform: () => window.open("https://www.facebook.com/mindh4q3rr", "_blank"),
                subtitle: "Go to our Facebook page",
                icon: <BsFacebook className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white w-5 h-5" />,
            }),
            {
                id: "twitterAction",
                name: "Twitter",
                shortcut: ["g", "t"],
                keywords: "social contact dm",
                section: "Social Media",
                perform: () => window.open("https://twitter.com/mindh4q3rr", "_blank"),
                subtitle: "Go to our Twitter profile",
                icon: <AiFillTwitterCircle className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white w-6 h-6" />,
            },
            createAction({
                name: "Github",
                shortcut: ["g", "h"],
                keywords: "sourcecode",
                section: "Social Media",
                perform: () => window.open("https://github.com/barhouum7", "_blank"),
                subtitle: "Go to our Github profile",
                icon: <AiFillGithub className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white w-6 h-6" />,
            }),
        ]
    )
}

function CategoriesIcon () {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    )
}

function ContactIcon () {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
    )
}
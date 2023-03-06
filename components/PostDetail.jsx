import React, { useState, useEffect, useRef } from 'react';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import { Prism } from '@mantine/prism';

import { RichText } from '@graphcms/rich-text-react-renderer';
import moment from 'moment';

import Link from 'next/link';

const PostDetail = ({ post }) => {

    const getMinutesRead = (text) => {
        const words = text.split(' ').length;
        const wordsPerMinute = 10;
        const minutes = Math.round(words / wordsPerMinute);
        return minutes;
    }
    

    // const getContentFragment = (index, text, obj, type) => {
    // let modifiedText = text;

    // if (obj) {
    //     if (obj.bold) {
    //     modifiedText = (<b key={index}>{text}</b>);
    //     }

    //     if (obj.italic) {
    //     modifiedText = (<em key={index}>{text}</em>);
    //     }

    //     if (obj.underline) {
    //     modifiedText = (<u key={index}>{text}</u>);
    //     }
        
    //     if (obj.code) {
    //         modifiedText = (<code key={index}>{text}</code>);
    //     }
        
    //     if (obj.strikethrough) {
    //         modifiedText = (<del key={index}>{text}</del>);
    //     }
        
    //     if (obj.subscript) {
    //         modifiedText = (<sub key={index}>{text}</sub>);
    //     }
        
    //     if (obj.superscript) {
    //         modifiedText = (<sup key={index}>{text}</sup>);
    //     }
        
    //     if (obj.link) {
    //         modifiedText = (<a href={obj.href} key={index}>{text}</a>);
    //     }
    //     if (obj.image) {
    //         modifiedText = (<img src={obj.image} key={index} alt={obj.alt} />);
    //     }
    //     if (obj.quote) {
    //         modifiedText = (<blockquote key={index}>{text}</blockquote>);
    //     }
    //     if (obj.list) {
    //         modifiedText = (<ul key={index}>{text}</ul>);
    //     }
    //     if (obj.listitem) {
    //         modifiedText = (<li key={index}>{text}</li>);
    //     }
    //     if (obj.table) {
    //         modifiedText = (<table key={index}>{text}</table>);
    //     }
    //     if (obj.tablecell) {
    //         modifiedText = (<td key={index}>{text}</td>);
    //     }
    //     if (obj.tableheader) {
    //         modifiedText = (<th key={index}>{text}</th>);
    //     }
    //     if (obj.tablefooter) {
    //         modifiedText = (<tfoot key={index}>{text}</tfoot>);
    //     }
    //     if (obj.paragraph) {
    //         modifiedText = (<p key={index}>{text}</p>);
    //     }
    //     if (obj.heading) {
    //         modifiedText = (<h1 key={index}>{text}</h1>);
    //     }
    //     if (obj.heading2) {
    //         modifiedText = (<h2 key={index}>{text}</h2>);
    //     }
    //     if (obj.heading3) {
    //         modifiedText = (<h3 key={index}>{text}</h3>);
    //     }
    //     if (obj.heading4) {
    //         modifiedText = (<h4 key={index}>{text}</h4>);
    //     }
    //     if (obj.heading5) {
    //         modifiedText = (<h5 key={index}>{text}</h5>);
    //     }
    //     if (obj.heading6) {
    //         modifiedText = (<h6 key={index}>{text}</h6>);
    //     }
    //     if (obj.orderedlist) {
    //         modifiedText = (<ol key={index}>{text}</ol>);
    //     }
    //     if (obj.unorderedlist) {
    //         modifiedText = (<ul key={index}>{text}</ul>);
    //     }
    // }

    // switch (type) {
    //     case 'heading-three':
    //     return <h3 key={index} className="text-xl font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
    //     case 'paragraph':
    //         if (modifiedText.map((item, i) => item === 'text')) {
    //             return <p key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>;
    //         } else if (modifiedText.map((item, i) => item === 'href')) {
    //             return <a href={item[1]} key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</a>;
    //         }
    //         break;
    //     case 'heading-four':
    //     return <h4 key={index} className="text-md font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
    //     case 'image':
    //     return (
    //         <img
    //         key={index}
    //         alt={obj.title}
    //         height={obj.height}
    //         width={obj.width}
    //         src={obj.src}
    //         />
    //     );
    //     default:
    //     return modifiedText;
    // }
    // };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl lg:p-8 pb-12 m-0 mb-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
            <div className="relative overflow-hidden shadow-xl mb-6">
                <img 
                    src={post.featuredImage.url}
                    alt={post.title}
                    className="object-top w-full h-full rounded-t-lg"
                />
            </div>
            <div className="px-4 lg:px-0">
                <div className="lg:flex block items-center mb-8 w-full">
                    <div className="flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto mr-2">
                        <img
                            alt={post.author.name}
                            height="30"
                            width="30"
                            src={post.author.photo.url}
                            className="rounded-full align-middle border-none shadow-lg cursor-pointer"
                        />
                        <p className="inline align-middle text-gray-700 dark:text-gray-200 ml-2 text-lg">{post.author.name}</p>
                    </div>
                    <div className="flex items-center justify-center w-full lg:w-auto font-medium text-gray-700 dark:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className='mr-2'>
                            {moment(post.createdAt).format('MMMM Do YYYY')}
                        </span>
                            &nbsp;•&nbsp;
                        <span>
                            {/* <svg width="30px" height="30px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" stroke="currentColor" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 919.04c-224.768 0-407.04-182.272-407.04-407.04S287.232 104.96 512 104.96s407.04 182.272 407.04 407.04-182.272 407.04-407.04 407.04z m0-15.36c216.064 0 391.68-175.616 391.68-391.68S728.064 120.32 512 120.32 120.32 295.936 120.32 512s175.616 391.68 391.68 391.68z" fill=""></path><path d="M512 837.12c-179.712 0-325.12-145.408-325.12-325.12S332.288 186.88 512 186.88s325.12 145.408 325.12 325.12-145.408 325.12-325.12 325.12z m0-15.36c171.008 0 309.76-138.752 309.76-309.76S683.008 202.24 512 202.24 202.24 340.992 202.24 512s138.752 309.76 309.76 309.76z" fill=""></path><path d="M501.76 245.76h20.48c5.632 0 10.24 4.608 10.24 10.24v81.92c0 5.632-4.608 10.24-10.24 10.24h-20.48c-5.632 0-10.24-4.608-10.24-10.24V256c0-5.632 4.608-10.24 10.24-10.24zM714.24 328.192c3.072 3.072 3.072 7.68 0 10.752l-32.768 32.768c-3.072 3.072-7.68 3.072-10.752 0-3.072-3.072-3.072-7.68 0-10.752l32.768-32.768c3.072-3.072 8.192-3.072 10.752 0zM366.08 655.872c3.072 3.072 3.072 7.68 0 10.752l-32.768 32.768c-3.072 3.072-7.68 3.072-10.752 0-3.072-3.072-3.072-7.68 0-10.752l32.768-32.768c3.072-3.072 8.192-3.072 10.752 0zM650.752 655.872c3.072-3.072 7.68-3.072 10.752 0l32.768 32.768c3.072 3.072 3.072 7.68 0 10.752-3.072 3.072-7.68 3.072-10.752 0l-32.768-32.768c-3.072-3.072-3.072-8.192 0-10.752zM353.28 501.76v20.48c0 5.632-4.608 10.24-10.24 10.24H261.12c-5.632 0-10.24-4.608-10.24-10.24v-20.48c0-5.632 4.608-10.24 10.24-10.24h81.92c5.632 0 10.24 4.608 10.24 10.24zM501.76 675.84h20.48c5.632 0 10.24 4.608 10.24 10.24v81.92c0 5.632-4.608 10.24-10.24 10.24h-20.48c-5.632 0-10.24-4.608-10.24-10.24v-81.92c0-5.632 4.608-10.24 10.24-10.24zM773.12 501.76v20.48c0 5.632-4.608 10.24-10.24 10.24h-81.92c-5.632 0-10.24-4.608-10.24-10.24v-20.48c0-5.632 4.608-10.24 10.24-10.24h81.92c5.632 0 10.24 4.608 10.24 10.24zM515.584 473.088h0.512L395.264 317.952c-3.072-4.608-9.728-5.12-14.336-1.536l-24.064 18.944c-4.608 3.584-5.12 9.728-1.536 14.336l120.32 154.624c4.096-17.92 20.48-31.232 39.936-31.232z" fill="#7ED321"></path><path d="M519.68 463.872L401.408 312.32c-3.072-3.584-7.168-6.144-11.776-6.656-5.12-0.512-9.728 0.512-13.824 3.584l-24.064 18.944c-8.192 6.144-9.216 16.896-3.072 25.088l115.712 148.992c-0.512 3.072-1.024 6.656-1.024 9.728 0 26.624 22.016 48.64 48.64 48.64s48.64-22.016 48.64-48.64c0-24.064-17.408-44.544-40.96-48.128z m-158.72-119.808c-0.512-0.512-1.536-2.048 0-3.584l24.064-18.944c1.024-0.512 1.536-0.512 2.048-0.512 1.024 0 1.024 0 1.536 0.512l111.616 143.36c-11.776 3.072-22.016 10.752-28.672 20.48L360.96 344.064z m151.04 201.216c-14.336 0-26.624-9.216-31.232-22.016-1.024-3.584-2.048-7.168-2.048-11.264 0-4.608 1.024-9.216 2.56-13.312 5.12-11.264 15.872-19.456 29.184-19.968h1.024c13.824 0 25.6 8.192 30.72 19.968 1.536 4.096 2.56 8.704 2.56 13.312 0.512 18.432-14.336 33.28-32.768 33.28z" fill=""></path></g></svg> */}
                            <svg width="30px" height="30px" viewBox="0 0 24 24" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"> 
                                    <path d="M17 7L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                    <path d="M10 3H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                    <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle> 
                                    <path d="M12 13V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                </g>
                            </svg>
                        </span>
                        <span className='text-gray-700 dark:text-gray-200'>
                            {getMinutesRead(post.excerpt)} min read
                        </span>
                    </div>
                </div>
                <h1 className='mb-8 mt-4 text-3xl font-semibold'>
                    {post.title}
                </h1>
                {/* {console.log(post.content.json.children)} */}
                {/* {post.content.json.children[0].children[0].text} */}
                
                
                {/* {post.content.json.children.map((typeObj, index) => {
                    const children = typeObj.children.map((item, itemIndex) =>  item.text)
                    return console.log(children)
                    // return children
                })} */}

                {/* {post.content.raw.children.map((typeObj, index) => {
                    const children = typeObj.children.map((item, itemIndex) => getContentFragment(itemIndex, item.text, item)) 
                    return getContentFragment(index, children, typeObj, typeObj.type)
                })} */}

                <div>
                    <RichText
                    content={post.content.json.children}
                    renderers={{
                    a: ({ children, openInNewTab, href, rel, ...rest }) => {
                        if (href.match(/^https?:\/\/|^\/\//i)) {
                        return (
                                <a
                                className='text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-700'
                                href={href}
                                target={openInNewTab ? '_blank' : '_self'}
                                rel={rel || 'noopener noreferrer'}
                                {...rest}
                                >
                                    {children}

                                </a>
                        );
                        }

                        return (
                                <Link href={href}>
                                    <a {...rest}>{children}</a>
                                </Link>
                        );
                    },
                    h1: ({ children }) => <h1 className="text-3xl font-semibold">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-1xl font-semibold">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-xl font-semibold my-4">{children}</h4>,
                    h5: ({ children }) => <h5 className="text-gray-700 font-semibold">{children}</h5>,
                    h6: ({ children }) => <h6 className="text-gray-700 font-semibold">{children}</h6>,
                    p: ({ children }) => <p className="text-gray-900 dark:text-gray-400">{children}</p>,
                    bold: ({ children }) => <span className="font-semibold text-sm text-gray-900 dark:text-gray-400">{children}</span>,
                    italic: ({ children }) => <em className="relative text-gray-900 dark:text-white mr-1">{children}</em>,
                    code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-600 px-2 py-0 rounded font-mono text-sm text-gray-900 dark:text-gray-100">{children}</code>,
                    code_block:
                        ({ children }) => 
                     {
                        const [preContent, setPreContent] = useState("");

                        useEffect(() => {
                            const childArray = React.Children.toArray(children);
                            console.log(childArray[0]);
                            let content = "";
                            for (let i = 0; i < childArray.length; i++) {
                                const child = childArray[i].props.content[0].text;
                                // console.log(child);
                                if (typeof child === "string") {
                                content += child;
                                } else if (child.props && child.props.children) {
                                const grandchildArray = React.Children.toArray(child.props.children);
                                for (let j = 0; j < grandchildArray.length; j++) {
                                    const grandchild = grandchildArray[j];
                                    if (typeof grandchild === "string") {
                                    content += grandchild;
                                    }
                                }
                                }
                            }
                            setPreContent(content);
                            }, [children]);

                        return (
                            <div>
                                {/* <pre id="code-block" ref={preRef}>
                                    {children}
                                </pre> */}
                                <Prism
                                    language="javascript"
                                    getPrismTheme={(_theme, colorScheme) =>
                                    colorScheme === "dark" ? duotoneLight : duotoneDark
                                    }
                                    className="m-2"
                                >
                                    {preContent}
                                </Prism>
                            </div>
                        );
                    }
                    ,
                    blockquote: ({ children }) => <blockquote className="text-red-700">{children}</blockquote>,
                    ol: ({ children }) => <ol className="list-decimal list-inside leading-10 bg-gray-200 dark:bg-gray-700 px-2 py-0 my-2 rounded font-mono text-sm text-gray-900 dark:text-gray-100">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-900 dark:text-gray-400">{children}</li>,
                    
                    }}
                />
                
                </div>
            </div>
        </div>
    )
}

export default PostDetail
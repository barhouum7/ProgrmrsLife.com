import React, { useState, useEffect } from 'react';
import { RichText } from '@graphcms/rich-text-react-renderer';
import Link from 'next/link';
import { Prism } from '@mantine/prism';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import Image from 'next/image';
import { grpahCMSImageLoader } from '../../util';

/**
 * Shared RichText content renderer for Guides and AlternativePosts.
 * Uses the same @graphcms/rich-text-react-renderer approach as PostDetail.jsx
 * for consistent, styled rendering of Hygraph Rich Text content.
 */
const RichTextContent = ({ content }) => {
  // Support both raw (guides/alternatives) and json (posts) content formats
  // We added json support in the Hygraph schema (by adding embeddings in the content field) for guides and alternatives as well
  const children = content?.json?.children || content?.raw?.children;
  if (!children) return null;

  return (
    <section className="post-content">
      <RichText
        content={children}
        renderers={{
          a: ({ children, openInNewTab, href, rel, ...rest }) => {
            if (href?.match(/^https?:\/\/|^\/\//i)) {
              return (
                <Link
                  className="text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-500"
                  href={href}
                  target={openInNewTab ? '_blank' : '_self'}
                  rel={rel || 'noopener noreferrer'}
                  {...rest}
                >
                  {children}
                </Link>
              );
            }

            return (
              <Link href={href} className="text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-500">
                <span {...rest}>{children}</span>
              </Link>
            );
          },
          h1: ({ children }) => (
            <div className='group relative py-2 overflow-hidden'>
              <div className='absolute left-0 top-1/2 w-1 h-1/2 bg-pink-400 rounded-full transform -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:h-[53%] group-hover:top-0 group-hover:translate-y-2 z-0 group-hover:z-10 bg-opacity-100 group-hover:bg-opacity-0'></div>
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 pl-4 mb-4 relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-500 before:rounded-full transition-all duration-300 ease-in-out hover:pl-8 hover:text-indigo-600 dark:hover:text-indigo-200 hover:before:w-2 before:bg-opacity-100 group-hover:before:bg-opacity-0 group">
                <span className="relative z-[5] transition-transform duration-300 ease-in-out group-hover:translate-x-2">{children}</span>
                <div className="overflow-hidden absolute inset-0 bg-indigo-100 dark:bg-indigo-900/40 transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100 rounded-full">
                  <div className='absolute z-0 left-0 top-1/2 w-1 h-1/2 bg-pink-400 rounded-full transform -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:w-2 group-hover:h-[1000px] group-hover:top-[14px] group-hover:z-10'></div>
                </div>
              </h1>
            </div>
          ),
          h2: ({ children }) => (
            <div className='group relative py-2 overflow-hidden'>
              <div className='absolute z-0 left-0 top-1/2 w-1 h-1/2 bg-pink-400 rounded-full transform -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-0'></div>
              <h2 className="overflow-hidden text-xl font-semibold ml-2 pl-4 mb-3 relative before:content-[''] before:absolute before:left-0 before:top-1/4 before:bottom-1/4 before:w-1 before:bg-pink-400 before:rounded-full transition-all duration-300 ease-in-out group-hover:ml-4 group-hover:text-pink-600 dark:group-hover:text-pink-200 group-hover:before:top-0 group-hover:before:bottom-0 group-hover:before:w-2 before:bg-opacity-100 group-hover:before:bg-opacity-0">
                <span className="relative z-[5] transition-transform duration-300 ease-in-out group-hover:translate-x-2">{children}</span>
                <div className="overflow-hidden absolute inset-0 bg-pink-100 dark:bg-pink-900/10 transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100 rounded-full">
                  <div className='absolute z-0 left-0 top-1/2 w-1 h-1/2 bg-pink-400 rounded-full transform -translate-y-1/2 transition-all duration-300 ease-in-out group-hover:w-2 group-hover:h-[1000px] group-hover:top-[14px] group-hover:z-10'></div>
                </div>
              </h2>
            </div>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold ml-4 pl-4 mb-2 relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-purple-400 before:skew-y-12 transition-all duration-300 hover:ml-6 hover:text-purple-600 dark:hover:text-purple-400 hover:before:skew-y-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold ml-6 pl-4 mb-2 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-3 before:h-3 before:bg-blue-400 before:rounded-full before:transform before:-translate-y-1/2 transition-all duration-300 hover:ml-8 hover:text-blue-600 dark:hover:text-blue-400 hover:before:scale-150">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-semibold ml-7 pl-4 mb-2 text-gray-800 dark:text-gray-200 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-2 before:h-2 before:bg-teal-400 before:transform before:-translate-y-1/2 before:rotate-45 transition-all duration-300 hover:ml-9 hover:text-teal-600 dark:hover:text-teal-400 hover:before:rotate-90">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-semibold ml-8 pl-4 mb-2 text-gray-700 dark:text-gray-300 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-2 before:h-1 before:bg-green-400 before:transform before:-translate-y-1/2 transition-all duration-300 hover:ml-10 hover:text-green-600 dark:hover:text-green-400 hover:before:w-3 hover:before:h-3 hover:before:rounded-full">
              {children}
            </h6>
          ),
          p: ({ children }) => <p className="mb-8 text-gray-900 dark:text-gray-400">{children}</p>,
          bold: ({ children }) => <span className="font-bold text-sm text-black dark:text-gray-200">{children}</span>,
          italic: ({ children }) => <em className="relative text-gray-900 dark:text-white mr-0">{children}</em>,
          code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-600 px-2 py-0 rounded font-mono text-sm text-gray-900 dark:text-gray-100">{children}</code>,
          code_block: ({ children }) => {
            const CodeBlock = () => {
              const [preContent, setPreContent] = useState("");

              useEffect(() => {
                const childArray = React.Children.toArray(children);
                let codeContent = "";
                for (let i = 0; i < childArray.length; i++) {
                  const child = childArray[i];
                  if (child.props && child.props.content && Array.isArray(child.props.content)) {
                    const text = child.props.content.reduce((acc, cur) => acc + cur.text, "");
                    codeContent += text;
                  } else if (typeof child === "string") {
                    codeContent += child;
                  } else if (child.props && child.props.content?.children) {
                    const grandchildArray = React.Children.toArray(child.props.content.children);
                    for (let j = 0; j < grandchildArray.length; j++) {
                      const grandchild = grandchildArray[j]?.props?.content?.[0]?.children?.[0]?.text;
                      if (typeof grandchild === "string") {
                        codeContent += grandchild;
                      }
                    }
                  }
                }
                setPreContent(codeContent);
              }, []);

              return (
                <div>
                  <Prism
                    language="javascript"
                    getPrismTheme={(_theme, colorScheme) =>
                      colorScheme === "dark" ? duotoneLight : duotoneDark
                    }
                    className="m-2 sm:max-w-lg max-w-xs overflow-x-auto"
                  >
                    {preContent}
                  </Prism>
                </div>
              );
            };

            return <CodeBlock />;
          },
          blockquote: ({ children }) => (
            <blockquote className="mb-8 italic text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-gray-200 dark:shadow-gray-700 shadow-inner">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="w-full my-8 overflow-x-auto">
              <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                {children}
              </table>
            </div>
          ),
          table_head: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">
              {children}
            </thead>
          ),
          table_body: ({ children }) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {children}
            </tbody>
          ),
          table_row: ({ children }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors divide-x divide-gray-200 dark:divide-gray-700">
              {children}
            </tr>
          ),
          table_cell: ({ children }) => (
            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-300 break-words">
              {children}
            </td>
          ),
          table_header_cell: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider break-words divide-x divide-gray-200 dark:divide-gray-700">
              {children}
            </th>
          ),
          img: ({ src, altText, title, width, height }) => (
            <div className="my-6">
              <Image
                loader={grpahCMSImageLoader}
                src={src}
                alt={altText || title || ''}
                width={width}
                height={height}
                className="rounded-xl shadow-lg mx-auto"
                loading="lazy"
              />
              {title && <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">{title}</p>}
            </div>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-6 space-y-1 text-gray-700 dark:text-gray-400 pl-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-6 space-y-1 text-gray-700 dark:text-gray-400 pl-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 dark:text-gray-400">
              {children}
            </li>
          ),
        }}
      />
    </section>
  );
};

export default RichTextContent;

import React, { useState, useEffect } from 'react';
import { Tooltip } from 'flowbite-react';

/**
 * Shared post actions bar for Guides and AlternativePosts detail pages.
 * Includes: share (Twitter, LinkedIn, Facebook), copy link, and text-to-speech.
 *
 * @param {string} title - Article title
 * @param {string} slug - Article slug (used for URL construction)
 * @param {string} basePath - Route prefix, e.g. "/guides" or "/alternatives"
 * @param {string} plainText - Plain text content for TTS
 * @param {string} readingTime - Auto-calculated reading time string
 * @param {string} authorName - Author display name
 * @param {string} publishDate - Formatted publish date
 */
const PostActions = ({ title, slug, basePath, plainText, readingTime }) => {
  const fullUrl = `https://www.progrmrslife.com${basePath}/${slug}`;

  // Copy link state
  const [isCopied, setIsCopied] = useState(false);

  // TTS state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}&via=mindh4q3rr`;
    window.open(url, 'twitter-share', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(url, 'linkedin-share', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(url, 'facebook-share', 'width=600,height=400');
  };

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    if (isPaused && synth.paused) {
      synth.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(plainText || title);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    synth.speak(utterance);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    if (synth?.speaking) {
      synth.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-gray-200 dark:border-gray-700 my-6">
      {/* Reading Time */}
      {readingTime && (
        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mr-auto">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readingTime}
        </span>
      )}

      {/* Listen Button */}
      <Tooltip content={isPlaying ? "Pause" : isPaused ? "Resume" : "Listen to this article"} placement="top" style="dark">
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <div className="relative">
            {isPlaying ? (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM6.77 10.46a.62.62 0 1 1-1.23 0V5.54a.62.62 0 0 1 1.23 0v4.92zm3.7 0a.62.62 0 1 1-1.24 0V5.54a.62.62 0 0 1 1.23 0v4.92z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm2.8 8.51l-3.69 2.46a.62.62 0 0 1-.96-.5V5.53a.62.62 0 0 1 .96-.51l3.7 2.46a.62.62 0 0 1 0 1.02z" />
              </svg>
            )}
            {isPlaying && (
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-ping" />
            )}
          </div>
          <span className="font-medium">{isPlaying ? 'Listening...' : isPaused ? 'Resume' : 'Listen'}</span>
        </button>
      </Tooltip>

      {/* Stop (only when playing/paused) */}
      {(isPlaying || isPaused) && (
        <Tooltip content="Stop" placement="top" style="dark">
          <button onClick={handleStop} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="9" y="9" width="6" height="6" fill="currentColor" />
            </svg>
          </button>
        </Tooltip>
      )}

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Twitter */}
      <Tooltip content="Tweet this" placement="top" style="dark">
        <button onClick={handleTwitterShare} className="text-gray-400 hover:text-sky-500 transition-colors">
          <svg className="w-4.5 h-4.5" viewBox="0 0 16 16" fill="currentColor" width="18" height="18">
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
          </svg>
        </button>
      </Tooltip>

      {/* LinkedIn */}
      <Tooltip content="Share on LinkedIn" placement="top" style="dark">
        <button onClick={handleLinkedInShare} className="text-gray-400 hover:text-blue-700 transition-colors">
          <svg className="w-4.5 h-4.5" viewBox="0 2 67 70" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" clipRule="evenodd" d="M50.837,48.137V36.425c0-6.275-3.35-9.195-7.816-9.195  c-3.604,0-5.219,1.983-6.119,3.374V27.71h-6.79c0.09,1.917,0,20.427,0,20.427h6.79V36.729c0-0.609,0.044-1.219,0.224-1.655  c0.49-1.22,1.607-2.483,3.482-2.483c2.458,0,3.44,1.873,3.44,4.618v10.929H50.837z M22.959,24.922c2.367,0,3.842-1.57,3.842-3.531  c-0.044-2.003-1.475-3.528-3.797-3.528s-3.841,1.524-3.841,3.528c0,1.961,1.474,3.531,3.753,3.531H22.959z M34,64  C17.432,64,4,50.568,4,34C4,17.431,17.432,4,34,4s30,13.431,30,30C64,50.568,50.568,64,34,64z M26.354,48.137V27.71h-6.789v20.427  H26.354z" />
          </svg>
        </button>
      </Tooltip>

      {/* Facebook */}
      <Tooltip content="Share on Facebook" placement="top" style="dark">
        <button onClick={handleFacebookShare} className="text-gray-400 hover:text-blue-600 transition-colors">
          <svg className="w-4.5 h-4.5" viewBox="0 0 16 16" fill="currentColor" width="18" height="18">
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
          </svg>
        </button>
      </Tooltip>

      {/* Copy Link */}
      <Tooltip content={isCopied ? 'Copied!' : 'Copy link'} placement="top" style="dark">
        <button onClick={handleCopyLink} className={`transition-colors ${isCopied ? 'text-green-500' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}>
          {isCopied ? (
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.57 14.67c0-.57.13-1.11.38-1.6l.02-.02v-.02l.02-.02c0-.02 0-.02.02-.02.12-.26.3-.52.57-.8L7.78 9v-.02l.01-.02c.44-.41.91-.7 1.44-.85a4.87 4.87 0 0 0-1.19 2.36A5.04 5.04 0 0 0 8 11.6L6.04 13.6c-.19.19-.32.4-.38.65a2 2 0 0 0 0 .9c.08.2.2.4.38.57l1.29 1.31c.27.28.62.42 1.03.42.42 0 .78-.14 1.06-.42l1.23-1.25.79-.78 1.15-1.16c.08-.09.19-.22.28-.4.1-.2.15-.42.15-.67 0-.16-.02-.3-.06-.45l-.02-.02v-.02l-.07-.14s0-.03-.04-.06l-.06-.13-.02-.02c0-.02 0-.03-.02-.05a.6.6 0 0 0-.14-.16l-.48-.5c0-.04.02-.1.04-.15l.06-.12 1.17-1.14.09-.09.56.57c.02.04.08.1.16.18l.05.04.03.06.04.05.03.04.04.06.1.14.02.02c0 .02.01.03.03.04l.1.2v.02c.1.16.2.38.3.68a1 1 0 0 1 .04.25 3.2 3.2 0 0 1 .02 1.33 3.49 3.49 0 0 1-.95 1.87l-.66.67-.97.97-1.56 1.57a3.4 3.4 0 0 1-2.47 1.02c-.97 0-1.8-.34-2.49-1.03l-1.3-1.3a3.55 3.55 0 0 1-1-2.51v-.01h-.02v.02zm5.39-3.43c0-.19.02-.4.07-.63.13-.74.44-1.37.95-1.87l.66-.67.97-.98 1.56-1.56c.68-.69 1.5-1.03 2.47-1.03.97 0 1.8.34 2.48 1.02l1.3 1.32a3.48 3.48 0 0 1 1 2.48c0 .58-.11 1.11-.37 1.6l-.02.02v.02l-.02.04c-.14.27-.35.54-.6.8L16.23 15l-.01.02-.01.02c-.44.42-.92.7-1.43.83a4.55 4.55 0 0 0 1.23-3.52L18 10.38c.18-.21.3-.42.35-.65a2.03 2.03 0 0 0-.01-.9 1.96 1.96 0 0 0-.36-.58l-1.3-1.3a1.49 1.49 0 0 0-1.06-.42c-.42 0-.77.14-1.06.4l-1.2 1.27-.8.8-1.16 1.15c-.08.08-.18.21-.29.4a1.66 1.66 0 0 0-.08 1.12l.02.03v.02l.06.14s.01.03.05.06l.06.13.02.02.01.02.01.02c.05.08.1.13.14.16l.47.5c0 .04-.02.09-.04.15l-.06.12-1.15 1.15-.1.08-.56-.56a2.3 2.3 0 0 0-.18-.19c-.02-.01-.02-.03-.02-.04l-.02-.02a.37.37 0 0 1-.1-.12c-.03-.03-.05-.04-.05-.06l-.1-.15-.02-.02-.02-.04-.08-.17v-.02a5.1 5.1 0 0 1-.28-.69 1.03 1.03 0 0 1-.04-.26c-.06-.23-.1-.46-.1-.7v.01z" />
            </svg>
          )}
        </button>
      </Tooltip>
    </div>
  );
};

export default PostActions;

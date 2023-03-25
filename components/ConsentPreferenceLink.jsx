import React, {useEffect} from 'react'
import { AiFillSetting } from 'react-icons/ai';
import { Tooltip } from "flowbite-react";

const ConsentPreferenceLink = () => {
    // function reloadPage() {
    //     window.location.reload();
    //     }

    //     useEffect(() => {
    //     const modal = window.termlyConsentModal;

    //     if (modal) {
    //         modal.addEventListener('hide', reloadPage);
    //     }

    //     return () => {
    //         if (modal) {
    //         modal.removeEventListener('hide', reloadPage);
    //         }
    //     };
    //     }, []);

return (
    <>
        <button 
            className="fixed bottom-10 left-10 w-12 h-12 rounded-full border-none bg-gray-800 hover:bg-gray-900 cursor-pointer z-50 transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
            href="#"
            onClick={() => {
                window.displayPreferenceModal()
            }}
            id="termly-consent-preferences"
        >
            <Tooltip content="Manage your Consent Preferences 📝" style="dark" className="text-lg transition duration-700 ease-in-out">
            <div className='relative hover:animate-none animate-[spin_3s_ease-in-out_infinite] m-0 p-0 w-12 h-12'>
                <AiFillSetting className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
                
            </Tooltip>
        </button>
    </>
    )
}

export default ConsentPreferenceLink
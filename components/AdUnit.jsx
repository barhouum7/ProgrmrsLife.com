import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const AdUnit = ({ client, slot, format = 'auto', responsive = true }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Ad error:', err);
      }
    }
  }, []);

  return (
    <div className="ad-container my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        ref={adRef}
      />
    </div>
  );
};

AdUnit.propTypes = {
  client: PropTypes.string.isRequired,
  slot: PropTypes.string.isRequired,
  format: PropTypes.string,
  responsive: PropTypes.bool,
};

export default AdUnit;
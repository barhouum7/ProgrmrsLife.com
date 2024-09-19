import React from 'react';
import PropTypes from 'prop-types';

const AdUnit = ({ client, slot, format = 'auto', responsive = true }) => {
  return (
    <div className="mb-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
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
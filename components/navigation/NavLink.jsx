import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'flowbite-react';

export const NavLink = ({ 
  href, 
  children, 
  isActive, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick,
  isScrolled 
}) => {

    return (
    <Navbar.Link
        className='navbar-item'
        href={href}
        active={isActive}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        style={{
            position: 'relative',
            color: isHovered ? "#8B5CF6" : isActive ? isScrolled ? "#8B5CF6" : "#8B5CF6" : "inherit",
        }}
    >
      {children}
      <UnderlineAnimation isVisible={isHovered} />
    </Navbar.Link>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  isHovered: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  isScrolled: PropTypes.bool
};

NavLink.defaultProps = {
  isActive: false,
  isHovered: false,
  isScrolled: false,
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onClick: () => {}
};

const UnderlineAnimation = ({ isVisible }) => (
  <span 
    style={{
      content: "''",
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: isVisible ? '100%' : '0%',
      height: '2px',
      backgroundColor: 'violet',
      transition: 'width 0.3s ease-out',
    }}
  />
);

UnderlineAnimation.propTypes = {
  isVisible: PropTypes.bool.isRequired
};
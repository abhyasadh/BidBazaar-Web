import React from "react";
import { NavLink } from "react-router-dom";

const NavButton = ({ label, icon, to }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}
    >
      {({ isActive }) => (
        <>
          {React.cloneElement(icon, {
            color: isActive ? "var(--primary-color)" : "var(--inverted-text-color)",
            size: 24,
          })}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default NavButton;
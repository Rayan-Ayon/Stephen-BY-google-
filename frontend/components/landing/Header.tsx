import React from 'react';
import Navbar, { NavbarProps, IeltsDynastyEmblem } from '../Navbar';

export interface HeaderProps extends NavbarProps {}

export const Header: React.FC<HeaderProps> = (props) => {
  return <Navbar {...props} />;
};

export { IeltsDynastyEmblem };
export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../../../types/user';

interface NavLinksProps {
  role: UserRole;
  isAdmin: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ role, isAdmin }) => {
  const sellerLinks = [
    { to: '/', label: 'Home' },
    { to: '/listings', label: 'Browse Listings' },
    { to: '/bids/received', label: 'Bids Received' },
    { to: '/help', label: 'Help' },
  ];

  const buyerLinks = [
    { to: '/', label: 'Home' },
    { to: '/items/add', label: 'Post Wanted Item' },
    { to: '/listings', label: 'My Listings' },
    { to: '/bids', label: 'My Bids' },
    { to: '/help', label: 'Help' },
  ];

  const links = role === 'seller' ? sellerLinks : buyerLinks;

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {link.label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          to="/admin"
          className="inline-flex items-center px-3 pt-1 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Admin Panel
        </Link>
      )}
    </>
  );
};
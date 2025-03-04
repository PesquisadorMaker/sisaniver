import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gift, Users, BarChart2, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <Gift className="mr-2" />
          <span>Sistema de Aniversários</span>
        </Link>
        
        <div className="flex space-x-6">
          <Link to="/clients" className="flex items-center hover:text-indigo-200">
            <Users className="mr-1" size={18} />
            <span>Clientes</span>
          </Link>
          
          <Link to="/analytics" className="flex items-center hover:text-indigo-200">
            <BarChart2 className="mr-1" size={18} />
            <span>Análises</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center hover:text-indigo-200"
          >
            <LogOut className="mr-1" size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
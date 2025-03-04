import React from 'react';
import { useClient } from '../context/ClientContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import { Gift, Users, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { 
    clients, 
    birthdayMessages, 
    getTodaysBirthdays, 
    getMonthBirthdays 
  } = useClient();
  
  const todaysBirthdays = getTodaysBirthdays();
  const monthBirthdays = getMonthBirthdays();
  
  const currentMonth = format(new Date(), 'MMMM', { locale: ptBR });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Clients Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
            </div>
          </div>
        </div>
        
        {/* Today's Birthdays Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Aniversários Hoje</p>
              <p className="text-2xl font-bold text-gray-800">{todaysBirthdays.length}</p>
            </div>
          </div>
        </div>
        
        {/* Month's Birthdays Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Aniversários em {currentMonth}</p>
              <p className="text-2xl font-bold text-gray-800">{monthBirthdays.length}</p>
            </div>
          </div>
        </div>
        
        {/* Messages Sent Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Mensagens Enviadas</p>
              <p className="text-2xl font-bold text-gray-800">{birthdayMessages.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Birthdays Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Gift className="mr-2 text-indigo-500" size={20} />
          Aniversariantes de Hoje
        </h2>
        
        {todaysBirthdays.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todaysBirthdays.map(client => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Não há aniversariantes hoje.</p>
        )}
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/clients" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
            <Users className="mr-2 text-indigo-500" size={20} />
            Gerenciar Clientes
          </h3>
          <p className="text-gray-600">
            Adicione, edite ou remova clientes do seu sistema.
          </p>
        </Link>
        
        <Link 
          to="/analytics" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
            <Mail className="mr-2 text-indigo-500" size={20} />
            Ver Análises
          </h3>
          <p className="text-gray-600">
            Visualize estatísticas sobre mensagens enviadas e engajamento.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
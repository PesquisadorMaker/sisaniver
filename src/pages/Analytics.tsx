import React from 'react';
import { useClient } from '../context/ClientContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Mail, Eye, MousePointer } from 'lucide-react';

const Analytics: React.FC = () => {
  const { birthdayMessages, getMonthlyMessages } = useClient();
  
  const monthlyMessages = getMonthlyMessages();
  
  const currentMonth = format(new Date(), 'MMMM', { locale: ptBR });
  
  // Calculate statistics
  const totalViews = birthdayMessages.filter(msg => msg.viewed).length;
  const totalClicks = birthdayMessages.filter(msg => msg.clicked).length;
  const viewRate = birthdayMessages.length > 0 
    ? Math.round((totalViews / birthdayMessages.length) * 100) 
    : 0;
  const clickRate = totalViews > 0 
    ? Math.round((totalClicks / totalViews) * 100) 
    : 0;
  
  // Prepare data for charts
  const engagementData = [
    { name: 'Visualizações', value: totalViews },
    { name: 'Cliques', value: totalClicks },
    { name: 'Não Visualizados', value: birthdayMessages.length - totalViews }
  ];
  
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];
  
  // Group messages by day for the bar chart
  const messagesByDay: Record<string, { date: string, sent: number, views: number, clicks: number }> = {};
  
  monthlyMessages.forEach(msg => {
    const day = format(parseISO(msg.sentDate), 'dd/MM');
    
    if (!messagesByDay[day]) {
      messagesByDay[day] = {
        date: day,
        sent: 0,
        views: 0,
        clicks: 0
      };
    }
    
    messagesByDay[day].sent += 1;
    
    if (msg.viewed) {
      messagesByDay[day].views += 1;
    }
    
    if (msg.clicked) {
      messagesByDay[day].clicks += 1;
    }
  });
  
  const barChartData = Object.values(messagesByDay);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Análises de Mensagens</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Messages Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total de Mensagens</p>
              <p className="text-2xl font-bold text-gray-800">{birthdayMessages.length}</p>
              <p className="text-sm text-gray-500">
                {monthlyMessages.length} em {currentMonth}
              </p>
            </div>
          </div>
        </div>
        
        {/* View Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Taxa de Visualização</p>
              <p className="text-2xl font-bold text-gray-800">{viewRate}%</p>
              <p className="text-sm text-gray-500">
                {totalViews} de {birthdayMessages.length} mensagens
              </p>
            </div>
          </div>
        </div>
        
        {/* Click Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <MousePointer size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Taxa de Cliques</p>
              <p className="text-2xl font-bold text-gray-800">{clickRate}%</p>
              <p className="text-sm text-gray-500">
                {totalClicks} de {totalViews} visualizações
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mensagens por Dia ({currentMonth})</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" name="Enviadas" fill="#4F46E5" />
                <Bar dataKey="views" name="Visualizações" fill="#10B981" />
                <Bar dataKey="clicks" name="Cliques" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Engajamento das Mensagens</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mensagens Recentes</h2>
        
        {birthdayMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Envio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visualizada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicada
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...birthdayMessages]
                  .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime())
                  .slice(0, 10)
                  .map(message => {
                    const client = useClient().clients.find(c => c.id === message.clientId);
                    
                    return (
                      <tr key={message.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(parseISO(message.sentDate), 'dd/MM/yyyy HH:mm')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {client?.name || 'Cliente não encontrado'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            message.viewed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.viewed ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            message.clicked 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.clicked ? 'Sim' : 'Não'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma mensagem enviada ainda.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
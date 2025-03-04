import React, { useState } from 'react';
import { useClient } from '../context/ClientContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import { Plus, Edit, Trash2, Gift, Search } from 'lucide-react';
import ClientForm from '../components/ClientForm';

const ClientList: React.FC = () => {
  const { clients, deleteClient, sendBirthdayMessage } = useClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendBirthdayMessage = (clientId: string) => {
    sendBirthdayMessage(clientId);
    alert('Mensagem de aniversário enviada com sucesso!');
  };
  
  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(id);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Cliente
        </button>
      </div>
      
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Adicionar Novo Cliente</h2>
          <ClientForm 
            onSubmit={(clientData) => {
              useClient().addClient(clientData);
              setShowAddForm(false);
            }}
            buttonText="Adicionar Cliente"
          />
        </div>
      )}
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredClients.length > 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Aniversário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map(client => (
                  <React.Fragment key={client.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(parseISO(client.birthdate), 'dd/MM/yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingClient(client.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => handleSendBirthdayMessage(client.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Enviar mensagem de aniversário"
                          >
                            <Gift size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {editingClient === client.id && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Cliente</h3>
                            <ClientForm 
                              initialData={{
                                id: client.id,
                                name: client.name,
                                email: client.email,
                                phone: client.phone,
                                birthdate: client.birthdate
                              }}
                              onSubmit={(clientData) => {
                                useClient().updateClient(client.id, clientData);
                                setEditingClient(null);
                              }}
                              buttonText="Atualizar Cliente"
                            />
                            <button
                              onClick={() => setEditingClient(null)}
                              className="mt-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {searchTerm 
                ? 'Nenhum cliente encontrado com os termos de busca.' 
                : 'Nenhum cliente cadastrado. Adicione seu primeiro cliente!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
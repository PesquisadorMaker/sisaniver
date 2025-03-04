import React, { createContext, useState, useContext, useEffect } from 'react';
import { Client, BirthdayMessage } from '../types';
import { useAuth } from './AuthContext';
import { format, isToday, parseISO, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'userId'>) => void;
  updateClient: (id: string, client: Omit<Client, 'id' | 'userId'>) => void;
  deleteClient: (id: string) => void;
  birthdayMessages: BirthdayMessage[];
  sendBirthdayMessage: (clientId: string) => void;
  markAsViewed: (messageId: string) => void;
  markAsClicked: (messageId: string) => void;
  getMonthlyMessages: () => BirthdayMessage[];
  getTodaysBirthdays: () => Client[];
  getMonthBirthdays: () => Client[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [birthdayMessages, setBirthdayMessages] = useState<BirthdayMessage[]>([]);

  useEffect(() => {
    if (currentUser) {
      const storedClients = JSON.parse(localStorage.getItem(`clients_${currentUser.id}`) || '[]');
      const storedMessages = JSON.parse(localStorage.getItem(`messages_${currentUser.id}`) || '[]');
      
      setClients(storedClients);
      setBirthdayMessages(storedMessages);
      
      // Check for birthdays today and send automatic messages
      const today = new Date();
      storedClients.forEach((client: Client) => {
        const birthdate = parseISO(client.birthdate);
        if (
          birthdate.getDate() === today.getDate() && 
          birthdate.getMonth() === today.getMonth()
        ) {
          // Check if we already sent a message today
          const alreadySent = storedMessages.some(
            (msg: BirthdayMessage) => 
              msg.clientId === client.id && 
              isToday(parseISO(msg.sentDate))
          );
          
          if (!alreadySent) {
            sendBirthdayMessage(client.id);
          }
        }
      });
    }
  }, [currentUser]);

  const saveClients = (updatedClients: Client[]) => {
    if (currentUser) {
      localStorage.setItem(`clients_${currentUser.id}`, JSON.stringify(updatedClients));
      setClients(updatedClients);
    }
  };

  const saveMessages = (updatedMessages: BirthdayMessage[]) => {
    if (currentUser) {
      localStorage.setItem(`messages_${currentUser.id}`, JSON.stringify(updatedMessages));
      setBirthdayMessages(updatedMessages);
    }
  };

  const addClient = (client: Omit<Client, 'id' | 'userId'>) => {
    if (currentUser) {
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        userId: currentUser.id
      };
      
      const updatedClients = [...clients, newClient];
      saveClients(updatedClients);
    }
  };

  const updateClient = (id: string, clientData: Omit<Client, 'id' | 'userId'>) => {
    if (currentUser) {
      const updatedClients = clients.map(client => 
        client.id === id 
          ? { ...client, ...clientData } 
          : client
      );
      
      saveClients(updatedClients);
    }
  };

  const deleteClient = (id: string) => {
    if (currentUser) {
      const updatedClients = clients.filter(client => client.id !== id);
      saveClients(updatedClients);
      
      // Also delete related messages
      const updatedMessages = birthdayMessages.filter(msg => msg.clientId !== id);
      saveMessages(updatedMessages);
    }
  };

  const sendBirthdayMessage = (clientId: string) => {
    if (currentUser) {
      const newMessage: BirthdayMessage = {
        id: Date.now().toString(),
        clientId,
        sentDate: new Date().toISOString(),
        viewed: false,
        clicked: false,
        userId: currentUser.id
      };
      
      const updatedMessages = [...birthdayMessages, newMessage];
      saveMessages(updatedMessages);
    }
  };

  const markAsViewed = (messageId: string) => {
    const updatedMessages = birthdayMessages.map(msg => 
      msg.id === messageId 
        ? { ...msg, viewed: true } 
        : msg
    );
    
    saveMessages(updatedMessages);
  };

  const markAsClicked = (messageId: string) => {
    const updatedMessages = birthdayMessages.map(msg => 
      msg.id === messageId 
        ? { ...msg, clicked: true } 
        : msg
    );
    
    saveMessages(updatedMessages);
  };

  const getMonthlyMessages = () => {
    const currentDate = new Date();
    return birthdayMessages.filter(msg => {
      const sentDate = parseISO(msg.sentDate);
      return isSameMonth(sentDate, currentDate);
    });
  };

  const getTodaysBirthdays = () => {
    const today = new Date();
    return clients.filter(client => {
      const birthdate = parseISO(client.birthdate);
      return (
        birthdate.getDate() === today.getDate() && 
        birthdate.getMonth() === today.getMonth()
      );
    });
  };

  const getMonthBirthdays = () => {
    const today = new Date();
    return clients.filter(client => {
      const birthdate = parseISO(client.birthdate);
      return birthdate.getMonth() === today.getMonth();
    });
  };

  return (
    <ClientContext.Provider 
      value={{ 
        clients, 
        addClient, 
        updateClient, 
        deleteClient, 
        birthdayMessages, 
        sendBirthdayMessage, 
        markAsViewed, 
        markAsClicked, 
        getMonthlyMessages,
        getTodaysBirthdays,
        getMonthBirthdays
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
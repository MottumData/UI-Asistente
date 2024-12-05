// File: useChatActions.ts
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  type?: 'text' | 'file' | 'html';
  fileName?: string;
  fileUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  uploadedFiles?: { fileName: string; fileUrl: string }[];
}

const useChatActions = (
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  currentConversationId: string | null,
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  apiURL: string,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  
  const sendMessage = () => {
    if (input.trim()) {
      let conversationId = currentConversationId;

      console.log('conversationId al escribir:', currentConversationId);
      console.log('Número de conversaciones al escribir:', conversations.length);
      
      setIsLoading(true);
      if (!conversationId && conversations.length === 0) {
        conversationId = uuidv4();
        const newConversation: Conversation = {
          id: conversationId,
          name: `Conversation ${conversations.length + 1}`,
          messages: [],
        };
        setConversations([...conversations, newConversation]);
        setCurrentConversationId(conversationId);
      }

      const newMessage: Message = { text: input, sender: 'user' };
      const newMessages: Message[] = [...(conversations.find(conv => conv.id === conversationId)?.messages || []), newMessage];
      setMessages(newMessages);
      setInput('');

      const messagePayload = {
        conversation_id: conversationId,
        prompt: input,
      };
      
      fetch(`${apiURL}/chat-rag/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      })
        .then(response => response.json())
        .then(data => {
          const botMessage: Message = { text: data.response, sender: 'bot' };
          const updatedMessages: Message[] = [...newMessages, botMessage];
          setMessages(updatedMessages);
        })
        .catch(error => {
          console.error('Error al enviar el mensaje:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const loadConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversation.id);
    }
  };

  const updateConversationName = (id: string, name: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conv =>
        conv.id === id ? { ...conv, name } : conv
      )
    );
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      name: `Conversation ${conversations.length + 1}`,
      messages: [],
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
    console.log('Número de conversaciones:', conversations.length);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    return newConversation.id;
  };

  const deleteConversation = (id: string) => {
    setConversations(prevConversations => prevConversations.filter(conv => conv.id !== id));
    console.log('Número de conversaciones_borrar:', conversations.length);
  
    if (currentConversationId === id) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => console.log(`Nombre: ${file.name}, Tipo: ${file.type}`));
    if (files.length === 0) return;
  
    const allowedTypes = [
      'text/plain',
      'application/json',
      'application/vnd.ms-excel',
      'text/csv',
      'application/pdf',                       
    ];

    const filteredFiles = files.filter(file => allowedTypes.includes(file.type));
  
    if (filteredFiles.length === 0) {
      toast('Solo se permiten archivos PDF, TXT, JSON o XLS.');
      return;
    }
  
    const formData = new FormData();
    filteredFiles.forEach(file => {
      formData.append('file', file);
    });
  
    fetch(`${apiURL}/upload-file/`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(`Error ${response.status}: ${errorData.detail}`);
          });
        }
        return response.json();
      })
      .then(data => {
        toast('Archivo subido exitosamente');
  
        if (data.uploadedFiles && Array.isArray(data.uploadedFiles)) {
          const uploadedFiles = data.uploadedFiles.map((file: any) => ({
            fileName: file.name,
            fileUrl: file.url,
          }));
  
          setConversations(prevConversations =>
            prevConversations.map(conv =>
              conv.id === currentConversationId
                ? { ...conv, uploadedFiles: [...(conv.uploadedFiles || []), ...uploadedFiles] }
                : conv
            )
          );
        } else {
          throw new Error('La respuesta del servidor no contiene la propiedad "uploadedFiles".');
        }
      })
      .catch(error => {
        console.error('Error al subir el archivo:', error);
        toast(`Hubo un error al subir el archivo: ${error.message}`);
      });
  };

  return {
    sendMessage,
    loadConversation,
    updateConversationName,
    createNewConversation,
    deleteConversation,
    handleFileUpload,
    openSettingsInfo,
  };
};

export const openSettingsInfo = (setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsModalOpen(true);
};

export default useChatActions;
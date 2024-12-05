// File: useSidebarActions.ts
import { toast } from 'react-toastify';

interface UseSidebarActionsProps {
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  updateConversationName: (id: string, name: string) => void;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  createNewConversation: () => string;
  setDropdownOpenId: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  newName: string;
  editingId: string | null;
  activeConversationId: string | null;
}

const useSidebarActions = ({
  setEditingId,
  setNewName,
  updateConversationName,
  loadConversation,
  deleteConversation,
  createNewConversation,
  setDropdownOpenId,
  setActiveConversationId,
  chatContainerRef,
  newName,
  editingId,
  activeConversationId,

}: UseSidebarActionsProps) => {
  const handleEditClick = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setNewName(currentName);
    setDropdownOpenId(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleNameSubmit = (id: string) => {
    if (newName.trim() !== '') {
      updateConversationName(id, newName.trim());
      setEditingId(null);
      toast.success('Nombre de conversación actualizado');
    }
  };

  const handleConversationClick = (id: string) => {
    if (editingId === null) {
      loadConversation(id);
      setActiveConversationId(id);
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Deleting conversation:', id);
    deleteConversation(id);
    setDropdownOpenId(null);

    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
    toast.success('Conversación eliminada');
  };

  const handleCreateNewConversation = () => {
    const newConversationId = createNewConversation(); // Ahora obtienes el ID
    setActiveConversationId(newConversationId);
    loadConversation(newConversationId); 
    toast.success('Chat añadido con éxito');
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  return {
    handleEditClick,
    handleNameChange,
    handleNameSubmit,
    handleConversationClick,
    handleDeleteClick,
    handleCreateNewConversation,
  };
};

export default useSidebarActions;
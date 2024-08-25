import { useState, createContext, useContext, Dispatch, SetStateAction } from 'react';

import { WorkspaceUser } from '@/types';

import { TabsNames } from '../type';

export type contextType = {
  isCreateDepartmentModalOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isInviteNewCoworkersModalOpen: boolean;
  setIsInviteNewCoworkersModalOpen: Dispatch<SetStateAction<boolean>>;
  isEditMode: boolean;
  isEditDepartmentModalOpen: boolean;
  isInviteNewAdminsModalOpen: boolean;
  setIsInviteNewAdminsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditDepartmentModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
  activeTab: TabsNames;
  setActiveTab: Dispatch<SetStateAction<TabsNames>>;
  createDepartmentName: string;
  setCreateDepartmentName: Dispatch<SetStateAction<string>>;
  createDepartmentDescription: string;
  setCreateDepartmentDescription: Dispatch<SetStateAction<string>>;
  createDepartmentApprovalPolicy: {
    label: string;
    value: any;
  };
  setCreateDepartmentApprovalPolicy: Dispatch<
    SetStateAction<{
      label: string;
      value: any;
    }>
  >;
  createDepartmentCoworks: WorkspaceUser[];
  setCreateDepartmentCoworks: Dispatch<SetStateAction<WorkspaceUser[]>>;
  createDepartmentAdmins: WorkspaceUser[];
  setCreateDepartmentAdmins: Dispatch<SetStateAction<WorkspaceUser[]>>;
  currentInviteType: 'coworker' | 'admin';
  setCurrentInviteType: Dispatch<SetStateAction<'coworker' | 'admin'>>;
  activeDepartmentTab: 'Coworkers' | 'Requests';
  setActiveDepartmentTab: Dispatch<SetStateAction<'Coworkers' | 'Requests'>>;
};

const DepartmentsRequestContext = createContext({} as contextType);

export const useDepartmentsRequestContext = () => {
  const ctx = useContext(DepartmentsRequestContext);

  if (!ctx) {
    throw new Error('[useCreateRequest] must be used within a RejectRequewstProvider');
  }

  return ctx;
};

const DepartmentsRequestProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);
  const [isInviteNewCoworkersModalOpen, setIsInviteNewCoworkersModalOpen] = useState(false);
  const [isInviteNewAdminsModalOpen, setIsInviteNewAdminsModalOpen] = useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
  const [currentInviteType, setCurrentInviteType] = useState<'coworker' | 'admin'>('coworker');
  const [activeTab, setActiveTab] = useState<TabsNames>('create-department');
  const [activeDepartmentTab, setActiveDepartmentTab] = useState<'Coworkers' | 'Requests'>('Coworkers');
  const [isEditMode, setIsEditMode] = useState(false);
  const [createDepartmentName, setCreateDepartmentName] = useState('');
  const [createDepartmentDescription, setCreateDepartmentDescription] = useState('');
  const [createDepartmentAdmins, setCreateDepartmentAdmins] = useState<WorkspaceUser[]>([]);
  const [createDepartmentCoworks, setCreateDepartmentCoworks] = useState<WorkspaceUser[]>([]);
  const [createDepartmentApprovalPolicy, setCreateDepartmentApprovalPolicy] = useState({ value: 0, label: '' });

  const value = {
    isCreateDepartmentModalOpen,
    onOpenChange: setIsCreateDepartmentModalOpen,
    activeTab,
    setActiveTab,
    isEditMode,
    setIsEditMode,
    createDepartmentName,
    setCreateDepartmentName,
    createDepartmentDescription,
    setCreateDepartmentDescription,
    createDepartmentApprovalPolicy,
    setCreateDepartmentApprovalPolicy,
    isInviteNewCoworkersModalOpen,
    setIsInviteNewCoworkersModalOpen,
    currentInviteType,
    setCurrentInviteType,
    activeDepartmentTab,
    setActiveDepartmentTab,
    isEditDepartmentModalOpen,
    setIsEditDepartmentModalOpen,
    createDepartmentAdmins,
    setCreateDepartmentAdmins,
    createDepartmentCoworks,
    setCreateDepartmentCoworks,
    isInviteNewAdminsModalOpen,
    setIsInviteNewAdminsModalOpen,
  };

  return <DepartmentsRequestContext.Provider value={value}>{children}</DepartmentsRequestContext.Provider>;
};

export default DepartmentsRequestProvider;

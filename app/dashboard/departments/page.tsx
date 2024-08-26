'use client';

import { ChevronLeft, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import RoleGuard from '@/components/shared/check-for-role-to-display-page';
import EmptyContentWrapper from '@/components/shared/empty-content-wrapper';
import GoBackButton from '@/components/shared/go-back-button';
import GridToggle from '@/components/shared/grid-toggle';
import PageWrapper from '@/components/shared/page-wrapper';
import SecondarySortPopover from '@/components/shared/secondary-sort-pop-over';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import CreateDepartmentDialog from '@/domains/departments/components/create-department-dialog';
import EditDepartmentDialog from '@/domains/departments/components/edit-department-dialog';
import GridDepartmentCard from '@/domains/departments/components/grid-department-card';
import InviteNewAdmin from '@/domains/departments/components/invite-new-admin';
import InviteNewCoworkers from '@/domains/departments/components/invite-new-coworkers';
import ListDepartmentCard from '@/domains/departments/components/list-deparmtent-card';
import { useDepartmentsRequestContext } from '@/domains/departments/context/departments-request-provider';
import useFetchDepartments from '@/domains/departments/hooks/use-fetch-departments';
import { departmentsData } from '@/domains/departments/static';
import { iDepartment } from '@/domains/departments/type';
import { useUserContext } from '@/domains/user/contexts/user-context';

const ManageDepartments = () => {
  const { currentWorkspaceRole } = useUserContext();

  const [isGridView, setIsGridView] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');

  const { isLoading, data: { items: departments = [] } = {} } = useFetchDepartments({ size: 10, page: 1 });

  const router = useRouter();

  const {
    isEditDepartmentModalOpen,
    setIsEditDepartmentModalOpen,
    onOpenChange,
    setActiveDepartmentTab,
    isInviteNewCoworkersModalOpen,
    isCreateDepartmentModalOpen,
    isInviteNewAdminsModalOpen,
  } = useDepartmentsRequestContext();

  return (
    <RoleGuard role="Manager" isAllowed={currentWorkspaceRole === 'Manager'}>
      <PageWrapper>
        {/* modal */}
        <InviteNewCoworkers
          isOpen={isInviteNewCoworkersModalOpen}
          onClose={() => onOpenChange(false)}
          title=""
          deptId={id}
        />
        <InviteNewAdmin isOpen={isInviteNewAdminsModalOpen} onClose={() => onOpenChange(false)} title="" deptId={id} />
        <CreateDepartmentDialog isOpen={isCreateDepartmentModalOpen} onClose={() => onOpenChange(false)} title="" />
        <EditDepartmentDialog
          isOpen={isEditDepartmentModalOpen}
          onClose={() => setIsEditDepartmentModalOpen(false)}
          title={title}
          description={description}
          editId={id}
        />

        <div className="mb-2 flex items-center justify-between">
          <div className="flex w-full justify-between">
            <h1 className="text-1xl font-bold">Manage Department</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="mb-4 mt-4 rounded-lg border bg-white p-3">
            <div className="flex justify-center py-56 text-text-dim">
              <Text size={'xs'}>Loading... Please wait while we fetch your departments.</Text>
            </div>
          </div>
        ) : departments.length === 0 ? (
          <div className="mb-4 mt-4 rounded-lg border bg-white p-3">
            <EmptyContentWrapper
              customMessage="No department found"
              className="py-48 text-text-dim"
              isEmpty={departments.length === 0}
            />
          </div>
        ) : (
          <div className={`grid ${isGridView ? 'grid-cols-1 ' : ''} gap-4`}>
            {departments.map((dept: iDepartment, index: number) => (
              <ListDepartmentCard
                key={index}
                {...dept}
                setId={setId}
                setTitle={setTitle}
                setDescription={setDescription}
                onClick={() => {
                  setActiveDepartmentTab('Coworkers');
                  router.push(`departments/${dept.id}`);
                }}
              />
            ))}
          </div>
        )}
      </PageWrapper>
    </RoleGuard>
  );
};

export default ManageDepartments;

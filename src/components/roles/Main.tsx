"use client";
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ActionTypeEnum } from '@/constant/action.enum';
import { RolResponse } from '@/types/response/RolResponse';
import { useRoles } from '@/hooks/useRoles';
import RolForm from './Form';

export default function RolMain() {
    const [roles, setRoles] = useState<RolResponse[]>([]);
    const [rolDialog, setRolDialog] = useState<boolean>(false);
    const [rol, setRol] = useState<RolResponse | null>(null);
    const [flagAction, setFlagAction] = useState<number>(0);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<RolResponse[]>>(null);

    const { getAllRoles, deleteRol } = useRoles();

    const initComponent = async () => {
        try {
            const data = await getAllRoles();
            setRoles(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los roles', life: 3000 });
        }
    };

    useEffect(() => {
        initComponent();
    }, []);

    const openNew = () => {
        setFlagAction(ActionTypeEnum.CREATE);
        setRolDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        if (updateData) {
            initComponent();
        }
        setRol(null);
        setRolDialog(false);
    };

    const editRol = (rol: RolResponse) => {
        setFlagAction(ActionTypeEnum.UPDATE);
        setRol({ ...rol });
        setRolDialog(true);
    };

    const confirmDeleteRol = (rol: RolResponse) => {
        confirmDialog({
            message: 'Esta seguro de eliminar el rol?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => handleDeleteRol(rol),
            reject: () => toast.current?.show({ severity: 'info', summary: 'Operacion cancelada', detail: 'Rol no eliminado', life: 3000 }),
        });
    };

    const handleDeleteRol = async (rol: RolResponse) => {
        try {
            await deleteRol(rol.id);
            initComponent();
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Rol Eliminado', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el rol', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData: RolResponse) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRol(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRol(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Roles</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Search..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
            </IconField>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable id="rolesTable" ref={dt} value={roles}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}
                >
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="descripcion" header="Descripcion" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={rolDialog} style={{ width: '56rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Rol Dialog" modal className="p-fluid" onHide={hideDialog}>

                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <RolForm
                        rol={rol}
                        hideDialog={hideDialog}
                        flagAction={flagAction}
                        toast={toast}
                    />
                )}
                {flagAction == ActionTypeEnum.READ && (
                    <div>Datos del rol</div>
                )}
            </Dialog>
        </div>
    );
}

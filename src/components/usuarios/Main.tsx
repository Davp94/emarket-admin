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
import { UsuarioResponse } from '@/types/response/UsuarioResponse';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ActionTypeEnum } from '@/constant/action.enum';
import { useUsuarios } from '@/hooks/useUsuarios';
import UsuariosForm from './Form';


export default function UsuariosMain() {

    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [usuariosDialog, setUsuariosDialog] = useState<boolean>(false);
    const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
    const [flagAction, setFlagAction] = useState<number>(0);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<UsuarioResponse[]>>(null);

    const { getUsuarios, deleteUsuario } = useUsuarios();

    const initComponent = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los usuarios', life: 3000 });
      }
    };

    useEffect(() => {
      initComponent();
    }, []);

    const openNew = () => {
        setFlagAction(ActionTypeEnum.CREATE);
        setUsuariosDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        if(updateData) {
            initComponent();
        }
        setUsuario(null);
        setUsuariosDialog(false);
    };

    const editUsuario = (usuario:UsuarioResponse) => {
        setFlagAction(ActionTypeEnum.UPDATE);
        setUsuario({...usuario});
        setUsuariosDialog(true);
    }

    const confirmDeleteUsuario = (usuario: UsuarioResponse) => {
        confirmDialog({
            message: 'Esta seguro de eliminar el usuario?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => handleDeleteUsuario(usuario),
            reject: () => toast.current?.show({ severity: 'info', summary: 'Operacion cancelada', detail: 'Usuario no eliminado', life: 3000 }),
        });
    };

    const handleDeleteUsuario = async (usuario: UsuarioResponse) => {
        try {
            await deleteUsuario(usuario.id);
            initComponent();
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Eliminado', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario', life: 3000 });
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

    const actionBodyTemplate = (rowData: UsuarioResponse) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Usuarios</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                 <InputText type="search" placeholder="Search..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
            </IconField>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable id="usuariosTable" ref={dt} value={usuarios} 
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}
                >
                    <Column field="nombres" header="Nombres" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="apellidos" header="Apellidos" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="correo" header="Correo" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={usuariosDialog} style={{ width: '56rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Usuarios Dialog" modal className="p-fluid" onHide={hideDialog}>
                
                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <UsuariosForm 
                        usuario={usuario}
                        hideDialog={hideDialog}
                        flagAction={flagAction}
                        toast={toast}
                    />
                )}
                {flagAction == ActionTypeEnum.READ && (
                    <div>Datos del usuario</div>
                )}
            </Dialog>
        </div>
    );
}
        
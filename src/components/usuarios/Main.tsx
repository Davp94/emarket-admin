"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber,InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ProductService } from '@/service/ProductService';
import { UsuarioResponse } from '@/types/response/UsuarioResponse';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ActionTypeEnum } from '@/constant/action.enum';
import UsuariosForm from './Form';


export default function UsuariosMain() {

    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [usuariosDialog, setUsuariosDialog] = useState<boolean>(false);
    const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
    const [flagAction, setFlagAction] = useState<number>(0);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<UsuarioResponse[]>>(null);

    const initComponent = async () => {
      //TODO call service usuarios
      setUsuarios([]);
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
            accept: () => deleteUsuario(usuario),
            reject: () => toast.current?.show({ severity: 'info', summary: 'Operacion cancelada', detail: 'Usuario no eliminado', life: 3000 }),
        });
    };

    const deleteUsuario = (usuario: UsuarioResponse) => {
        //TODO call service delete usuario
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Eliminado', life: 3000 });
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
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={usuarios} 
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
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
        
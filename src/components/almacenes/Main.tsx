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
import { AlmacenResponse } from '@/types/response/AlmacenResponse';
import { useAlmacen } from '@/hooks/useAlmacen';
import AlmacenForm from './Form';

export default function AlmacenMain() {
    const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
    const [almacenDialog, setAlmacenDialog] = useState<boolean>(false);
    const [almacen, setAlmacen] = useState<AlmacenResponse | null>(null);
    const [flagAction, setFlagAction] = useState<number>(0);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<AlmacenResponse[]>>(null);

    const { getAlmacenes, deleteAlmacen } = useAlmacen();

    const initComponent = async () => {
        try {
            const data = await getAlmacenes();
            setAlmacenes(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los almacenes', life: 3000 });
        }
    };

    useEffect(() => {
        initComponent();
    }, []);

    const openNew = () => {
        setFlagAction(ActionTypeEnum.CREATE);
        setAlmacenDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        if (updateData) {
            initComponent();
        }
        setAlmacen(null);
        setAlmacenDialog(false);
    };

    const editAlmacen = (almacen: AlmacenResponse) => {
        setFlagAction(ActionTypeEnum.UPDATE);
        setAlmacen({ ...almacen });
        setAlmacenDialog(true);
    };

    const confirmDeleteAlmacen = (almacen: AlmacenResponse) => {
        confirmDialog({
            message: 'Esta seguro de eliminar el almacen?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => handleDeleteAlmacen(almacen),
            reject: () => toast.current?.show({ severity: 'info', summary: 'Operacion cancelada', detail: 'Almacen no eliminado', life: 3000 }),
        });
    };

    const handleDeleteAlmacen = async (almacen: AlmacenResponse) => {
        try {
            await deleteAlmacen(almacen.id);
            initComponent();
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Almacen Eliminado', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el almacen', life: 3000 });
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

    const actionBodyTemplate = (rowData: AlmacenResponse) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editAlmacen(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteAlmacen(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Almacenes</h4>
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

                <DataTable id="almacenesTable" ref={dt} value={almacenes}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}
                >
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="codigo" header="Codigo" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="sucursalNombre" header="Sucursal" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ciudad" header="Ciudad" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="direccion" header="Direccion" sortable style={{ minWidth: '14rem' }}></Column>
                    <Column field="telefono" header="Telefono" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={almacenDialog} style={{ width: '56rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Almacen Dialog" modal className="p-fluid" onHide={hideDialog}>

                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <AlmacenForm
                        almacen={almacen}
                        hideDialog={hideDialog}
                        flagAction={flagAction}
                        toast={toast}
                    />
                )}
                {flagAction == ActionTypeEnum.READ && (
                    <div>Datos del almacen</div>
                )}
            </Dialog>
        </div>
    );
}

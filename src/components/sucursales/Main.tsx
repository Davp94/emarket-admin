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
import { SucursalResponse } from '@/types/response/SucursalResponse';
import { useSucursal } from '@/hooks/useSucursal';
import SucursalForm from './Form';

export default function SucursalMain() {
    const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
    const [sucursalDialog, setSucursalDialog] = useState<boolean>(false);
    const [sucursal, setSucursal] = useState<SucursalResponse | null>(null);
    const [flagAction, setFlagAction] = useState<number>(0);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<SucursalResponse[]>>(null);

    const { getSucursales, deleteSucursal, loading } = useSucursal();

    const initComponent = async () => {
        try {
            const data = await getSucursales();
            setSucursales(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar las sucursales', life: 3000 });
        }
    };

    useEffect(() => {
        initComponent();
    }, []);

    const openNew = () => {
        setFlagAction(ActionTypeEnum.CREATE);
        setSucursalDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        if (updateData) {
            initComponent();
        }
        setSucursal(null);
        setSucursalDialog(false);
    };

    const editSucursal = (sucursal: SucursalResponse) => {
        setFlagAction(ActionTypeEnum.UPDATE);
        setSucursal({ ...sucursal });
        setSucursalDialog(true);
    };

    const confirmDeleteSucursal = (sucursal: SucursalResponse) => {
        confirmDialog({
            message: 'Esta seguro de eliminar la sucursal?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => handleDeleteSucursal(sucursal),
            reject: () => toast.current?.show({ severity: 'info', summary: 'Operacion cancelada', detail: 'Sucursal no eliminada', life: 3000 }),
        });
    };

    const handleDeleteSucursal = async (sucursal: SucursalResponse) => {
        try {
            await deleteSucursal(sucursal.id);
            initComponent();
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Sucursal Eliminada', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la sucursal', life: 3000 });
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

    const actionBodyTemplate = (rowData: SucursalResponse) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editSucursal(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteSucursal(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Sucursales</h4>
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

                <DataTable id="sucursalesTable" ref={dt} value={sucursales}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}
                >
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ciudad" header="Ciudad" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="direccion" header="Direccion" sortable style={{ minWidth: '14rem' }}></Column>
                    <Column field="telefono" header="Telefono" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={sucursalDialog} style={{ width: '56rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Sucursal Dialog" modal className="p-fluid" onHide={hideDialog}>

                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <SucursalForm
                        sucursal={sucursal}
                        hideDialog={hideDialog}
                        flagAction={flagAction}
                        toast={toast}
                    />
                )}
                {flagAction == ActionTypeEnum.READ && (
                    <div>Datos de la sucursal</div>
                )}
            </Dialog>
        </div>
    );
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";
import { PaginationResponse } from "@/types/common/PaginationResponse";
import { ProductoResponse } from "@/types/response/ProductoResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { useInventario } from "@/hooks/useInventario";
import { useThemeStore } from "@/state-management/zustand/useThemeStore";
import { usePermissions } from "@/hooks/usePermissions";

export default function InventarioMain() {
  const [productos, setProductos] =
    useState<PaginationResponse<ProductoResponse>>();
  const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
  const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
  const [selectedSucursal, setSelectedSucursal] =
    useState<SucursalResponse | null>(null);
  const [selectedAlmacen, setSelectedAlmacen] =
    useState<AlmacenResponse | null>(null);
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<ProductoResponse[]>>(null);
  const [lazyState, setLazyState] = useState({
    pageSize: 10,
    pageNumber: 0,
    sortField: "",
    sortOrder: "ASC" as "ASC" | "DESC",
  });
  const theme = useThemeStore((state)=>state.theme);
  const { permissions } = usePermissions();
  const { getSucursales, getAlmacenesBySucursal, getProductosPaginacion } = useInventario();

  const initComponent = async () => {
    try {
      const sucursales = await getSucursales();
      setSucursales(sucursales);
    } catch (error) {
      console.log(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener las sucursales",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    initComponent();
  }, []);

  const getAlmacenes = async () => {
    try {
      if (selectedSucursal?.id) {
        const almacenesRetrieved = await getAlmacenesBySucursal(selectedSucursal.id);
        setAlmacenes(almacenesRetrieved);
      }
    } catch (error) {
      console.log(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los almacenes",
        life: 3000,
      });
    }
  };

    useEffect(() => {
    getAlmacenes();
  }, [selectedSucursal]);

  const getProductos = async () => {
    if (selectedAlmacen?.id) {
      try {
        const productos = await getProductosPaginacion({
          ...lazyState,
          almacenId: selectedAlmacen.id,
          filterValue: globalFilter,
        });
        setProductos(productos);
      } catch (error) {
        console.log(error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al obtener los productos",
          life: 3000,
        });
      }
    }
  };

    useEffect(() => {
      getProductos();
    }, [selectedAlmacen, lazyState, globalFilter]);

    const onPage = (event: DataTablePageEvent) => {
        setLazyState({
            ...lazyState,
            pageNumber: event.page ? event.page + 1 : 1,
            pageSize: event.rows
        });
    };

    const onSort = (event: DataTablePageEvent) => {
        setLazyState({
            ...lazyState,
            sortField: event.sortField,
            sortOrder: event.sortOrder === 1 ? 'ASC' : 'DESC'
        });
    };



  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={() => router.push(`notas/nueva-nota?almacenId=${selectedAlmacen?.id}`)} 
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const actionBodyTemplate = (rowData: UsuarioResponse) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => console.log('')}
          disabled={!permissions.includes('ADMINISTRADOR')}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => console.log('')}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Inventario</h4>
      <Dropdown
        value={selectedSucursal}
        onChange={(e)=>setSelectedSucursal(e.value)}
        options={sucursales}
        optionLabel="nombre"
        placeholder="Seleccione una sucursal"
      />
        <Dropdown
        value={selectedAlmacen}
        onChange={(e)=>setSelectedAlmacen(e.value)}
        options={almacenes}
        optionLabel="nombre"
        placeholder="Seleccione un almacen"
      />
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </IconField>
    </div>
  );

  return (
    <div className={theme == 'dark' ? 'text-amber-300': 'text-blue-400'}>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          start={leftToolbarTemplate}
          end={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          id="inventarioTable"
          ref={dt}
          value={productos?.content}
          lazy
          paginator
          first={lazyState.pageNumber * lazyState.pageSize}
          rows={lazyState.pageSize}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
          totalRecords={productos?.totalElements}
          onPage={onPage}
          onSort={onSort}
          sortField={lazyState.sortField}
          sortOrder={lazyState.sortOrder === 'ASC' ? 1 : 0}
        >
          <Column
            field="nombre"
            header="Nombre"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="descripcion"
            header="Descripcion"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="precioVentaActual"
            header="Precio"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
            <Column
            field="nombreCategoria"
            header="Categoria"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          {/* //TODO add images */}
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

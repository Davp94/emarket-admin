'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNotas } from "@/hooks/useNotas";
import { NotaResponse } from "@/types/response/NotaResponse";
import { MovimientoResponse } from "@/types/response/MovimientoResponse";

export default function NotasMain() {
  const [notas, setNotas] = useState<NotaResponse[]>([]);
  const [selectedNota, setSelectedNota] = useState<NotaResponse | null>(null);
  const [detailsDialog, setDetailsDialog] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const router = useRouter();
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<NotaResponse[]>>(null);

  const { getNotas, deleteNota, loading } = useNotas();

  const initComponent = async () => {
    try {
      const data = await getNotas();
      setNotas(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al cargar las notas",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    initComponent();
  }, []);

  const confirmDeleteNota = (nota: NotaResponse) => {
    confirmDialog({
      message: `¿Está seguro de eliminar/anular la nota #${nota.id}?`,
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptLabel: "Sí, Eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => handleDeleteNota(nota),
      reject: () =>
        toast.current?.show({
          severity: "info",
          summary: "Operación cancelada",
          detail: "Nota no eliminada",
          life: 3000,
        }),
    });
  };

  const handleDeleteNota = async (nota: NotaResponse) => {
    try {
      await deleteNota(nota.id);
      await initComponent();
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Nota eliminada correctamente",
        life: 3000,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la nota",
        life: 3000,
      });
    }
  };

  const openDetails = (nota: NotaResponse) => {
    setSelectedNota(nota);
    setDetailsDialog(true);
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const calculateNotaTotal = (nota: NotaResponse): number => {
    if (!nota.movimientos || nota.movimientos.length === 0) {
      return 0;
    }
    const sumMovimientos = nota.movimientos.reduce((acc, mov) => {
      const precio =
        nota.tipoNota === "Compra"
          ? mov.precioUnitarioCompra || 0
          : mov.precioUnitarioVenta || 0;
      return acc + (mov.cantidad || 0) * precio;
    }, 0);
    const descuento = Number(nota.descuentos) || 0;
    const impuesto = Number(nota.impuestos) || 0;
    return sumMovimientos - descuento + impuesto;
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Crear Nota"
          icon="pi pi-plus"
          severity="success"
          onClick={() => router.push("/notas/nueva-nota")}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Exportar"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const tipoNotaTemplate = (rowData: NotaResponse) => {
    const isCompra = rowData.tipoNota?.toLowerCase() === "compra";
    return (
      <Tag
        value={rowData.tipoNota}
        severity={isCompra ? "info" : "success"}
      />
    );
  };

  const estadoNotaTemplate = (rowData: NotaResponse) => {
    const estado = rowData.estadoNota?.toUpperCase() || "ACTIVO";
    let severity: "success" | "danger" | "warning" | "info" = "success";
    if (estado === "ANULADO" || estado === "ELIMINADO") {
      severity = "danger";
    } else if (estado === "PENDIENTE") {
      severity = "warning";
    }
    return <Tag value={estado} severity={severity} />;
  };

  const currencyTemplate = (val: number) => {
    return `Bs. ${(val || 0).toFixed(2)}`;
  };

  const totalBodyTemplate = (rowData: NotaResponse) => {
    return currencyTemplate(calculateNotaTotal(rowData));
  };

  const actionBodyTemplate = (rowData: NotaResponse) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          severity="info"
          tooltip="Ver Detalle"
          onClick={() => openDetails(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          tooltip="Eliminar Nota"
          onClick={() => confirmDeleteNota(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 text-xl font-bold">Gestión de Notas</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Buscar notas..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </IconField>
    </div>
  );

  const movimientoSubtotalTemplate = (rowData: MovimientoResponse) => {
    const precio =
      selectedNota?.tipoNota === "Compra"
        ? rowData.precioUnitarioCompra || 0
        : rowData.precioUnitarioVenta || 0;
    const subtotal = (rowData.cantidad || 0) * precio;
    return currencyTemplate(subtotal);
  };

  const movimientoPrecioTemplate = (rowData: MovimientoResponse) => {
    const precio =
      selectedNota?.tipoNota === "Compra"
        ? rowData.precioUnitarioCompra || 0
        : rowData.precioUnitarioVenta || 0;
    return currencyTemplate(precio);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="card">
        <Toolbar
          className="mb-4"
          start={leftToolbarTemplate}
          end={rightToolbarTemplate}
        />

        <DataTable
          id="notasTable"
          ref={dt}
          value={notas}
          loading={loading}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} notas"
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No se encontraron notas."
        >
          <Column field="id" header="ID" sortable style={{ minWidth: "5rem" }} />
          <Column field="fecha" header="Fecha" sortable style={{ minWidth: "10rem" }} />
          <Column
            field="tipoNota"
            header="Tipo"
            body={tipoNotaTemplate}
            sortable
            style={{ minWidth: "8rem" }}
          />
          <Column
            field="clienteProveedorRazonSocial"
            header="Cliente / Proveedor"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="usuarioNombre"
            header="Usuario"
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="impuestos"
            header="Impuestos"
            body={(rowData) => currencyTemplate(rowData.impuestos)}
            style={{ minWidth: "8rem" }}
          />
          <Column
            field="descuentos"
            header="Descuentos"
            body={(rowData) => currencyTemplate(rowData.descuentos)}
            style={{ minWidth: "8rem" }}
          />
          <Column
            header="Total"
            body={totalBodyTemplate}
            style={{ minWidth: "9rem" }}
          />
          <Column
            field="estadoNota"
            header="Estado"
            body={estadoNotaTemplate}
            sortable
            style={{ minWidth: "8rem" }}
          />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "9rem" }}
          />
        </DataTable>
      </div>

      {/* Details Dialog */}
      <Dialog
        visible={detailsDialog}
        style={{ width: "65rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`Detalle de Nota #${selectedNota?.id || ""}`}
        modal
        className="p-fluid"
        onHide={() => setDetailsDialog(false)}
      >
        {selectedNota && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div>
                <span className="font-semibold block text-sm text-gray-500">Fecha:</span>
                <span className="text-base font-medium">{selectedNota.fecha || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500">Tipo de Nota:</span>
                <Tag
                  value={selectedNota.tipoNota}
                  severity={selectedNota.tipoNota?.toLowerCase() === "compra" ? "info" : "success"}
                />
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500">Estado:</span>
                <Tag
                  value={selectedNota.estadoNota || "ACTIVO"}
                  severity={selectedNota.estadoNota === "ANULADO" ? "danger" : "success"}
                />
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500">Cliente / Proveedor:</span>
                <span className="text-base font-medium">{selectedNota.clienteProveedorRazonSocial || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500">Usuario Responsable:</span>
                <span className="text-base font-medium">{selectedNota.usuarioNombre || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500">Observaciones:</span>
                <span className="text-base font-medium">{selectedNota.observaciones || "Sin observaciones"}</span>
              </div>
            </div>

            <div className="mt-2">
              <h5 className="font-bold text-lg mb-2">Movimientos</h5>
              <DataTable
                value={selectedNota.movimientos || []}
                emptyMessage="No existen movimientos asociados a esta nota."
                size="small"
              >
                <Column field="id" header="ID" style={{ width: "4rem" }} />
                <Column field="productoNombre" header="Producto" />
                <Column field="tipoMovimiento" header="Tipo Mov." />
                <Column field="cantidad" header="Cantidad" style={{ width: "6rem" }} />
                <Column header="Precio Unit." body={movimientoPrecioTemplate} style={{ width: "8rem" }} />
                <Column header="Subtotal" body={movimientoSubtotalTemplate} style={{ width: "8rem" }} />
                <Column field="observaciones" header="Observaciones" />
              </DataTable>
            </div>

            <div className="flex flex-col items-end gap-1 mt-4 p-4 border-t bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm">
                <span>Descuentos: </span>
                <span className="font-semibold">{currencyTemplate(selectedNota.descuentos)}</span>
              </div>
              <div className="text-sm">
                <span>Impuestos: </span>
                <span className="font-semibold">{currencyTemplate(selectedNota.impuestos)}</span>
              </div>
              <div className="text-lg font-bold mt-1 text-green-700 dark:text-green-400">
                <span>Total Final: </span>
                <span>{currencyTemplate(calculateNotaTotal(selectedNota))}</span>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
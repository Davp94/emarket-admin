import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { ClienteProveedorResponse } from "@/types/response/ClienteProveedorResponse";
import { ProductoResponse } from "@/types/response/ProductoResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useInventario } from "@/hooks/useInventario";
import { Card } from "primereact/card";
import DropdownComponent from "../common/DropdownComponent";
import InputTextAreaComponent from "../common/InputTextAreaComponent";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import InputTextComponent from "../common/InputTextComponent";
import { useClienteProveedor } from "@/hooks/useClienteProveedor";
import { useThemeStore } from "@/state-management/zustand/useThemeStore";

export default function NotasForm() {
  const [tipo, setTipo] = useState<string[]>(["Compra", "Venta"]);
  const [modalReport, setModalReport] = useState<boolean>(false);
  const [urlReport, setUrlReport] = useState<string>();

  const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
  const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  const [clientesProveedores, setClientesProveedores] = useState<
    ClienteProveedorResponse[]
  >([]);
  const [filteredProductos, setFilteredProductos] =
    useState<ProductoResponse[]>();
  const router = useRouter();
  const theme = useThemeStore((state)=>state.theme);
  const toast = useRef<Toast>(null);
  const usuarioId = Cookies.get("identifier");
  const { getClientesProveedores } = useClienteProveedor();
  const { getSucursales, getAlmacenesBySucursal, getProductosAlmacen } =
    useInventario();
  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      tipo: "Compra",
      impuestos: 0,
      descuentos: 0,
      observaciones: "",
      usuarioId: Number(usuarioId),
      clienteProveedorId: 0,
      sucursalId: 0,
      almacenId: 0,
      total: 0,
      movimientos: [
        {
          cantidad: 1,
          precioUnitarioCompra: 0,
          precioUnitarioVenta: 0,
          observaciones: "",
          productoId: 0,
          almacenId: 0,
          tipoMovimiento: "Compra",
          subTotal: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "movimientos",
  });

  const initForm = async () => {
    try {
      const [clientes, sucursales] = await Promise.all([
        getClientesProveedores(),
        getSucursales(),
      ]);
      setClientesProveedores(clientes);
      setSucursales(sucursales);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los datos iniciales",
        life: 3000,
      });
    }
  };

  const getAlmacenes = async () => {
    try {
      const almacenes = await getAlmacenesBySucursal(watch("sucursalId"));
      setAlmacenes(almacenes);
      setProductos([]);
    } catch (error) {
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
  }, [watch("sucursalId")]);

  const getProductos = async () => {
    try {
      const productos = await getProductosAlmacen(watch("almacenId"));
      setProductos(productos);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los productos",
        life: 3000,
      });
    }
  };
  useEffect(() => {
    getProductos();
  }, [watch("almacenId")]);

  const searchProducto = (event: any) => {
    const query = (event.query || "").toLowerCase();
    const filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(query) ||
        producto.descripcion.toLowerCase().includes(query),
    );
    setFilteredProductos(filtered);
  };

  const addMovimiento = () => {
    append({
      cantidad: 1,
      precioUnitarioCompra: 0,
      precioUnitarioVenta: 0,
      observaciones: "",
      productoId: 0,
      almacenId: watch("almacenId"),
      tipoMovimiento: watch("tipo"),
      subTotal: 0,
    });
  };

  const removeMovimiento = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    initForm();
  }, []);

  const onProductoSelect = (producto: ProductoResponse, index: number) => {
    const movimiento = getValues("movimientos")[index];
    movimiento.productoId = producto.id;
    movimiento.precioUnitarioCompra = producto.precioVentaActual || 0;
    movimiento.precioUnitarioVenta = producto.precioVentaActual || 0;

    movimiento.almacenId = watch("almacenId");
    setValue(`movimientos.${index}`, movimiento);
  };

  useEffect(() => {
    const currentMovimientos = watch("movimientos") || [];
    let newTotal = 0;
    currentMovimientos.forEach((mov: any, index: number) => {
      const precio =
        watch("tipo") == "Compra"
          ? mov.precioUnitarioCompra
          : mov.precioUnitarioVenta;
      const cant = mov.cantidad;
      const precioCalculated = precio;
      const subTotal = precioCalculated * cant;

      setValue(`movimientos.${index}.subTotal`, subTotal);
      newTotal += subTotal;
    });

    const descuento = Number(watch("descuentos")) || 0;
    const impuestos = Number(watch("impuestos")) || 0;
    const finalTotal = newTotal - descuento + impuestos;

    setValue("total", finalTotal);
  }, [watch("movimientos"), watch("descuentos"), watch("impuestos")]);

  const onSubmit = async () => {
    try {
      const formData = getValues();
      console.log(formData);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar la nota",
        life: 3000,
      });
    }
  };

  const onCloseForm = () => {
    reset();
    router.push("/notas");
  };
  return (
    <div className="surface-ground px-4 py-8">
      <Toast ref={toast} />
      <div className="flex flex-col justify-between items-center mb-5">
        <h1 className={theme == 'light'? '': '' }>Crear Nota</h1>
        <p>Gestion de notas de compras y ventas</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <Card title="Datos Generales">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <label>Tipo de Nota</label>
            <DropdownComponent
              control={control}
              name="tipo"
              rules={{ required: "Tipo requerido" }}
              placeholder="Seleccione el tipo de nota"
              options={tipo}
            />
          </div>
          <div>
            <label>Cliente/Proveedor</label>
            <DropdownComponent
              control={control}
              name="clienteProveedorId"
              rules={{ required: "Cliente/Proveedor requerido" }}
              placeholder="Seleccione el cliente/proveedor"
              options={clientesProveedores}
              optionLabel="razonSocial"
              optionValue="id"
            />
          </div>
          <div>
            <label>Sucursal</label>
            <DropdownComponent
              control={control}
              name="sucursalId"
              rules={{ required: "Sucursal requerido" }}
              placeholder="Seleccione la sucursal"
              options={sucursales}
              optionLabel="nombre"
              optionValue="id"
            />
          </div>
          <div>
            <label>Almacen</label>
            <DropdownComponent
              control={control}
              name="almacenId"
              rules={{ required: "Almacen requerido" }}
              placeholder="Seleccione el almacen"
              options={almacenes}
              optionLabel="nombre"
              optionValue="id"
            />
          </div>
          <div>
            <label>Observaciones</label>
            <InputTextAreaComponent
              control={control}
              name="observaciones"
              placeholder="Ingrese las observaciones"
              rules={{ required: "observaciones requeridas" }}
            />
          </div>
        </Card>

        <Card
          title="Productos y Movimientos"
          subTitle={
            <Button
              type="button"
              icon="pi pi-plus"
              label="Agregar movimiento"
              severity="success"
              onClick={addMovimiento}
              disabled={!watch("almacenId")}
            />
          }
        >
          {fields.map((field, index) => (
            <div key={field.id}>
              <div>
                <span>Movimiento # {index + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    label="Eliminar"
                    severity="danger"
                    onClick={() => removeMovimiento(index)}
                  />
                )}
              </div>
              <div>
                <div>
                  <label>Producto</label>
                  <Controller
                    name={`movimientos.${index}.productoId`}
                    control={control}
                    rules={{ required: "producto requerido" }}
                    render={({ field, fieldState }) => (
                      <>
                        <AutoComplete
                          field="nombre"
                          value={productos.find((p) => p.id === field.value)}
                          suggestions={filteredProductos}
                          completeMethod={searchProducto}
                          onSelect={(e) => onProductoSelect(e.value, index)}
                          dropdown
                          placeholder="Buscar o seleccionar producto"
                        />
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 xl:col-span-2">
                  <label className="font-medium text-gray-700 text-sm">
                    Cantidad
                  </label>
                  <Controller
                    name={`movimientos.${index}.cantidad`}
                    control={control}
                    rules={{ required: "Cantidad", min: 1 }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputNumber
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                          placeholder="1"
                          className="w-full"
                        />
                        {fieldState.error && (
                          <small className="text-red-500">Valor inválido</small>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 xl:col-span-2">
                  <label className="font-medium text-gray-700 text-sm">
                    Precio Unitario
                  </label>
                  <Controller
                    name={`movimientos.${index}.${watch('tipo') === "COMPRA" ? "precioUnitarioCompra" : "precioUnitarioVenta"}`}
                    control={control}
                    rules={{ required: "Precio requerido", min: 0 }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputNumber
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                          placeholder="0.00"
                          mode="decimal"
                          minFractionDigits={2}
                          className="w-full"
                        />
                        {fieldState.error && (
                          <small className="text-red-500">Requerido</small>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 xl:col-span-3">
                  <label className="font-medium text-gray-700 text-sm">
                    Subtotal
                  </label>
                  <Controller
                    name={`movimientos.${index}.subTotal`}
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        value={field.value}
                        readOnly
                        mode="decimal"
                        minFractionDigits={2}
                        className="w-full opacity-90 p-inputnumber-readonly"
                        inputClassName="bg-gray-100 font-bold text-gray-800"
                      />
                    )}
                  />
                </div>

                <div className="xl:col-span-12 flex flex-col gap-2 mt-2">
                  <label className="font-medium text-gray-700 text-sm">
                    Observación de Movimiento
                  </label>
                  <InputTextComponent
                    name={`movimientos.${index}.observaciones`}
                    control={control}
                    rules={{ required: false }}
                    placeholder="Comentarios o detalles adicionales (Opcional)"
                  />
                </div>
              </div>
            </div>
          ))}
        </Card>
         <Card title="Resumen" className="shadow-2 border-round">
                    <div className="flex flex-col gap-4 md:w-1/2 lg:w-1/3 ml-auto text-lg mt-2">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-gray-700 font-bold uppercase tracking-wider text-sm">Total de Nota</span>
                            <span className="text-green-800 font-bold text-2xl block bg-green-100 px-4 py-2 rounded-lg border border-green-200">
                                Bs. {(Number(watch('total')) || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-gray-100">
                            <Button
                                type="button"
                                label="Cancelar"
                                severity="danger"
                                outlined
                                onClick={onCloseForm}
                                className="px-5 w-auto"
                            />
                            <Button type="submit" label="Procesar y Guardar" icon="pi pi-save" className="px-5 font-bold w-auto" />
                        </div>
                    </div>
        </Card>
      </form>
    </div>
  );
}

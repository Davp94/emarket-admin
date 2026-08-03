"use client";
import { useAuth } from "@/hooks/useAuth";
import { AuthService } from "@/service/AuthService";
import { AuthProvider } from "@/state-management/context/AuthContext";
import { wrapApiHandler } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useCallback, useEffect, useRef } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {logout} = useAuth();
  const topbarMenu = useRef<Menu>(null);
  const router = useRouter();
  const navigationItems = [
    { name: "Home", href: "/", icon: "pi pi-home" },
    { name: "Usuarios", href: "/usuarios", icon: "pi pi-user" },
    { name: "Notas", href: "/notas", icon: "pi pi-user" },
    { name: "Roles", href: "/roles", icon: "pi pi-shield" },
    { name: "Sucursales", href: "/sucursales", icon: "pi pi-building" },
    { name: "Almacenes", href: "/almacenes", icon: "pi pi-warehouse" },
    { name: "Inventario", href: "/inventario", icon: "pi pi-box" },
    { name: "Test", href: "/test", icon: "pi pi-box" },
  ];
  let topBarItems: MenuItem[] = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => {
        router.push('profile')
      },
    },
    {
      label: "Salir",
      icon: "pi pi-sign-out",
      command: () => {
        logout();
        router.push('login')
      },
    },
  ];

  const handleSessionExpired = useCallback(async () => {
    if(AuthService.isTokenExpired()) {
      try {
        await AuthService.refreshToken();
      } catch (error) {
        await logout();
        router.push("/login")
      }
    }
  },[logout, router]);

  useEffect(() => {
    handleSessionExpired();
    const interval = setInterval(handleSessionExpired, 60);
    return () => clearInterval(interval);    
  }, [handleSessionExpired])

  return (
    <>
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="p-4 text-xl font-bold">Emarket</div>
          <nav className="flex-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white shadow flex items-center justify-end px-4">
            <Menu model={topBarItems} popup ref={topbarMenu} />
            <Button
              icon="pi pi-ellipsis-v"
              className="p-button-text"
              onClick={(e) => topbarMenu.current?.toggle(e)}
            />
          </header>
          <main className="flex-1 overflow-auto p-4">
              <AuthProvider>
                {children}
              </AuthProvider>
          </main>
        </div>
      </div>
    </>
  );
}

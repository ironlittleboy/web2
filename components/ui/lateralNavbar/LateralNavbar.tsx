import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsBox2, BsBoxArrowLeft, BsColumnsGap } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdSupport } from "react-icons/md";
import { GrNote } from "react-icons/gr";

import {
  CiAirportSign1,
  CiBoxes,
  CiChat1,
  CiDollar,
  CiPlane,
  CiWallet,
} from "react-icons/ci";

import NavLinkItem from "./NavLinkItem";
import Button from "@/components/shared/Button/Button";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/useUserStore";
import { StoreUser } from "@/interfaces/IStoreUser";

const LateralNavbar = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  
  console.log(user?.role);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  return (
    <>
      <div className="w-[300px] bg-transparent h-full px-5 py-4 bg-white border-r border-gray-200">
        <div className="border border-gray-400 rounded px-4 py-2 flex justify-center items-center mb-5 font-bold">
          <span className="flex items-center justify-center text-blue-400">
            IVENTORY
          </span>
          PRO
        </div>
        <nav className="px-3 flex flex-col gap-5">
          {user?.role === "admin" && (
            <div>
              <h3 className="font-bold text-xl mb-3">Administracion</h3>
              <ul>
                <NavLinkItem
                  href="/admin/dashboard"
                  label="Panel de control"
                  Icon={BsColumnsGap}
                />
                <NavLinkItem
                  href="/admin/sitios"
                  label="Bodegas y Sitios"
                  Icon={CiBoxes}
                />
                <NavLinkItem
                  href="/admin/users"
                  label="Usuarios"
                  Icon={FaRegUser}
                />
                <NavLinkItem
                  href="/admin/products"
                  label="Productos"
                  Icon={BsBox2}
                />
                <NavLinkItem
                  href="/admin/tags"
                  label="Etiquetas"
                  Icon={GrNote}
                />
                <NavLinkItem
                  href="/admin/providers"
                  label="Proveedores"
                  Icon={FaRegUser}
                />
                <NavLinkItem href="/admin/lotes" label="Lotes" Icon={CiBoxes} />
                <NavLinkItem
                  href="/admin/chatbot"
                  label="ChatBot"
                  Icon={CiWallet}
                />
                <NavLinkItem
                  href="/admin/retornos"
                  label="Retornos"
                  Icon={CiAirportSign1}
                />
                <NavLinkItem
                  href="/admin/factura"
                  label="Facturas"
                  Icon={CiDollar}
                />
                <NavLinkItem
                  href="/admin/permission"
                  label="Roles y Permisos"
                  Icon={MdOutlineTaskAlt}
                />
                <NavLinkItem
                  href="/admin/settings"
                  label="Configuracion"
                  Icon={IoSettingsOutline}
                />
                <NavLinkItem
                  href="/admin/support"
                  label="Soporte"
                  Icon={MdSupport}
                />
                <li className="text-sm cursor-pointer font-light px-3 py-2 flex justify-start items-center gap-2">
                  <Button
                    label="Salir"
                    type="button"
                    variant="outline"
                    onClick={logout}
                    Icon={BsBoxArrowLeft}
                  />
                </li>
              </ul>
            </div>
          )}
          {user?.role === "owner" && (
            <div>
              <h3 className="font-bold text-xl mb-3">Propietario</h3>
              <ul>
                <NavLinkItem
                  href="/owner/dashboard"
                  label="Panel de control"
                  Icon={BsColumnsGap}
                />
                <NavLinkItem
                  href="/owner/sitios"
                  label="Bodegas y Sitios"
                  Icon={CiBoxes}
                />
                <NavLinkItem
                  href="/owner/users"
                  label="Usuarios"
                  Icon={FaRegUser}
                />
                <NavLinkItem
                  href="/owner/products"
                  label="Productos"
                  Icon={BsBox2}
                />
                <NavLinkItem
                  href="/owner/tags"
                  label="Etiquetas"
                  Icon={GrNote}
                />
                <NavLinkItem
                  href="/owner/providers"
                  label="Proveedores"
                  Icon={FaRegUser}
                />
                <NavLinkItem href="/owner/lotes" label="Lotes" Icon={CiBoxes} />
                <li className="text-sm cursor-pointer font-light px-3 py-2 flex justify-start items-center gap-2">
                  <Button
                    label="Salir"
                    type="button"
                    variant="outline"
                    onClick={logout}
                    Icon={BsBoxArrowLeft}
                  />
                </li>
              </ul>
            </div>
          )}
          {user?.role === "user" && (
            <div>
              <h3 className="font-bold text-xl mb-3">Usuario</h3>
              <ul>
                <NavLinkItem
                  href="/user/dashboard"
                  label="Panel de control"
                  Icon={BsColumnsGap}
                />
                <NavLinkItem
                  href="/user/sitios"
                  label="Bodegas y Sitios"
                  Icon={CiBoxes}
                />
                <li className="text-sm cursor-pointer font-light px-3 py-2 flex justify-start items-center gap-2">
                  <Button
                    label="Salir"
                    type="button"
                    variant="outline"
                    onClick={logout}
                    Icon={BsBoxArrowLeft}
                  />
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default LateralNavbar;

"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

import { ProfileIcon, SettingsIcon } from "@/components/ui/icons"
import { logout } from "@/app/auth/login/actions"

type NavbarActionsProps = {
  userId: string | undefined
}

type UserAvatarProps = {
  imageUrl: string
  alt?: string
  size?: number
}

const UserAvatar = ({
  imageUrl,
  alt = "User avatar",
  size = 40,
}: UserAvatarProps) => (
  <div className="w-10 rounded-full">
    <Image
      alt={alt}
      src={imageUrl}
      width={size}
      height={size}
      className="rounded-full"
    />
  </div>
)

const DEFAULT_AVATAR = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAACoCAMAAACPKThEAAAAwFBMVEUac+j///8YWrwUWbzz+P0iXL4Zbd0AaucXcugAaOcAbecAZ+cAT7no8PwRcOgYXsMAU7oZZc9rne4AYOYASrcZa9q+1Pf4+v7J2fgAVbs3geqUtPGhvfNMiuwAY+bW4vqFqvCqxPW0yvZ5pe9EhOpvn+8ieOlKjOzI1u/t7/WYr91Te8iBnNEAU8Lg5vMAXMq3xeWqu+Fric2OpNgyaMHDz+oARbdVdMVag8uZuPMyfOnd5/takewAY9nS2ux3ldT6dCdZAAADxklEQVR4nO3ca1uiQByHYZhRZhjlkCGKZZqrbra227m2g33/b7UitqumDCFdsMzvflMvx+diEJG/mgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAfPpf3Gv4HXDAR/rUZs/NeS7HZJ50j36rMWe3j7onIez3FZZuNnr7C6jPU2o4N10otajVqea+qkGr9zVKhUxOn+Q/M022pdL0tEGvDrlS63mOItYZt3YCRAc5Zq+zO7lS6/g3vhivYh3fAVS0z7/UViGjEpdL1Y5b3Cosj/rDS9YqN0/sSH8an0vURzlhL4kjWyscmXDLbslYWNuHSYUXWSh+jVYRJU+kdtFrgY3mr77jxt4BWyXEhbzXEHowctqStcG5fqp3JUk2wBZfEuazVGa5Fl+wfslZTfMZ5d/EzPlWritPVu1/T+FaXF2j1runGH1j0IO8VFkgQe8Y6rzfzXmCBON7V7lSzOsl7fUViEG/nNZZFsQXXONSb7UhVDXBYreIGIdu34cylBIfVuoN5rOvJZqnWjUeJk/faCschxKU363dIr27rhBANF1eb5rGo671dWou7Dq3J3dSt0zAVfDTfhoQE3n314fHx4fbec8NS2IDbNUmEBgGl0b8H2IC7HJA1joFSMZrO31DzSwWkkjGaTSP8i1JyXEMnACg4zm1bCBYRwrbxeMxWXJhC67yM+seDge/7g9Pf/Ub3iZsMvdZwUTOHfb9X2fwCumX1TkfjmoleEc7Y01E77mt6yx9pDOMTmjgZHj/HdHo/wNp9zVT6i/r5Oeqb5BHklVyDbk3ZWpyNj+RPP67qNRQdVhXik6UWtV5q6p23uPlifbpUqK2p9hyI0PxUpUJ9tcYvWffz2+8fX6WzlhkzLZiE9aRMLFM6UyJT6SgSa9+jahFrrEQs2bBgMs8q/IwKt+VPaCehwhR0Lf3Fwrryj1LI5yqT6pX+wGKDrFrp3ZIfWJyn+2SzTdknxnnsDzF8Tq/kP0VgZ3LBELFK/iHaHmXYquR34TM9rtAKrZbQKjm0Sg6tksu2Vd6v5mvx79m1ei77dbuRzR2Z0GXZW73uGFFK4a3ke1B7vc4q1eQi79fyxbjhSebAE3tz834xXy64zSbVmVf6UTnuuI9ZpJoFtPxD0E1Sf9z/vfAsoCoMgDnErd7tV6oy9Sgp/2EVzoETen97NZtU0pncTT1XlWG5cPSN1l1aTSeou0SZaVUezQnStBZDYEqUChkO2Y9SI5h71Sr9hdVHRjp5LzsPPKW81w0AAAAAAAAAAAAAAAAAAAAAAAAAAAB/AH/nP550lAOJAAAAAElFTkSuQmCC`

type UserDropdownProps = {
  userId: string
}

const UserDropdown = ({}: UserDropdownProps) => (
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost">
      <UserAvatar imageUrl={DEFAULT_AVATAR} />
    </div>
    <ul
      tabIndex={0}
      className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
    >
      <li>
        <Link href="/profile" className="flex items-center gap-2">
          <ProfileIcon />
          Profil
        </Link>
      </li>
      <li>
        <Link href="/settings" className="flex items-center gap-2">
          <SettingsIcon />
          Inställningar
        </Link>
      </li>
    </ul>
  </div>
)

export default function NavbarActions({ userId }: NavbarActionsProps) {
  return (
    <div className="navbar-end">
      {userId ? (
        <div className="flex items-center gap-2">
          <button onClick={() => logout()} className="btn btn-ghost">
            Logout
          </button>
          <UserDropdown userId={userId} />
        </div>
      ) : (
        <Link href="/auth/login" className="btn btn-ghost">
          Login
        </Link>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { KeyboardArrowDown, Person, Dashboard, ExitToApp } from '@mui/icons-material'
import { handleLogout } from '@/app/utils/auth'
import kaiLogo from '../assets/kai_negativo.png'

export default function Header() {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const userName = session?.user?.name || 'Nome do cliente'

  return (
    <header className="w-full bg-gradient-to-r from-[#A9DC93] to-[#FF8046] py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/dashboard">
          <Image
            src={kaiLogo}
            alt="KAI Prevention Center"
            width={110}
            height={48}
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-8">
        {/* Schedule button */}
        <Link
          href="/agendamento"
          className="text-white border border-white rounded-full px-5 py-2 text-sm hover:bg-white/10 transition-colors"
        >
          Agendar experiência KAI
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-1 text-white cursor-pointer"
          >
            {userName} <KeyboardArrowDown />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 py-2">
              <Link href="/dashboard" className="block px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Dashboard fontSize="small" />
                  <span className="text-gray-700">Painel do Usuário</span>
                </div>
              </Link>
              <Link href="/profile" className="block px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Person fontSize="small" />
                  <span className="text-gray-700">Perfil</span>
                </div>
              </Link>
              <div className="px-4 py-2">
                <button
                  className="flex items-center gap-2 text-gray-700 w-full text-left hover:text-kai-primary"
                  onClick={handleLogout}
                >
                  <ExitToApp fontSize="small" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

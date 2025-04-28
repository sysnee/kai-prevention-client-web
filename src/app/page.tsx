'use client'

import { redirect } from "next/navigation";

export default function Public() {
  return redirect('/dashboard')
}

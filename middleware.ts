// middleware.ts
import { NextRequest, NextResponse } from "next/server"

const EUR_COUNTRIES = new Set([
  "FR","DE","ES","IT","NL","BE","LU","IE","PT","AT","FI","GR","CY",
  "EE","LV","LT","MT","SI","SK", // zone euro
  "AD","MC","SM","ME","XK"       // pays utilisant l’euro
])

function countryToCurrency(country: string | null): "EUR" | "USD" {
  if (!country) return "USD"
  return EUR_COUNTRIES.has(country.toUpperCase()) ? "EUR" : "USD"
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // si le cookie existe déjà (utilisateur a choisi ou déjà vu), on ne touche à rien
  const existing = req.cookies.get("currency")?.value
  if (!existing) {
    // Sur Vercel, cet header est renseigné automatiquement
    const country = req.headers.get("x-vercel-ip-country")
    const currency = countryToCurrency(country)

    res.cookies.set("currency", currency, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 an
      sameSite: "lax",
    })
  }

  return res
}

// s'applique à toutes les routes sauf les assets statiques
export const config = {
  matcher: ["/((?!_next|static|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)"],
}
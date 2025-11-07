"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputSoraya from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Eye, EyeOff } from "lucide-react";

// ---- Types

type Mode = "signin" | "signup";

type SignInState = {
  email: string;
  password: string;
};

type SignUpState = {
  firstName: string; // Prénom
  lastName: string;  // Nom
  siret: string;
  phone: string;
  email: string;
  country: string;
  postalCode: string;
  city: string;
  password: string;
  confirmPassword: string;
};

// ---- Helpers

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const onlyDigits = (v: string) => v.replace(/[^0-9]/g, "");

export default function AuthentificationSoraya() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [signIn, setSignIn] = useState<SignInState>({ email: "", password: "" });
  const [signUp, setSignUp] = useState<SignUpState>({
    firstName: "",
    lastName: "",
    siret: "",
    phone: "",
    email: "",
    country: "",
    postalCode: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const resetFeedback = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  // ----- SIGN IN
  const handleSubmitConnexion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetFeedback();

    if (!validateEmail(signIn.email)) {
      setErrorMessage("Email invalide");
      return;
    }
    if (signIn.password.length < 6) {
      setErrorMessage("Le mot de passe doit faire au moins 6 caractères");
      return;
    }

    try {
      setLoading(true);

      // 1) Récupère le token JWT
      const tokenRes = await fetch(
        "https://maillotsoraya-conception.com/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: signIn.email, password: signIn.password }),
        }
      );

      if (!tokenRes.ok) {
        setErrorMessage("Adresse e-mail ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      const tokenData = await tokenRes.json();
      const token = tokenData?.token;
      const username = tokenData?.user_display_name;

      // 2) Vérifie rôle "distributeur"
      const roleRes = await fetch(
        "https://maillotsoraya-conception.com/wp-json/wp/v2/users?roles=distributeur",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!roleRes.ok) {
        setErrorMessage("Erreur lors de la vérification des rôles.");
        setLoading(false);
        return;
      }

      const distributeurs = await roleRes.json();
      const isDistributeur = Array.isArray(distributeurs)
        ? distributeurs.some((u: any) => u?.name === username)
        : false;
      const userId = Array.isArray(distributeurs)
        ? distributeurs.find((u: any) => u?.name === username)?.id
        : undefined;

      if (!isDistributeur) {
        setErrorMessage(
          "Accès refusé : vous n'êtes pas autorisé à accéder à cette section."
        );
        setLoading(false);
        return;
      }

      // 3) Succès : persiste et redirige
      try {
        localStorage.setItem("isLoggedInDistributeur", "true");
        if (userId) localStorage.setItem("id", String(userId));
        if (username) localStorage.setItem("username", username);
        if (token) localStorage.setItem("jwt", token);
      } catch (_) {
        // Ignorer erreurs de quota
      }

      router.push("/accueil");
    } catch (err) {
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // ----- SIGN UP (UI / collecte infos B2B)
  const handleSubmitInscription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetFeedback();

    // Validations locales pour UX
    if (signUp.firstName.trim().length < 2)
      return setErrorMessage("Entrez un prénom valide");
    if (signUp.lastName.trim().length < 2)
      return setErrorMessage("Entrez un nom valide");
    if (!validateEmail(signUp.email))
      return setErrorMessage("Email invalide");
    // SIRET français: 14 chiffres (on reste permissif si autre pays)
    if (signUp.country.toLowerCase() === "france" || signUp.country.toLowerCase() === "fr") {
      if (onlyDigits(signUp.siret).length !== 14)
        return setErrorMessage("Le numéro de SIRET doit contenir 14 chiffres");
      if (onlyDigits(signUp.postalCode).length !== 5)
        return setErrorMessage("Le code postal doit contenir 5 chiffres");
    }
    if (signUp.phone && onlyDigits(signUp.phone).length < 8)
      return setErrorMessage("Entrez un numéro de téléphone valide");
    if (!signUp.country.trim())
      return setErrorMessage("Renseignez votre pays");
    if (!signUp.city.trim())
      return setErrorMessage("Renseignez votre ville");
    if (!signUp.postalCode.trim())
      return setErrorMessage("Renseignez votre code postal");
    if (signUp.password.length < 6)
      return setErrorMessage("Le mot de passe doit faire au moins 6 caractères");
    if (signUp.password !== signUp.confirmPassword)
      return setErrorMessage("Les mots de passe ne correspondent pas");

    // Parcours actuel: pré‑inscription + redirection/CTA site B2B
    setInfoMessage(
      "Merci ! Nous avons bien enregistré vos informations. Pour finaliser l'inscription B2B, cliquez sur le lien 'Rejoindre le réseau B2B'."
    );
  };

  return (
    <div className="flex justify-center mt-16 px-4 mb-16">
      <div className="w-full max-w-[620px]">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo-soraya.png"
            alt="Logo Soraya"
            width={420}
            height={120}
            priority
            quality={100}
          />

          <h2 className="mt-4 text-center text-2xl font-yanone">
            Bienvenue dans l'espace B2B de Soraya Swimwear
          </h2>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                resetFeedback();
              }}
              className={
                "h-10 rounded-lg text-sm font-semibold transition-colors " +
                (mode === "signin"
                  ? "bg-black text-white"
                  : "text-slate-600 hover:text-slate-900")
              }
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                resetFeedback();
              }}
              className={
                "h-10 rounded-lg text-sm font-semibold transition-colors " +
                (mode === "signup"
                  ? "bg-black text-white"
                  : "text-slate-600 hover:text-slate-900")
              }
            >
              Inscription
            </button>
          </div>

          {/* Forms */}
          {mode === "signin" ? (
            <form onSubmit={handleSubmitConnexion} noValidate>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm mb-1">
                  Adresse e‑mail
                </label>
                <InputSoraya
                  type="email"
                  id="email"
                  required
                  value={signIn.email}
                  placeholder="exemple@domaine.com"
                  onChange={(e: any) => setSignIn((s) => ({ ...s, email: e.target.value }))}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPassword ? "Cacher" : "Afficher"}
                  </button>
                </div>
                <InputSoraya
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={signIn.password}
                  placeholder="••••••••"
                  onChange={(e: any) => setSignIn((s) => ({ ...s, password: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-sm p-3 font-semibold rounded-lg border border-slate-500 text-white bg-black hover:bg-zinc-700 disabled:opacity-60"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>

              <div className="mt-4 text-center text-sm">
                <Link className="underline" href="https://maillotsoraya.com">
                  En savoir plus sur Soraya Swimwear
                </Link>
                .
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitInscription} noValidate>
              {/* Grid identité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Prénom</label>
                  <InputSoraya
                    type="text"
                    value={signUp.firstName}
                    placeholder="Ex. Jeanne"
                    onChange={(e: any) => setSignUp((s) => ({ ...s, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nom</label>
                  <InputSoraya
                    type="text"
                    value={signUp.lastName}
                    placeholder="Ex. Martin"
                    onChange={(e: any) => setSignUp((s) => ({ ...s, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Coordonnées pro */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Numéro de SIRET</label>
                  <InputSoraya
                    type="text"
                    value={signUp.siret}
                    placeholder="14 chiffres (France)"
                    onChange={(e: any) =>
                      setSignUp((s) => ({ ...s, siret: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Numéro de téléphone</label>
                  <InputSoraya
                    type="tel"
                    value={signUp.phone}
                    placeholder="Ex. +33 6 12 34 56 78"
                    onChange={(e: any) => setSignUp((s) => ({ ...s, phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mt-4">
                <label className="block text-sm mb-1">Email</label>
                <InputSoraya
                  type="email"
                  value={signUp.email}
                  placeholder="exemple@domaine.com"
                  onChange={(e: any) => setSignUp((s) => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>

              {/* Adresse */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm mb-1">Pays</label>
                  <InputSoraya
                    type="text"
                    value={signUp.country}
                    placeholder="Ex. France"
                    onChange={(e: any) => setSignUp((s) => ({ ...s, country: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm mb-1">Code postal</label>
                  <InputSoraya
                    type="text"
                    value={signUp.postalCode}
                    placeholder="Ex. 75008"
                    onChange={(e: any) => setSignUp((s) => ({ ...s, postalCode: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm mb-1">Ville</label>
                  <InputSoraya
                    type="text"
                    value={signUp.city}
                    placeholder="Ex. Paris"
                    onChange={(e: any) => setSignUp((s) => ({ ...s, city: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Mots de passe */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPassword ? "Cacher" : "Afficher"}
                  </button>
                </div>
                <InputSoraya
                  type={showPassword ? "text" : "password"}
                  value={signUp.password}
                  placeholder="Au moins 6 caractères"
                  onChange={(e: any) => setSignUp((s) => ({ ...s, password: e.target.value }))}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-1">Confirmer le mot de passe</label>
                <InputSoraya
                  type={showPassword ? "text" : "password"}
                  value={signUp.confirmPassword}
                  placeholder="Retapez le mot de passe"
                  onChange={(e: any) =>
                    setSignUp((s) => ({ ...s, confirmPassword: e.target.value }))
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full text-sm p-3 font-semibold rounded-lg border border-slate-500 text-white bg-black hover:bg-zinc-700"
              >
                Pré‑inscription
              </button>

              <p className="mt-3 text-xs text-slate-600 text-center">
                Une fois votre compte validé, vous pourrez découvrir et commander toute notre collection.
              </p>
            </form>
          )}
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="fixed bottom-6 left-6 w-80 z-50">
            <Alert variant="default" className="bg-red-100 border-red-500 text-red-700">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle className="text-red-700">Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        {infoMessage && (
          <div className="fixed bottom-6 left-6 w-80 z-50">
            <Alert variant="default" className="bg-emerald-100 border-emerald-500 text-emerald-700">
              <AlertTitle className="text-emerald-700">Information</AlertTitle>
              <AlertDescription>{infoMessage}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}

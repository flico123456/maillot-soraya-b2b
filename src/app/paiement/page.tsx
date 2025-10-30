'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import KRGlue from "@lyracom/embedded-form-glue";
import axios from "axios";
import Head from "next/head";
import Script from "next/script";

export default function Paiement() {
    const [prixGlobal, setPrixGlobal] = useState<number>(0);
    const [canPay, setCanPay] = useState(false);
    const MIN_ORDER = 500;

    useEffect(() => {
        const storedPrix = localStorage.getItem("PriceTotal") || localStorage.getItem("PrixGlobal");
        const total = storedPrix ? Number(storedPrix) : 0;
        setPrixGlobal(total);
        setCanPay(total < MIN_ORDER);
    }, []);

    useEffect(() => {
        async function setupPaymentForm() {
            if (!canPay) return; // n’instancie pas la forme si en-dessous du minimum

            const endpoint = "https://api.systempay.fr/";
            const publicKey = "24084100:publickey_ducG9HjiRVdpnmN2fXS0wKqX92ksSReTs3z9FMRuqaCBL";

            try {
                const prixGlobalFromStorage = localStorage.getItem("PrixGlobal") || String(prixGlobal);
                const montantTotalEnCentimes = (Number(prixGlobalFromStorage) * 100).toFixed(0);

                const customerUsername = localStorage.getItem("username") || "";
                const customerEmail = localStorage.getItem("emailCustomer") || "";

                const paymentConf = {
                    amount: montantTotalEnCentimes,
                    currency: "EUR",
                    orderId: localStorage.getItem("IdCommande") || undefined,
                    customer: {
                        billingDetails: { firstName: customerUsername },
                        email: customerEmail,
                    },
                };

                const paymentResponse = await axios.post(
                    "https://api.maillotsoraya-conception.com:1675/createPayment",
                    { paymentConf }
                );

                const formToken = paymentResponse.data.formToken;

                const { KR } = await KRGlue.loadLibrary(endpoint, publicKey);
                await KR.setFormConfig({
                    formToken,
                    "kr-language": "fr-FR",
                });

                const { result } = await KR.attachForm("#myPaymentForm");
                await KR.showForm(result.formId);
            } catch (error) {
                console.log(error + " (voir console pour plus de détails)");
            }
        }

        setupPaymentForm();
    }, [canPay, prixGlobal]);

    return (
        <div>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link
                    rel="stylesheet"
                    href="https://api.systempay.fr/static/js/krypton-client/V4.0/ext/neon-reset.css"
                />
            </Head>

            <Script src="https://api.systempay.fr/static/js/krypton-client/V4.0/ext/neon.js" />
            <Script
                src="https://static.systempay.fr/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
                kr-public-key="24084100:publickey_ducG9HjiRVdpnmN2fXS0wKqX92ksSReTs3z9FMRuqaCBL"
                kr-post-url-success="/api/paiement-accepte"
            />

            {/* ---- GLOBAL CSS pour styler les éléments du formulaire Krypton ---- */}
            <style jsx global>{`
  /* Font par défaut */
  #myPaymentForm .kr-embedded,
  #myPaymentForm .kr-pan,
  #myPaymentForm .kr-expiry,
  #myPaymentForm .kr-security-code {
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  }

  /* Champs (compact) */
  #myPaymentForm .kr-pan,
  #myPaymentForm .kr-expiry,
  #myPaymentForm .kr-security-code {
    border: 1px solid #e5e7eb !important; /* gray-200 */
    border-radius: 0.5rem !important;      /* rounded-lg */
    padding: 0.5rem 0.75rem !important;    /* py-2 px-3 */
    background: #fff !important;
    min-height: 38px !important;           /* ~h-9 */
  }

  /* Espacements fins */
  #myPaymentForm .kr-input,
  #myPaymentForm .kr-form-row {
    margin-bottom: 0.5rem !important;      /* mb-2 */
  }

  /* Messages d'erreur */
  #myPaymentForm .kr-form-error,
  #myPaymentForm .kr-error {
    color: #dc2626 !important;             /* red-600 */
    font-size: 12px !important;
    margin-top: 4px !important;
  }

  /* Bouton (plus discret/compact) */
  #myPaymentForm .kr-payment-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    max-width: 14rem !important;           /* w-56 */
    padding: 0.5rem 0.875rem !important;   /* py-2 px-3.5 */
    margin: 0.5rem 0 0 !important;         /* mt-2 */
    border-radius: 9999px !important;      /* rounded-full */
    font-weight: 600 !important;
    font-size: 0.875rem !important;        /* text-sm */
    background: #111827 !important;        /* gray-900 */
    color: #fff !important;
    border: 1px solid #111827 !important;
    transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease, color 150ms ease !important;
    cursor: pointer !important;
    text-align: center !important;
  }
  #myPaymentForm .kr-payment-button:hover {
    background: #fff !important;
    color: #111827 !important;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08) !important;
    transform: translateY(-1px) !important;
  }
  #myPaymentForm .kr-payment-button:active {
    transform: translateY(0) scale(0.98) !important;
  }
`}</style>

            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl p-8 space-y-6 shadow-sm border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center gap-2 cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span className="font-inter text-xs font-semibold">Retour</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <Image
                            src="/logo-soraya.png"
                            alt="Logo"
                            width={150}
                            height={100}
                            className="object-contain"
                        />
                        <h1 className="font-inter text-xl font-semibold">{prixGlobal.toFixed(2)} €</h1>
                    </div>

                    <h1 className="font-inter text-xl font-bold text-center">Paiement sécurisé</h1>

                    {/* Formulaire Krypton */}
                    <div className="flex justify-center items-center">
                        <div
                            id="myPaymentForm"
                            className={`w-full flex justify-center items-center ${!canPay ? "opacity-50 pointer-events-none" : ""}`}
                        >
                            {canPay ? (
                                <div className="kr-embedded w-full max-w-md space-y-3">
                                    <div className="space-y-1">
                                        <label className="block text-[11px] text-gray-500">Numéro de carte</label>
                                        <div className="kr-pan" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="block text-[11px] text-gray-500">Expiration</label>
                                            <div className="kr-expiry" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[11px] text-gray-500">CVC</label>
                                            <div className="kr-security-code" />
                                        </div>
                                    </div>

                                    <button className="kr-payment-button">Payer {prixGlobal.toFixed(2)} €</button>
                                </div>
                            ) : (
                                <div className="w-full max-w-md flex flex-col items-center justify-center text-center border border-dashed border-gray-300 rounded-xl p-6">
                                    <p className="text-sm text-gray-600">
                                        Le montant minimum de commande est de <strong>500 €</strong>.
                                    </p>
                                    <button
                                        className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-200 text-gray-500 text-sm cursor-not-allowed"
                                        disabled
                                    >
                                        Payer maintenant
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logos */}
                    <div className="flex items-center justify-center">
                        <Image className="mr-5" src="/visa.png" width={40} height={40} alt="alt-visa" />
                        <Image className="mr-5" src="/american-express.png" width={40} height={40} alt="alt-amex" />
                        <Image src="/master-card.png" width={40} height={40} alt="alt-mastercard" />
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        Vos informations sont protégées avec un cryptage SSL.
                    </p>
                </div>
            </div>
        </div>
    );
}

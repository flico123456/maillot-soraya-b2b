import React, { useState } from "react";

export default function Devise() {
    const [currency, setCurrency] = useState<string>("eur");

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCurrency = localStorage.getItem("currency");
            if (storedCurrency) {
                setCurrency(storedCurrency);
            }
        }
    }, []);

    const handleClick = () => {
        if (typeof window !== "undefined") {
            const current = localStorage.getItem("currency") || "eur";
            const next = current === "eur" ? "usd" : "eur";
            localStorage.setItem("currency", next);
            setCurrency(next);
        }
    };

    return (
        <div
            className="flex items-center cursor-pointer"
            onClick={handleClick}
        >
            <img
                src={currency === "eur" ? "/france.png" : "/etats-unis.png"}
                alt={currency === "eur" ? "France" : "USA"}
                className="w-6 h-6 mr-2"
            />
        </div>
    );
}

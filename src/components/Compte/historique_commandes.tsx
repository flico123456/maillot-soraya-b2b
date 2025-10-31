'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApiData } from '@/api/Users/getUserInfo';

type ContenuItem = {
  name?: string;
  sku?: string | number;
  quantity?: number;
  [k: string]: any;
};

type Commande = {
  id: number;
  date: string;
  raison_sociale: string;
  n_tva: string;
  contenu: ContenuItem[] | any;
  [k: string]: any;
  price: string;
};

export default function HistoriqueDesCommandes() {
  const apiData = useApiData();

  const [formData, setFormData] = useState({
    raison_sociale: '',
    vatNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Commande[]>([]);

  // Hydrate formData dès que l’API user est dispo
  useEffect(() => {
    if (!apiData) return;
    setFormData({
      raison_sociale: apiData?.raison_sociale || '',
      vatNumber: apiData?.tva_intracom || '',
    });
  }, [apiData]);

  const nTva = useMemo(() => String(formData.vatNumber || '').trim(), [formData.vatNumber]);

  useEffect(() => {
    if (!nTva) return;

    let aborted = false;
    const API_BASE = 'https://apistock.maillotsoraya-conception.com:3001';

    const parseJsonSafe = <T,>(txt: string): T | null => {
      try { return JSON.parse(txt) as T; } catch { return null; }
    };

    const normalizeRows = (rows: any[]): Commande[] => {
      return rows.map((row) => {
        let contenu = row.contenu;
        if (typeof contenu === 'string') {
          const parsed = parseJsonSafe<any>(contenu);
          if (parsed !== null) contenu = parsed;
        }
        return { ...row, contenu };
      });
    };

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE}/commandes/${encodeURIComponent(nTva)}`;
        const resp = await fetch(url);

        const text = await resp.text();
        console.log('Réponse brute commandes:', resp.status, text);

        if (!resp.ok) {
          if (!aborted) setError(`Erreur API: ${resp.status} ${resp.statusText} — ${text}`);
          return;
        }

        // La route peut renvoyer un tableau OU un objet
        const parsed = parseJsonSafe<any>(text);
        if (parsed == null) {
          if (!aborted) setError('Réponse JSON invalide');
          return;
        }

        const rows: any[] = Array.isArray(parsed) ? parsed : [parsed];
        const normalized = normalizeRows(rows);

        if (!aborted) setOrders(normalized);
      } catch (e: any) {
        if (!aborted) setError(e?.message || 'Erreur réseau');
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchOrders();

    return () => { aborted = true; };
  }, [nTva]);

  return (
    <div className="p-4 space-y-4 [&_details>div]:md:max-h-[48vh] [&_details>div]:md:overflow-auto">
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((c) => {
            const items: any[] = Array.isArray(c.contenu)
              ? c.contenu
              : c.contenu && typeof c.contenu === 'object'
              ? Object.values(c.contenu)
              : [];

            const orderTotal = items.reduce(
              (s, it) => s + Number(it?.quantity ?? it?.qty ?? 1),
              0
            );

            return (
              <details key={c.id} className="rounded-lg border p-3 hover:bg-gray-400/10">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <div className="font-medium">Commande du {new Date(c.date).toLocaleDateString()}</div>
                  <div className="text-sm opacity-70">{Number(c.price).toFixed(2)} €</div>
                </summary>

                <div className="mt-3">
                  {items.length > 0 ? (
                    <>
                      <ul className="space-y-2">
                        {items.map((it: ContenuItem | any, idx: number) => (
                          <li
                            key={it?.sku ?? it?.id ?? idx}
                            className="flex justify-between items-start gap-4"
                          >
                            <div>
                              <div className="font-medium">{it?.name ?? it?.designation ?? 'Produit'}</div>
                              {it?.sku && <div className="text-sm opacity-70">Réf: {it.sku}</div>}
                              {it?.description && <div className="text-sm opacity-70">{it.description}</div>}
                            </div>
                            <div className="text-sm opacity-80">x{it?.quantity ?? it?.qty ?? 1}</div>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t mt-4 text-right text-sm font-medium">
                        Total articles commande : {orderTotal}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm opacity-70">Aucun produit disponible</div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="p-4 text-sm opacity-70">Aucune commande trouvée</div>
      )}

      {loading && <div className="p-4">Chargement…</div>}
      {error && <div className="p-4 text-red-600">Erreur: {error}</div>}
    </div>
  );
}

// pages/api/paiement-accepte.ts
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Gérez le traitement de la validation ici
    const successMessage = 'Validation réussie';

    // Redirigez l'utilisateur vers une autre page
    res.writeHead(302, {
      Location: '/paiement-accepte', // Remplacez '/autre-page' par l'URL souhaitée
    });
    res.end();
  } else {
    const errorMessage = 'Méthode non autorisée. Cette page ne prend en charge que les requêtes POST.';
    res.status(405).send(errorMessage);
  }
};

export default handler;

'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedInDistributeur') === 'true';

    if (!isLoggedIn) {
      router.push("/authentification")
    } 
  }, []);

  return <>{children}</>;
};

export default RequireAuth;

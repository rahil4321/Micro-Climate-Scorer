// src/app/layout.js
import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';


export const metadata = {
  title: 'Real Estate Micro-Climate Scorer',
  description: 'Evaluate environmental factors and natural disaster risks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
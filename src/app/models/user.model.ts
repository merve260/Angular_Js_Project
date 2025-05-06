export interface User {
    id: string;
    name: string;
    avatar: string;
    beschreibung?: string;
    email?: string;
    role: 'admin' | 'user';
  }
  
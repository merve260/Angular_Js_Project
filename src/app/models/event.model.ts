
export interface Event {
  id: string;
  userEmail: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  isPublic: boolean; 
  createdBy: string; 
  participants: string[]; 
  favorite?: boolean;
  raum?: string;
  limit?: number; // Maximale Teilnehmerzahl (optional)
}

  
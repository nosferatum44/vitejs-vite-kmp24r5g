export interface Promise {
  id: string;
  user_id: string;
  title: string;
  description: string;
  deadline: string;
  penalty_amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  charity_id: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
}
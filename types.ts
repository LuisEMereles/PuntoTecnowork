import React from 'react';

export type Role = 'admin' | 'local' | 'client';

export interface Profile {
  id: string;
  email?: string; // Joined from auth.users
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: Role;
  points: number;
  avatar_url?: string;
  manager_id?: string; // For 'local' role
}

export interface Local {
  id: string;
  name: string;
  address: string;
  manager_id?: string;
  has_photo_print: boolean;
  can_edit_prices: boolean;
}

export interface Order {
  id: string;
  client_id: string;
  local_id: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  total_price: number;
  points_earned: number;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  image_url?: string;
  is_active: boolean;
}

// Navigation Item Type
export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}
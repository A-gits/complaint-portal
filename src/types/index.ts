// ─── User & Auth ────────────────────────────────────────────────────────────
export type UserRole = 'client' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
}

export interface AuthUser extends User {
  token: string;
}

// ─── Categories ──────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// ─── Complaints ──────────────────────────────────────────────────────────────
export type ComplaintStatus = 'open' | 'assigned' | 'in_progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
}

export interface Reply {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  clientId: string;
  clientName: string;
  agentId?: string;
  agentName?: string;
  attachments: Attachment[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  categoryId: string;
  priority: ComplaintPriority;
  attachments?: File[];
}

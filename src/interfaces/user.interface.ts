export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role: string;
    gravatarUrl: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: string | null;
    is_online: boolean;
}

export interface User {
    nick: string;
    subnick?: string;
    age?: number;
    email: string;
    friend?: boolean;
    uid: any;
    status?: status;
}

export type status = 'online' | 'offline' | 'busy' | 'away';

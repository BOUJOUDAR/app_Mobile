import { Timestamp } from 'firebase/firestore';

export interface Session {
    id: string; // ABC-123 format
    createdAt: Timestamp;
    status: 'waiting' | 'partner_joined' | 'both_completed' | 'revealed';
    partnerA: {
        name: string;
        partnerName: string;
        answers: string[]; // ['a', 'b', 'c', ...]
        completedAt?: Timestamp;
    };
    partnerB?: {
        name: string;
        answers: string[];
        completedAt?: Timestamp;
    };
    result?: {
        score: number;
        matchingQuestions: number[];
        calculatedAt: Timestamp;
    };
}

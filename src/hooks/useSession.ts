import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { db, rtdb } from '../services/firebase';
import { Session } from '../types';
import { calculateScore } from '../services/scoreCalculator';

const generateSessionId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const nums = '23456789';
    let id = '';
    for (let i = 0; i < 3; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    id += '-';
    for (let i = 0; i < 3; i++) id += nums.charAt(Math.floor(Math.random() * nums.length));
    return id;
};

export const useSession = (sessionId?: string) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isPartnerOnline, setIsPartnerOnline] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial listen to Firestore session
    useEffect(() => {
        if (!sessionId) return;

        const unsub = onSnapshot(doc(db, 'sessions', sessionId), (docSnap) => {
            if (docSnap.exists()) {
                setSession(docSnap.data() as Session);
            }
        });

        return () => unsub();
    }, [sessionId]);

    // Presence logic
    useEffect(() => {
        if (!sessionId) return;

        // Current user presence
        const presenceRef = ref(rtdb, `presence/${sessionId}/partner${session?.partnerB ? 'B' : 'A'}`);
        set(presenceRef, { online: true, lastSeen: serverTimestamp() });
        onDisconnect(presenceRef).set({ online: false, lastSeen: serverTimestamp() });

        // Listen for partner presence
        const partnerKey = session?.partnerB ? 'partnerA' : 'partnerB';
        const partnerPresenceRef = ref(rtdb, `presence/${sessionId}/${partnerKey}`);

        const unsubPresence = onValue(partnerPresenceRef, (snapshot) => {
            const val = snapshot.val();
            setIsPartnerOnline(!!val?.online);
        });

        return () => unsubPresence();
    }, [sessionId, !!session?.partnerB]);

    const createSession = async (name: string, partnerName: string, answers: string[]) => {
        setLoading(true);
        try {
            const id = generateSessionId();
            const newSession: Session = {
                id,
                createdAt: Timestamp.now(),
                status: 'waiting',
                partnerA: {
                    name,
                    partnerName,
                    answers,
                    completedAt: Timestamp.now()
                }
            };

            await setDoc(doc(db, 'sessions', id), newSession);
            return id;
        } catch (e: any) {
            console.error("Create session error", e);
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const joinSessionAsB = async (id: string, name: string, answers: string[]) => {
        setLoading(true);
        try {
            const sessionRef = doc(db, 'sessions', id);
            const snap = await getDoc(sessionRef);

            if (!snap.exists()) {
                throw new Error('Session not found');
            }

            const currentData = snap.data() as Session;

            // Calculate result with matching indices
            const { score, matchingIndices } = calculateScore(currentData.partnerA.answers, answers);

            await updateDoc(sessionRef, {
                partnerB: {
                    name,
                    answers,
                    completedAt: Timestamp.now()
                },
                status: 'both_completed',
                result: {
                    score,
                    matchingQuestions: matchingIndices,
                    calculatedAt: Timestamp.now()
                }
            });

        } catch (e: any) {
            console.error("Join session error", e);
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { session, isPartnerOnline, error, loading, createSession, joinSessionAsB };
};


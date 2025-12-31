import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useSession } from '../hooks/useSession';
import { colors } from '../theme/colors';
import { HeartAnimation } from '../components/HeartAnimation';

export default function WaitingScreen() {
    const params = useLocalSearchParams();
    const [createdSessionId, setCreatedSessionId] = useState<string | null>(params.sessionCode as string || null);
    const requestSent = useRef(false);

    const { session, isPartnerOnline, createSession, joinSessionAsB, loading, error } = useSession(createdSessionId || undefined);

    useEffect(() => {
        const init = async () => {
            if (requestSent.current) return;

            if (params.mode === 'new' && !createdSessionId) {
                requestSent.current = true;
                const answers = JSON.parse(params.answers as string);
                const id = await createSession(params.myName as string, params.partnerName as string, answers);
                setCreatedSessionId(id);
            } else if (params.mode === 'join') {
                requestSent.current = true;
                const answers = JSON.parse(params.answers as string);
                await joinSessionAsB(params.sessionCode as string, params.myName as string, answers);
            }
        };

        init();
    }, []);

    useEffect(() => {
        if (session?.status === 'both_completed' || session?.status === 'revealed') {
            router.replace({
                pathname: '/results',
                params: { sessionId: session.id, score: session.result?.score }
            });
        }
    }, [session]);

    const copyCode = async () => {
        if (createdSessionId) {
            await Clipboard.setStringAsync(createdSessionId);
        }
    };

    const shareCode = async () => {
        if (createdSessionId) {
            try {
                await Share.share({
                    message: `Let's test our compatibility! Join me using code: ${createdSessionId}`,
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <HeartAnimation size={80} />

            <View style={styles.presenceContainer}>
                <View style={[styles.presenceDot, { backgroundColor: isPartnerOnline ? '#4CD964' : '#FF3B30' }]} />
                <Text style={styles.presenceText}>{isPartnerOnline ? 'Partner Online' : 'Partner Offline'}</Text>
            </View>

            <Text style={styles.title}>
                {params.mode === 'new' ? 'Waiting for Partner...' : 'Syncing Results...'}
            </Text>

            {params.mode === 'new' && createdSessionId && (
                <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>SHARE THIS CODE:</Text>
                    <TouchableOpacity onPress={copyCode}>
                        <Text style={styles.code}>{createdSessionId}</Text>
                    </TouchableOpacity>
                    <Text style={styles.hint}>(Tap to copy)</Text>

                    <TouchableOpacity style={styles.shareButton} onPress={shareCode}>
                        <Text style={styles.shareButtonText}>Share Code</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading && <ActivityIndicator size="large" color={colors.primaryPink} style={{ marginTop: 20 }} />}

            <Text style={styles.status}>
                {loading ? 'Processing...' :
                    session?.partnerB ? 'Partner Joined! Calculating...' :
                        params.mode === 'new' ? 'Share the code with your partner' :
                            'Sending your answers...'}
            </Text>


            {error && <Text style={{ color: 'red', marginTop: 20 }}>Error: {error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.deepPurple,
        marginTop: 20,
        marginBottom: 40,
        textAlign: 'center',
    },
    codeContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
        backgroundColor: colors.softPink,
        borderRadius: 20,
        marginBottom: 30,
    },
    codeLabel: {
        fontSize: 14,
        color: colors.deepPurple,
        marginBottom: 10,
        fontWeight: '600',
    },
    code: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.primaryRed,
        letterSpacing: 2,
        textAlign: 'center',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    shareButton: {
        marginTop: 20,
        backgroundColor: colors.primaryPink,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    shareButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    status: {
        marginTop: 20,
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    presenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    presenceDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    presenceText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
});

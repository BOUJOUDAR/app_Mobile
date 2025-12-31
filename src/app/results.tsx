import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring } from 'react-native-reanimated';
import { verdicts, questions } from '../data/questions';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useSession } from '../hooks/useSession';
import { ShareCard } from '../components/ShareCard';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
    const { sessionId, score: scoreParam } = useLocalSearchParams();
    const score = parseInt(scoreParam as string || '0', 10);

    const { session } = useSession(sessionId as string);
    const viewShotRef = useRef(null);

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);

    // Determine verdict
    let verdict = verdicts.veryLow;
    if (score >= 90) verdict = verdicts.excellent;
    else if (score >= 75) verdict = verdicts.great;
    else if (score >= 60) verdict = verdicts.good;
    else if (score >= 45) verdict = verdicts.okay;
    else if (score >= 30) verdict = verdicts.low;

    useEffect(() => {
        scale.value = withSpring(1);
        opacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
    }, []);

    const handleShare = async () => {
        try {
            if (viewShotRef.current) {
                const uri = await captureRef(viewShotRef, {
                    format: 'png',
                    quality: 0.9,
                    result: 'tmpfile'
                });
                await Sharing.shareAsync(uri);
            }
        } catch (error) {
            console.error("Sharing failed", error);
        }
    };

    const animatedCardStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: withTiming(opacity.value === 1 ? 0 : 20) }]
    }));

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.scoreContainer}>
                <Animated.View style={[styles.circle, { borderColor: verdict.color, transform: [{ scale }] }]}>
                    <Text style={[styles.scoreText, { color: verdict.color }]}>{score}%</Text>
                </Animated.View>
            </View>

            <Animated.View style={[styles.card, animatedCardStyle]}>
                <Text style={styles.emoji}>{verdict.emoji}</Text>
                <Text style={[styles.verdictTitle, { color: verdict.color }]}>{verdict.title}</Text>
                <Text style={styles.verdictMessage}>{verdict.message}</Text>

                <View style={styles.divider} />

                <Text style={styles.verdictTitleEn}>{verdict.titleEn}</Text>
                <Text style={styles.verdictMessageEn}>{verdict.messageEn}</Text>
            </Animated.View>

            {session?.result?.matchingQuestions && session.result.matchingQuestions.length > 0 && (
                <View style={styles.matchingContainer}>
                    <Text style={styles.matchingTitle}>Highlights & Common Ground</Text>
                    {session.result.matchingQuestions.slice(0, 3).map((idx) => (
                        <View key={idx} style={styles.matchItem}>
                            <Text style={styles.matchText}>✅ {questions[idx].text}</Text>
                            <Text style={styles.matchTextEn}>{questions[idx].textEn}</Text>
                        </View>
                    ))}
                </View>
            )}

            <TouchableOpacity onPress={handleShare} style={[styles.buttonWrapper, { marginBottom: 16 }]}>
                <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Share Result Image</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/')} style={styles.buttonWrapper}>
                <LinearGradient
                    colors={colors.gradient}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Play Again</Text>
                </LinearGradient>
            </TouchableOpacity>


            {/* Hidden View for Capture */}
            <View style={{ position: 'absolute', left: -10000, top: 0 }}>
                <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
                    <ShareCard
                        score={score}
                        verdict={verdict}
                        partnerAName={session?.partnerA?.name}
                        partnerBName={session?.partnerB?.name}
                    />
                </ViewShot>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 30,
        backgroundColor: colors.white,
        alignItems: 'center',
        paddingTop: 80,
    },
    scoreContainer: {
        marginBottom: 40,
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    scoreText: {
        fontSize: 60,
        fontWeight: 'bold',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 3,
        marginBottom: 30,
    },
    emoji: {
        fontSize: 50,
        marginBottom: 16,
    },
    verdictTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    verdictMessage: {
        fontSize: 18,
        textAlign: 'center',
        color: colors.darkText,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        width: '80%',
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    verdictTitleEn: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    verdictMessageEn: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    buttonWrapper: {
        width: '100%',
        shadowColor: colors.primaryPink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    button: {
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    matchingContainer: {
        width: '100%',
        backgroundColor: colors.softPink,
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },
    matchingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.deepPurple,
        marginBottom: 15,
        textAlign: 'center',
    },
    matchItem: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,107,157,0.2)',
    },
    matchText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.darkText,
    },
    matchTextEn: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
});

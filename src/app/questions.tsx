import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ProgressBar } from '../components/ProgressBar';
import { AnswerButton } from '../components/AnswerButton';
import { questions } from '../data/questions';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function QuestionsScreen() {
    const params = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    // Shared value for question transition
    const fade = useSharedValue(1);

    const currentQuestion = questions[currentIndex];
    const progress = (currentIndex + 1) / questions.length;

    const handleAnswer = (optionId: string) => {
        Haptics.selectionAsync();

        // Save answer
        const newAnswers = [...answers, optionId];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            // Fade out, change index, fade in
            fade.value = withTiming(0, { duration: 200 }, () => {
                // Changing state inside worklet requires runOnJS
                // but since we are just triggering a timeout/state change, we can do it after
            });

            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                fade.value = withTiming(1, { duration: 200 });
            }, 250);
        } else {
            // Finished
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = (finalAnswers: string[]) => {
        router.replace({
            pathname: '/waiting',
            params: {
                ...params,
                answers: JSON.stringify(finalAnswers)
            }
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: fade.value,
        transform: [{ translateY: (1 - fade.value) * 10 }]
    }));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <View style={{ flex: 1 }}>
                        <ProgressBar progress={progress} />
                    </View>
                    <Text style={styles.progressText}>{currentIndex + 1}/{questions.length}</Text>
                </View>
            </View>

            <Animated.View style={[styles.contentWrapper, animatedStyle]}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{currentQuestion.text}</Text>
                    <Text style={styles.translationText}>{currentQuestion.textEn}</Text>
                </View>

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option) => (
                        <AnswerButton
                            key={option.id}
                            text={option.text + (option.textEn ? `\n${option.textEn}` : '')}
                            selected={false}
                            onPress={() => handleAnswer(option.id)}
                        />
                    ))}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        padding: 20,
        paddingTop: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressText: {
        color: colors.primaryPink,
        fontWeight: 'bold',
        minWidth: 40,
    },
    contentWrapper: {
        flex: 1,
    },
    questionContainer: {
        padding: 24,
        minHeight: 180,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.deepPurple,
        marginBottom: 8,
        textAlign: 'center',
    },
    translationText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginBottom: 8,
    },
    optionsContainer: {
        padding: 20,
        marginTop: 10,
    },
});


import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface ProgressBarProps {
    progress: number; // 0 to 1
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const width = useSharedValue(0);

    useEffect(() => {
        width.value = withSpring(progress * 100);
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`,
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.fill, animatedStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 12,
        backgroundColor: '#eee',
        borderRadius: 6,
        overflow: 'hidden',
        width: '100%',
    },
    fill: {
        height: '100%',
        backgroundColor: colors.primaryPink,
        borderRadius: 6,
    },
});

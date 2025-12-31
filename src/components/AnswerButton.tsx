import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface AnswerButtonProps {
    text: string;
    emoji?: string;
    selected: boolean;
    onPress: () => void;
    disabled?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const AnswerButton: React.FC<AnswerButtonProps> = ({ text, emoji, selected, onPress, disabled }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <AnimatedTouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[
                styles.container,
                selected && styles.selectedContainer,
                animatedStyle,
            ]}
        >
            <View style={styles.content}>
                <Text style={[styles.text, selected && styles.selectedText]}>{text}</Text>
                {emoji && <Text style={styles.emoji}>{emoji}</Text>}
            </View>
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 16,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: '#eee',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectedContainer: {
        backgroundColor: colors.softPink,
        borderColor: colors.primaryPink,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,
        color: colors.darkText,
        fontWeight: '600',
        flex: 1,
    },
    selectedText: {
        color: colors.primaryRed,
    },
    emoji: {
        fontSize: 20,
        marginLeft: 8,
    },
});

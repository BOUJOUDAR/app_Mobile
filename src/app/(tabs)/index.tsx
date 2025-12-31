import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartAnimation } from '../../components/HeartAnimation';
import { colors } from '../../theme/colors';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <HeartAnimation size={120} />
                <Text style={styles.title}>Couple Compatibility Test</Text>
                <Text style={styles.subtitle}>Discover your love match! 💘</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.push('/name-entry')}>
                    <LinearGradient
                        colors={colors.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.primaryButton}
                    >
                        <Text style={styles.primaryButtonText}>Start New Test</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/join-session')}
                >
                    <Text style={styles.secondaryButtonText}>Join Partner</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footer}>Made with ❤️ for couples</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'space-between',
        padding: 30,
        paddingTop: 100,
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.deepPurple,
        marginTop: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: colors.primaryPink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primaryPink,
    },
    secondaryButtonText: {
        color: colors.primaryPink,
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        color: '#999',
        marginBottom: 20,
    },
});

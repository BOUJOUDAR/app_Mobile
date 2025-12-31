import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ShareCardProps {
    score: number;
    verdict: any;
    partnerAName?: string;
    partnerBName?: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({ score, verdict, partnerAName, partnerBName }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Couple Compatibility</Text>

            <View style={styles.namesContainer}>
                <Text style={styles.name}>{partnerAName || 'Me'}</Text>
                <Text style={styles.heart}>❤️</Text>
                <Text style={styles.name}>{partnerBName || 'Partner'}</Text>
            </View>

            <View style={[styles.scoreCircle, { borderColor: verdict.color }]}>
                <Text style={[styles.score, { color: verdict.color }]}>{score}%</Text>
            </View>

            <View>
                <Text style={[styles.verdictTitle, { color: verdict.color }]}>{verdict.title}</Text>
                <Text style={styles.verdictMessage}>{verdict.message}</Text>
            </View>

            <Text style={styles.footer}>Get the app & test your love!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 30,
        alignItems: 'center',
        width: 320,
        height: 500,
        justifyContent: 'space-between',
        borderWidth: 5,
        borderColor: colors.primaryPink,
        borderRadius: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.deepPurple,
        marginTop: 10,
    },
    namesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.darkText,
    },
    heart: {
        fontSize: 24,
    },
    scoreCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    score: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    verdictTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    verdictMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
    footer: {
        marginBottom: 10,
        color: '#999',
        fontSize: 14,
        fontWeight: '600',
    },
});

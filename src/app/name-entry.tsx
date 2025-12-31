import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function NameEntryScreen() {
    const [name, setName] = useState('');
    const [partnerName, setPartnerName] = useState('');

    const handleContinue = () => {
        if (!name.trim() || !partnerName.trim()) {
            Alert.alert('Missing Info', 'Please enter both names to continue!');
            return;
        }
        // Navigate to questions with params
        router.push({
            pathname: '/questions',
            params: {
                myName: name.trim(),
                partnerName: partnerName.trim(),
                mode: 'new' // creating a new session
            }
        });
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Who are you?</Text>
                    <Text style={styles.subtitle}>Enter your names to get started.</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Your Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Romeo"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Partner's Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Juliet"
                            value={partnerName}
                            onChangeText={setPartnerName}
                        />
                    </View>

                    <TouchableOpacity onPress={handleContinue} style={styles.buttonWrapper}>
                        <LinearGradient
                            colors={colors.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollContent: {
        padding: 30,
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.deepPurple,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkText,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    buttonWrapper: {
        marginTop: 20,
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
});

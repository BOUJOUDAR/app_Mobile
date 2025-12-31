import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../theme/colors';

export default function JoinSessionScreen() {
    const [sessionCode, setSessionCode] = useState('');
    const [name, setName] = useState('');

    const handleJoin = async () => {
        if (!sessionCode.trim() || !name.trim()) {
            Alert.alert('Missing Info', 'Please enter your name and the session code!');
            return;
        }

        // We would validate session existence here in a real app or in the questions screen
        router.push({
            pathname: '/questions',
            params: {
                myName: name.trim(),
                sessionCode: sessionCode.trim(),
                mode: 'join'
            }
        });
    };

    const pasteCode = async () => {
        const text = await Clipboard.getStringAsync();
        if (text) setSessionCode(text);
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Join Partner</Text>
                    <Text style={styles.subtitle}>Enter the code your partner shared.</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Your Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Juliet"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Session Code</Text>
                        <View style={styles.codeInputContainer}>
                            <TextInput
                                style={[styles.input, styles.codeInput]}
                                placeholder="ABC-123"
                                value={sessionCode}
                                onChangeText={(text) => setSessionCode(text.toUpperCase())}
                                autoCapitalize="characters"
                                maxLength={7}
                            />
                            <TouchableOpacity onPress={pasteCode} style={styles.pasteButton}>
                                <Text style={styles.pasteText}>Paste</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleJoin} style={styles.buttonWrapper}>
                        <LinearGradient
                            colors={colors.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Join Game</Text>
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
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    codeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    codeInput: {
        flex: 1,
        letterSpacing: 2,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    pasteButton: {
        position: 'absolute',
        right: 12,
        padding: 8,
    },
    pasteText: {
        color: colors.primaryPink,
        fontWeight: '600',
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

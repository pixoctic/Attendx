import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UnifiedLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const parsedEmail = email.trim().toLowerCase();

    if (!parsedEmail) {
      Alert.alert('Missing Email', 'Please enter your email to continue.');
      return;
    }

    // Auto-route based on email keyword for the demo
    if (parsedEmail.includes('faculty') || parsedEmail.includes('teacher')) {
      router.replace('/teacher');
    } else if (parsedEmail.includes('admin')) {
      router.replace('/admin');
    } else {
      // Default to student portal
      router.replace('/student');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="qrcode-scan" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.brandTextGroup}>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>AttendX</Text>
              <View style={styles.secureBadge}>
                <Feather name="shield" size={10} color="#059669" />
                <Text style={styles.secureBadgeText}>Encrypted</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>
              Unified Academic & Attendance Portal
            </Text>
          </View>
        </View>

        {/* Login Form Card */}
        <View style={styles.loginCard}>
          <Text style={styles.cardHeading}>Welcome Back</Text>
          <Text style={styles.cardSubheading}>
            Sign in to access your dashboard. Your role will be assigned automatically.
          </Text>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={17} color="#64748B" />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="alex@student.edu"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={17} color="#64748B" />
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.signInBtn}
            onPress={handleLogin}
          >
            <Text style={styles.signInBtnText}>Secure Sign In</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Helper text for testing */}
        <View style={styles.helperBox}>
          <Text style={styles.helperTitle}>Demo Routing Guide:</Text>
          <Text style={styles.helperText}>• Type <Text style={styles.boldText}>alex@student.edu</Text> for Student Portal</Text>
          <Text style={styles.helperText}>• Type <Text style={styles.boldText}>henderson@faculty.edu</Text> for Teacher Portal</Text>
          <Text style={styles.helperText}>• Type <Text style={styles.boldText}>root@admin.edu</Text> for Admin Portal</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTextGroup: {
    flex: 1,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  secureBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeading: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubheading: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  signInBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#109D6D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  helperBox: {
    marginTop: 32,
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helperTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface DeviceResetRequest {
  id: string;
  studentName: string;
  roll: string;
  reason: string;
  oldDevice: string;
  newDevice: string;
  status: 'Pending' | 'Approved';
}

const INITIAL_RESET_REQUESTS: DeviceResetRequest[] = [
  {
    id: 'req-1',
    studentName: 'Arjun Krishnan',
    roll: 'CS-2024-07',
    reason: 'Display replacement / new handset',
    oldDevice: 'UUID-88A1-POCO',
    newDevice: 'UUID-99F4-IQOO',
    status: 'Pending',
  },
  {
    id: 'req-2',
    studentName: 'Neha Thomas',
    roll: 'EC-2024-31',
    reason: 'Factory reset device',
    oldDevice: 'UUID-41C0-SAMS',
    newDevice: 'UUID-77B2-SAMS',
    status: 'Pending',
  },
];

const SECURITY_LOGS = [
  {
    id: 'log-1',
    title: 'Expired QR Token Rejected',
    meta: 'Room 402 • CS-2024-19 attempted scan 18s after rotation',
    time: '10:32 AM',
    severity: 'Warning',
  },
  {
    id: 'log-2',
    title: 'Hardware UUID Mismatch Blocked',
    meta: 'Hall B • Unbound device attempted check-in for CS-2024-07',
    time: '09:14 AM',
    severity: 'Critical',
  },
  {
    id: 'log-3',
    title: 'Campus Wi-Fi Subnet Verified',
    meta: '44/51 students authenticated on AP-BLOCK-B-04',
    time: '09:00 AM',
    severity: 'Safe',
  },
];

export default function AdminPortalScreen() {
  const [requests, setRequests] = useState<DeviceResetRequest[]>(INITIAL_RESET_REQUESTS);

  const handleApproveReset = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    Alert.alert(
      'Hardware UUID Re-bound ✅',
      `New hardware UUID approved and locked for ${name}.`
    );
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== TOP HEADER ==================== */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingText}>System Admin</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADM-ROOT-01</Text>
              </View>
            </View>
            <Text style={styles.subtitleText}>
              AttendX Security & Institution Control
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => router.replace('/')}
          >
            <Feather name="log-out" size={17} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* ==================== INSTITUTION METRICS ==================== */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#ECFDF5' }]}>
              <Feather name="users" size={16} color="#059669" />
            </View>
            <Text style={styles.metricValue}>1,240</Text>
            <Text style={styles.metricLabel}>Active Students</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#EFF6FF' }]}>
              <MaterialCommunityIcons name="qrcode-scan" size={16} color="#2563EB" />
            </View>
            <Text style={styles.metricValue}>84.2%</Text>
            <Text style={styles.metricLabel}>Campus Avg</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: '#F5F3FF' }]}>
              <Feather name="shield" size={16} color="#7C3AED" />
            </View>
            <Text style={styles.metricValue}>{pendingCount}</Text>
            <Text style={styles.metricLabel}>UUID Resets</Text>
          </View>
        </View>

        {/* ==================== HARDWARE UUID RESET QUEUE ==================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>HARDWARE UUID BINDING REQUESTS</Text>
          <Text style={styles.sectionCount}>{pendingCount} Pending</Text>
        </View>

        {requests.map((req) => {
          const isApproved = req.status === 'Approved';
          return (
            <View key={req.id} style={styles.requestCard}>
              <View style={styles.reqTopRow}>
                <View>
                  <Text style={styles.reqStudentName}>
                    {req.studentName} •{' '}
                    <Text style={styles.reqRoll}>{req.roll}</Text>
                  </Text>
                  <Text style={styles.reqReason}>{req.reason}</Text>
                </View>
                <View
                  style={[
                    styles.reqStatusPill,
                    isApproved && { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
                  ]}
                >
                  <Text
                    style={[
                      styles.reqStatusText,
                      isApproved && { color: '#047857' },
                    ]}
                  >
                    {req.status}
                  </Text>
                </View>
              </View>

              <View style={styles.uuidComparisonRow}>
                <Text style={styles.uuidChip}>{req.oldDevice}</Text>
                <Feather name="arrow-right" size={13} color="#94A3B8" />
                <Text style={[styles.uuidChip, { color: '#7C3AED' }]}>
                  {req.newDevice}
                </Text>
              </View>

              {!isApproved && (
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApproveReset(req.id, req.studentName)}
                >
                  <Feather name="check-circle" size={15} color="#FFFFFF" />
                  <Text style={styles.approveBtnText}>
                    Approve & Bind New Hardware UUID
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* ==================== ANTI-PROXY SECURITY AUDIT LOGS ==================== */}
        <View style={[styles.sectionHeaderRow, { marginTop: 14 }]}>
          <Text style={styles.sectionTitle}>ANTI-PROXY SECURITY AUDIT</Text>
          <Text style={styles.sectionCount}>Live Feed</Text>
        </View>

        {SECURITY_LOGS.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View
              style={[
                styles.logIconBox,
                log.severity === 'Critical'
                  ? { backgroundColor: '#FEF2F2' }
                  : log.severity === 'Warning'
                  ? { backgroundColor: '#FFFBEB' }
                  : { backgroundColor: '#ECFDF5' },
              ]}
            >
              <Feather
                name={
                  log.severity === 'Critical'
                    ? 'slash'
                    : log.severity === 'Warning'
                    ? 'clock'
                    : 'wifi'
                }
                size={16}
                color={
                  log.severity === 'Critical'
                    ? '#DC2626'
                    : log.severity === 'Warning'
                    ? '#D97706'
                    : '#059669'
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.logTopLine}>
                <Text style={styles.logTitle}>{log.title}</Text>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
              <Text style={styles.logMeta}>{log.meta}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
  },
  adminBadge: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  subtitleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  logoutBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.7,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 12,
  },
  reqTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reqStudentName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  reqRoll: {
    color: '#64748B',
    fontWeight: '700',
  },
  reqReason: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  reqStatusPill: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  reqStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  uuidComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  uuidChip: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  approveBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  logIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  logTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  logMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
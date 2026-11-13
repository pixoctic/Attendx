import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface StudentRecord {
  id: string;
  name: string;
  roll: string;
  status: 'Present' | 'Absent';
  time: string;
  uuidVerified: boolean;
  overallPct: number;
}

const INITIAL_ROSTER: StudentRecord[] = [
  { id: '1', name: 'Alex', roll: 'CS-2024-88', status: 'Present', time: '10:29 AM', uuidVerified: true, overallPct: 86.4 },
  { id: '2', name: 'Priya Nair', roll: 'CS-2024-42', status: 'Present', time: '10:30 AM', uuidVerified: true, overallPct: 92.0 },
  { id: '3', name: 'Rahul Menon', roll: 'CS-2024-19', status: 'Absent', time: '--:--', uuidVerified: true, overallPct: 71.2 },
  { id: '4', name: 'Sneha Varghese', roll: 'CS-2024-64', status: 'Present', time: '10:31 AM', uuidVerified: true, overallPct: 88.5 },
  { id: '5', name: 'Arjun Krishnan', roll: 'CS-2024-07', status: 'Absent', time: '--:--', uuidVerified: false, overallPct: 68.4 },
  { id: '6', name: 'Meera Das', roll: 'CS-2024-53', status: 'Present', time: '10:31 AM', uuidVerified: true, overallPct: 81.0 },
];

export default function TeacherPortalScreen() {
  const [activeTab, setActiveTab] = useState<'Session' | 'Roster' | 'Alerts'>('Session');
  const [sessionActive, setSessionActive] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [tokenSeed, setTokenSeed] = useState(9981);
  const [roster, setRoster] = useState<StudentRecord[]>(INITIAL_ROSTER);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');

  // Rotate QR token every 15 seconds
  useEffect(() => {
    if (!sessionActive) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTokenSeed(Math.floor(1000 + Math.random() * 9000));
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionActive]);

  const toggleStudentAttendance = (id: string) => {
    setRoster((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;
        const nextStatus = student.status === 'Present' ? 'Absent' : 'Present';
        return {
          ...student,
          status: nextStatus,
          time: nextStatus === 'Present' ? 'Manual' : '--:--',
        };
      })
    );
  };

  const presentCount = roster.filter((s) => s.status === 'Present').length;
  const lowAttendanceList = roster.filter((s) => s.overallPct < 75);

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
              <Text style={styles.greetingText}>Prof. Henderson</Text>
              <View style={styles.facultyBadge}>
                <Text style={styles.facultyBadgeText}>FAC-CS-104</Text>
              </View>
            </View>
            <Text style={styles.subtitleText}>
              Department of Computer Science • Sem 4
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => router.replace('/')}
          >
            <Feather name="log-out" size={17} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* ==================== SEGMENTED NAVIGATION ==================== */}
        <View style={styles.tabRow}>
          {(['Session', 'Roster', 'Alerts'] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                  {tab === 'Session'
                    ? 'Live QR'
                    : tab === 'Roster'
                    ? `Roster (${presentCount}/${roster.length})`
                    : `At Risk (${lowAttendanceList.length})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ==================== TAB 1: LIVE QR PROJECTOR ==================== */}
        {activeTab === 'Session' && (
          <>
            <View style={styles.qrProjectorCard}>
              <View style={styles.qrCardTopRow}>
                <View>
                  <Text style={styles.courseTag}>CS-201 • HALL B (ROOM 402)</Text>
                  <Text style={styles.courseMainTitle}>
                    Data Structures & Algorithms
                  </Text>
                </View>
                <View
                  style={[
                    styles.livePill,
                    !sessionActive && { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
                  ]}
                >
                  <View
                    style={[
                      styles.liveDot,
                      !sessionActive && { backgroundColor: '#DC2626' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.livePillText,
                      !sessionActive && { color: '#DC2626' },
                    ]}
                  >
                    {sessionActive ? 'Broadcasting' : 'Paused'}
                  </Text>
                </View>
              </View>

              {/* Dynamic Rotating QR Box */}
              <View style={styles.qrDisplayBox}>
                <MaterialCommunityIcons
                  name="qrcode"
                  size={156}
                  color={sessionActive ? '#0F172A' : '#94A3B8'}
                />
                <View style={styles.tokenOverlayPill}>
                  <Feather name="shield" size={12} color="#2563EB" />
                  <Text style={styles.tokenText}>
                    ATTENDX-CS201-SESSION-{tokenSeed}
                  </Text>
                </View>
              </View>

              {/* Countdown Bar */}
              <View style={styles.rotationRow}>
                <Text style={styles.rotationLabel}>
                  Rotating anti-proxy token in
                </Text>
                <Text style={styles.rotationTimer}>{countdown}s</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(countdown / 15) * 100}%` },
                  ]}
                />
              </View>

              {/* Controls */}
              <View style={styles.qrActionsRow}>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => {
                    setTokenSeed(Math.floor(1000 + Math.random() * 9000));
                    setCountdown(15);
                  }}
                >
                  <Feather name="refresh-cw" size={15} color="#2563EB" />
                  <Text style={styles.secondaryBtnText}>Rotate Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    !sessionActive && { backgroundColor: '#059669' },
                  ]}
                  onPress={() => setSessionActive(!sessionActive)}
                >
                  <Feather
                    name={sessionActive ? 'pause' : 'play'}
                    size={15}
                    color="#FFFFFF"
                  />
                  <Text style={styles.primaryBtnText}>
                    {sessionActive ? 'Freeze QR' : 'Resume QR'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Live Stats Summary */}
            <View style={styles.statsGrid}>
              <View style={styles.statMiniCard}>
                <Text style={styles.statMiniLabel}>Checked In</Text>
                <Text style={[styles.statMiniVal, { color: '#059669' }]}>
                  {presentCount} / {roster.length}
                </Text>
                <Text style={styles.statMiniSub}>Wi-Fi & UUID Verified</Text>
              </View>

              <View style={styles.statMiniCard}>
                <Text style={styles.statMiniLabel}>Quick Action</Text>
                <TouchableOpacity
                  style={styles.postAssignBtn}
                  onPress={() => setAssignmentModal(true)}
                >
                  <Feather name="plus-circle" size={15} color="#FFFFFF" />
                  <Text style={styles.postAssignBtnText}>Post Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* ==================== TAB 2: LIVE CLASS ROSTER ==================== */}
        {activeTab === 'Roster' && (
          <View style={styles.sectionList}>
            <Text style={styles.helperBanner}>
              Tap any student row to manually override Present / Absent status.
            </Text>

            {roster.map((student) => {
              const isPresent = student.status === 'Present';
              return (
                <TouchableOpacity
                  key={student.id}
                  activeOpacity={0.85}
                  style={styles.studentRowCard}
                  onPress={() => toggleStudentAttendance(student.id)}
                >
                  <View style={styles.studentLeft}>
                    <View
                      style={[
                        styles.studentAvatar,
                        { backgroundColor: isPresent ? '#DBEAFE' : '#FEE2E2' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.studentAvatarText,
                          { color: isPresent ? '#1D4ED8' : '#DC2626' },
                        ]}
                      >
                        {student.name.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.studentNameRow}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentRoll}>{student.roll}</Text>
                      </View>
                      <Text style={styles.studentMeta}>
                        {student.uuidVerified
                          ? `UUID Verified • ${student.time}`
                          : 'Hardware Lock Pending'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      isPresent ? styles.statusPresent : styles.statusAbsent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: isPresent ? '#047857' : '#DC2626' },
                      ]}
                    >
                      {student.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ==================== TAB 3: AT-RISK (<75%) ALERTS ==================== */}
        {activeTab === 'Alerts' && (
          <View style={styles.sectionList}>
            {lowAttendanceList.map((student) => (
              <View key={student.id} style={styles.studentRowCard}>
                <View style={styles.studentLeft}>
                  <View style={[styles.studentAvatar, { backgroundColor: '#FEF3C7' }]}>
                    <Feather name="alert-triangle" size={16} color="#D97706" />
                  </View>
                  <View>
                    <Text style={styles.studentName}>
                      {student.name} ({student.roll})
                    </Text>
                    <Text style={[styles.studentMeta, { color: '#DC2626', fontWeight: '700' }]}>
                      Semester Attendance: {student.overallPct}% (Below 75%)
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.notifyBtn}
                  onPress={() =>
                    Alert.alert(
                      'Warning Sent',
                      `Attendance shortage alert sent to ${student.name} (${student.roll}).`
                    )
                  }
                >
                  <Text style={styles.notifyBtnText}>Ping</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ==================== POST ASSIGNMENT MODAL ==================== */}
      <Modal
        visible={assignmentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setAssignmentModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Class Assignment</Text>
            <Text style={styles.modalSub}>
              Broadcasts immediately to Sem 4 Student Portals
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Binary Trees Lab Report"
              placeholderTextColor="#94A3B8"
              value={assignmentTitle}
              onChangeText={setAssignmentTitle}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setAssignmentModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmit}
                onPress={() => {
                  setAssignmentModal(false);
                  setAssignmentTitle('');
                  Alert.alert('Published ✅', 'Assignment posted to all Sem 4 students.');
                }}
              >
                <Text style={styles.modalSubmitText}>Publish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  facultyBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  facultyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
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
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  qrProjectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  qrCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.6,
  },
  courseMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  livePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  qrDisplayBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  tokenOverlayPill: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  tokenText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  rotationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rotationLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  rotationTimer: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  qrActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    gap: 6,
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statMiniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'space-between',
  },
  statMiniLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  statMiniVal: {
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4,
  },
  statMiniSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  postAssignBtn: {
    marginTop: 8,
    backgroundColor: '#109D6D',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  postAssignBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionList: {
    gap: 10,
  },
  helperBanner: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  studentRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  studentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  studentRoll: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  studentMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPresent: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusAbsent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  notifyBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  notifyBtnText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '700',
  },
  modalSubmit: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
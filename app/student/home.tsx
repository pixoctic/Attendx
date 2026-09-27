import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [scheduleTab, setScheduleTab] = useState("Today's Schedule");

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Top Bar & Profile */}
      <View style={styles.homeHeader}>
        <View>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingTitle}>Hello, Alex</Text>
            <View style={styles.studentIdBadge}>
              <Text style={styles.studentIdText}>CS-2024-88</Text>
            </View>
          </View>
          <Text style={styles.greetingSubtitle}>Here's your academic pulse today</Text>
        </View>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>AL</Text>
            </View>
          </View>
          <View style={styles.notificationDot} />
        </View>
      </View>

      {/* Segmented Toggle */}
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, scheduleTab === "Today's Schedule" && styles.segmentBtnActive]}
          onPress={() => setScheduleTab("Today's Schedule")}
        >
          <Text style={[styles.segmentText, scheduleTab === "Today's Schedule" && styles.segmentTextActive]}>
            Today's Schedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, scheduleTab === 'Weekly Outlook' && styles.segmentBtnActive]}
          onPress={() => setScheduleTab('Weekly Outlook')}
        >
          <Text style={[styles.segmentText, scheduleTab === 'Weekly Outlook' && styles.segmentTextActive]}>
            Weekly Outlook
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Attendance Card */}
      <View style={styles.homeHeroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.homeHeroLabel}>OVERALL ATTENDANCE</Text>
          <View style={styles.safeZoneBadge}>
            <View style={styles.safeZoneDot} />
            <Text style={styles.safeZoneText}>Safe Zone (≥75%)</Text>
          </View>
        </View>

        <View style={styles.heroPercentageRow}>
          <Text style={styles.homeHeroPercentage}>86.4%</Text>
          <Text style={styles.homeHeroTrend}>+2.1% this month</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.heroStatsRow}>
          <View style={styles.statItem}>
            <View style={styles.homeIconBox}>
              <Feather name="check" size={16} color="#A7F3D0" />
            </View>
            <View>
              <Text style={styles.statLabel}>Classes Attended</Text>
              <Text style={styles.statValue}>44 / 51</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.homeIconBox}>
              <Feather name="alert-triangle" size={15} color="#A7F3D0" />
            </View>
            <View>
              <Text style={styles.statLabel}>Safe Misses</Text>
              <Text style={styles.statValue}>5 Lectures Left</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick QR Scan Trigger */}
      <TouchableOpacity
        style={styles.qrTriggerCard}
        activeOpacity={0.85}
        onPress={() => router.push('/student/scanner')}
      >
        <View style={styles.qrTriggerLeft}>
          <View style={styles.qrIconBox}>
            <MaterialCommunityIcons name="qrcode-scan" size={22} color="#109D6D" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.qrTitleRow}>
              <Text style={styles.qrTriggerTitle}>Scan Classroom QR</Text>
              <View style={styles.pingDot} />
            </View>
            <Text style={styles.qrTriggerSubtitle}>Room 402 • Data Structures starting in 10m</Text>
          </View>
        </View>
        <View style={styles.qrArrowBtn}>
          <Feather name="chevron-right" size={18} color="#FFF" />
        </View>
      </TouchableOpacity>

      {/* Next Activities List */}
      <View style={styles.activitiesHeader}>
        <Text style={styles.activitiesTitle}>NEXT ACTIVITIES</Text>
        <TouchableOpacity>
          <Text style={styles.viewScheduleLink}>View Schedule</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activityCard}>
        <View style={styles.activityLeft}>
          <View style={styles.activityIconCode}>
            <Feather name="code" size={18} color="#109D6D" />
          </View>
          <View>
            <Text style={styles.activityItemTitle}>Data Structures & Algorithms</Text>
            <Text style={styles.activityItemSub}>Prof. Henderson • Hall B</Text>
          </View>
        </View>
        <View style={styles.timeBadgeGreen}>
          <Text style={styles.timeBadgeGreenText}>10:30 AM</Text>
        </View>
      </View>

      <View style={styles.activityCard}>
        <View style={styles.activityLeft}>
          <View style={styles.activityIconTask}>
            <Feather name="clipboard" size={18} color="#D97706" />
          </View>
          <View>
            <View style={styles.urgentRow}>
              <Text style={styles.activityItemTitle}>OS Process Scheduling</Text>
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>Urgent</Text>
              </View>
            </View>
            <Text style={styles.activityItemSub}>Assignment 4 • Operating Systems</Text>
          </View>
        </View>
        <View style={styles.timeBadgeSlate}>
          <Text style={styles.timeBadgeSlateText}>Tomorrow</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 18, paddingBottom: 140 },
  homeHeader: { marginTop: 40, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greetingTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' },
  studentIdBadge: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  studentIdText: { fontSize: 11, fontWeight: '600', color: '#047857' },
  greetingSubtitle: { fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: '500' },

  avatarWrapper: { position: 'relative' },
  avatarBorder: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#109D6D', padding: 2 },
  avatarInner: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: 'bold', color: '#0D7E57' },
  notificationDot: { position: 'absolute', top: -1, right: -1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF' },

  segmentedContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 16, padding: 4, marginBottom: 16 },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12 },
  segmentBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  segmentText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  segmentTextActive: { color: '#0F172A', fontWeight: '700' },

  homeHeroCard: { backgroundColor: '#0E8A60', borderRadius: 24, padding: 22, marginBottom: 16, shadowColor: '#109D6D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 5 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  homeHeroLabel: { color: '#D1FAE5', fontSize: 11, fontWeight: '600', letterSpacing: 0.6 },
  safeZoneBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.25)', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  safeZoneDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6EE7B7', marginRight: 6 },
  safeZoneText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  heroPercentageRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  homeHeroPercentage: { fontSize: 38, fontWeight: '800', color: '#FFF' },
  homeHeroTrend: { fontSize: 12, fontWeight: '500', color: '#D1FAE5', marginLeft: 8 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16 },
  heroStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  homeIconBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  statLabel: { color: '#EAF6F0', fontSize: 11 },
  statValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  qrTriggerCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#D1FAE5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  qrTriggerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  qrIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  qrTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qrTriggerTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  pingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  qrTriggerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  qrArrowBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#109D6D', alignItems: 'center', justifyContent: 'center' },

  activitiesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  activitiesTitle: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.8 },
  viewScheduleLink: { fontSize: 12, fontWeight: '600', color: '#109D6D' },

  activityCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  activityLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  activityIconCode: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  activityIconTask: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  activityItemTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  activityItemSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  urgentRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  urgentBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  urgentBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#DC2626' },
  timeBadgeGreen: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  timeBadgeGreenText: { fontSize: 12, fontWeight: 'bold', color: '#0D7E57' },
  timeBadgeSlate: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  timeBadgeSlateText: { fontSize: 12, fontWeight: '600', color: '#475569' },
});
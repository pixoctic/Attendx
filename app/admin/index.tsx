import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// --- MOCK DATA & TYPES ---
type UserRole = 'Student' | 'Faculty';
type AcademicYear = 'Year 1' | 'Year 2' | 'Year 3' | 'All';

interface UserRecord {
  id: string;
  name: string;
  role: UserRole;
  rollOrId: string;
  department: string;
  year?: string;
  semester?: string;
  status: 'Active' | 'Pending' | 'Revoked';
  classTeacherOf?: string;
  deviceUUID: string;
  attendancePct?: number; // Added for HOD shortage checks
}

interface LeaveRequest {
  id: string;
  name: string;
  roll: string;
  type: 'Medical' | 'Blood Donation' | 'Sports' | 'Arts';
  dates: string;
  status: 'Pending' | 'Approved';
}

const MOCK_DIRECTORY: UserRecord[] = [
  { id: 'u1', name: 'Kalidas S.', role: 'Student', rollOrId: 'CS-2024-19', department: 'Computer Eng.', year: 'Year 3', semester: 'Sem 6', status: 'Active', deviceUUID: 'UUID-99A1', attendancePct: 88.5 },
  { id: 'u2', name: 'Alex M.', role: 'Student', rollOrId: 'CS-2024-88', department: 'Computer Eng.', year: 'Year 2', semester: 'Sem 4', status: 'Pending', deviceUUID: 'UNBOUND', attendancePct: 86.4 },
  { id: 'u3', name: 'Arjun Krishnan', role: 'Student', rollOrId: 'CS-2024-07', department: 'Computer Eng.', year: 'Year 2', semester: 'Sem 4', status: 'Active', deviceUUID: 'UUID-44B2', attendancePct: 68.4 },
  { id: 'u4', name: 'Prof. Henderson', role: 'Faculty', rollOrId: 'FAC-CS-104', department: 'Computer Eng.', status: 'Active', classTeacherOf: 'Year 2 (Sem 4)', deviceUUID: 'UUID-FAC1' },
  { id: 'u5', name: 'Dr. Aris Vance', role: 'Faculty', rollOrId: 'FAC-EC-201', department: 'Electronics', status: 'Active', deviceUUID: 'UUID-FAC2' },
];

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: 'lv-1', name: 'Rahul Menon', roll: 'CS-2024-42', type: 'Blood Donation', dates: '12 Nov 2026', status: 'Pending' },
  { id: 'lv-2', name: 'Sneha Varghese', roll: 'CS-2024-64', type: 'Sports', dates: '10 Nov - 11 Nov (Inter-Poly)', status: 'Pending' },
  { id: 'lv-3', name: 'Meera Das', roll: 'CS-2024-53', type: 'Medical', dates: '05 Nov - 08 Nov (Viral Fever)', status: 'Pending' },
];

const SECURITY_LOGS = [
  { id: 'log-1', type: 'Anti-Proxy', meta: 'CS-2024-88 failed UUID check in Room 402', time: '10:32 AM', severity: 'Critical' },
  { id: 'log-2', type: 'Manual Override', meta: 'Prof. Henderson manually marked 4 students Present', time: '10:15 AM', severity: 'Warning' },
  { id: 'log-3', type: 'Assignment', meta: 'Dr. Vance pushed OS Lab Report to Year 2 Group', time: '09:45 AM', severity: 'Info' },
];

export default function AdminPortalScreen() {
  const [activeTab, setActiveTab] = useState<'Security' | 'Directory' | 'Academics'>('Security');
  
  // Directory State
  const [searchQuery, setSearchQuery] = useState('');
  const [dirFilter, setDirFilter] = useState<UserRole>('Student');
  const [yearFilter, setYearFilter] = useState<AcademicYear>('All');
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [pushModalVisible, setPushModalVisible] = useState(false);
  const [pushMessage, setPushMessage] = useState('');

  // Queues
  const [resetQueue, setResetQueue] = useState([
    { id: 'req-1', name: 'Alex M.', roll: 'CS-2024-88', reason: 'Phone repaired / Factory reset' }
  ]);
  const [leaveQueue, setLeaveQueue] = useState<LeaveRequest[]>(INITIAL_LEAVES);

  // --- HANDLERS ---
  const handleUnpairDevice = (id: string, name: string) => {
    setResetQueue((prev) => prev.filter((r) => r.id !== id));
    Alert.alert('Hardware Unpaired ✅', `Device UUID lock removed for ${name}. They can now log in with a new device.`);
  };

  const handleApproveLeave = (id: string, name: string, type: string) => {
    setLeaveQueue((prev) => prev.map((r) => r.id === id ? { ...r, status: 'Approved' } : r));
    Alert.alert('OD/Leave Approved', `Attendance override granted for ${name} (${type}). Registers will be updated automatically.`);
  };

  const handleStatusChange = (status: 'Active' | 'Revoked') => {
    if (!selectedUser) return;
    Alert.alert(`Access ${status}`, `${selectedUser.name}'s portal access has been ${status.toLowerCase()}.`);
    setSelectedUser({ ...selectedUser, status });
  };

  const handleBulkAction = (action: 'Promote' | 'CSV') => {
    if (action === 'Promote') {
      Alert.alert('Semester Promotion', 'This will promote all active batches to the next semester and archive current attendance logs. Proceed?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Promote Batches', style: 'destructive' }
      ]);
    } else {
      Alert.alert('CSV Import', 'Select a CSV file to bulk import new First-Year admissions and map them to the database.');
    }
  };

  // --- FILTERING ---
  const filteredDirectory = MOCK_DIRECTORY.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.rollOrId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = u.role === dirFilter;
    const matchesYear = yearFilter === 'All' || u.year === yearFilter;
    return matchesSearch && matchesRole && (dirFilter === 'Faculty' ? true : matchesYear);
  });

  const shortageList = MOCK_DIRECTORY.filter(u => u.role === 'Student' && (u.attendancePct || 100) < 75);
  const pendingLeaves = leaveQueue.filter(l => l.status === 'Pending');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ==================== HOD HEADER ==================== */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingText}>HOD Dashboard</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>HOD-CS</Text>
              </View>
            </View>
            <Text style={styles.subtitleText}>Department of Computer Engineering</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
            <Feather name="log-out" size={17} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* ==================== MAIN TABS ==================== */}
        <View style={styles.tabContainer}>
          {(['Security', 'Directory', 'Academics'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ==================== TAB 1: SECURITY & DASHBOARD ==================== */}
        {activeTab === 'Security' && (
          <View style={styles.section}>
            
            {/* Device Unpairing Queue */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>DEVICE UNPAIRING REQUESTS</Text>
              <Text style={styles.sectionCount}>{resetQueue.length} Pending</Text>
            </View>
            {resetQueue.length === 0 ? (
              <Text style={styles.emptyText}>No pending hardware reset requests.</Text>
            ) : (
              resetQueue.map((req) => (
                <View key={req.id} style={styles.card}>
                  <View style={styles.reqTopRow}>
                    <View>
                      <Text style={styles.reqStudentName}>{req.name} • <Text style={styles.reqRoll}>{req.roll}</Text></Text>
                      <Text style={styles.reqReason}>Reason: {req.reason}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleUnpairDevice(req.id, req.name)}>
                    <Feather name="unlock" size={15} color="#FFFFFF" />
                    <Text style={styles.approveBtnText}>Approve & Unpair Device</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {/* Suspicious Activities Log */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>SUSPICIOUS ACTIVITIES & SYSTEM LOGS</Text>
            </View>
            {SECURITY_LOGS.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={[styles.logIconBox, log.severity === 'Critical' ? { backgroundColor: '#FEF2F2' } : log.severity === 'Warning' ? { backgroundColor: '#FFFBEB' } : { backgroundColor: '#EFF6FF' }]}>
                  <Feather name={log.severity === 'Critical' ? 'alert-triangle' : log.severity === 'Warning' ? 'edit-2' : 'file-text'} size={16} color={log.severity === 'Critical' ? '#DC2626' : log.severity === 'Warning' ? '#D97706' : '#2563EB'} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.logTopLine}>
                    <Text style={styles.logTitle}>{log.type}</Text>
                    <Text style={styles.logTime}>{log.time}</Text>
                  </View>
                  <Text style={styles.logMeta}>{log.meta}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ==================== TAB 2: DIRECTORY ==================== */}
        {activeTab === 'Directory' && (
          <View style={styles.section}>
            
            {/* Bulk Actions (HOD Exclusive) */}
            <View style={styles.bulkActionsRow}>
              <TouchableOpacity style={styles.bulkBtn} onPress={() => handleBulkAction('CSV')}>
                <Feather name="upload-cloud" size={16} color="#7C3AED" />
                <Text style={styles.bulkBtnText}>CSV Import</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bulkBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]} onPress={() => handleBulkAction('Promote')}>
                <Feather name="chevrons-up" size={16} color="#DC2626" />
                <Text style={[styles.bulkBtnText, { color: '#DC2626' }]}>Semester Promote</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchWrapper}>
              <Feather name="search" size={18} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, roll no, or ID..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Role & Year Filters */}
            <View style={styles.filterRow}>
              <View style={styles.roleToggleGroup}>
                <TouchableOpacity style={[styles.roleToggleBtn, dirFilter === 'Student' && styles.roleToggleBtnActive]} onPress={() => setDirFilter('Student')}>
                  <Text style={[styles.roleToggleText, dirFilter === 'Student' && styles.roleToggleTextActive]}>Students</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.roleToggleBtn, dirFilter === 'Faculty' && styles.roleToggleBtnActive]} onPress={() => setDirFilter('Faculty')}>
                  <Text style={[styles.roleToggleText, dirFilter === 'Faculty' && styles.roleToggleTextActive]}>Faculty</Text>
                </TouchableOpacity>
              </View>

              {dirFilter === 'Faculty' && (
                <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Add Faculty', 'Open Faculty Registration Form')}>
                  <Feather name="plus" size={14} color="#FFFFFF" />
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>

            {dirFilter === 'Student' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearScroll}>
                {(['All', 'Year 1', 'Year 2', 'Year 3'] as AcademicYear[]).map((y) => (
                  <TouchableOpacity key={y} style={[styles.yearChip, yearFilter === y && styles.yearChipActive]} onPress={() => setYearFilter(y)}>
                    <Text style={[styles.yearChipText, yearFilter === y && styles.yearChipTextActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Directory List */}
            {filteredDirectory.map((user) => (
              <TouchableOpacity key={user.id} activeOpacity={0.7} style={styles.userCard} onPress={() => setSelectedUser(user)}>
                <View style={styles.userCardLeft}>
                  <View style={[styles.avatarBox, { backgroundColor: user.role === 'Faculty' ? '#EFF6FF' : '#F5F3FF' }]}>
                    <Text style={[styles.avatarText, { color: user.role === 'Faculty' ? '#2563EB' : '#7C3AED' }]}>{user.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userMeta}>
                      {user.rollOrId} {user.year ? `• ${user.year} (${user.semester})` : ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusPill, user.status === 'Active' ? styles.statusActive : user.status === 'Revoked' ? styles.statusRevoked : styles.statusPending]}>
                  <Text style={[styles.statusPillText, user.status === 'Active' ? styles.statusActiveText : user.status === 'Revoked' ? styles.statusRevokedText : styles.statusPendingText]}>
                    {user.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ==================== TAB 3: ACADEMICS & OD ==================== */}
        {activeTab === 'Academics' && (
          <View style={styles.section}>
            
            {/* Global Broadcast */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Global Push Notification</Text>
              <Text style={styles.cardSub}>Broadcast to all CS Department students and faculty</Text>
              <TouchableOpacity style={styles.pushBtn} onPress={() => setPushModalVisible(true)}>
                <Feather name="bell" size={16} color="#FFFFFF" />
                <Text style={styles.pushBtnText}>Compose Broadcast</Text>
              </TouchableOpacity>
            </View>

            {/* Manual Override & Leave Approvals */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>ON-DUTY (OD) & LEAVE QUEUE</Text>
              <Text style={styles.sectionCount}>{pendingLeaves.length} Pending</Text>
            </View>
            {pendingLeaves.length === 0 ? (
              <Text style={styles.emptyText}>No pending OD or Medical requests.</Text>
            ) : (
              pendingLeaves.map((lv) => (
                <View key={lv.id} style={styles.card}>
                  <View style={styles.reqTopRow}>
                    <View>
                      <Text style={styles.reqStudentName}>{lv.name} • <Text style={styles.reqRoll}>{lv.roll}</Text></Text>
                      <Text style={[styles.reqReason, { fontWeight: '700', color: '#0F172A', marginTop: 4 }]}>
                        Reason: {lv.type}
                      </Text>
                      <Text style={styles.reqReason}>Dates: {lv.dates}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproveLeave(lv.id, lv.name, lv.type)}>
                    <Feather name="check-circle" size={15} color="#FFFFFF" />
                    <Text style={styles.approveBtnText}>Approve & Override Attendance</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {/* End of Sem Shortage List */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={[styles.sectionTitle, { color: '#DC2626' }]}>ATTENDANCE SHORTAGE (&lt;75%)</Text>
              <Text style={[styles.sectionCount, { color: '#DC2626' }]}>{shortageList.length} Students</Text>
            </View>
            {shortageList.map(student => (
              <View key={student.id} style={[styles.userCard, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}>
                <View style={styles.userCardLeft}>
                  <View style={[styles.avatarBox, { backgroundColor: '#FFFFFF' }]}>
                    <Feather name="alert-triangle" size={16} color="#DC2626" />
                  </View>
                  <View>
                    <Text style={styles.userName}>{student.name}</Text>
                    <Text style={styles.userMeta}>{student.rollOrId} • {student.year}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#DC2626' }}>{student.attendancePct}%</Text>
              </View>
            ))}

          </View>
        )}
      </ScrollView>

      {/* ==================== USER DETAILS MODAL ==================== */}
      <Modal visible={!!selectedUser} transparent animationType="slide" onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedUser.name}</Text>
                    <Text style={styles.modalSub}>{selectedUser.rollOrId} • {selectedUser.department}</Text>
                  </View>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedUser(null)}>
                    <Feather name="x" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Role</Text>
                    <Text style={styles.detailValue}>{selectedUser.role}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={styles.detailValue}>{selectedUser.status}</Text>
                  </View>
                  {selectedUser.year && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Academic Year</Text>
                      <Text style={styles.detailValue}>{selectedUser.year} • {selectedUser.semester}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Bound Device UUID</Text>
                    <Text style={styles.detailValue}>{selectedUser.deviceUUID}</Text>
                  </View>
                </View>

                {selectedUser.role === 'Faculty' && (
                  <View style={styles.actionGroup}>
                    <Text style={styles.detailLabel}>Class Teacher Assignment</Text>
                    <TouchableOpacity style={styles.outlineBtn} onPress={() => Alert.alert('Assign Class', 'Select Year and Semester to assign as Class Teacher.')}>
                      <Feather name="users" size={15} color="#2563EB" />
                      <Text style={styles.outlineBtnText}>
                        {selectedUser.classTeacherOf ? `Reassign (Current: ${selectedUser.classTeacherOf})` : 'Assign Class Teacher'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.actionGroup}>
                  <Text style={styles.detailLabel}>Administrative Actions</Text>
                  <TouchableOpacity style={styles.outlineBtn} onPress={() => Alert.alert('Detailed Logs', `Viewing full activity logs for ${selectedUser.name}...`)}>
                    <Feather name="activity" size={15} color="#2563EB" />
                    <Text style={styles.outlineBtnText}>View Detailed User Log</Text>
                  </TouchableOpacity>
                  
                  {selectedUser.status !== 'Revoked' ? (
                    <TouchableOpacity style={styles.dangerBtn} onPress={() => handleStatusChange('Revoked')}>
                      <Feather name="slash" size={15} color="#DC2626" />
                      <Text style={styles.dangerBtnText}>Revoke Portal Access</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.successBtn} onPress={() => handleStatusChange('Active')}>
                      <Feather name="check-circle" size={15} color="#059669" />
                      <Text style={styles.successBtnText}>Approve & Restore Access</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ==================== PUSH NOTIFICATION MODAL ==================== */}
      <Modal visible={pushModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Broadcast Push Notification</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter message for all CS students and faculty..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={pushMessage}
              onChangeText={setPushMessage}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPushModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSendBtn} onPress={() => { setPushModalVisible(false); setPushMessage(''); Alert.alert('Sent', 'Push notification broadcasted successfully.'); }}>
                <Text style={styles.modalSendBtnText}>Send Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  scrollContent: { paddingHorizontal: 18, paddingTop: 48, paddingBottom: 60 },
  
  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft: { flex: 1 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greetingText: { fontSize: 23, fontWeight: '800', color: '#0F172A' },
  adminBadge: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', borderWidth: 1, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  adminBadgeText: { fontSize: 11, fontWeight: '700', color: '#7C3AED' },
  subtitleText: { fontSize: 12, color: '#64748B', marginTop: 3, fontWeight: '500' },
  logoutBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', alignItems: 'center', justifyContent: 'center' },
  
  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 14, padding: 4, marginBottom: 24 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  tabBtnText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  tabBtnTextActive: { color: '#0F172A', fontWeight: '800' },
  section: { flex: 1 },

  // Metrics
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  metricCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  metricValue: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  metricLabel: { fontSize: 11, fontWeight: '600', color: '#64748B', marginTop: 4 },

  // Bulk Actions
  bulkActionsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  bulkBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 14, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', gap: 8 },
  bulkBtnText: { color: '#7C3AED', fontSize: 12, fontWeight: '700' },

  // Cards & Headers
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 2 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.7 },
  sectionCount: { fontSize: 11, fontWeight: '700', color: '#7C3AED' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  
  // Unpairing / Leave Queue
  reqTopRow: { marginBottom: 12 },
  reqStudentName: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  reqRoll: { color: '#64748B', fontWeight: '700' },
  reqReason: { fontSize: 12, color: '#64748B', marginTop: 4 },
  approveBtn: { backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  approveBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyText: { fontSize: 13, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center', marginVertical: 20 },

  // Logs
  logCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  logIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  logTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  logTime: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  logMeta: { fontSize: 12, color: '#64748B', lineHeight: 18 },

  // Directory
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 14, height: 46, marginBottom: 16, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500', color: '#0F172A' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  roleToggleGroup: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 10, padding: 3 },
  roleToggleBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  roleToggleBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  roleToggleText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  roleToggleTextActive: { color: '#0F172A', fontWeight: '800' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7C3AED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4 },
  addBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  yearScroll: { gap: 8, marginBottom: 16, paddingBottom: 4 },
  yearChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  yearChipActive: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
  yearChipText: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  yearChipTextActive: { color: '#7C3AED', fontWeight: '800' },
  
  userCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 10 },
  userCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatarBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '800' },
  userName: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  userMeta: { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '500' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  statusActive: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  statusActiveText: { color: '#059669', fontSize: 10, fontWeight: '800' },
  statusPending: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  statusPendingText: { color: '#D97706', fontSize: 10, fontWeight: '800' },
  statusRevoked: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  statusRevokedText: { color: '#DC2626', fontSize: 10, fontWeight: '800' },

  // Academics
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  cardSub: { fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 16 },
  pushBtn: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pushBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Modals
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.55)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  modalSub: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
  closeBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 12 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 24 },
  detailItem: { width: '46%' },
  detailLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  actionGroup: { marginBottom: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', gap: 8, marginBottom: 10 },
  outlineBtnText: { color: '#2563EB', fontSize: 13, fontWeight: '700' },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', gap: 8 },
  dangerBtnText: { color: '#DC2626', fontSize: 13, fontWeight: '700' },
  successBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', gap: 8 },
  successBtnText: { color: '#059669', fontSize: 13, fontWeight: '700' },
  
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 16, height: 100, fontSize: 14, textAlignVertical: 'top', marginTop: 16, marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  modalCancelBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  modalCancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 14 },
  modalSendBtn: { backgroundColor: '#2563EB', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  modalSendBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
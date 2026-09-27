import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type ChatTab = 'Professors & TAs' | 'Course Channels';

interface FacultyMember {
  id: string;
  initials: string;
  name: string;
  dept: string;
  bgColor: string;
  textColor: string;
  statusColor: string;
  statusLabel: string;
}

interface ChatThread {
  id: string;
  category: ChatTab;
  initials: string;
  name: string;
  subtitle: string;
  senderPrefix?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatarBg: string;
  avatarBorder: string;
  avatarText: string;
  statusDot?: string;
}

const FACULTY_LIST: FacultyMember[] = [
  {
    id: 'f1',
    initials: 'PH',
    name: 'Prof. Henderson',
    dept: 'Data Struct.',
    bgColor: '#10B981',
    textColor: '#FFFFFF',
    statusColor: '#10B981',
    statusLabel: 'Available for doubts (Room 304)',
  },
  {
    id: 'f2',
    initials: 'AV',
    name: 'Dr. Vance',
    dept: 'Networks',
    bgColor: '#4F46E5',
    textColor: '#FFFFFF',
    statusColor: '#FBBF24',
    statusLabel: 'Currently in Lecture',
  },
  {
    id: 'f3',
    initials: 'SJ',
    name: 'TA Sarah J.',
    dept: 'OS Lab',
    bgColor: '#F43F5E',
    textColor: '#FFFFFF',
    statusColor: '#10B981',
    statusLabel: 'Available in Lab 2B',
  },
  {
    id: 'f4',
    initials: 'CS Dept',
    name: 'Help Desk',
    dept: 'Admin',
    bgColor: '#E2E8F0',
    textColor: '#475569',
    statusColor: '#CBD5E1',
    statusLabel: 'Offline • Opens 9:00 AM',
  },
];

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 't1',
    category: 'Professors & TAs',
    initials: 'PH',
    name: 'Prof. Henderson',
    subtitle: 'Data Structures • CS201',
    lastMessage: 'Regarding the project guidelines, you can use either C++ or Python 3.11.',
    time: '10:14 AM',
    unreadCount: 1,
    avatarBg: '#ECFDF5',
    avatarBorder: '#D1FAE5',
    avatarText: '#047857',
    statusDot: '#10B981',
  },
  {
    id: 't2',
    category: 'Course Channels',
    initials: '#',
    name: 'CS301 Course Group',
    subtitle: 'Algorithms Peer Channel',
    senderPrefix: 'Marcus: ',
    lastMessage: 'Has anyone verified question 4 on page 82?',
    time: '09:45 AM',
    unreadCount: 0,
    avatarBg: '#FFFBEB',
    avatarBorder: '#FEF3C7',
    avatarText: '#B45309',
  },
  {
    id: 't3',
    category: 'Professors & TAs',
    initials: 'SJ',
    name: 'TA Sarah Jenkins',
    subtitle: 'Operating Systems Lab',
    lastMessage: 'Your lab 3 evaluation is updated. Good job on the fork implementation!',
    time: 'Yesterday',
    unreadCount: 0,
    avatarBg: '#FFF1F2',
    avatarBorder: '#FFE4E6',
    avatarText: '#BE123C',
    statusDot: '#10B981',
  },
  {
    id: 't4',
    category: 'Professors & TAs',
    initials: 'AV',
    name: 'Dr. Aris Vance',
    subtitle: 'Computer Networks',
    lastMessage: 'Office hours shifted to 3:00 PM today in Room 210.',
    time: '2 days ago',
    unreadCount: 0,
    avatarBg: '#EEF2FF',
    avatarBorder: '#E0E7FF',
    avatarText: '#4338CA',
    statusDot: '#FBBF24',
  },
];

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState<ChatTab>('Professors & TAs');
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [replyText, setReplyText] = useState('');

  // Show all threads on default view to match reference design, or filter when switching to Course Channels
  const displayedThreads =
    activeTab === 'Professors & TAs'
      ? threads
      : threads.filter((t) => t.category === 'Course Channels');

  const handleMarkAllRead = () => {
    setThreads((prev) => prev.map((t) => ({ ...t, unreadCount: 0 })));
  };

  const handleOpenThread = (thread: ChatThread) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
    );
    setSelectedThread(thread);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id
          ? { ...t, senderPrefix: 'You: ', lastMessage: replyText.trim(), time: 'Just now' }
          : t
      )
    );
    setReplyText('');
    setSelectedThread(null);
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Academic Chat</Text>
          <Text style={styles.screenSubtitle}>Connect with professors & study groups</Text>
        </View>

        {/* Segmented Control Tabs */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'Professors & TAs' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('Professors & TAs')}
          >
            <Text style={[styles.segmentText, activeTab === 'Professors & TAs' && styles.segmentTextActive]}>
              Professors & TAs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'Course Channels' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('Course Channels')}
          >
            <Text style={[styles.segmentText, activeTab === 'Course Channels' && styles.segmentTextActive]}>
              Course Channels
            </Text>
          </TouchableOpacity>
        </View>

        {/* Available Faculty Horizontal Rail */}
        <View style={styles.facultySection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>AVAILABLE FACULTY</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Faculty Office Hours',
                  '• Prof. Henderson: Mon/Wed 2–4 PM (Room 304)\n• Dr. Vance: Tue/Thu 3–4 PM (Room 210)\n• TA Sarah Jenkins: Fri 1–3 PM (Lab 2B)'
                )
              }
            >
              <Text style={styles.sectionActionLink}>View Office Hours</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.facultyRail}
          >
            {FAULTS_OR_FACULTY(FACULTY_LIST).map((fac) => (
              <TouchableOpacity
                key={fac.id}
                style={styles.facultyItem}
                activeOpacity={0.8}
                onPress={() => Alert.alert(fac.name, fac.statusLabel)}
              >
                <View style={styles.facultyAvatarContainer}>
                  <View style={[styles.facultyCircle, { backgroundColor: fac.bgColor }]}>
                    <Text
                      style={[
                        styles.facultyInitials,
                        { color: fac.textColor, fontSize: fac.initials.length > 2 ? 11 : 14 },
                      ]}
                    >
                      {fac.initials}
                    </Text>
                  </View>
                  <View style={[styles.facultyStatusDot, { backgroundColor: fac.statusColor }]} />
                </View>
                <Text style={styles.facultyName} numberOfLines={1}>
                  {fac.name}
                </Text>
                <Text style={styles.facultyDept} numberOfLines={1}>
                  {fac.dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Conversations Header */}
        <View style={styles.conversationsHeaderRow}>
          <Text style={styles.sectionLabel}>RECENT CONVERSATIONS</Text>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.sectionActionLink}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Thread Cards */}
        <View style={styles.threadsList}>
          {displayedThreads.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              activeOpacity={0.85}
              onPress={() => handleOpenThread(thread)}
              style={styles.threadCard}
            >
              {/* Left Avatar Box */}
              <View style={styles.threadAvatarWrapper}>
                <View
                  style={[
                    styles.threadAvatarBox,
                    { backgroundColor: thread.avatarBg, borderColor: thread.avatarBorder },
                  ]}
                >
                  <Text style={[styles.threadAvatarText, { color: thread.avatarText }]}>
                    {thread.initials}
                  </Text>
                </View>
                {thread.statusDot && (
                  <View style={[styles.threadStatusDot, { backgroundColor: thread.statusDot }]} />
                )}
              </View>

              {/* Right Content */}
              <View style={styles.threadContentCol}>
                <View style={styles.threadTitleRow}>
                  <Text style={styles.threadName} numberOfLines={1}>
                    {thread.name}
                  </Text>
                  <Text
                    style={[
                      styles.threadTime,
                      thread.unreadCount > 0 && styles.threadTimeUnread,
                    ]}
                  >
                    {thread.time}
                  </Text>
                </View>

                <Text style={styles.threadSubtitle} numberOfLines={1}>
                  {thread.subtitle}
                </Text>

                <View style={styles.threadPreviewRow}>
                  <Text
                    style={[
                      styles.threadMessage,
                      thread.unreadCount > 0 && styles.threadMessageUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {thread.senderPrefix && (
                      <Text style={styles.senderPrefixText}>{thread.senderPrefix}</Text>
                    )}
                    {thread.lastMessage}
                  </Text>

                  {thread.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{thread.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating New Doubt (+) Button on Bottom Right */}
      <TouchableOpacity
        style={styles.fabNewDoubt}
        activeOpacity={0.85}
        onPress={() =>
          Alert.alert('New Academic Doubt', 'Select a course channel or professor to start a conversation.')
        }
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Quick Conversation Reply Modal */}
      <Modal
        visible={selectedThread !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedThread(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedThread(null)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            {selectedThread && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.threadAvatarBox,
                      {
                        backgroundColor: selectedThread.avatarBg,
                        borderColor: selectedThread.avatarBorder,
                        width: 40,
                        height: 40,
                      },
                    ]}
                  >
                    <Text style={[styles.threadAvatarText, { color: selectedThread.avatarText }]}>
                      {selectedThread.initials}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.modalTitle}>{selectedThread.name}</Text>
                    <Text style={styles.modalSubtitle}>{selectedThread.subtitle}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedThread(null)}
                  >
                    <Feather name="x" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.chatBubbleIncoming}>
                  <Text style={styles.chatBubbleText}>{selectedThread.lastMessage}</Text>
                  <Text style={styles.chatBubbleTime}>{selectedThread.time}</Text>
                </View>

                <View style={styles.replyRow}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Write a message or ask a doubt..."
                    placeholderTextColor="#94A3B8"
                    value={replyText}
                    onChangeText={setReplyText}
                  />
                  <TouchableOpacity style={styles.sendBtn} onPress={handleSendReply}>
                    <Feather name="send" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function FAULTS_OR_FACULTY(list: FacultyMember[]) {
  return list;
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 150,
  },
  headerSection: {
    marginTop: 34,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
    fontWeight: '500',
  },

  // Segmented Control
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },

  // Available Faculty Section
  facultySection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.7,
  },
  sectionActionLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  facultyRail: {
    paddingVertical: 4,
    gap: 14,
  },
  facultyItem: {
    width: 78,
    alignItems: 'center',
    marginRight: 10,
  },
  facultyAvatarContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  facultyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  facultyInitials: {
    fontWeight: '800',
  },
  facultyStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  facultyName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    width: '100%',
  },
  facultyDept: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 1,
  },

  // Recent Conversations
  conversationsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  threadsList: {
    gap: 12,
  },
  threadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 10,
  },
  threadAvatarWrapper: {
    position: 'relative',
    marginRight: 13,
  },
  threadAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadAvatarText: {
    fontSize: 14,
    fontWeight: '800',
  },
  threadStatusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadContentCol: {
    flex: 1,
  },
  threadTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  threadName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  threadTime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  threadTimeUnread: {
    color: '#059669',
    fontWeight: '700',
  },
  threadSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  threadPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  threadMessage: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    paddingRight: 8,
  },
  threadMessageUnread: {
    color: '#334155',
    fontWeight: '600',
  },
  senderPrefixText: {
    color: '#1E293B',
    fontWeight: '700',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Floating Action Button (+)
  fabNewDoubt: {
    position: 'absolute',
    bottom: 82,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 370,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBubbleIncoming: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  chatBubbleText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },
  chatBubbleTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'right',
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
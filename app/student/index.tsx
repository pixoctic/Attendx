import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

import HomeScreen from './home';
import AttendanceScreen from './attendance';
import CoursesScreen from './courses';
import ChatScreen from './chat';

export default function StudentPortalShell() {
  const [bottomTab, setBottomTab] = useState<'Home' | 'Attendance' | 'Courses' | 'Chat'>('Chat');

  return (
    <View style={styles.container}>
      {/* Active Page Content */}
      {bottomTab === 'Home' && <HomeScreen />}
      {bottomTab === 'Attendance' && <AttendanceScreen />}
      {bottomTab === 'Courses' && <CoursesScreen />}
      {bottomTab === 'Chat' && <ChatScreen />}

      {/* Persistent Floating Attendance Scan Button (Unchanged) */}
      <TouchableOpacity
        style={styles.floatingScanBtn}
        onPress={() => router.push('/student/scanner')}
      >
        <Feather name="maximize" size={20} color="#FFF" />
        <Text style={styles.floatingScanText}>Scan In</Text>
      </TouchableOpacity>

      {/* Persistent Bottom Navigation Bar (Unchanged) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setBottomTab('Home')}>
          <Feather name="home" size={22} color={bottomTab === 'Home' ? '#10B981' : '#9CA3AF'} />
          <Text style={[styles.navText, bottomTab === 'Home' && { color: '#10B981' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setBottomTab('Attendance')}>
          <View style={styles.navBadge} />
          <Feather name="check-square" size={22} color={bottomTab === 'Attendance' ? '#10B981' : '#9CA3AF'} />
          <Text style={[styles.navText, bottomTab === 'Attendance' && { color: '#10B981' }]}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setBottomTab('Courses')}>
          <Feather name="book-open" size={22} color={bottomTab === 'Courses' ? '#10B981' : '#9CA3AF'} />
          <Text style={[styles.navText, bottomTab === 'Courses' && { color: '#10B981' }]}>Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setBottomTab('Chat')}>
          <Feather name="message-circle" size={22} color={bottomTab === 'Chat' ? '#10B981' : '#9CA3AF'} />
          <Text style={[styles.navText, bottomTab === 'Chat' && { color: '#10B981' }]}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  floatingScanBtn: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E7950',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#0E7950',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    gap: 8,
  },
  floatingScanText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: { alignItems: 'center', position: 'relative' },
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  navBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1,
    borderColor: '#FFF',
    zIndex: 1,
  },
});
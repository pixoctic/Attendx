import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type CategoryType = 'All' | 'Assignments' | 'Notes & Slides' | 'Exams';
type CourseCode = 'All Courses' | 'CS301 OS' | 'CS304 DBMS' | 'CS201 DSA' | 'CS308 Networks';

interface StudyMaterial {
  id: string;
  courseFilter: CourseCode;
  category: CategoryType;
  courseHeader: string;
  courseHeaderColor: string;
  title: string;
  meta: string;
  dateOrder: number;
  tagLabel: string;
  tagBg: string;
  tagText: string;
  iconType: 'pdf' | 'cheat' | 'slides' | 'exam' | 'code';
  secondaryAction?: string;
  primaryAction: string;
  primaryVariant: 'solidGreen' | 'lightGreen' | 'starLight';
}

const MATERIALS_DATA: StudyMaterial[] = [
  {
    id: '1',
    courseFilter: 'CS301 OS',
    category: 'Notes & Slides',
    courseHeader: 'CS301 • OPERATING SYSTEMS',
    courseHeaderColor: '#64748B',
    title: 'Lecture 15: Virtual Memory & Page Replacement Algorithms',
    meta: 'Prof. Henderson • 4.8 MB PDF • Oct 14',
    dateOrder: 6,
    tagLabel: 'Lecture PDF',
    tagBg: '#F1F5F9',
    tagText: '#475569',
    iconType: 'pdf',
    secondaryAction: 'Preview',
    primaryAction: 'Download',
    primaryVariant: 'solidGreen',
  },
  {
    id: '2',
    courseFilter: 'CS201 DSA',
    category: 'Notes & Slides',
    courseHeader: 'CS201 • DATA STRUCTURES',
    courseHeaderColor: '#64748B',
    title: 'Lecture 14: Red-Black Trees & Recoloring Invariants',
    meta: 'Prof. Henderson • 3.2 MB PDF • Oct 12',
    dateOrder: 5,
    tagLabel: 'Lecture PDF',
    tagBg: '#F1F5F9',
    tagText: '#475569',
    iconType: 'pdf',
    secondaryAction: 'View',
    primaryAction: 'Download',
    primaryVariant: 'solidGreen',
  },
  {
    id: '3',
    courseFilter: 'CS304 DBMS',
    category: 'Notes & Slides',
    courseHeader: 'CS304 • DATABASE SYSTEMS',
    courseHeaderColor: '#2563EB',
    title: 'Relational Algebra & Normalization Cheat Sheet (3NF/BCNF)',
    meta: 'Prof. Sharma • 1.8 MB PDF • Oct 10',
    dateOrder: 4,
    tagLabel: 'Cheat Sheet',
    tagBg: '#EFF6FF',
    tagText: '#2563EB',
    iconType: 'cheat',
    primaryAction: 'Quick Access →',
    primaryVariant: 'solidGreen',
  },
  {
    id: '4',
    courseFilter: 'CS308 Networks',
    category: 'Notes & Slides',
    courseHeader: 'CS308 • COMPUTER NETWORKS',
    courseHeaderColor: '#D97706',
    title: 'TCP/IP Handshake & Socket Programming Architecture Slides',
    meta: 'Dr. Vance • 12.6 MB PPTX • Oct 8',
    dateOrder: 3,
    tagLabel: 'Slide Deck',
    tagBg: '#FFFBEB',
    tagText: '#92400E',
    iconType: 'slides',
    primaryAction: 'Download',
    primaryVariant: 'lightGreen',
  },
  {
    id: '5',
    courseFilter: 'CS201 DSA',
    category: 'Exams',
    courseHeader: 'CS201 • DATA STRUCTURES',
    courseHeaderColor: '#64748B',
    title: 'Midterm Formula Sheet & Complexity Analysis Handbook',
    meta: 'CS Dept • 2.1 MB PDF • Oct 5',
    dateOrder: 2,
    tagLabel: 'Exam Reference',
    tagBg: '#ECFDF5',
    tagText: '#065F46',
    iconType: 'exam',
    primaryAction: 'Save Handbook',
    primaryVariant: 'starLight',
  },
  {
    id: '6',
    courseFilter: 'CS301 OS',
    category: 'Assignments',
    courseHeader: 'CS301 • OPERATING SYSTEMS',
    courseHeaderColor: '#64748B',
    title: 'Lab 04 Source Starter Code & Semaphore Examples',
    meta: 'TA Sarah J. • 540 KB ZIP • Oct 2',
    dateOrder: 1,
    tagLabel: 'Code Lab / ZIP',
    tagBg: '#F1F5F9',
    tagText: '#334155',
    iconType: 'code',
    primaryAction: 'Download ZIP',
    primaryVariant: 'solidGreen',
  },
];

const CATEGORIES: CategoryType[] = ['All', 'Assignments', 'Notes & Slides', 'Exams'];
const COURSE_FILTERS: CourseCode[] = ['All Courses', 'CS301 OS', 'CS304 DBMS', 'CS201 DSA', 'CS308 Networks'];

export default function CoursesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Notes & Slides');
  const [selectedCourse, setSelectedCourse] = useState<CourseCode>('All Courses');
  const [sortDescending, setSortDescending] = useState(true);

  const filteredMaterials = MATERIALS_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      selectedCategory === 'Notes & Slides' || // default view in reference shows all 6 files
      item.category === selectedCategory;
    const matchesCourse = selectedCourse === 'All Courses' || item.courseFilter === selectedCourse;
    return matchesCategory && matchesCourse;
  }).sort((a, b) => (sortDescending ? b.dateOrder - a.dateOrder : a.dateOrder - b.dateOrder));

  const renderFileIcon = (type: StudyMaterial['iconType']) => {
    switch (type) {
      case 'pdf':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FFF1F2' }]}>
            <Feather name="file" size={20} color="#E11D48" />
          </View>
        );
      case 'cheat':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Feather name="file-text" size={20} color="#2563EB" />
          </View>
        );
      case 'slides':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
            <MaterialCommunityIcons name="presentation" size={21} color="#D97706" />
          </View>
        );
      case 'exam':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Feather name="book-open" size={20} color="#047857" />
          </View>
        );
      case 'code':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
            <Feather name="code" size={20} color="#334155" />
          </View>
        );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Screen Header */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Courses</Text>
        <Text style={styles.screenSubtitle}>Lecture notes, materials & active assignments</Text>
      </View>

      {/* Primary Category Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
            >
              <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Secondary Course Chip Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.courseChipScroll}
      >
        {COURSE_FILTERS.map((course) => {
          const isActive = selectedCourse === course;
          return (
            <TouchableOpacity
              key={course}
              activeOpacity={0.8}
              onPress={() => setSelectedCourse(course)}
              style={[styles.courseChip, isActive && styles.courseChipActive]}
            >
              <Text style={[styles.courseChipText, isActive && styles.courseChipTextActive]}>
                {course}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Repository Header Row */}
      <View style={styles.repoHeaderRow}>
        <View style={styles.repoTitleLeft}>
          <Text style={styles.repoTitle}>Study Repository</Text>
          <View style={styles.fileCountBadge}>
            <Text style={styles.fileCountText}>{filteredMaterials.length} Files</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setSortDescending(!sortDescending)}>
          <Text style={styles.sortBtnText}>
            Sort by Date {sortDescending ? '↓' : '↑'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Study Repository Cards */}
      <View style={styles.cardsList}>
        {filteredMaterials.map((item) => (
          <View key={item.id} style={styles.materialCard}>
            {/* Top Info Row */}
            <View style={styles.cardTopRow}>
              {renderFileIcon(item.iconType)}
              <View style={styles.cardTextCol}>
                <Text style={[styles.courseHeaderLabel, { color: item.courseHeaderColor }]}>
                  {item.courseHeader}
                </Text>
                <Text style={styles.materialTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.materialMeta}>{item.meta}</Text>
              </View>
            </View>

            {/* Bottom Actions Row */}
            <View style={styles.cardBottomRow}>
              <View style={[styles.typeTag, { backgroundColor: item.tagBg }]}>
                <Text style={[styles.typeTagText, { color: item.tagText }]}>{item.tagLabel}</Text>
              </View>

              <View style={styles.actionsGroup}>
                {item.secondaryAction && (
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => Alert.alert(item.secondaryAction!, item.title)}
                  >
                    <Text style={styles.secondaryBtnText}>{item.secondaryAction}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    item.primaryVariant === 'solidGreen' && styles.primaryBtnSolidGreen,
                    item.primaryVariant === 'lightGreen' && styles.primaryBtnLightGreen,
                    item.primaryVariant === 'starLight' && styles.primaryBtnStarLight,
                  ]}
                  onPress={() => Alert.alert(item.primaryAction, `Opening ${item.title}`)}
                >
                  {item.primaryVariant === 'solidGreen' && !item.primaryAction.includes('→') && (
                    <Feather name="download" size={13} color="#FFFFFF" />
                  )}
                  {item.primaryVariant === 'lightGreen' && (
                    <Feather name="download" size={13} color="#109D6D" />
                  )}
                  {item.primaryVariant === 'starLight' && (
                    <Ionicons name="star" size={13} color="#D97706" />
                  )}
                  <Text
                    style={[
                      styles.primaryBtnText,
                      item.primaryVariant === 'solidGreen' && { color: '#FFFFFF' },
                      item.primaryVariant === 'lightGreen' && { color: '#109D6D' },
                      item.primaryVariant === 'starLight' && { color: '#334155' },
                    ]}
                  >
                    {item.primaryAction}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 145,
  },
  headerSection: {
    marginTop: 34,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },

  // Category Filter Pills
  categoryScroll: {
    paddingBottom: 12,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#109D6D',
    borderColor: '#109D6D',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Course Filter Chips
  courseChipScroll: {
    paddingBottom: 18,
    gap: 6,
  },
  courseChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  courseChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  courseChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  courseChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Study Repository Header
  repoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  repoTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  fileCountBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  fileCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#109D6D',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#109D6D',
  },

  // Material Cards
  cardsList: {
    gap: 12,
  },
  materialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
  },
  courseHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  materialTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  materialMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },

  // Card Bottom Row
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 12,
    marginTop: 12,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondaryBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 5,
  },
  primaryBtnSolidGreen: {
    backgroundColor: '#109D6D',
  },
  primaryBtnLightGreen: {
    backgroundColor: '#ECFDF5',
  },
  primaryBtnStarLight: {
    backgroundColor: '#F1F5F9',
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
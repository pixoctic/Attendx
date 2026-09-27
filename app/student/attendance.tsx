import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const hourlyScheduleData = [
  { hour: 'Hour 1 (09:00 - 10:00 AM)', subject: 'CS201: Data Structures & Algorithms', hall: 'Hall 304', prof: 'Prof. Henderson' },
  { hour: 'Hour 2 (10:00 - 11:00 AM)', subject: 'CS201: DSA Lab / Hands-on', hall: 'Lab 2B', prof: 'TA Sarah J.' },
  { hour: 'Hour 3 (11:15 - 12:15 PM)', subject: 'CS301: Operating Systems', hall: 'Lecture Hall B', prof: 'Dr. Rostova' },
  { hour: 'Hour 4 (01:00 - 02:00 PM)', subject: 'CS304: Database Management', hall: 'Seminar Room 1', prof: 'Prof. V. Sharma' },
  { hour: 'Hour 5 (02:00 - 03:00 PM)', subject: 'MATH304: Discrete Mathematics', hall: 'Auditorium 2', prof: 'Prof. Vance' },
  { hour: 'Hour 6 (03:15 - 04:15 PM)', subject: 'CS308: Computer Networks', hall: 'Lab 08', prof: 'Prof. Tanaka' },
];

type DayStatus = 'present' | 'absent' | 'off';
interface CalendarDay {
  day: number;
  status: DayStatus;
  detail: string;
}

type YearKey = 1 | 2 | 3;
type SemesterKey = 1 | 2 | 3 | 4 | 5 | 6;

const YEAR_SEMESTERS: Record<YearKey, { label: string; sems: [SemesterKey, SemesterKey] }> = {
  1: { label: '1st Year', sems: [1, 2] },
  2: { label: '2nd Year', sems: [3, 4] },
  3: { label: '3rd Year', sems: [5, 6] },
};

interface MonthStat {
  key: string;
  short: string;
  full: string;
  present: number;
  total: number;
  percentage: number;
  margin: string;
  isProjected?: boolean;
}

interface SubjectStat {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
  status: string;
  leaves: string;
  color: string;
  criticalMessage?: string;
}

interface SemesterRecord {
  sem: SemesterKey;
  sessionTitle: string;
  monthTitle: string;
  attendedPct: string;
  presentDays: number;
  absentDays: number;
  offDays: number;
  absentDates: number[];
  safeLeavesText: string;
  months: MonthStat[];
  subjects: SubjectStat[];
}

const SEMESTER_DATA: Record<SemesterKey, SemesterRecord> = {
  1: {
    sem: 1,
    sessionTitle: '1ST YEAR • SEMESTER 1',
    monthTitle: 'October 2022',
    attendedPct: '91.2%',
    presentDays: 22,
    absentDays: 2,
    offDays: 7,
    absentDates: [11, 25],
    safeLeavesText: '+7 Safe Leaves Available',
    months: [
      { key: 'aug', short: 'Aug', full: 'August', present: 40, total: 44, percentage: 90.9, margin: '+15.9%' },
      { key: 'sep', short: 'Sep', full: 'September', present: 43, total: 46, percentage: 93.5, margin: '+18.5%' },
      { key: 'oct', short: 'Oct', full: 'October', present: 41, total: 45, percentage: 91.2, margin: '+16.2%' },
      { key: 'nov', short: 'Nov', full: 'November', present: 39, total: 43, percentage: 90.7, margin: '+15.7%' },
    ],
    subjects: [
      { id: '1', code: 'CP', name: 'Programming in C', attended: 24, total: 25, percentage: 96, status: 'Safe', leaves: '6 Safe Leaves', color: '#10B981' },
      { id: '2', code: 'EM', name: 'Engineering Mathematics I', attended: 22, total: 25, percentage: 88, status: 'Safe', leaves: '4 Safe Leaves', color: '#10B981' },
      { id: '3', code: 'EP', name: 'Applied Physics', attended: 21, total: 24, percentage: 88, status: 'Safe', leaves: '3 Safe Leaves', color: '#10B981' },
      { id: '4', code: 'EG', name: 'Engineering Graphics', attended: 19, total: 22, percentage: 86, status: 'Safe', leaves: '3 Safe Leaves', color: '#10B981' },
    ],
  },
  2: {
    sem: 2,
    sessionTitle: '1ST YEAR • SEMESTER 2',
    monthTitle: 'March 2023',
    attendedPct: '88.5%',
    presentDays: 21,
    absentDays: 3,
    offDays: 7,
    absentDates: [3, 17, 28],
    safeLeavesText: '+6 Safe Leaves Available',
    months: [
      { key: 'jan', short: 'Jan', full: 'January', present: 38, total: 43, percentage: 88.4, margin: '+13.4%' },
      { key: 'feb', short: 'Feb', full: 'February', present: 36, total: 40, percentage: 90.0, margin: '+15.0%' },
      { key: 'mar', short: 'Mar', full: 'March', present: 40, total: 45, percentage: 88.5, margin: '+13.5%' },
      { key: 'apr', short: 'Apr', full: 'April', present: 37, total: 42, percentage: 88.1, margin: '+13.1%' },
    ],
    subjects: [
      { id: '1', code: 'OO', name: 'Object Oriented Programming', attended: 23, total: 25, percentage: 92, status: 'Safe', leaves: '5 Safe Leaves', color: '#10B981' },
      { id: '2', code: 'M2', name: 'Engineering Mathematics II', attended: 21, total: 24, percentage: 88, status: 'Safe', leaves: '3 Safe Leaves', color: '#10B981' },
      { id: '3', code: 'DE', name: 'Digital Electronics', attended: 19, total: 24, percentage: 79, status: 'Warning', leaves: '1 Safe Miss Left', color: '#F59E0B' },
      { id: '4', code: 'EC', name: 'Professional Communication', attended: 22, total: 24, percentage: 92, status: 'Safe', leaves: '4 Safe Leaves', color: '#10B981' },
    ],
  },
  3: {
    sem: 3,
    sessionTitle: '2ND YEAR • SEMESTER 3',
    monthTitle: 'October 2023',
    attendedPct: '84.0%',
    presentDays: 20,
    absentDays: 4,
    offDays: 7,
    absentDates: [2, 10, 18, 26],
    safeLeavesText: '+4 Safe Leaves Available',
    months: [
      { key: 'aug', short: 'Aug', full: 'August', present: 36, total: 43, percentage: 83.7, margin: '+8.7%' },
      { key: 'sep', short: 'Sep', full: 'September', present: 39, total: 45, percentage: 86.7, margin: '+11.7%' },
      { key: 'oct', short: 'Oct', full: 'October', present: 38, total: 45, percentage: 84.0, margin: '+9.0%' },
      { key: 'nov', short: 'Nov', full: 'November', present: 37, total: 44, percentage: 84.1, margin: '+9.1%' },
    ],
    subjects: [
      { id: '1', code: 'CA', name: 'Computer Architecture', attended: 21, total: 25, percentage: 84, status: 'Safe', leaves: '2 Safe Leaves', color: '#10B981' },
      { id: '2', code: 'DM', name: 'Discrete Mathematics', attended: 20, total: 24, percentage: 83, status: 'Safe', leaves: '2 Safe Leaves', color: '#10B981' },
      { id: '3', code: 'JP', name: 'Java Programming', attended: 22, total: 25, percentage: 88, status: 'Safe', leaves: '3 Safe Leaves', color: '#10B981' },
      { id: '4', code: 'SE', name: 'Software Engineering', attended: 18, total: 23, percentage: 78, status: 'Warning', leaves: '1 Safe Miss Left', color: '#F59E0B' },
    ],
  },
  4: {
    sem: 4,
    sessionTitle: '2ND YEAR • SEMESTER 4',
    monthTitle: 'March 2024',
    attendedPct: '89.1%',
    presentDays: 21,
    absentDays: 3,
    offDays: 7,
    absentDates: [8, 15, 22],
    safeLeavesText: '+6 Safe Leaves Available',
    months: [
      { key: 'jan', short: 'Jan', full: 'January', present: 39, total: 44, percentage: 88.6, margin: '+13.6%' },
      { key: 'feb', short: 'Feb', full: 'February', present: 38, total: 42, percentage: 90.5, margin: '+15.5%' },
      { key: 'mar', short: 'Mar', full: 'March', present: 41, total: 46, percentage: 89.1, margin: '+14.1%' },
      { key: 'apr', short: 'Apr', full: 'April', present: 39, total: 44, percentage: 88.6, margin: '+13.6%' },
    ],
    subjects: [
      { id: '1', code: 'MC', name: 'Microcontrollers & AVR', attended: 23, total: 25, percentage: 92, status: 'Safe', leaves: '5 Safe Leaves', color: '#10B981' },
      { id: '2', code: 'WT', name: 'Web Technologies', attended: 22, total: 24, percentage: 92, status: 'Safe', leaves: '4 Safe Leaves', color: '#10B981' },
      { id: '3', code: 'AD', name: 'Algorithm Design', attended: 21, total: 24, percentage: 88, status: 'Safe', leaves: '3 Safe Leaves', color: '#10B981' },
      { id: '4', code: 'SS', name: 'System Software', attended: 20, total: 24, percentage: 83, status: 'Safe', leaves: '2 Safe Leaves', color: '#10B981' },
    ],
  },
  5: {
    sem: 5,
    sessionTitle: '3RD YEAR • SEMESTER 5',
    monthTitle: 'October 2024',
    attendedPct: '86.7%',
    presentDays: 21,
    absentDays: 3,
    offDays: 7,
    absentDates: [4, 15, 24],
    safeLeavesText: '+5 Safe Leaves Available',
    months: [
      { key: 'aug', short: 'Aug', full: 'August', present: 38, total: 42, percentage: 90.4, margin: '+15.4%' },
      { key: 'sep', short: 'Sep', full: 'September', present: 44, total: 48, percentage: 91.6, margin: '+16.6%' },
      { key: 'oct', short: 'Oct', full: 'October', present: 39, total: 45, percentage: 86.7, margin: '+11.7%' },
      { key: 'nov', short: 'Nov', full: 'November', present: 41, total: 45, percentage: 91.1, margin: '+16.1%', isProjected: true },
    ],
    subjects: [
      { id: '1', code: 'DS', name: 'Data Structures & Algorithms', attended: 23, total: 25, percentage: 92, status: 'Safe', leaves: '5 Safe Leaves', color: '#10B981' },
      { id: '2', code: 'OS', name: 'Operating Systems', attended: 18, total: 23, percentage: 78, status: 'Warning', leaves: '1 Safe Miss Left', color: '#F59E0B' },
      { id: '3', code: 'DB', name: 'Database Management', attended: 22, total: 25, percentage: 88, status: 'Safe', leaves: '3 Safe Leaves', color: '#10B981' },
      { id: '4', code: 'CN', name: 'Computer Networks', attended: 17, total: 23, percentage: 74, status: 'Below 75% Cutoff', leaves: 'Critical', color: '#EF4444', criticalMessage: 'Must attend next 2 classes to restore 75% cutoff!' },
    ],
  },
  6: {
    sem: 6,
    sessionTitle: '3RD YEAR • SEMESTER 6',
    monthTitle: 'March 2025',
    attendedPct: '92.4%',
    presentDays: 22,
    absentDays: 2,
    offDays: 7,
    absentDates: [7, 19],
    safeLeavesText: '+8 Safe Leaves Available',
    months: [
      { key: 'jan', short: 'Jan', full: 'January', present: 41, total: 44, percentage: 93.2, margin: '+18.2%' },
      { key: 'feb', short: 'Feb', full: 'February', present: 39, total: 42, percentage: 92.8, margin: '+17.8%' },
      { key: 'mar', short: 'Mar', full: 'March', present: 42, total: 45, percentage: 92.4, margin: '+17.4%' },
      { key: 'apr', short: 'Apr', full: 'April', present: 40, total: 43, percentage: 93.0, margin: '+18.0%', isProjected: true },
    ],
    subjects: [
      { id: '1', code: 'CC', name: 'Cloud Computing & DevOps', attended: 24, total: 25, percentage: 96, status: 'Safe', leaves: '6 Safe Leaves', color: '#10B981' },
      { id: '2', code: 'CS', name: 'Cyber Security & Cryptography', attended: 23, total: 25, percentage: 92, status: 'Safe', leaves: '5 Safe Leaves', color: '#10B981' },
      { id: '3', code: 'MD', name: 'Mobile App Development', attended: 22, total: 24, percentage: 92, status: 'Safe', leaves: '4 Safe Leaves', color: '#10B981' },
      { id: '4', code: 'MP', name: 'Major Project & Viva', attended: 20, total: 22, percentage: 91, status: 'Safe', leaves: '4 Safe Leaves', color: '#10B981' },
    ],
  },
};

const CHART_HEIGHT = 140;

export default function AttendanceScreen() {
  const [selectedYear, setSelectedYear] = useState<YearKey>(3);
  const [selectedSem, setSelectedSem] = useState<SemesterKey>(5);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(2);
  const [selectedDayModal, setSelectedDayModal] = useState<CalendarDay | null>(null);

  const currentSemData = SEMESTER_DATA[selectedSem];
  const activeMonthObj = currentSemData.months[selectedMonthIdx] || currentSemData.months[0];
  const availableSemsForYear = YEAR_SEMESTERS[selectedYear].sems;

  const handleSelectYear = (year: YearKey) => {
    setSelectedYear(year);
    const firstSemOfYear = YEAR_SEMESTERS[year].sems[0];
    setSelectedSem(firstSemOfYear);
    setSelectedMonthIdx(2);
  };

  // Build 31-day calendar dynamically for the selected semester
  const calendarDays: CalendarDay[] = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    if (currentSemData.absentDates.includes(day)) {
      return { day, status: 'absent', detail: '0/6 Hours Attended (Leave / Absent)' };
    }
    if ([5, 12, 19, 26].includes(day)) {
      return { day, status: 'off', detail: 'Weekend / No Classes' };
    }
    if ([6, 13, 20, 27].includes(day)) {
      return { day, status: 'off', detail: 'Sunday / Campus Closed' };
    }
    return { day, status: 'present', detail: '6/6 Hours Attended' };
  });

  const cycleMonth = () => {
    setSelectedMonthIdx((prev) => (prev + 1) % currentSemData.months.length);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.attTopBar}>
          <View style={styles.attTopBarLeft}>
            <View style={styles.attAvatarRing}>
              <View style={styles.attAvatarCircle}>
                <Text style={styles.attAvatarText}>AL</Text>
              </View>
            </View>
            <Text style={styles.attTopBarTitle}>Attendance Records</Text>
          </View>
          <TouchableOpacity style={styles.attQrIconBtn} onPress={() => router.push('/student/scanner')}>
            <MaterialCommunityIcons name="qrcode-scan" size={18} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* 3-Year Selector Row */}
        <View style={styles.yearSelectorContainer}>
          {([1, 2, 3] as YearKey[]).map((yr) => {
            const isActive = selectedYear === yr;
            return (
              <TouchableOpacity
                key={yr}
                activeOpacity={0.85}
                style={[styles.yearBtn, isActive && styles.yearBtnActive]}
                onPress={() => handleSelectYear(yr)}
              >
                <Text style={[styles.yearBtnText, isActive && styles.yearBtnTextActive]}>
                  {YEAR_SEMESTERS[yr].label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2-Semester Sub-Toggle for Selected Year */}
        <View style={styles.semToggleContainer}>
          {availableSemsForYear.map((semNum) => {
            const isActive = selectedSem === semNum;
            return (
              <TouchableOpacity
                key={semNum}
                activeOpacity={0.85}
                style={[styles.semToggleBtn, isActive && styles.semToggleBtnActive]}
                onPress={() => {
                  setSelectedSem(semNum);
                  setSelectedMonthIdx(2);
                }}
              >
                <View style={[styles.semDot, isActive && styles.semDotActive]} />
                <Text style={[styles.semToggleText, isActive && styles.semToggleTextActive]}>
                  Semester {semNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          <View style={styles.calHeader}>
            <View>
              <Text style={styles.calSessionLabel}>{currentSemData.sessionTitle}</Text>
              <View style={styles.calMonthRow}>
                <MaterialCommunityIcons name="calendar-month-outline" size={18} color="#059669" />
                <Text style={styles.calMonthTitle}>{currentSemData.monthTitle}</Text>
              </View>
            </View>
            <View style={styles.calAttendedBadge}>
              <View style={styles.calAttendedDot} />
              <Text style={styles.calAttendedText}>{currentSemData.attendedPct}{'\n'}Attended</Text>
            </View>
          </View>

          {/* Present / Absent / Off Summary Pills */}
          <View style={styles.calStatsBox}>
            <View style={styles.calStatCol}>
              <Text style={styles.calStatLabelGreen}>PRESENT</Text>
              <Text style={styles.calStatValDark}>{currentSemData.presentDays} Days</Text>
            </View>
            <View style={[styles.calStatCol, styles.calStatColBorder]}>
              <Text style={styles.calStatLabelRed}>ABSENT</Text>
              <Text style={styles.calStatValRed}>{currentSemData.absentDays} Days</Text>
            </View>
            <View style={styles.calStatCol}>
              <Text style={styles.calStatLabelGrey}>OFF / SUN</Text>
              <Text style={styles.calStatValGrey}>{currentSemData.offDays} Days</Text>
            </View>
          </View>

          {/* Days of Week Header */}
          <View style={styles.weekHeaderRow}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
              <Text key={d} style={styles.weekHeaderText}>{d}</Text>
            ))}
          </View>

          {/* Month Dates Grid */}
          <View style={styles.daysGrid}>
            <View style={styles.dayCellWrapper}><View style={styles.dayCircleEmpty} /></View>
            {calendarDays.map((item) => {
              const isSelected = item.day === 29;
              return (
                <View key={item.day} style={styles.dayCellWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setSelectedDayModal(item)}
                    style={[
                      styles.dayCircle,
                      item.status === 'present' && styles.dayCirclePresent,
                      item.status === 'absent' && styles.dayCircleAbsent,
                      item.status === 'off' && styles.dayCircleOff,
                      isSelected && styles.dayCircleSelectedRing,
                    ]}
                  >
                    <Text style={[styles.dayNumberText, item.status === 'off' && styles.dayNumberTextOff]}>
                      {item.day}
                    </Text>
                    {item.status === 'present' && (
                      <View style={[styles.dayDot, isSelected && styles.dayDotSelected]} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
            <View style={styles.dayCellWrapper}><View style={styles.dayCircleEmpty} /></View>
            <View style={styles.dayCellWrapper}><View style={styles.dayCircleEmpty} /></View>
            <View style={styles.dayCellWrapper}><View style={styles.dayCircleEmpty} /></View>
          </View>

          {/* Calendar Legend */}
          <View style={styles.calLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Attended (Present)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F43F5E' }]} />
              <Text style={styles.legendText}>Missed (Absent)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E2E8F0' }]} />
              <Text style={styles.legendText}>Off / Holiday</Text>
            </View>
          </View>

          <View style={styles.calHintBanner}>
            <Text style={styles.calHintText}>
              💡 Tap any date above to view the animated 6-hour attendance breakdown.
            </Text>
          </View>
        </View>

        {/* Attendance Analytics Card */}
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <View>
              <Text style={styles.analyticsTitle}>Semester {selectedSem} Analytics</Text>
              <Text style={styles.analyticsSubtitle}>Tap any bar to inspect monthly trend</Text>
            </View>
            <TouchableOpacity style={styles.monthSelectorBtn} onPress={cycleMonth}>
              <Text style={styles.monthSelectorText}>{activeMonthObj.short}</Text>
              <Feather name="chevron-down" size={14} color="#047857" />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryStrip}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>SELECTED MONTH</Text>
              <Text style={styles.summaryMainVal}>{activeMonthObj.full}</Text>
              <Text style={styles.summarySubText}>{activeMonthObj.present} of {activeMonthObj.total} classes</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>ATTENDANCE RATE</Text>
              <Text style={[styles.summaryMainVal, { color: '#059669' }]}>{activeMonthObj.percentage}%</Text>
              <Text style={styles.summarySubTextGreen}>{activeMonthObj.margin} above 75%</Text>
            </View>
            <TouchableOpacity style={styles.inspectBtn} onPress={() => setSelectedDayModal(calendarDays[28])}>
              <Feather name="clock" size={14} color="#047857" />
              <Text style={styles.inspectBtnText}>6h Log</Text>
            </TouchableOpacity>
          </View>

          {/* Scaled Bar Chart */}
          <View style={styles.cleanChartWrapper}>
            <View style={styles.chartPlotArea}>
              <View style={styles.yAxisColumn}>
                <Text style={styles.yAxisText}>100%</Text>
                <Text style={[styles.yAxisText, { color: '#E11D48', fontWeight: '800' }]}>75%</Text>
                <Text style={styles.yAxisText}>50%</Text>
                <Text style={styles.yAxisText}>25%</Text>
                <Text style={styles.yAxisText}>0%</Text>
              </View>

              <View style={styles.plotCanvas}>
                <View style={[styles.gridLine, { bottom: CHART_HEIGHT }]} />
                <View style={[styles.gridLineCutoff, { bottom: CHART_HEIGHT * 0.75 }]}>
                  <View style={styles.cutoffPill}>
                    <Text style={styles.cutoffPillText}>75% MIN CUTOFF</Text>
                  </View>
                </View>
                <View style={[styles.gridLine, { bottom: CHART_HEIGHT * 0.5 }]} />
                <View style={[styles.gridLine, { bottom: CHART_HEIGHT * 0.25 }]} />
                <View style={[styles.gridLineBase, { bottom: 0 }]} />

                <View style={styles.barsOverlayRow}>
                  {currentSemData.months.map((item, idx) => {
                    const isSelected = idx === selectedMonthIdx;
                    const barPixelHeight = (item.percentage / 100) * CHART_HEIGHT;
                    return (
                      <TouchableOpacity
                        key={item.key}
                        activeOpacity={0.8}
                        onPress={() => setSelectedMonthIdx(idx)}
                        style={styles.barColumnTouch}
                      >
                        <View style={[styles.barValueBubble, isSelected && styles.barValueBubbleActive]}>
                          <Text style={[styles.barValueBubbleText, isSelected && styles.barValueBubbleTextActive]}>
                            {item.percentage}%
                          </Text>
                        </View>
                        <View style={styles.barSlotTrack}>
                          <View
                            style={[
                              styles.barActualFill,
                              {
                                height: barPixelHeight,
                                backgroundColor: isSelected ? '#059669' : item.isProjected ? '#99F6E4' : '#6EE7B7',
                              },
                              isSelected && styles.barActualFillSelected,
                            ]}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.xAxisRow}>
              <View style={{ width: 36 }} />
              <View style={styles.xAxisLabelsContainer}>
                {currentSemData.months.map((item, idx) => {
                  const isSelected = idx === selectedMonthIdx;
                  return (
                    <TouchableOpacity key={item.key} onPress={() => setSelectedMonthIdx(idx)} style={styles.xAxisItem}>
                      <Text style={[styles.xAxisMonthText, isSelected && styles.xAxisMonthTextActive]}>{item.short}</Text>
                      <Text style={[styles.xAxisCountText, isSelected && styles.xAxisCountTextActive]}>
                        {item.isProjected ? 'Proj.' : `${item.present}/${item.total}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.safeStandingPill}>
            <View style={styles.safeStandingLeft}>
              <View style={styles.safeStandingDot} />
              <Text style={styles.safeStandingLabel}>Safe Margin Standing:</Text>
            </View>
            <View style={styles.safeStandingBadge}>
              <Text style={styles.safeStandingBadgeText}>{currentSemData.safeLeavesText}</Text>
            </View>
          </View>
        </View>

        {/* ==================== SUBJECT-WISE BREAKDOWN SECTION ==================== */}
        <View style={styles.breakdownHeader}>
          <Text style={styles.sectionTitle}>Subject-wise Breakdown</Text>
          <Text style={styles.courseCount}>{currentSemData.subjects.length} Total Courses</Text>
        </View>

        {currentSemData.subjects.map((sub) => (
          <View key={sub.id} style={[styles.subjectCard, sub.percentage < 75 && styles.criticalCard]}>
            <View style={styles.subjectRow}>
              <View style={[styles.subjectIcon, { borderColor: sub.color }]}>
                <Text style={[styles.subjectIconText, { color: sub.color }]}>{sub.code}</Text>
              </View>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{sub.name}</Text>
                <Text style={styles.subjectStats}>
                  {sub.attended} of {sub.total} attended • {sub.status}
                </Text>
              </View>
              <View style={styles.subjectRight}>
                <Text style={[styles.subjectPercentage, { color: sub.color }]}>{sub.percentage}%</Text>
                <View style={[styles.leavesBadge, { backgroundColor: `${sub.color}15` }]}>
                  <Text style={[styles.leavesText, { color: sub.color }]}>{sub.leaves}</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${sub.percentage}%`, backgroundColor: sub.color }]} />
            </View>

            {sub.criticalMessage && (
              <View style={styles.criticalAlert}>
                <Ionicons name="warning-outline" size={16} color="#EF4444" />
                <Text style={styles.criticalAlertText}>{sub.criticalMessage}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 6-Hour Breakdown Modal */}
      <Modal visible={selectedDayModal !== null} transparent animationType="fade" onRequestClose={() => setSelectedDayModal(null)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setSelectedDayModal(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedDayModal(null)}>
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
            {selectedDayModal && (
              <>
                <View style={styles.modalHeaderRow}>
                  <View
                    style={[
                      styles.modalDateCircle,
                      selectedDayModal.status === 'present' && { backgroundColor: '#10B981' },
                      selectedDayModal.status === 'absent' && { backgroundColor: '#F43F5E' },
                      selectedDayModal.status === 'off' && { backgroundColor: '#CBD5E1' },
                    ]}
                  >
                    <Text style={styles.modalDateCircleText}>{selectedDayModal.day}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalDateTitle}>
                      {currentSemData.monthTitle.split(' ')[0]} {selectedDayModal.day}, {currentSemData.monthTitle.split(' ')[1]}
                    </Text>
                    <Text
                      style={[
                        styles.modalStatusSub,
                        selectedDayModal.status === 'present' && { color: '#059669' },
                        selectedDayModal.status === 'absent' && { color: '#E11D48' },
                        selectedDayModal.status === 'off' && { color: '#64748B' },
                      ]}
                    >
                      {selectedDayModal.status === 'present'
                        ? `Attended • ${selectedDayModal.detail}`
                        : selectedDayModal.status === 'absent'
                        ? `Absent • ${selectedDayModal.detail}`
                        : `Off Day • ${selectedDayModal.detail}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalDividerRow}>
                  <Text style={styles.modalDividerLeft}>Daily Schedule Breakdown:</Text>
                  <Text style={styles.modalDividerRight}>6 Academic Periods</Text>
                </View>

                <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                  {hourlyScheduleData.map((item, idx) => {
                    const isPresent = selectedDayModal.status === 'present';
                    const isAbsent = selectedDayModal.status === 'absent';
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.periodCard,
                          isPresent && styles.periodCardPresent,
                          isAbsent && styles.periodCardAbsent,
                          selectedDayModal.status === 'off' && styles.periodCardOff,
                        ]}
                      >
                        <View style={styles.periodLeft}>
                          <Feather
                            name={isPresent ? 'check-circle' : isAbsent ? 'x-circle' : 'minus-circle'}
                            size={16}
                            color={isPresent ? '#059669' : isAbsent ? '#F43F5E' : '#94A3B8'}
                            style={{ marginTop: 2, marginRight: 8 }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.periodHourText}>{item.hour}</Text>
                            <Text style={styles.periodSubjectText}>{item.subject}</Text>
                            <Text style={styles.periodProfText}>{item.hall} • {item.prof}</Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.periodBadge,
                            isPresent && { backgroundColor: '#A7F3D0' },
                            isAbsent && { backgroundColor: '#FECDD3' },
                            selectedDayModal.status === 'off' && { backgroundColor: '#E2E8F0' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.periodBadgeText,
                              isPresent && { color: '#064E3B' },
                              isAbsent && { color: '#881337' },
                              selectedDayModal.status === 'off' && { color: '#334155' },
                            ]}
                          >
                            {isPresent ? 'Present' : isAbsent ? 'Absent' : 'No Lecture'}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setSelectedDayModal(null)}>
                  <Text style={styles.modalDoneBtnText}>Close Breakdown</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 18, paddingBottom: 145 },
  attTopBar: { marginTop: 38, marginBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  attTopBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  attAvatarRing: { width: 42, height: 42, borderRadius: 21, padding: 2, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  attAvatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#059669', borderWidth: 2, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  attAvatarText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  attTopBarTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  attQrIconBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', elevation: 1 },

  // 3-Year Selector Styles
  yearSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 10,
    gap: 4,
  },
  yearBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 12,
  },
  yearBtnActive: {
    backgroundColor: '#0F172A',
    elevation: 2,
  },
  yearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  yearBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // 2-Semester Sub-Toggle Styles
  semToggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  semToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 9,
    gap: 6,
  },
  semToggleBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  semDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  semDotActive: {
    backgroundColor: '#059669',
  },
  semToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  semToggleTextActive: {
    color: '#047857',
    fontWeight: '800',
  },

  calendarCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16, elevation: 2 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  calSessionLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.6 },
  calMonthRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  calMonthTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  calAttendedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderColor: '#D1FAE5', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, gap: 6 },
  calAttendedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  calAttendedText: { fontSize: 11, fontWeight: '800', color: '#047857', lineHeight: 14 },

  calStatsBox: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  calStatCol: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  calStatColBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E2E8F0' },
  calStatLabelGreen: { fontSize: 10, fontWeight: '800', color: '#059669' },
  calStatValDark: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginTop: 2 },
  calStatLabelRed: { fontSize: 10, fontWeight: '800', color: '#F43F5E' },
  calStatValRed: { fontSize: 14, fontWeight: '800', color: '#E11D48', marginTop: 2 },
  calStatLabelGrey: { fontSize: 10, fontWeight: '800', color: '#94A3B8' },
  calStatValGrey: { fontSize: 14, fontWeight: '800', color: '#475569', marginTop: 2 },

  weekHeaderRow: { flexDirection: 'row', marginBottom: 8 },
  weekHeaderText: { width: '14.28%', textAlign: 'center', fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCellWrapper: { width: '14.28%', alignItems: 'center', marginVertical: 4 },
  dayCircleEmpty: { width: 36, height: 36 },
  dayCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dayCirclePresent: { backgroundColor: '#10B981' },
  dayCircleAbsent: { backgroundColor: '#F43F5E' },
  dayCircleOff: { backgroundColor: '#F1F5F9' },
  dayCircleSelectedRing: { borderWidth: 2.5, borderColor: '#047857' },
  dayNumberText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  dayNumberTextOff: { color: '#94A3B8', fontWeight: '600' },
  dayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.75)', marginTop: 1 },
  dayDotSelected: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFF' },

  calLegendRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12, marginTop: 10, flexWrap: 'wrap', gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontWeight: '500', color: '#64748B' },
  calHintBanner: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginTop: 10 },
  calHintText: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },

  analyticsCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 22, elevation: 2 },
  analyticsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  analyticsTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  analyticsSubtitle: { fontSize: 11, color: '#64748B', fontWeight: '500', marginTop: 2 },
  monthSelectorBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, gap: 4 },
  monthSelectorText: { fontSize: 11, fontWeight: '800', color: '#065F46' },

  summaryStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 18 },
  summaryCol: { flex: 1 },
  summaryDivider: { width: 1, height: 34, backgroundColor: '#E2E8F0', marginHorizontal: 12 },
  summaryLabel: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  summaryMainVal: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  summarySubText: { fontSize: 11, color: '#64748B', fontWeight: '500', marginTop: 1 },
  summarySubTextGreen: { fontSize: 11, color: '#059669', fontWeight: '700', marginTop: 1 },
  inspectBtn: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 3 },
  inspectBtnText: { fontSize: 10, fontWeight: '800', color: '#047857' },

  cleanChartWrapper: { backgroundColor: '#FAFAFA', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  chartPlotArea: { flexDirection: 'row', height: CHART_HEIGHT + 28, alignItems: 'flex-end' },
  yAxisColumn: { width: 36, height: CHART_HEIGHT, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 8 },
  yAxisText: { fontSize: 9, fontWeight: '700', color: '#94A3B8' },

  plotCanvas: { flex: 1, height: CHART_HEIGHT, position: 'relative', justifyContent: 'flex-end' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#E2E8F0' },
  gridLineBase: { position: 'absolute', left: 0, right: 0, height: 1.5, backgroundColor: '#CBD5E1' },
  gridLineCutoff: { position: 'absolute', left: 0, right: 0, borderBottomWidth: 1.5, borderColor: '#F43F5E', borderStyle: 'dashed', zIndex: 15, flexDirection: 'row', justifyContent: 'flex-end' },
  cutoffPill: { backgroundColor: '#FFE4E6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: -10 },
  cutoffPillText: { fontSize: 8, fontWeight: '800', color: '#E11D48', letterSpacing: 0.4 },

  barsOverlayRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: CHART_HEIGHT, zIndex: 10 },
  barColumnTouch: { alignItems: 'center', width: 52 },
  barValueBubble: { marginBottom: 4, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 },
  barValueBubbleActive: { backgroundColor: '#065F46' },
  barValueBubbleText: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  barValueBubbleTextActive: { color: '#FFF', fontWeight: '800' },

  barSlotTrack: { width: 32, height: CHART_HEIGHT, backgroundColor: 'rgba(226,232,240,0.35)', borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barActualFill: { width: '100%', borderRadius: 8 },
  barActualFillSelected: { borderWidth: 1.5, borderColor: '#064E3B' },

  xAxisRow: { flexDirection: 'row', marginTop: 10 },
  xAxisLabelsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  xAxisItem: { alignItems: 'center', width: 52 },
  xAxisMonthText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  xAxisMonthTextActive: { color: '#059669', fontWeight: '800' },
  xAxisCountText: { fontSize: 10, fontWeight: '500', color: '#94A3B8', marginTop: 1 },
  xAxisCountTextActive: { color: '#047857', fontWeight: '700' },

  safeStandingPill: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', marginTop: 14 },
  safeStandingLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  safeStandingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  safeStandingLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
  safeStandingBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  safeStandingBadgeText: { fontSize: 11, fontWeight: '800', color: '#047857' },

  // Subject-wise Breakdown Styles
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  courseCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 1,
  },
  criticalCard: {
    borderColor: '#FEE2E2',
    borderWidth: 1,
    backgroundColor: '#FEF2F2',
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  subjectIconText: {
    fontSize: 13,
    fontWeight: '800',
  },
  subjectInfo: {
    flex: 1,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  subjectStats: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  subjectRight: {
    alignItems: 'flex-end',
  },
  subjectPercentage: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  leavesBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  leavesText: {
    fontSize: 10,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  criticalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 9,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  criticalAlertText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },

  // Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', alignItems: 'center', padding: 18 },
  modalCard: { width: '100%', maxWidth: 370, backgroundColor: '#FFF', borderRadius: 24, padding: 20 },
  modalCloseBtn: { position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 15, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 30 },
  modalDateCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalDateCircleText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  modalDateTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalStatusSub: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  modalDividerRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingVertical: 8, marginVertical: 12 },
  modalDividerLeft: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  modalDividerRight: { fontSize: 11, color: '#334155', fontWeight: '700' },
  periodCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  periodCardPresent: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' },
  periodCardAbsent: { backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' },
  periodCardOff: { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' },
  periodLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 8 },
  periodHourText: { fontSize: 9, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  periodSubjectText: { fontSize: 12, fontWeight: '800', color: '#0F172A', marginVertical: 1 },
  periodProfText: { fontSize: 10, color: '#64748B' },
  periodBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  periodBadgeText: { fontSize: 10, fontWeight: '700' },
  modalDoneBtn: { backgroundColor: '#059669', borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  modalDoneBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
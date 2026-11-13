import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const TODAY_SCHEDULE = [
  { time: '09:00 AM', title: 'Computer Networks', room: 'Lab 08', prof: 'Dr. Aris Vance', status: 'Completed' },
  { time: '10:30 AM', title: 'Data Structures & Algorithms', room: 'Hall B (Room 402)', prof: 'Prof. Henderson', status: 'Next Up' },
  { time: '01:00 PM', title: 'Database Management Systems', room: 'Seminar Room 1', prof: 'Prof. V. Sharma', status: 'Upcoming' },
  { time: '02:30 PM', title: 'Operating Systems Lab', room: 'Lab 2B', prof: 'TA Sarah Jenkins', status: 'Upcoming' },
];

export default function HomeScreen() {
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  const upperWaveGlide = useRef(new Animated.Value(0)).current;
  const lowerWaveGlide = useRef(new Animated.Value(0)).current;

  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;
  const qrDotBlink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(upperWaveGlide, {
          toValue: 1,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(upperWaveGlide, {
          toValue: 0,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(lowerWaveGlide, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(lowerWaveGlide, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const startBubbleLoop = (anim: Animated.Value, duration: number, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startBubbleLoop(bubble1, 2800, 0);
    startBubbleLoop(bubble2, 3400, 900);
    startBubbleLoop(bubble3, 3000, 1800);

    Animated.loop(
      Animated.sequence([
        Animated.timing(qrDotBlink, {
          toValue: 0.15,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(qrDotBlink, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [upperWaveGlide, lowerWaveGlide, bubble1, bubble2, bubble3, qrDotBlink]);

  const upperWaveTranslateX = upperWaveGlide.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 16],
  });

  const lowerWaveTranslateX = lowerWaveGlide.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -12],
  });

  const getBubbleStyle = (anim: Animated.Value, riseDistance: number) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 0.85, 0.85, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [2, -riseDistance],
        }),
      },
    ],
  });

  const handleProfilePress = () => {
    Alert.alert(
      'Student Profile',
      'Alex • CS-2024-88\nComputer Science (Sem 4)\n\n1 Unread Notification',
      [
        { text: 'Close', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/')
        },
      ]
    );
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingText}>Hello, Alex</Text>
              <View style={styles.rollBadge}>
                <Text style={styles.rollBadgeText} numberOfLines={1}>
                  CS-2024-88
                </Text>
              </View>
            </View>
            <Text style={styles.subtitleText}>
              Here's your academic pulse today
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.avatarContainer}
            onPress={handleProfilePress}
          >
            <View style={styles.avatarOuterRing}>
              <View style={styles.avatarInnerBox}>
                <Text style={styles.avatarInitials}>AL</Text>
              </View>
            </View>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.glowCircleTopRight} />
          <View style={styles.glowCircleBottomRight} />

          <View style={styles.heroHeaderRow}>
            <Text style={styles.heroHeaderTitle} numberOfLines={1}>
              OVERALL ATTENDANCE <Text style={styles.dotSeparator}>•</Text>{' '}
              <Text style={styles.semHighlight}>SEM 4</Text>
            </Text>

            <View style={styles.safeZonePill}>
              <View style={styles.safeZoneDot} />
              <Text style={styles.safeZoneText} numberOfLines={1}>
                Safe Zone (≥75%)
              </Text>
            </View>
          </View>

          <View style={styles.heroBodyRow}>
            <View style={styles.orbOuterRing}>
              <View style={styles.orbContainer}>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.animatedWaveLayer,
                    { transform: [{ translateX: upperWaveTranslateX }] },
                  ]}
                >
                  <Svg width={INNER_ORB + 72} height={INNER_ORB} viewBox="0 0 200 120" preserveAspectRatio="none">
                    <Defs>
                      <LinearGradient id="upperBufferGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#82B7DC" stopOpacity="0.95" />
                        <Stop offset="100%" stopColor="#60A5FA" stopOpacity="0.98" />
                      </LinearGradient>
                    </Defs>
                    <Path
                      d="M0,15 C45,9 95,22 145,13 C172,9 188,12 200,15 L200,120 L0,120 Z"
                      fill="#5294F7"
                    />
                    <Path
                      d="M0,18 C50,24 105,11 155,19 C178,22 190,17 200,18 L200,120 L0,120 Z"
                      fill="url(#upperBufferGrad)"
                    />
                  </Svg>
                </Animated.View>

                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.animatedWaveLayer,
                    { transform: [{ translateX: lowerWaveTranslateX }] },
                  ]}
                >
                  <Svg width={INNER_ORB + 72} height={INNER_ORB} viewBox="0 0 200 120" preserveAspectRatio="none">
                    <Defs>
                      <LinearGradient id="lowerBaseGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#2B6CE6" stopOpacity="1" />
                        <Stop offset="50%" stopColor="#2563EB" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
                      </LinearGradient>
                    </Defs>
                    <Path
                      d="M0,33 C55,29 110,37 160,32 C180,30 192,32 200,33 L200,120 L0,120 Z"
                      fill="url(#lowerBaseGrad)"
                    />
                    <Path
                      d="M0,33 C55,29 110,37 160,32 C180,30 192,32 200,33"
                      stroke="rgba(191, 219, 254, 0.55)"
                      strokeWidth="1.2"
                      fill="none"
                    />
                  </Svg>
                </Animated.View>

                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.waterBubble,
                    { bottom: 6, left: 26, width: 5, height: 5 },
                    getBubbleStyle(bubble1, 14),
                  ]}
                />
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.waterBubble,
                    { bottom: 8, right: 24, width: 8, height: 8 },
                    getBubbleStyle(bubble2, 16),
                  ]}
                />
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.waterBubble,
                    { bottom: 4, left: 50, width: 4, height: 4 },
                    getBubbleStyle(bubble3, 12),
                  ]}
                />

                <View style={styles.orbTextOverlay} pointerEvents="none">
                  <Text style={styles.orbPercentageText}>86.4%</Text>
                  <View style={styles.orbTrendPill}>
                    <Text style={styles.orbTrendText}>+2.1% mo</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.metricsColumn}>
              <View style={styles.metricRowCard}>
                <View style={styles.metricLeftGroup}>
                  <View style={styles.metricIconBlue}>
                    <Feather name="check" size={14} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.metricLabel}>Attended</Text>
                    <Text style={styles.metricValue}>44 / 51</Text>
                  </View>
                </View>
                <View style={styles.presentPill}>
                  <Text style={styles.presentPillText} numberOfLines={1}>
                    Present
                  </Text>
                </View>
              </View>

              <View style={styles.metricRowCard}>
                <View style={styles.metricLeftGroup}>
                  <View style={styles.metricIconRed}>
                    <Feather name="x" size={14} color="#DC2626" />
                  </View>
                  <View>
                    <Text style={styles.metricLabel}>Missed Classes</Text>
                    <Text style={styles.metricValue}>7 Classes</Text>
                  </View>
                </View>
                <View style={styles.missedPill}>
                  <Text style={styles.missedPillText} numberOfLines={1}>
                    Missed
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.qrTriggerCard}
          onPress={() => router.push('/student/scanner')}
        >
          <View style={styles.qrTriggerLeft}>
            <View style={styles.qrIconBox}>
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#109D6D" />
            </View>
            <View style={styles.qrTextWrapper}>
              <View style={styles.qrTitleRow}>
                <Text style={styles.qrCardTitle}>Scan Classroom QR</Text>
                <Animated.View
                  style={[
                    styles.qrLiveDot,
                    { opacity: qrDotBlink },
                  ]}
                />
              </View>
              <Text style={styles.qrCardSubtitle} numberOfLines={1}>
                Room 402 • Data Structures starting in 10m
              </Text>
            </View>
          </View>

          <View style={styles.qrArrowCircle}>
            <Feather name="chevron-right" size={18} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.activitiesHeaderRow}>
          <Text style={styles.activitiesSectionTitle}>NEXT ACTIVITIES</Text>
          <TouchableOpacity onPress={() => setScheduleModalVisible(true)}>
            <Text style={styles.viewScheduleLink}>View Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesList}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.activityCard}
            onPress={() => setScheduleModalVisible(true)}
          >
            <View style={styles.activityLeft}>
              <View style={styles.activityIconSlate}>
                <Feather name="code" size={19} color="#109D6D" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  Data Structures & Algorithms
                </Text>
                <Text style={styles.activitySubtitle} numberOfLines={1}>
                  Prof. Henderson • Hall B
                </Text>
              </View>
            </View>

            <View style={styles.timeBadgeEmerald}>
              <Text style={styles.timeBadgeEmeraldText} numberOfLines={1}>
                10:30 AM
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.activityCard}
            onPress={() =>
              Alert.alert(
                'OS Process Scheduling',
                'Assignment 4 • Operating Systems\nDue: Tomorrow at 11:59 PM\nSubmit via Courses > Assignments tab.'
              )
            }
          >
            <View style={styles.activityLeft}>
              <View style={styles.activityIconAmber}>
                <Feather name="clipboard" size={19} color="#D97706" />
              </View>
              <View style={styles.activityInfo}>
                <View style={styles.assignmentTitleRow}>
                  <Text style={styles.activityTitleShrink} numberOfLines={1}>
                    OS Process Scheduling
                  </Text>
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText} numberOfLines={1}>
                      Urgent
                    </Text>
                  </View>
                </View>
                <Text style={styles.activitySubtitle} numberOfLines={1}>
                  Assignment 4 • Operating Systems
                </Text>
              </View>
            </View>

            <View style={styles.timeBadgeSlate}>
              <Text style={styles.timeBadgeSlateText} numberOfLines={1}>
                Tomorrow
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setScheduleModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Today's Class Schedule</Text>
                  <Text style={styles.modalSubtitle}>Semester 4 • CS-2024-88</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setScheduleModalVisible(false)}
                >
                  <Feather name="x" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {TODAY_SCHEDULE.map((item, index) => (
                <View key={index} style={styles.scheduleItemRow}>
                  <View style={styles.scheduleTimeCol}>
                    <Text style={styles.scheduleTimeText}>{item.time}</Text>
                    <Text
                      style={[
                        styles.scheduleStatusText,
                        item.status === 'Next Up' && { color: '#109D6D', fontWeight: '800' },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <View style={styles.scheduleDetailsCol}>
                    <Text style={styles.scheduleCourseTitle}>{item.title}</Text>
                    <Text style={styles.scheduleCourseMeta}>
                      {item.prof} • {item.room}
                    </Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => setScheduleModalVisible(false)}
              >
                <Text style={styles.modalDoneBtnText}>Close Schedule</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const ORB_SIZE = 126;
const INNER_ORB = 116;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 145,
  },
  headerRow: {
    marginTop: 34,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 8,
  },
  greetingText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  rollBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
  },
  rollBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarOuterRing: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#10B981',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInnerBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  glowCircleTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(219, 234, 254, 0.45)',
  },
  glowCircleBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(191, 219, 254, 0.3)',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  heroHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  dotSeparator: {
    color: '#94A3B8',
  },
  semHighlight: {
    color: '#047857',
    fontWeight: '900',
  },
  safeZonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    flexShrink: 0,
  },
  safeZoneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  safeZoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  heroBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  orbOuterRing: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    padding: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContainer: {
    width: INNER_ORB,
    height: INNER_ORB,
    borderRadius: INNER_ORB / 2,
    backgroundColor: '#F1F6FF',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedWaveLayer: {
    position: 'absolute',
    top: 0,
    left: -36,
    width: INNER_ORB + 72,
    height: INNER_ORB,
  },
  waterBubble: {
    position: 'absolute',
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    zIndex: 10,
  },
  orbTextOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: INNER_ORB,
    height: INNER_ORB,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
  },
  orbPercentageText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 24,
    includeFontPadding: false,
    textAlign: 'center',
    textShadowColor: 'rgba(15, 23, 42, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  orbTrendPill: {
    marginTop: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  orbTrendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EFF6FF',
    includeFontPadding: false,
  },
  metricsColumn: {
    flex: 1,
    gap: 10,
  },
  metricRowCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  metricIconBlue: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconRed: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  presentPill: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
  },
  presentPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857',
  },
  missedPill: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
  },
  missedPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#DC2626',
  },
  qrTriggerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#109D6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  qrTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 13,
  },
  qrIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrTextWrapper: {
    flex: 1,
  },
  qrTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  qrLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  qrCardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
  },
  qrArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#109D6D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activitiesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  activitiesSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  viewScheduleLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#109D6D',
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 12,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 12,
  },
  activityIconSlate: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIconAmber: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  assignmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityTitleShrink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    flexShrink: 1,
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    flexShrink: 0,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  activitySubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
  },
  timeBadgeEmerald: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexShrink: 0,
  },
  timeBadgeEmeraldText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  timeBadgeSlate: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexShrink: 0,
  },
  timeBadgeSlateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 370,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scheduleTimeCol: {
    width: 78,
  },
  scheduleTimeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  scheduleStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  scheduleDetailsCol: {
    flex: 1,
    paddingLeft: 8,
  },
  scheduleCourseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  scheduleCourseMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalDoneBtn: {
    marginTop: 16,
    backgroundColor: '#109D6D',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
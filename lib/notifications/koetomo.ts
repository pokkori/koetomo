import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissionAsync(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyRemindersAsync(): Promise<void> {
  const granted = await requestNotificationPermissionAsync();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  // 毎日20時: 夕方の振り返りリマインダー（傾聴型）
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'コエトモ',
      body: '今日はどんな気持ちでしたか？30秒で記録できます',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });

  // 毎日21時: メインリマインダー
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'コエトモタイムですよ',
      body: '声で話しかけるだけでOKです。今日の気持ちを聞かせてください。',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 0,
    },
  });

  // 毎日22時: ストリーク継続促進
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'コエトモが待っています',
      body: '1分だけでも話しかけてみませんか？',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 22,
      minute: 0,
    },
  });
}

/** 20時の夕方振り返り通知のみを個別にスケジュール（傾聴型） */
export async function scheduleEveningReflectionNotification(): Promise<void> {
  const granted = await requestNotificationPermissionAsync();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'コエトモ',
      body: '今日はどんな気持ちでしたか？30秒で記録できます',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

export async function sendStreakMilestoneNotification(streakDays: number): Promise<void> {
  const messages: Record<number, { title: string; body: string }> = {
    7: {
      title: '7日連続達成！',
      body: 'コエトモのともだち認定です。ありがとうございます。',
    },
    30: {
      title: '30日連続達成！',
      body: '「こころの記録者」称号獲得。1ヶ月の感情グラフを確認してみてください。',
    },
    100: {
      title: '100日連続達成！',
      body: '100日間の成長を振り返る特別レポートが生成されました。',
    },
  };

  const msg = messages[streakDays];
  if (!msg) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: msg.title,
      body: msg.body,
      sound: true,
    },
    trigger: null,
  });
}

export async function sendWeeklySummaryNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '今週の感情まとめが完成しました',
      body: '7日間の感情グラフを確認してみてください。',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // 日曜日
      hour: 21,
      minute: 0,
    },
  });
}

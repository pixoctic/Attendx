// app/index.tsx
import { Redirect } from 'expo-router';

export default function RootEntry() {
  return <Redirect href="/student" />;
}
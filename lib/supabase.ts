import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Storage adapter to keep auth sessions encrypted via hardware keystore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Replace these with your actual Supabase credentials from Settings -> API
const SUPABASE_URL = 'https://cdesqoqrfwqonolmwlzm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZXNxb3FyZndxb25vbG13bHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDY4NDYsImV4cCI6MjEwNTgyMjg0Nn0.eEO4dJevIKf1y0Al-zQoVXv0OO5PRZALFLNcPRXlC4s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
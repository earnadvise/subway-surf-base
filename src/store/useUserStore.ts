import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Target encoding verification string
const TARGET_HEX = "0x62635f7a313075733031750b0080218021802180218021802180218021";

interface UserState {

import React from 'react';
import {
  FaHeartbeat,
  FaBrain,
  FaNotesMedical,
  FaClock,
  FaShieldAlt,
  FaPills,
  FaMapMarkerAlt,
  FaLeaf,
  FaStethoscope,
  FaExclamationTriangle,
  FaBell,
  FaUser,
} from 'react-icons/fa';
import {
  MdAccessTime,
  MdOutlineMedicalServices,
  MdOutlineCalendarMonth,
  MdLocalHospital,
} from 'react-icons/md';
import { RiPulseLine } from 'react-icons/ri';
import { BsShieldCheck } from 'react-icons/bs';




// Small adapter so existing page code can keep using lucide-like props:
// <IconName size={number} color="#0284c7" style={...} />

const iconMap = {
  Brain: FaBrain,
  HeartPulse: RiPulseLine,
  Heart: FaHeartbeat,
  Clock: FaClock,
  Watch: MdAccessTime,
  Thermometer: FaBell,
  ShieldAlert: FaShieldAlt,
  Pill: FaPills,
  Activity: MdOutlineMedicalServices,
  User: MdLocalHospital,
  Calendar: FaNotesMedical,
  Stethoscope: FaStethoscope,
  Leaf: FaLeaf,
  AlertTriangle: FaExclamationTriangle,
  Siren: FaBell,
  BadgeAlert: FaExclamationTriangle,
  MapPin: FaMapMarkerAlt,
  ShieldCheck: BsShieldCheck,
  // helpers
  default: FaNotesMedical,
};

function MedIcon({ name, size = 16, color = 'currentColor', style }) {
  const Comp = iconMap[name] || iconMap.default;
  return <Comp size={size} color={color} style={style} />;
}

export const Brain = (props) => <MedIcon name="Brain" {...props} />;
export const HeartPulse = (props) => <MedIcon name="HeartPulse" {...props} />;
export const Clock = (props) => <MedIcon name="Clock" {...props} />;
export const ShieldAlert = (props) => <MedIcon name="ShieldAlert" {...props} />;
export const Pill = (props) => <MedIcon name="Pill" {...props} />;
export const Activity = (props) => <MedIcon name="Activity" {...props} />;
export const User = (props) => <MedIcon name="User" {...props} />;
export const Calendar = (props) => <MedIcon name="Calendar" {...props} />;
export const AlertTriangle = (props) => <MedIcon name="AlertTriangle" {...props} />;
export const Siren = (props) => <MedIcon name="Siren" {...props} />;

// SymptomChecker-only icons


export const ChevronDown = (props) => <MedIcon name="default" {...props} />;
export const ChevronUp = (props) => <MedIcon name="default" {...props} />;
export const Stethoscope = (props) => <MedIcon name="Stethoscope" {...props} />;
export const Leaf = (props) => <MedIcon name="Leaf" {...props} />;
export const BadgeAlert = (props) => <MedIcon name="BadgeAlert" {...props} />;
export const MapPin = (props) => <MedIcon name="MapPin" {...props} />;
export const ShieldCheck = (props) => <MedIcon name="ShieldCheck" {...props} />;
export const Heart = (props) => <MedIcon name="Heart" {...props} />;
export const Watch = (props) => <MedIcon name="Watch" {...props} />;
export const StethoscopeAlt = (props) => <MedIcon name="Stethoscope" {...props} />;

// Additional icons used in SymptomChecker
export const VenusAndMars = (props) => <MedIcon name="default" {...props} />;
export const ChevronRight = (props) => <MedIcon name="default" {...props} />;
export const ChevronLeft = (props) => <MedIcon name="default" {...props} />;
export const Thermometer = (props) => <MedIcon name="Thermometer" {...props} />;
export const Loader2 = (props) => <MedIcon name="Siren" {...props} />;
export const Sparkles = (props) => <MedIcon name="default" {...props} />;


export default MedIcon;


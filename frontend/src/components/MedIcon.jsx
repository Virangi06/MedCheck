import React from 'react';
import {
  Brain as BrainIcon,
  HeartPulse as HeartPulseIcon,
  Heart as HeartIcon,
  Clock as ClockIcon,
  Watch as WatchIcon,
  Thermometer as ThermometerIcon,
  ShieldAlert as ShieldAlertIcon,
  Pill as PillIcon,
  Activity as ActivityIcon,
  Hospital as HospitalIcon,
  Calendar as CalendarIcon,
  Stethoscope as StethoscopeIcon,
  Leaf as LeafIcon,
  AlertTriangle as AlertTriangleIcon,
  Siren as SirenIcon,
  BadgeAlert as BadgeAlertIcon,
  MapPin as MapPinIcon,
  ShieldCheck as ShieldCheckIcon,
  Download as DownloadIcon,
  Users as UsersIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Loader2 as Loader2Icon,
  Sparkles as SparklesIcon,
  ClipboardList as ClipboardListIcon,
} from 'lucide-react';

const iconMap = {
  Brain: BrainIcon,
  HeartPulse: HeartPulseIcon,
  Heart: HeartIcon,
  Clock: ClockIcon,
  Watch: WatchIcon,
  Thermometer: ThermometerIcon,
  ShieldAlert: ShieldAlertIcon,
  Pill: PillIcon,
  Activity: ActivityIcon,
  User: HospitalIcon,
  Calendar: CalendarIcon,
  Stethoscope: StethoscopeIcon,
  Leaf: LeafIcon,
  AlertTriangle: AlertTriangleIcon,
  Siren: SirenIcon,
  BadgeAlert: BadgeAlertIcon,
  MapPin: MapPinIcon,
  ShieldCheck: ShieldCheckIcon,
  Download: DownloadIcon,
  VenusAndMars: UsersIcon,
  ChevronRight: ChevronRightIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  Loader2: Loader2Icon,
  Sparkles: SparklesIcon,
  default: ClipboardListIcon,
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

export const ChevronDown = (props) => <MedIcon name="ChevronDown" {...props} />;
export const ChevronUp = (props) => <MedIcon name="ChevronUp" {...props} />;
export const Stethoscope = (props) => <MedIcon name="Stethoscope" {...props} />;
export const Leaf = (props) => <MedIcon name="Leaf" {...props} />;
export const BadgeAlert = (props) => <MedIcon name="BadgeAlert" {...props} />;
export const MapPin = (props) => <MedIcon name="MapPin" {...props} />;
export const ShieldCheck = (props) => <MedIcon name="ShieldCheck" {...props} />;
export const Heart = (props) => <MedIcon name="Heart" {...props} />;
export const Watch = (props) => <MedIcon name="Watch" {...props} />;
export const StethoscopeAlt = (props) => <MedIcon name="Stethoscope" {...props} />;

export const VenusAndMars = (props) => <MedIcon name="VenusAndMars" {...props} />;
export const ChevronRight = (props) => <MedIcon name="ChevronRight" {...props} />;
export const ChevronLeft = (props) => <MedIcon name="ChevronLeft" {...props} />;
export const Thermometer = (props) => <MedIcon name="Thermometer" {...props} />;
export const Loader2 = (props) => <MedIcon name="Loader2" {...props} />;
export const Sparkles = (props) => <MedIcon name="Sparkles" {...props} />;
export const Download = (props) => <MedIcon name="Download" {...props} />;

export default MedIcon;

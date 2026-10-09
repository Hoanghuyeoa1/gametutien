// lib/types/disciple-appointment.ts
// Pure Domain Types cho phân hệ "Bổ Nhiệm Tiên Đồng Xuất Sư (Disciple Graduation & Dominion Appointment)"

export type DiscipleAppointmentRole = 'none' | 'tinh_hai_guardian' | 'sect_treasury_deacon';

export interface DiscipleSpecialtyBonus {
  starHarvestMultiplier?: number;    // Gia tốc sản lượng Tinh Hải (+10% ~ +50%, dạng thập phân 0.1 - 0.5)
  starDefenseBonus?: number;         // Tăng thủ ngự cứ điểm chống cướp phá (+15% ~ +60%, dạng thập phân 0.15 - 0.6)
  treasuryEfficiency?: number;       // Tăng sản lượng linh thạch / tài nguyên tông môn (+10% ~ +40%, dạng thập phân 0.1 - 0.4)
  resourceDecayReduction?: number;   // Giảm tiêu hao vận hành khố phòng (-15% ~ -40%, dạng thập phân 0.15 - 0.4)
}

export interface DiscipleAppointmentData {
  isGraduated: boolean;
  graduatedAt?: number;
  graduationRealmIndex: number;      // Cảnh giới khi xuất sư (tối thiểu Hóa Thần Kỳ >= 26)
  assignedRole: DiscipleAppointmentRole;
  assignedTargetId?: string | null;  // ID của cứ điểm Tinh Hải hoặc ID Khố Phòng Tông Môn
  assignedAt?: number;
  loyalty: number;                   // Trung thành 0 - 100
  meritPoints: number;               // Điểm công trạng tích lũy khi làm nhiệm vụ
  specialtyBonus: DiscipleSpecialtyBonus;
}

export interface AppointmentYieldResult {
  resourceBonus: Record<string, number>;
  decaySaved: Record<string, number>;
  meritGained: number;
  loyaltyDelta: number;
  defenseRating: number;
}

export interface GraduationCheckResult {
  eligible: boolean;
  reason?: string;
}

export interface AppointmentCheckResult {
  eligible: boolean;
  reason?: string;
}

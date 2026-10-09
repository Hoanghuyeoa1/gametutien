'use client';
// components/modals/SaveManagementModal.tsx
// Modal Quản Lý Lưu Trữ, Tiên Thư Bản Thể (Mã Hóa Base64 + Checksum Adler-32) và 3 Bản Lưu Snapshot

import React, { useState, useEffect } from 'react';
import {
  Save,
  Copy,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  X,
  Sparkles,
  RotateCcw,
  FileText,
  KeyRound,
  Database
} from 'lucide-react';
import type { PlayerStats } from '@/lib/types';
import {
  exportSaveToEncryptedString,
  importSaveFromEncryptedString,
  getAllSlotsMetadata,
  SaveSlotMetadata,
  SLOT_TITLES
} from '@/lib/save-encryption';

export interface SaveManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  onSaveProgress: () => boolean;
  onExportEncryptedString: () => string;
  onImportEncryptedString: (str: string) => boolean;
  onRestoreSnapshot: (slotIndex: 1 | 2 | 3) => boolean;
  onSaveSnapshot: (slotIndex: 1 | 2 | 3, reason?: string) => boolean;
  onExportJson?: () => string;
  onImportJson?: (json: string) => boolean;
  showToast?: (msg: string) => void;
  onResetNewGame?: () => void;
}

export const SaveManagementModal: React.FC<SaveManagementModalProps> = ({
  isOpen,
  onClose,
  player,
  onSaveProgress,
  onExportEncryptedString,
  onImportEncryptedString,
  onRestoreSnapshot,
  onSaveSnapshot,
  onExportJson,
  onImportJson,
  showToast,
  onResetNewGame
}) => {
  const [activeTab, setActiveTab] = useState<'tienthu' | 'snapshots' | 'json'>('tienthu');
  const [inputString, setInputString] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmResetNewGame, setConfirmResetNewGame] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    detectedPlayer?: PlayerStats;
  }>({ tested: false, valid: false, message: '' });

  const [snapshots, setSnapshots] = useState<SaveSlotMetadata[]>([]);
  const [confirmRestoreSlot, setConfirmRestoreSlot] = useState<(1 | 2 | 3) | null>(null);

  // Cập nhật thông tin snapshots khi mở modal
  const refreshSnapshots = () => {
    setSnapshots(getAllSlotsMetadata());
  };

  useEffect(() => {
    if (isOpen) {
      refreshSnapshots();
      setVerifyResult({ tested: false, valid: false, message: '' });
      setInputString('');
      setCopied(false);
      setConfirmResetNewGame(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý sao chép Tiên Thư
  const handleCopyEncrypted = () => {
    const enc = onExportEncryptedString();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    showToast?.('Đã sao chép Tiên Thư Bản Thể vào bộ nhớ tạm!');
  };

  // Kiểm tra tính hợp lệ của chuỗi Tiên Thư nhập vào
  const handleVerifyString = () => {
    if (!inputString.trim()) {
      setVerifyResult({
        tested: true,
        valid: false,
        message: 'Vui lòng dán chuỗi Tiên Thư vào ô nhập liệu trước!'
      });
      return;
    }

    const res = importSaveFromEncryptedString(inputString.trim());
    if (res.success && res.data) {
      setVerifyResult({
        tested: true,
        valid: true,
        message: `Mã kiểm tra toàn vẹn hợp lệ! Đạo hiệu: [${res.data.name}] | Cảnh giới: Cấp ${res.data.currentRealm ?? 0} | Linh thạch: ${(res.data.linhThach ?? 0).toLocaleString()}`,
        detectedPlayer: res.data
      });
    } else {
      setVerifyResult({
        tested: true,
        valid: false,
        message: res.errorMessage || 'Chuỗi Tiên Thư không hợp lệ hoặc Checksum bị sai lệch!'
      });
    }
  };

  // Nạp Tiên Thư vào game
  const handleApplyEncrypted = () => {
    if (!verifyResult.valid) {
      handleVerifyString();
      return;
    }
    const success = onImportEncryptedString(inputString.trim());
    if (success) {
      refreshSnapshots();
      onClose();
    }
  };

  // Khôi phục snapshot
  const handleConfirmRestore = (slot: 1 | 2 | 3) => {
    const success = onRestoreSnapshot(slot);
    if (success) {
      refreshSnapshots();
      setConfirmRestoreSlot(null);
      onClose();
    }
  };

  // Ghi đè snapshot
  const handleOverwriteSnapshot = (slot: 1 | 2 | 3) => {
    const reason = slot === 3 ? 'Lưu mốc trọng đại' : 'Lưu thủ công';
    onSaveSnapshot(slot, reason);
    refreshSnapshots();
    showToast?.(`Đã ghi đè dữ liệu vào Slot ${slot}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-3xl w-full p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-4 max-h-[92vh] overflow-hidden flex flex-col bg-[#0c0c14]/95 text-zinc-200 relative">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-950/80 to-teal-900/40 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                  Client-First Bảo Mật Tuyệt Đối
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Adler-32 Checksum
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200 tracking-wide mt-0.5">
                TIÊN THƯ LƯU TRỮ • SAO LƯU ĐA TẦNG
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-rose-300 transition cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900/60"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nút Hành Động Nhanh */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSaveProgress();
                refreshSnapshots();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-500/60 text-emerald-200 text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lưu Nhanh Ngay</span>
            </button>
            <button
              onClick={handleCopyEncrypted}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-950/60 to-yellow-950/60 hover:from-amber-900/60 hover:to-yellow-900/60 border border-amber-500/60 text-amber-200 text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)] cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>{copied ? 'Đã Chép Tiên Thư!' : 'Chép Tiên Thư (Mã Hóa)'}</span>
            </button>
          </div>
          <span className="text-[11px] text-zinc-400 font-serif">
            Đạo hữu: <strong className="text-amber-300">{player.name}</strong> • Cảnh giới: <span className="text-emerald-300 font-mono">Cấp {player.currentRealm ?? 0}</span>
          </span>
        </div>

        {/* Tab chuyển đổi: Tiên Thư Mã Hóa | 3 Bản Lưu Snapshot | JSON */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('tienthu')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tienthu'
                ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tiên Thư Bản Thể (Chuỗi Mã Hóa)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('snapshots');
              refreshSnapshots();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'snapshots'
                ? 'bg-blue-950/80 border border-blue-500/60 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>3 Bản Lưu Snapshot (Luân Phiên)</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'bg-purple-950/80 border border-purple-500/60 text-purple-200'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Tệp JSON Thô</span>
          </button>
        </div>

        {/* Nội dung Tab */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
          
          {/* TAB 1: TIÊN THƯ BẢN THỂ (ENCRYPTED STRING) */}
          {activeTab === 'tienthu' && (
            <div className="space-y-4">
              {/* Giới thiệu tính năng */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-zinc-300 space-y-1 font-serif">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cơ chế Tiên Thư Bản Thể:</span>
                </div>
                <p>
                  Toàn bộ dữ liệu nhân vật, đan dược, pháp bảo và linh căn được nén và mã hóa thành một chuỗi văn bản duy nhất có tiền tố <code className="text-amber-300 font-mono">GTT_SAVE_V1$</code> và mã kiểm tra Adler-32.
                </p>
                <p className="text-[11px] text-zinc-400">
                  💡 Bạn có thể sao chép chuỗi này lưu vào ứng dụng Ghi chú, Zalo Cloud, Google Drive để mang dữ liệu sang máy tính hoặc điện thoại khác chơi tiếp bất cứ lúc nào!
                </p>
              </div>

              {/* Ô Nhập & Khôi Phục Tiên Thư */}
              <div className="space-y-2">
                <label className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dán Chuỗi Tiên Thư Để Khôi Phục Tiến Trình:</span>
                </label>
                <textarea
                  value={inputString}
                  onChange={e => {
                    setInputString(e.target.value);
                    setVerifyResult({ tested: false, valid: false, message: '' });
                  }}
                  rows={4}
                  placeholder="Dán chuỗi bắt đầu bằng GTT_SAVE_V1$... vào đây để khôi phục nhân vật..."
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-zinc-700 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 custom-scrollbar resize-none"
                />

                {/* Kết quả kiểm tra */}
                {verifyResult.tested && (
                  <div className={`p-2.5 rounded-xl border text-xs font-serif flex items-start gap-2 ${
                    verifyResult.valid
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                  }`}>
                    {verifyResult.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold">{verifyResult.valid ? 'Toàn vẹn thành công:' : 'Lỗi kiểm tra:'}</p>
                      <p className="text-[11px] opacity-90">{verifyResult.message}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleVerifyString}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 text-xs font-serif transition cursor-pointer"
                  >
                    🔍 Kiểm Tra Tính Toàn Vẹn
                  </button>
                  <button
                    onClick={handleApplyEncrypted}
                    disabled={!inputString.trim()}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-zinc-950 font-serif font-bold text-xs transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    📥 Nạp Tiên Thư & Khôi Phục Đạo Quả
                  </button>
                </div>
              </div>

              {/* Xuất Tiên Thư Hiện Tại */}
              <div className="space-y-1.5 border-t border-zinc-800 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-zinc-300">
                    Tiên Thư Bản Thể Hiện Tại Của Đạo Hữu:
                  </span>
                  <button
                    onClick={handleCopyEncrypted}
                    className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer font-serif"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Sao chép toàn bộ</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 break-all max-h-24 overflow-y-auto custom-scrollbar select-all">
                  {exportSaveToEncryptedString(player)}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3 BẢN LƯU SNAPSHOT */}
          {activeTab === 'snapshots' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-zinc-300 font-serif">
                Hệ thống tự động duy trì 3 khe lưu trữ độc lập tại trình duyệt để bảo vệ đạo quả trước rủi ro xóa cache hoặc lỗi mạng:
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {snapshots.map(slotMeta => (
                  <div
                    key={slotMeta.slot}
                    className={`p-3.5 rounded-xl border transition-all ${
                      slotMeta.exists
                        ? 'bg-zinc-900/40 border-zinc-700/80 hover:border-zinc-600'
                        : 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold text-zinc-100 flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-blue-400" />
                            {slotMeta.title}
                          </span>
                          {slotMeta.exists ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-mono">
                              Đã Lưu
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-500 font-mono">
                              Trống
                            </span>
                          )}
                        </div>

                        {slotMeta.exists ? (
                          <div className="text-xs text-zinc-300 font-serif space-y-0.5">
                            <div>
                              Đạo hiệu: <strong className="text-amber-300">{slotMeta.characterName}</strong> • Cảnh giới: <span className="text-emerald-300">{slotMeta.realmName} (Cấp {slotMeta.realmLevel})</span>
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                {slotMeta.savedAtFormatted}
                              </span>
                              <span>• Linh thạch: {(slotMeta.linhThach ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] text-zinc-500 italic font-serif">
                            Chưa có dữ liệu bản lưu trong khe này.
                          </p>
                        )}
                      </div>

                      {/* Các nút hành động cho slot */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOverwriteSnapshot(slotMeta.slot)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 text-xs font-serif transition cursor-pointer flex items-center gap-1"
                          title="Lưu trạng thái hiện tại vào slot này"
                        >
                          <Save className="w-3 h-3 text-zinc-400" />
                          <span>Ghi Đè</span>
                        </button>

                        {slotMeta.exists && (
                          <button
                            onClick={() => setConfirmRestoreSlot(slotMeta.slot)}
                            className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800/60 border border-blue-500/60 text-blue-200 text-xs font-serif font-bold transition cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                            title="Khôi phục dữ liệu từ slot này"
                          >
                            <RotateCcw className="w-3 h-3 text-blue-300" />
                            <span>Khôi Phục</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hộp thoại xác nhận khôi phục */}
                    {confirmRestoreSlot === slotMeta.slot && (
                      <div className="mt-3 p-3 rounded-lg bg-rose-950/80 border border-rose-600/60 text-xs text-rose-200 space-y-2 animate-in fade-in duration-200">
                        <p className="font-serif font-bold">
                          ⚠️ Cảnh báo: Khôi phục sẽ ghi đè toàn bộ tiến trình hiện tại bằng dữ liệu của {slotMeta.title}! Đạo hữu có chắc chắn muốn tiến hành?
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConfirmRestore(slotMeta.slot)}
                            className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition cursor-pointer"
                          >
                            Xác Nhận Khôi Phục
                          </button>
                          <button
                            onClick={() => setConfirmRestoreSlot(null)}
                            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                          >
                            Hủy Bỏ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TỆP JSON TRUYỀN THỐNG */}
          {activeTab === 'json' && (
            <div className="space-y-3 font-serif text-xs">
              <p className="text-zinc-400">
                Xuất hoặc nạp tệp văn bản định dạng JSON thô truyền thống:
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const json = onExportJson ? onExportJson() : JSON.stringify(player, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `gametutien_${player.name || 'save'}_${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast?.('Đã tải xuống tệp lưu trữ JSON!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Tải Xuống Tệp JSON</span>
                </button>
              </div>
            </div>
          )}

          {/* KHỞI TẠO LẠI NHÂN VẬT MỚI (NEW GAME / RESET SLATE) */}
          <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-950/20 p-3 rounded-xl border border-rose-900/30">
            <div className="space-y-0.5 text-left">
              <span className="text-xs font-serif font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                KHỞI TẠO LẠI TỪ ĐẦU (FRESH NEW GAME)
              </span>
              <p className="text-[10px] text-zinc-400 font-serif">
                Xóa bỏ tiến trình nhân vật hiện tại và bắt đầu lại cuộc đời tu tiên mới từ cấp 0.
              </p>
            </div>

            <button
              onClick={() => setConfirmResetNewGame(true)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/70 text-rose-200 text-xs font-serif font-bold transition cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(225,29,72,0.2)] shrink-0"
              title="Khởi tạo lại nhân vật từ con số 0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
              <span>⚠️ Khởi Tạo Lại Nhân Vật Mới (New Game)</span>
            </button>
          </div>

          {/* Hộp thoại xác nhận khởi tạo mới 2 bước */}
          {confirmResetNewGame && (
            <div className="p-3.5 rounded-xl bg-rose-950/95 border-2 border-rose-600 text-xs text-rose-100 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                <span className="font-serif font-bold text-rose-200 text-sm">
                  CẢNH BÁO NGUY HIỂM: KHỞI TẠO LẠI TỪ ĐẦU
                </span>
              </div>
              <p className="font-serif text-[11px] text-zinc-300 leading-relaxed">
                Đạo hữu có chắc chắn muốn bỏ qua Luân Hồi và làm lại từ đầu? Mọi điểm Karma, Pháp bảo phong ấn và tiến trình trước đây sẽ bị xóa hoàn toàn. Ngươi sẽ tái sinh thành một phàm nhân sơ khởi!
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setConfirmResetNewGame(false);
                    if (onResetNewGame) {
                      onResetNewGame();
                      onClose();
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-serif font-bold transition cursor-pointer shadow-md"
                >
                  Xác Nhận Tạo Lại
                </button>
                <button
                  onClick={() => setConfirmResetNewGame(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif transition cursor-pointer"
                >
                  Quay Lại
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default SaveManagementModal;

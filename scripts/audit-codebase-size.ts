// scripts/audit-codebase-size.ts
// Automated Telemetry & Codebase Size Auditor for GAMETUTIEN
// Run: npx tsx scripts/audit-codebase-size.ts

import * as fs from 'fs';
import * as path from 'path';

interface FileStatInfo {
  filePath: string;
  relativePath: string;
  lines: number;
  sizeBytes: number;
  sizeKb: number;
  extension: string;
  category: 'logic' | 'component' | 'data' | 'hook' | 'script' | 'other';
}

const ROOT_DIR = path.resolve(__dirname, '..');
const TARGET_DIRS = ['lib', 'components', 'hooks', 'scripts', 'data', 'app'];
const IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  '.gemini',
  'dist',
  'out',
  'build',
  'coverage',
  '.ag-kernel.json'
];

function shouldIgnore(fullPath: string): boolean {
  const rel = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
  const parts = rel.split('/');
  return parts.some(p => ['node_modules', '.next', '.git', 'dist', 'out', 'build', 'coverage', '.ag-kernel.json'].includes(p));
}

function countLines(content: string): number {
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function determineCategory(relPath: string): FileStatInfo['category'] {
  const norm = relPath.replace(/\\/g, '/');
  if (norm.startsWith('data/') || norm.includes('-data.ts') || norm.includes('data.ts') || norm.endsWith('.json')) {
    return 'data';
  }
  if (norm.startsWith('components/') || norm.endsWith('.tsx')) {
    return 'component';
  }
  if (norm.startsWith('hooks/')) {
    return 'hook';
  }
  if (norm.startsWith('scripts/')) {
    return 'script';
  }
  if (norm.startsWith('lib/')) {
    return 'logic';
  }
  return 'other';
}

function scanDirectory(dir: string, results: FileStatInfo[] = []): FileStatInfo[] {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (shouldIgnore(fullPath)) continue;

    if (entry.isDirectory()) {
      scanDirectory(fullPath, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ts', '.tsx', '.json', '.js', '.jsx'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = countLines(content);
          const stat = fs.statSync(fullPath);
          const relPath = path.relative(ROOT_DIR, fullPath);

          results.push({
            filePath: fullPath,
            relativePath: relPath,
            lines,
            sizeBytes: stat.size,
            sizeKb: Math.round((stat.size / 1024) * 10) / 10,
            extension: ext,
            category: determineCategory(relPath)
          });
        } catch {
          // Bỏ qua file lỗi đọc
        }
      }
    }
  }

  return results;
}

function runAudit() {
  console.log('====================================================================');
  console.log('🔍 GAMETUTIEN CODEBASE ARCHITECTURAL AUDIT & TELEMETRY');
  console.log('====================================================================\n');

  const allFiles: FileStatInfo[] = [];
  for (const dirName of TARGET_DIRS) {
    const fullDirPath = path.join(ROOT_DIR, dirName);
    scanDirectory(fullDirPath, allFiles);
  }

  const totalLines = allFiles.reduce((acc, f) => acc + f.lines, 0);
  const totalBytes = allFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
  const totalKb = Math.round((totalBytes / 1024) * 10) / 10;

  console.log(`📊 TỔNG QUAN HỆ THỐNG:`);
  console.log(`- Tổng số files kiểm toán: ${allFiles.length} files`);
  console.log(`- Tổng số dòng code (LOC): ${totalLines.toLocaleString()} dòng`);
  console.log(`- Tổng dung lượng mã nguồn: ${totalKb.toLocaleString()} KB (${(totalKb / 1024).toFixed(2)} MB)\n`);

  // 1. TOP 10 LOGIC MONOLITHS (lib/**/*.ts)
  const logicFiles = allFiles
    .filter(f => f.category === 'logic' && f.lines >= 400)
    .sort((a, b) => b.lines - a.lines);

  console.log('--------------------------------------------------------------------');
  console.log('🔥 TOP 10 MONOLITHIC LOGIC FILES (`lib/**/*.ts` >= 400 LOC)');
  console.log('--------------------------------------------------------------------');
  console.log('| Hạng | Đường Dẫn Tệp | Số Dòng (LOC) | Dung Lượng (KB) | Đánh Giá Rủi Ro |');
  console.log('|:---:|:---|:---:|:---:|:---|');
  logicFiles.slice(0, 10).forEach((f, idx) => {
    let risk = '🟡 Trung Bình';
    if (f.lines > 1500 || f.sizeKb > 60) risk = '🔴 CỰC NGUY CẤP (God File)';
    else if (f.lines > 800 || f.sizeKb > 35) risk = '🟠 Cao';
    console.log(`| ${idx + 1} | \`${f.relativePath}\` | ${f.lines.toLocaleString()} | ${f.sizeKb} KB | ${risk} |`);
  });
  console.log('\n');

  // 2. TOP 10 GOD COMPONENTS (components/**/*.tsx)
  const componentFiles = allFiles
    .filter(f => f.category === 'component' && f.lines >= 350)
    .sort((a, b) => b.lines - a.lines);

  console.log('--------------------------------------------------------------------');
  console.log('⚛️ TOP 10 GOD REACT COMPONENTS (`components/**/*.tsx` >= 350 LOC)');
  console.log('--------------------------------------------------------------------');
  console.log('| Hạng | Đường Dẫn Tệp | Số Dòng (LOC) | Dung Lượng (KB) | Đánh Giá Rủi Ro |');
  console.log('|:---:|:---|:---:|:---:|:---|');
  componentFiles.slice(0, 10).forEach((f, idx) => {
    let risk = '🟡 Trung Bình';
    if (f.lines > 1000 || f.sizeKb > 45) risk = '🔴 CỰC NGUY CẤP (Mega View)';
    else if (f.lines > 600 || f.sizeKb > 25) risk = '🟠 Cao';
    console.log(`| ${idx + 1} | \`${f.relativePath}\` | ${f.lines.toLocaleString()} | ${f.sizeKb} KB | ${risk} |`);
  });
  console.log('\n');

  // 3. TOP 10 DATA BLOAT FILES (lib/**-data.ts, data/**/*.json)
  const dataFiles = allFiles
    .filter(f => f.category === 'data')
    .sort((a, b) => b.sizeBytes - a.sizeBytes);

  console.log('--------------------------------------------------------------------');
  console.log('💾 TOP 10 DATA BLOAT FILES (`*-data.ts`, `data/**/*.json`)');
  console.log('--------------------------------------------------------------------');
  console.log('| Hạng | Đường Dẫn Tệp | Số Dòng (LOC) | Dung Lượng (KB) | Đánh Giá Rủi Ro |');
  console.log('|:---:|:---|:---:|:---:|:---|');
  dataFiles.slice(0, 10).forEach((f, idx) => {
    let risk = '🟡 Trung Bình';
    if (f.sizeKb > 100) risk = '🔴 CỰC NGUY CẤP (Mega Data)';
    else if (f.sizeKb > 40) risk = '🟠 Cao';
    console.log(`| ${idx + 1} | \`${f.relativePath}\` | ${f.lines.toLocaleString()} | ${f.sizeKb} KB | ${risk} |`);
  });
  console.log('\n');

  // 4. TOP 5 HOOKS CỒNG KỀNH (hooks/**/*.ts)
  const hookFiles = allFiles
    .filter(f => f.category === 'hook')
    .sort((a, b) => b.lines - a.lines);

  console.log('--------------------------------------------------------------------');
  console.log('🪝 TOP 5 MONOLITHIC HOOKS (`hooks/**/*.ts`)');
  console.log('--------------------------------------------------------------------');
  console.log('| Hạng | Đường Dẫn Tệp | Số Dòng (LOC) | Dung Lượng (KB) |');
  console.log('|:---:|:---|:---:|:---:|');
  hookFiles.slice(0, 5).forEach((f, idx) => {
    console.log(`| ${idx + 1} | \`${f.relativePath}\` | ${f.lines.toLocaleString()} | ${f.sizeKb} KB |`);
  });
  console.log('\n');

  console.log('====================================================================');
  console.log('✅ AUDIT COMPLETED! ĐÃ THỐNG KÊ CHI TIẾT TẤT CẢ ĐIỂM NÓNG.');
  console.log('====================================================================\n');
}

runAudit();

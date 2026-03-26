import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDataPath = path.join(__dirname, 'db', 'data_tvet.json');

const certificationScores = {
  Tiada: 35,
  CompTIA: 70,
  'Cisco CCNA': 85,
  'AWS Cloud': 90,
};

const targetScores = {
  Koding: 80,
  Rangkaian: 80,
  Kehadiran: 85,
  Akademik: 85,
  Pensijilan: 75,
};

let cachedStudentsPromise;

function normaliseStudent(record) {
  const dropoutRiskMap = {
    'Bermasalah': 'Tinggi',
    'Sederhana': 'Sederhana',
    'Cemerlang': 'Rendah'
  };

  return {
    id: record.ID_Pelajar,
    gender: 'Tidak Dinyatakan',
    incomeGroup: 'TBD',
    attendance: Number(record.Kehadiran_Pct) || 0,
    cgpa: Number(record.CGPA) || 0,
    codingScore: Number(record.PLO_1) || 0,
    networkingScore: Number(record.PLO_2) || 0,
    plo1: Number(record.PLO_1) || 0,
    plo2: Number(record.PLO_2) || 0,
    plo3: Number(record.PLO_3) || 0,
    plo4: Number(record.PLO_4) || 0,
    plo5: Number(record.PLO_5) || 0,
    plo6: Number(record.PLO_6) || 0,
    plo7: Number(record.PLO_7) || 0,
    plo8: Number(record.PLO_8) || 0,
    plo9: Number(record.PLO_9) || 0,
    certification: record.Sijil_Profesional,
    certificationScore: certificationScores[record.Sijil_Profesional] ?? 50,
    dropoutRisk: dropoutRiskMap[record.Status_Pelajar] || 'Sederhana',
    careerStatus: 'Pelajar',
  };
}

async function loadStudentsFromJson() {
  const fileContent = await readFile(defaultDataPath, 'utf8');
  const rows = JSON.parse(fileContent);

  return rows.map((row) => normaliseStudent(row));
}

async function getStudentsDataset() {
  if (!cachedStudentsPromise) {
    cachedStudentsPromise = loadStudentsFromJson();
  }

  return cachedStudentsPromise;
}

function formatAcademicScore(cgpa) {
  return Math.round((cgpa / 4) * 100);
}

function buildMetrics(student) {
  return [
    { label: 'PLO 1', value: student.plo1, target: 80 },
    { label: 'PLO 2', value: student.plo2, target: 80 },
    { label: 'PLO 3', value: student.plo3, target: 80 },
    { label: 'PLO 4', value: student.plo4, target: 80 },
    { label: 'PLO 5', value: student.plo5, target: 80 },
    { label: 'PLO 6', value: student.plo6, target: 80 },
    { label: 'PLO 7', value: student.plo7, target: 80 },
    { label: 'PLO 8', value: student.plo8, target: 80 },
    { label: 'PLO 9', value: student.plo9, target: 80 }
  ];
}

function buildInsight(metrics, student) {
  const weakestMetric = metrics.reduce((lowest, current) =>
    current.value < lowest.value ? current : lowest
  );
  const improvementGap = Math.max(weakestMetric.target - weakestMetric.value, 0);
  const priorityText =
    improvementGap >= 20 ? 'perlu diberi perhatian segera' : 'boleh dipertingkatkan lagi';

  return {
    weakestSkill: weakestMetric.label,
    message: `Fokus pada "${weakestMetric.label}" kerana skor semasa ${weakestMetric.value}% dan ${priorityText}. Risiko keciciran pelajar ini kini ${student.dropoutRisk.toLowerCase()}.`,
  };
}

export async function getAllStudents() {
  const students = await getStudentsDataset();

  return students.map((student) => ({
    id: student.id,
    gender: student.gender,
    incomeGroup: student.incomeGroup,
    attendance: student.attendance,
    cgpa: student.cgpa,
    dropoutRisk: student.dropoutRisk,
    careerStatus: student.careerStatus,
    certification: student.certification,
  }));
}

export async function getStudentById(studentId) {
  const students = await getStudentsDataset();

  return students.find((student) => student.id.toLowerCase() === studentId.toLowerCase()) ?? null;
}

export async function getStudentSkillGapById(studentId) {
  const student = await getStudentById(studentId);

  if (!student) {
    return null;
  }

  const metrics = buildMetrics(student);

  return {
    student: {
      id: student.id,
      attendance: student.attendance,
      cgpa: student.cgpa,
      dropoutRisk: student.dropoutRisk,
      careerStatus: student.careerStatus,
      certification: student.certification,
    },
    chart: {
      labels: metrics.map((metric) => metric.label),
      current: metrics.map((metric) => metric.value),
      target: metrics.map((metric) => metric.target),
    },
    insight: buildInsight(metrics, student),
  };
}
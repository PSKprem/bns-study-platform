// Type contracts that mirror the JSON content schemas (see docs/spec.md §3).
// These keep content (data/*.json) and UI in sync — content that doesn't match
// these shapes is a type error.

export interface SubHeading {
  id: string;
  label: string;
  sectionIds: string[];
}

export interface KeyPoint {
  point: string;
  subPoints: string[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  sectionRange: string;
  shortDescription: string;
  subHeadings: SubHeading[];
  summary: string;
  keyPoints: KeyPoint[];
  fastRevision: string[];
  mindMap: string;
  lastVerified: string;
}

export type VerificationStatus = "verified" | "unverified";

export interface Verification {
  status: VerificationStatus;
  source: string;
}

export interface Classification {
  cognizable: string;
  bailable: string;
  compoundable: string;
  triableBy: string;
}

export interface IpcReference {
  section: string;
  changeNote: string;
}

export interface Section {
  id: string;
  chapterId: string;
  number: string;
  title: string;
  bareActText: string;
  plainMeaning: string;
  ingredients: string[];
  punishment: string;
  classification: Classification | null;
  ipcReference: IpcReference | null;
  illustrations: string[];
  termRefs: string[];
  verification: Verification;
  lastVerified: string;
}

export type Difficulty = "basic" | "medium" | "hard";

export interface ExamQA {
  id: string;
  chapterId: string;
  question: string;
  modelAnswer: string;
  difficulty: Difficulty;
}

export interface DictionaryTerm {
  id: string;
  term: string;
  meaningEn: string;
  meaningHi: string;
  relatedSections: string[];
}

export interface MCQ {
  id: string;
  chapterId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

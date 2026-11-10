export interface CommitType {
  description: string;
  title: string;
}

export type JiraLocation =
  | 'pre-type'
  | 'pre-description'
  | 'post-description'
  | 'post-body';

export interface Options {
  types: Record<string, CommitType>;
  jiraMode: boolean;
  skipScope: boolean;
  skipType: boolean;
  skipDescription: boolean;
  skipBreaking: boolean;
  customScope: boolean;
  maxHeaderWidth: number;
  minHeaderWidth: number;
  maxLineWidth: number;
  jiraPrefix: string;
  jiraOptional: boolean;
  jiraLocation: JiraLocation;
  jiraPrepend: string;
  jiraAppend: string;
  exclamationMark: boolean;
  scopes?: string[];
  defaultType?: string;
  defaultScope?: string;
  defaultSubject?: string;
  defaultBody?: string;
  defaultIssues?: string;
}

export interface Answers {
  type?: string;
  jira?: string;
  scope?: string;
  customScope?: string;
  subject: string;
  body?: string;
  isBreaking?: boolean;
  breaking?: string;
  isIssueAffected?: boolean;
  issuesBody?: string;
  issues?: string;
}

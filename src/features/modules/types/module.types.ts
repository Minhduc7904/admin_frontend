// Management module types

export type ManagementModuleType = 'admin' | 'education' | 'student' | 'public';

export type SubjectType = 'math' | 'physics' | 'chemistry' | 'literature' | 'biology' | 'english';

export interface ManagementModule {
    id: ManagementModuleType;
    name: string;
    description: string;
    icon: string;
    features: string[];
    requiresSubject?: boolean;
}

export interface Subject {
    id: SubjectType;
    name: string;
    nameEn: string;
    color: string;
    icon: string;
}

export interface ModuleSelection {
    module: ManagementModuleType | null;
    subject: SubjectType | null;
}

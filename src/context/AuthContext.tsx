import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, TargetClass, StudyGroup, UserRole } from '../types';
import { apiService, DEFAULT_STUDENT, DEFAULT_ADMIN } from '../services/apiService';

interface AuthContextType {
  currentUser: StudentProfile | null;
  isAuthenticated: boolean;
  loginStudent: (email: string, pass: string) => Promise<boolean>;
  loginAdmin: (email: string, keyphrase: string) => Promise<boolean>;
  registerStudent: (data: {
    fullName: string;
    email: string;
    targetClass: TargetClass;
    studyGroup: StudyGroup;
  }) => Promise<boolean>;
  logout: () => void;
  updateClassAndGroup: (targetClass: TargetClass, studyGroup: StudyGroup) => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(() => {
    return apiService.getCurrentUser();
  });

  const isAuthenticated = currentUser !== null;

  const loginStudent = async (email: string, _pass: string): Promise<boolean> => {
    // Simulated realistic student login
    const user: StudentProfile = {
      ...DEFAULT_STUDENT,
      email: email || DEFAULT_STUDENT.email,
    };
    setCurrentUser(user);
    apiService.setCurrentUser(user);
    return true;
  };

  const loginAdmin = async (email: string, _keyphrase: string): Promise<boolean> => {
    const user: StudentProfile = {
      ...DEFAULT_ADMIN,
      email: email || DEFAULT_ADMIN.email,
    };
    setCurrentUser(user);
    apiService.setCurrentUser(user);
    return true;
  };

  const registerStudent = async (data: {
    fullName: string;
    email: string;
    targetClass: TargetClass;
    studyGroup: StudyGroup;
  }): Promise<boolean> => {
    const newUser: StudentProfile = {
      id: 'std-' + Date.now(),
      fullName: data.fullName,
      email: data.email,
      role: 'student',
      targetClass: data.targetClass,
      studyGroup: data.studyGroup,
      registrationNumber: `BISE-SINDH-${data.targetClass === '9th' ? 'SSC-I' : 'SSC-II'}-${Math.floor(
        10000 + Math.random() * 90000
      )}`,
      joinedDate: 'Current Session',
    };
    setCurrentUser(newUser);
    apiService.setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    apiService.setCurrentUser(null);
  };

  const updateClassAndGroup = (targetClass: TargetClass, studyGroup: StudyGroup) => {
    if (!currentUser) return;
    const updated: StudentProfile = {
      ...currentUser,
      targetClass,
      studyGroup,
    };
    setCurrentUser(updated);
    apiService.setCurrentUser(updated);
  };

  const updateProfile = (partial: Partial<StudentProfile>) => {
    if (!currentUser) return;
    const updated: StudentProfile = {
      ...currentUser,
      ...partial,
    };
    setCurrentUser(updated);
    apiService.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loginStudent,
        loginAdmin,
        registerStudent,
        logout,
        updateClassAndGroup,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

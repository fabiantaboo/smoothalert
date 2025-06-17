declare module 'smoothalert-pro' {
  
  // Core Types
  export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'custom';
  export type PositionType = 'center' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  export type AnimationType = 'fade' | 'slide' | 'bounce' | 'zoom' | 'flip';
  export type ThemeType = 'light' | 'dark' | 'auto';
  export type ButtonStyle = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

  // Interface Definitions
  export interface ButtonConfig {
    label: string;
    style?: ButtonStyle;
    action?: string | ((modalId: string) => void);
    disabled?: boolean;
    className?: string;
  }

  export interface CustomStyles {
    modal?: Partial<CSSStyleDeclaration>;
    overlay?: Partial<CSSStyleDeclaration>;
    title?: Partial<CSSStyleDeclaration>;
    message?: Partial<CSSStyleDeclaration>;
    image?: Partial<CSSStyleDeclaration>;
    buttons?: Partial<CSSStyleDeclaration>;
    closeButton?: Partial<CSSStyleDeclaration>;
  }

  export interface ModalOptions {
    title?: string;
    message?: string;
    type?: AlertType;
    imageUrl?: string;
    buttons?: ButtonConfig[];
    showCloseButton?: boolean;
    autoClose?: boolean;
    autoCloseDuration?: number;
    backdropClose?: boolean;
    position?: PositionType;
    animationType?: AnimationType;
    enableAnimation?: boolean;
    customStyles?: CustomStyles;
    className?: string;
    id?: string;
    zIndex?: number;
    onOpen?: (modalId: string) => void;
    onClose?: (modalId: string) => void;
    onBeforeClose?: (modalId: string) => boolean;
  }

  export interface ToastOptions {
    type?: AlertType;
    duration?: number;
    position?: PositionType;
    showCloseButton?: boolean;
    showProgress?: boolean;
    customStyles?: CustomStyles;
    className?: string;
    id?: string;
    onClick?: (toastId: string) => void;
    onClose?: (toastId: string) => void;
  }

  export interface ConfirmOptions extends Omit<ModalOptions, 'buttons'> {
    confirmText?: string;
    cancelText?: string;
    confirmButtonStyle?: ButtonStyle;
    cancelButtonStyle?: ButtonStyle;
  }

  export interface ThemeConfig {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      background: string;
      text: string;
      overlay: string;
    };
    borderRadius: string;
    fontFamily: string;
    fontSize: string;
    boxShadow: string;
    backdropFilter: string;
  }

  export interface GlobalConfig {
    theme?: ThemeType;
    defaultPosition?: PositionType;
    defaultAnimation?: AnimationType;
    defaultDuration?: number;
    customTheme?: Partial<ThemeConfig>;
    enableSounds?: boolean;
    enableHaptics?: boolean;
    enableKeyboardShortcuts?: boolean;
    rtl?: boolean;
  }

  // Performance Monitoring
  export interface PerformanceMetrics {
    renderTime: number;
    memoryUsage: number;
    activeModals: number;
    totalModalsCreated: number;
  }

  // Main Class
  export class SmoothAlertEngine {
    constructor(config?: GlobalConfig);
    
    // Core Methods
    alert(message: string, options?: ModalOptions): string;
    success(message: string, options?: ModalOptions): string;
    error(message: string, options?: ModalOptions): string;
    warning(message: string, options?: ModalOptions): string;
    info(message: string, options?: ModalOptions): string;
    confirm(message: string, options?: ConfirmOptions): Promise<boolean>;
    
    // Toast Methods
    toast(message: string, options?: ToastOptions): string;
    
    // Utility Methods
    close(modalId: string): boolean;
    closeAll(): void;
    isOpen(modalId?: string): boolean;
    getActiveModals(): string[];
    
    // Configuration
    setTheme(theme: ThemeType | Partial<ThemeConfig>): void;
    getTheme(): ThemeConfig;
    setGlobalConfig(config: Partial<GlobalConfig>): void;
    getGlobalConfig(): GlobalConfig;
    
    // Performance
    getPerformanceMetrics(): PerformanceMetrics;
    cleanup(): void;
    
    // Events
    on(event: string, callback: Function): void;
    off(event: string, callback?: Function): void;
    emit(event: string, ...args: any[]): void;
  }

  // Static Methods for Global Instance
  export default class SmoothAlert {
    static alert(message: string, options?: ModalOptions): string;
    static success(message: string, options?: ModalOptions): string;
    static error(message: string, options?: ModalOptions): string;
    static warning(message: string, options?: ModalOptions): string;
    static info(message: string, options?: ModalOptions): string;
    static confirm(message: string, options?: ConfirmOptions): Promise<boolean>;
    static toast(message: string, options?: ToastOptions): string;
    static close(modalId: string): boolean;
    static closeAll(): void;
    static isOpen(modalId?: string): boolean;
    static getActiveModals(): string[];
    static setTheme(theme: ThemeType | Partial<ThemeConfig>): void;
    static getTheme(): ThemeConfig;
    static setGlobalConfig(config: Partial<GlobalConfig>): void;
    static getGlobalConfig(): GlobalConfig;
    static getPerformanceMetrics(): PerformanceMetrics;
    static cleanup(): void;
    static on(event: string, callback: Function): void;
    static off(event: string, callback?: Function): void;
    static emit(event: string, ...args: any[]): void;
  }

  // Legacy Support
  export function smoothAlert(options: ModalOptions): string;
  export function closeSmoothAlert(modalId: string): boolean;
  export function toast(message: string, options?: ToastOptions): string;
  
  // Global Alert Override
  export function alert(message: string): void;
}

// Global namespace for UMD builds
declare global {
  interface Window {
    SmoothAlert: typeof import('smoothalert-pro').default;
    smoothAlert: typeof import('smoothalert-pro').smoothAlert;
    closeSmoothAlert: typeof import('smoothalert-pro').closeSmoothAlert;
    toast: typeof import('smoothalert-pro').toast;
  }
} 
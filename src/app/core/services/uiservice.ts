import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export type AlertType = 'success' | 'error' | 'warn' | 'info';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  // ===== TOAST =====
  show(message: string, type: AlertType = 'success', summary?: string) {
    this.messageService.add({
      severity: type,
      summary: summary ?? this.getDefaultSummary(type),
      detail: message,
      life: 3000,
    });
  }

  success(message: string, summary = 'Éxito') {
    this.show(message, 'success', summary);
  }

  error(message: string, summary = 'Error') {
    this.show(message, 'error', summary);
  }

  warning(message: string, summary = 'Advertencia') {
    this.show(message, 'warn', summary);
  }

  info(message: string, summary = 'Información') {
    this.show(message, 'info', summary);
  }

  clearToasts() {
    this.messageService.clear();
  }

  // ===== CONFIRM =====
  confirm(options: {
    message: string;
    header?: string;
    icon?: string;
    acceptLabel?: string;
    rejectLabel?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: options.message,
        header: options.header ?? 'Confirmación',
        icon: options.icon ?? 'pi pi-exclamation-triangle',
        acceptLabel: options.acceptLabel ?? 'Sí',
        rejectLabel: options.rejectLabel ?? 'No',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  // ===== SWEET ALERT =====
  sweet(options: {
    title: string;
    text?: string;
    icon?: SweetAlertIcon;
    confirmButtonText?: string;
    confirmButtonColor?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    cancelButtonColor?: string;
  }): Promise<boolean> {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon ?? 'success',
      confirmButtonText: options.confirmButtonText ?? 'Aceptar',
      confirmButtonColor: options.confirmButtonColor ?? '#f97316',
      showCancelButton: options.showCancelButton ?? false,
      cancelButtonText: options.cancelButtonText ?? 'Cancelar',
      cancelButtonColor: options.cancelButtonColor ?? '#6b7280',
    }).then((result) => result.isConfirmed);
  }

  // ===== RUN DATA =====
  async runData<T>(opts: {
    task: () => Promise<any>;
    setLoading?: (v: boolean) => void;
    setErrorMsg?: (msg: string) => void;
    showSuccess?: boolean;
    successMessage?: string;
  }): Promise<T | null> {
    opts.setErrorMsg?.('');
    opts.setLoading?.(true);

    try {
      const res = await opts.task();

      if (res?.code && res.code !== '0') {
        const msg = res.message ?? 'Operación fallida';
        opts.setErrorMsg?.(msg);
        this.error(msg);
        return null;
      }

      if (opts.showSuccess) {
        this.success(opts.successMessage ?? res?.message ?? 'Operación exitosa');
      }

      return res?.data ?? res ?? null;
    } catch (e: any) {
      const msg = e?.error?.message || 'Error inesperado';
      opts.setErrorMsg?.(msg);
      this.error(msg);
      return null;
    } finally {
      opts.setLoading?.(false);
    }
  }

  private getDefaultSummary(type: AlertType): string {
    switch (type) {
      case 'success':
        return 'Éxito';
      case 'error':
        return 'Error';
      case 'warn':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return 'Mensaje';
    }
  }
}
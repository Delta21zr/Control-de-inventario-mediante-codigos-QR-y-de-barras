import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHintALLOption,
} from '@capacitor/barcode-scanner';

interface ScanSession {
  cancelled: boolean;
  resolveCancellation: (value: string) => void;
}

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  private session: ScanSession | null = null;

  /** Vacío cuando no ocurrió un error o se canceló desde stopScan(). */
  public lastError = '';

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  /**
   * Implementación para Android/iOS.
   * Solicita exclusivamente permiso de cámara.
   */
  async checkPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      this.lastError = 'El escáner está configurado para Android o iOS.';
      return false;
    }

    try {
      let status = await Camera.checkPermissions();

      if (
        status.camera === 'prompt' ||
        status.camera === 'prompt-with-rationale'
      ) {
        status = await Camera.requestPermissions({
          permissions: ['camera'],
        });
      }

      if (status.camera !== 'granted') {
        this.lastError =
          'Permiso de cámara denegado. Puedes habilitarlo en Ajustes.';
        return false;
      }

      return true;
    } catch {
      this.lastError = 'No fue posible verificar el permiso de cámara.';
      return false;
    }
  }

  /**
   * Devuelve el código leído o '' si se cancela, falla o no hay contenido.
   * Impide iniciar otro escaneo mientras la operación nativa siga abierta.
   */
  async startScan(): Promise<string> {
    if (this.session) {
      return '';
    }

    this.lastError = '';

    let resolveCancellation!: (value: string) => void;

    const cancellation = new Promise<string>((resolve) => {
      resolveCancellation = resolve;
    });

    const session: ScanSession = {
      cancelled: false,
      resolveCancellation,
    };

    this.session = session;

    // La operación mantiene el bloqueo hasta que el plugin termine,
    // incluso si stopScan() ya canceló la espera de la UI.
    const operation = this.performScan(session);

    return Promise.race([operation, cancellation]);
  }

  /**
   * Cancela la espera de la UI e ignora cualquier resultado posterior.
   *
   * Limitación del plugin oficial:
   * no permite cerrar la cámara nativa mediante JavaScript.
   */
  async stopScan(): Promise<void> {
    const session = this.session;

    if (session) {
      session.cancelled = true;
      session.resolveCancellation('');
    }

    this.removeScannerBackground();
  }

  private async performScan(session: ScanSession): Promise<string> {
    try {
      const allowed = await this.checkPermission();

      // Evita abrir la cámara si se salió durante la solicitud de permiso.
      if (!allowed || session.cancelled) {
        return '';
      }

      this.document.body.classList.add('scanner-active');

      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
        scanInstructions: 'Apunta a un código QR o de barras',
        scanButton: false,
      });

      if (session.cancelled) {
        return '';
      }

      return typeof result?.ScanResult === 'string'
        ? result.ScanResult.trim()
        : '';
    } catch {
      // Algunas plataformas notifican la cancelación como rechazo.
      // También se controla cualquier fallo sin devolver null a la UI.
      if (!session.cancelled) {
        this.lastError = 'Escaneo cancelado o no completado.';
      }

      return '';
    } finally {
      this.removeScannerBackground();

      if (this.session === session) {
        this.session = null;
      }
    }
  }

  private removeScannerBackground(): void {
    this.document.body.classList.remove('scanner-active');
  }
}
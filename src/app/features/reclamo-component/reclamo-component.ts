import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ReclamoService } from '../../core/services/reclamo-service';
import { UIService } from '../../core/services/uiservice';
import { lastValueFrom } from 'rxjs';
import { TipoReclamoModel } from '../../core/models/class/TipoReclamoModel';
import { GuardarReclamoRequest } from '../../core/models/request/GuardarReclamoRequest';
import { ClienteModel } from '../../core/models/interface/ClienteModel';
import { ReclamoModel } from '../../core/models/interface/ReclamoModel';

@Component({
  selector: 'app-reclamo-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    TextareaModule
  ],
  templateUrl: './reclamo-component.html',
  styleUrl: './reclamo-component.scss'
})
export class ReclamoComponent {
  private fb = inject(FormBuilder);
  private reclamoService = inject(ReclamoService);
  private router = inject(Router);
  private ui = inject(UIService);

  cliente = signal<ClienteModel | null>(null);
  errorMsg = signal('');
  loadingConsultar = signal(false);
  loadingGuardar = signal(false);

  tiposReclamo: TipoReclamoModel[] = [
    new TipoReclamoModel('Tarjetas de Crédito', 'Tarjetas de Crédito'),
    new TipoReclamoModel('Transferencias', 'Transferencias'),
    new TipoReclamoModel('Pago de Servicios', 'Pago de Servicios')
  ];

  form = this.fb.group({
    identificacion: ['', [Validators.required, Validators.minLength(10)]],
    tipoReclamo: [{ value: null, disabled: true }, Validators.required],
    detalleReclamo: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]]
  });

  nombreCompleto = computed(() => {
    const c = this.cliente();
    return c ? `${c.nombres} ${c.apellidos}` : '';
  });

  async consultarCliente() {
    this.errorMsg.set('');
    this.cliente.set(null);

    const identificacion = this.form.controls.identificacion.value?.trim() ?? '';

    if (!identificacion) {
      this.form.controls.identificacion.markAsTouched();
      return;
    }

    const data = await this.ui.runData<ClienteModel>({
      task: () => lastValueFrom(this.reclamoService.consultarCliente(identificacion)),
      setLoading: v => this.loadingConsultar.set(v),
      setErrorMsg: m => this.errorMsg.set(m),
    });

    if (!data) {
      this.form.controls.tipoReclamo.disable();
      this.form.controls.detalleReclamo.disable();
      this.form.controls.tipoReclamo.reset(null);
      this.form.controls.detalleReclamo.reset('');
      return;
    }

    this.cliente.set(data);

    this.form.controls.tipoReclamo.enable();
    this.form.controls.detalleReclamo.enable();
    this.form.controls.tipoReclamo.updateValueAndValidity();
    this.form.controls.detalleReclamo.updateValueAndValidity();
    this.ui.success('Cliente encontrado correctamente.');
  }

  async guardarReclamo() {
    this.errorMsg.set('');

    if (this.form.invalid || !this.cliente()) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();

    const payload: GuardarReclamoRequest = {
      identificacion: raw.identificacion?.trim() ?? '',
      tipoReclamo: raw.tipoReclamo ?? '',
      detalleReclamo: raw.detalleReclamo?.trim() ?? ''
    };


    const data = await this.ui.runData<ReclamoModel>({
      task: async () => {
        const resp = await lastValueFrom(this.reclamoService.guardarReclamo(payload));
        return resp.data;
      },
      setLoading: v => this.loadingGuardar.set(v),
      setErrorMsg: m => this.errorMsg.set(m),
    });

    if (!data) return;

    const nuevoReclamo = await this.ui.sweet({
      title: '¡Reclamo guardado!',
      text: '¿Desea ingresar un nuevo reclamo?',
      icon: 'success',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No'
    });

    if (nuevoReclamo) {
      this.nuevoReclamo();
    } else {
      this.cerrarSesion();
    }
  }

  private nuevoReclamo(): void {
    this.form.controls.tipoReclamo.reset(null);
    this.form.controls.detalleReclamo.reset('');
    this.form.controls.tipoReclamo.markAsUntouched();  
    this.form.controls.detalleReclamo.markAsUntouched();
    this.form.controls.tipoReclamo.markAsPristine();
    this.form.controls.detalleReclamo.markAsPristine();
    this.ui.info('Puede ingresar un nuevo reclamo.');
  }

  private cerrarSesion(): void {
    this.ui.sweet({
      title: '¡Reclamo enviado!',
      text: 'Su reclamo fue registrado exitosamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      localStorage.removeItem('session');
      this.router.navigate(['/auth/login']);
    });
  }
}
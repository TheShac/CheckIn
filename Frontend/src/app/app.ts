import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  dato = signal<string>('');
  isLoading = signal<boolean>(false);
  resultado = signal<any>(null);
  replicaOrigen = signal<string | null>(null);

  private readonly apiUrl = '[http://146.83.102.24/api/validar](http://146.83.102.24/api/validar)';

  actualizarDato(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.toUpperCase();

    // AUTO-FORMATEO DE RUT
    const esPosibleRUT = /^[0-9K\.\-]+$/.test(valor);

    if (esPosibleRUT && valor.length > 0) {
      let limpio = valor.replace(/[^0-9K]/g, '');
      
      if (limpio.length > 1) {
        const cuerpo = limpio.slice(0, -1);
        const dv = limpio.slice(-1);
        const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        valor = `${cuerpoConPuntos}-${dv}`;
      } else {
        valor = limpio;
      }
    }

    input.value = valor;
    this.dato.set(valor);
  }

  async validar() {
    const valorActual = this.dato().trim();
    if (!valorActual) return;

    this.isLoading.set(true);
    this.resultado.set(null);
    this.replicaOrigen.set(null);

    // VALIDACIÓN ESTRICTA DE RUT EN EL FRONTEND
    if (/^[0-9Kk\.\-]+$/.test(valorActual)) {
      const regexFormatoExacto = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/i;
      
      if (!regexFormatoExacto.test(valorActual)) {
        this.resultado.set({
          autorizado: false,
          mensaje: 'Formato de RUT incompleto o inválido. Debe ser ej: 12.345.678-9'
        });
        this.isLoading.set(false);
        return;
      }
    }

    try {
      const response = await fetch(`${this.apiUrl}?dato=${encodeURIComponent(valorActual)}`);

      if (!response.ok) {
         throw new Error('Error en la conexión con el servidor');
      }

      const data = await response.json();
      this.resultado.set(data);

      const replicaInfo = data.procesadorPor || data.procesadoPor || data.puerto;
      if (replicaInfo) {
        this.replicaOrigen.set(replicaInfo.toString());
      }
      
    } catch (error) {
      console.error("Falló la petición:", error);
      
      this.resultado.set({
        autorizado: false,
        mensaje: 'Error de conexión. Verifica que el servidor esté funcionando.'
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
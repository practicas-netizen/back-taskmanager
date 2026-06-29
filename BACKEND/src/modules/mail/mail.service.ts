/**
 * Servicio centralizado para enviar correos electrónicos usando SMTP de Gmail.
 *
 * Funciones principales:
 * 1. Crea un único “transporter” de nodemailer con configuración SMTP de Gmail.
 *    Las credenciales se obtienen de variables de entorno (.env), no hardcoded en el código:
 *     · SMTP_HOST: smtp.gmail.com
 *     · SMTP_PORT: 587 (STARTTLS) — Gmail también admite 465 (SSL directo)
 *     · SMTP_USER: la dirección de Gmail que envía los correos
 *     · SMTP_PASS: la contraseña de aplicación de 16 dígitos generada en
 *       myaccount.google.com/apppasswords
 * 
 * 2. Ofrece métodos para eventos de tickets:
 *     · sendTicketCreated: al empleado, confirmando que se ha enviado
 *     · sendTicketAccepted: al empleado, notificando aprobación
 *     · sendTicketRejected: al empleado, notificando rechazo + motivo
 *     · sendTicketUpdated: al empleado, notificando edición de su ticket
 * 
 * 3. Cada método crea su propio HTML de plantilla (sendMail privado) con diseño simple.
 * 
 * 4. Los envíos fallidos se registran en el log del servidor sin interrumpir la petición HTTP.
*/

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    private transporter;

    constructor() {
        const port = parseInt(process.env.SMTP_PORT || '587', 10);

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port,
            secure: port === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

   /**
   * Método interno genérico de envío. Captura errores para que un fallo
   * de SMTP nunca tumbe la petición HTTP que disparó la notificación.
   */
    private async sendMail(to: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: `"Gestió de Tickets" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });
            this.logger.log(`Email enviado a ${to}: ${subject}`);
        } catch (error) {
            this.logger.error(`Error enviando email a ${to}`, error);
        }
    }

    // Plantilla base reutilizada por todos los correos.
    // según el tipo de evento, cuerpo con los datos del ticket.
    private wrapTemplate(headerColor: string, headerText: string, bodyHTML: string): string {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; 
        border: 1px solid #e2e8fo; boder-radius: 12px; overflow: hidden;">
         <div style="background: ${headerColor}; padding: 20px 24 px;">
            <h2 style="color: white; margin: 0; font-size: 18px;">${headerText}</h2>
         </div>
            <div style="padding: 24px; color: #1e293b;">
                ${bodyHTML}
                <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">
                 Aquest és un missatge automàtic del sistema de Gestió de Tickets.
                 No responguis a aquest correu.
                </p>
            </div>
        </div> 
      `;
    }

    /** Notifica al empleado que su ticket se ha registrado correctamente */
    async sendTicketCreated(to: string, employeeName: string, ticketTitle: string, amount: number) {
        const html = this.wrapTemplate(
            '#3C3489', // violeta — marca de la app
            'Ticket enviat correctament',
            `
                <p>Hola ${employeeName},</p>
                <p>El teu ticket <strong>"${ticketTitle}"</strong> per import de <strong>${amount} €
                </strong> s'ha registrat correctament i està pendent de revisió.</p>
                <p>Rebràs un nou correu quan sigui acceptat o rebutjat.</p>
            `,
        );
        await this.sendMail(to, `Ticket enviat: ${ticketTitle}`, html);
    }

    /** Notifica al responsable contable que hay un nuevo ticket pendiente */
    async sendTicketPendingReview(to: string, accountantName: string, employeeName: string, ticketTitle: string, amount: number) {
        const html = this.wrapTemplate(
            '#3C3489',
            'Nou ticket pendent de revisio',
            `
                <p>Hola ${accountantName},</p>
                <p>${employeeName} ha enviat el ticket <strong>"${ticketTitle}"</strong>
                per import de <strong>${amount} EUR</strong>.</p>
                <p>Revisa'l a l'aplicació per acceptar-lo o rebutjar-lo.</p>
            `,
        );
        await this.sendMail(to, `Nou ticket pendent: ${ticketTitle}`, html);
    }

    /** Notifica al empleado que su ticket ha sido aceptado */
    async sendTicketAccepted(to: string, employeeName: string, ticketTitle: string, amount: number) {
        const html = this.wrapTemplate(
            '#16a34a', //acceptat
            'Ticket acceptat',
            `
             <p>Hola ${employeeName},</p>
             <p>El teu ticket <strong>"${ticketTitle}"</strong> per import de <strong>${amount}
             €</strong> ha estat <strong style="color:#16a34a;">acceptat</strong>.</p>
            `,
        );
        await this.sendMail(to, `Ticket acceptat: ${ticketTitle}`, html);
    }

    /** Notifica al empleado que su ticket ha sido rechazado, con el motivo */
    async sendTicketRejected(to: string, employeeName: string, ticketTitle: string, reason: string) {
        const html = this.wrapTemplate(
            '#dc2626', // rebutjat
            'Ticket rebutjat',
            `
             <p>Hola ${employeeName},</p>
             <p>El teu ticket <strong>"${ticketTitle}"</strong> ha estat <strong style="color:#dc2626;">
             rebutjat</strong>.</p>
             <p style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:12px;">
             <strong>Motiu:</strong> ${reason}
             </p>
            `,
        );
        await this.sendMail(to, `Ticket rebutjat: ${ticketTitle}`, html);
    }

    /** Notifica al empleado que su ticket ha sido editado (por un admin/contable) */
    async sendTicketUpdated(to: string, employeeName: string, ticketTitle: string) {
        const html = this.wrapTemplate(
            '#854F0B', // editat
            'Ticket modificat',
            `
             <p>Hola ${employeeName},</p>
             <p>El teu ticket <strong>"${ticketTitle}"</strong> ha estat modificat. 
             Revisa els detalls a l'aplicació.</p>
            `,
        );
        await this.sendMail(to, `Ticket modificat: ${ticketTitle}`, html);
    }

    /** Notifica al responsable contable que un ticket pendiente se ha modificado */
    async sendTicketUpdatedForReview(to: string, accountantName: string, employeeName: string, ticketTitle: string) {
        const html = this.wrapTemplate(
            '#854F0B',
            'Ticket pendent modificat',
            `
             <p>Hola ${accountantName},</p>
             <p>${employeeName} ha modificat el ticket pendent <strong>"${ticketTitle}"</strong>.</p>
             <p>Revisa els canvis a l'aplicació abans d'acceptar-lo o rebutjar-lo.</p>
            `,
        );
        await this.sendMail(to, `Ticket pendent modificat: ${ticketTitle}`, html);
    }

   /**
   * Notifica al nuevo empleado que se ha creado su cuenta.
   * Incluye sus credenciales de acceso (email + contraseña en texto claro
   * porque es la primera vez que las recibe y necesita poder iniciar sesión).
   */
    async sendUserCreated(
        to: string,
        employeeName: string,
        password: string,
        company: string,
        position: string,
    ) {
        const html = this.wrapTemplate(
            '#3C3489', // violeta (marca de la app)
            'Benvingut/da a Gestió de Tickets',
            `
                <p>Hola ${employeeName},</p>
                <p>El teu compte ha estat creat correctament a l'aplicació de <strong>Gestió de Tickets</strong> de <strong>${company}</strong>.</p>
                <Aquí tens les teves credencial d'accés a l'aplicació:</p>
                <div style="background:#f8f9fb; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin:16px 0;">
                    <p style="margin:0 0 8px;"><strong>Correu electrònic:</strong> ${to}</p>
                    <p style="margin:0 0 8px;"><strong>Contrasenya:</strong> ${password}</p>
                    <p style="margin:0; color:#64748b; font-size:13px;">Càrrec: ${position}</p>
                </div>
                <p style="color:#dc2626; font-size:13px;">Per seguretat, es recomana que canviïs la contrasenya en el teu primer inici de sessió.</p>    
            `,
        );
        await this.sendMail(to, 'Benvingut/da - Accés a Gestió de Tickets', html);
    }

   /**
   * Notifica al empleado que el admin ha modificado su perfil.
   * Informa de los campos que pueden haber cambiado.
   */
   async sendUserUpdated(
    to: string,
    employeeName: string,
    position: string,
    department: string,
   ) {
    const html = this.wrapTemplate(
        '#0F6E56', // teal (actualización del perfil de un empleado)
        'Perfil actualitzat',
        `
            <p>Hola ${employeeName},</p>
            <p>Un administrador ha modificat el teu perfil a l'aplicació de <strong>Gestió de Tickets</strong>.</p>
            <div style="background:#f8f9fb; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin:16px 0;">
                <p style="margin:0 0 8px;"><strong>Càrrec actual:</strong> ${position}</p>
                <p style="margin:0;"><strong>Departament:</strong> ${department}</p>
            </div>
            <p>Si creus que hi ha algun error, contacta amb el teu administrador per comentar-li.</p>
        `,
    );
    await this.sendMail(to, 'El teu perfil ha estat actualitzat', html);
   }


}



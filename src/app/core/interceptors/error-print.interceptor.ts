import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          const url = new URL(request.url);

          if (
            error.status === HttpStatusCode.Unauthorized ||
            error.status === HttpStatusCode.Forbidden
          ) {
            const err = JSON.parse(error?.error);
            alert(err?.message);
          }

          this.notificationService.showError(
            `Request to "${url.pathname}" failed. Check the console for the details`,
            0,
          );
        },
      }),
    );
  }
}

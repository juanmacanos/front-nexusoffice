import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Nexus Office';
  isIos = false;
  isInStandaloneMode = false;
  showInstallBanner = false;

  deferredPrompt: any;
  showInstallButton = false;

  ngOnInit(): void {
    this.isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    this.isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone'] as boolean);

    if (this.isIos && !this.isInStandaloneMode) {
      this.showInstallBanner = true;
    }

    window.addEventListener('beforeinstallprompt', (event: Event) => {
      console.log("Android")
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton = true;
    });
  }

  installApp(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA instalado');
        } else {
          console.log('PWA no instalado');
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      });
    }
  }
}

import { Component, DestroyRef, OnInit, inject, signal, effect } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);

  ngOnInit(): void {
    const subscription = this.clickCount$.subscribe({
      next: (val) =>
        console.log(`Clicked button ${this.clickCount()} times.`)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })

  }


  onClick() {
    this.clickCount.update(prevCount => prevCount + 1);
  }

}

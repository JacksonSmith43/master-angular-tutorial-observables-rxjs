import { Component, DestroyRef, OnInit, inject, signal, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });

  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;

    const interval = setInterval(() => {
      if (timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      subscriber.next({ message: "Next value" });
      timesExecuted++;
    }, 2000);
  });

  ngOnInit(): void {

    this.customInterval$.subscribe({
      next: (val) => console.log("val: ", val),
      complete: () => console.log("Completed."),
      error: (err) => console.log(err)
    })

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

import { Input, Output, EventEmitter } from "@angular/core";
class WidgetProps {
  @Input() someProp: string = "";
  @Input() type?: string = "";
  @Input() gridCompatibility?: boolean = true;
  @Input() pageIndex: number = 1;
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter();
}
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["someProp", "type", "gridCompatibility", "pageIndex"],
  outputs: ["pageIndexChange"],
  template: `<div></div>`,
})
class Widget extends WidgetProps {
  someState: number = 0;
  get __g7(): any {
    return this.__g6;
  }
  get __g5(): (string | undefined)[] {
    if (this.__getterCache["g5"] !== undefined) {
      return this.__getterCache["g5"];
    }
    return (this.__getterCache["g5"] = ((): (string | undefined)[] => {
      return [...this.g3(), this.__g2];
    })());
  }
  get __g1(): any {
    return this.someProp;
  }
  get __g2(): any {
    return this.type;
  }
  __factorial(n: number): number {
    return n > 1 ? this.__factorial(n - 1) : 1;
  }
  g3(): (string | undefined)[] {
    return [this.__g1, this.__g2];
  }
  get __g4(): (string | undefined)[] {
    if (this.__getterCache["g4"] !== undefined) {
      return this.__getterCache["g4"];
    }
    return (this.__getterCache["g4"] = ((): (string | undefined)[] => {
      return [...this.g3(), this.__g1];
    })());
  }
  get __g6(): (string | undefined)[] {
    if (this.__getterCache["g6"] !== undefined) {
      return this.__getterCache["g6"];
    }
    return (this.__getterCache["g6"] = ((): (string | undefined)[] => {
      return [...this.__g5, ...this.__g4];
    })());
  }
  __someEffect(): any {
    return () => this.__g7;
  }
  get __type(): any {
    return this.type;
  }
  __pageIndexChange(newPageIndex: number): void {
    if (this.gridCompatibility) {
      this._pageIndexChange((this.pageIndex = newPageIndex + 1));
    } else {
      this._pageIndexChange((this.pageIndex = newPageIndex));
    }
  }
  __someMethod(): any {
    return undefined;
  }
  __recursive1(): void {
    this._someState = this.__recursive2();
  }
  __recursive2(): number {
    return requestAnimationFrame(this.__recursive1);
  }
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __destroyEffects: any[] = [];
  __viewCheckedSubscribeEvent: Array<(() => void) | null> = [];
  _effectTimeout: any;
  __schedule_someEffect() {
    this.__destroyEffects[0]?.();
    this.__viewCheckedSubscribeEvent[0] = () => {
      this.__destroyEffects[0] = this.__someEffect();
    };
  }

  _updateEffects() {
    if (this.__viewCheckedSubscribeEvent.length) {
      clearTimeout(this._effectTimeout);
      this._effectTimeout = setTimeout(() => {
        this.__viewCheckedSubscribeEvent.forEach((s, i) => {
          s?.();
          if (this.__viewCheckedSubscribeEvent[i] === s) {
            this.__viewCheckedSubscribeEvent[i] = null;
          }
        });
      });
    }
  }

  __getterCache: {
    g5?: (string | undefined)[];
    g4?: (string | undefined)[];
    g6?: (string | undefined)[];
  } = {};

  ngAfterViewInit() {
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(this.__someEffect());
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (
      this.__destroyEffects.length &&
      ["someProp", "type"].some((d) => changes[d])
    ) {
      this.__schedule_someEffect();
    }

    if (["someProp", "type"].some((d) => changes[d])) {
      this.__getterCache["g5"] = undefined;
    }

    if (["someProp", "type"].some((d) => changes[d])) {
      this.__getterCache["g4"] = undefined;
    }

    if (["someProp", "type"].some((d) => changes[d])) {
      this.__getterCache["g6"] = undefined;
    }
  }
  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
    clearTimeout(this._effectTimeout);
  }
  ngAfterViewChecked() {
    this._updateEffects();
  }

  _pageIndexChange: any;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    this._pageIndexChange = (e: any) => {
      this.pageIndexChange.emit(e);
      this._detectChanges();
    };
  }
  set _someState(someState: number) {
    this.someState = someState;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
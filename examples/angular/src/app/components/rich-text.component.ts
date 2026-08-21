import { Component, Directive, computed } from '@angular/core';
import { ScRichTextDirective, TextField } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

interface RichTextFields {
  Text?: TextField;
}

const RICH_TEXT_HOST = {
  '[attr.class]': "('component rich-text ' + styles().trim())",
  '[attr.id]': 'renderingId()',
} as const;

@Directive()
abstract class RichTextBase extends SxaComponent {
  readonly contentField = computed(() => (this.fields() as RichTextFields)?.Text);
}

@Component({
  selector: 'app-rich-text',
  imports: [ScRichTextDirective],
  host: RICH_TEXT_HOST,
  template: `
    <div class="component-content">
      <div *scRichText="contentField()"></div>
    </div>
  `,
})
class RichTextComponent extends RichTextBase {}

@Component({
  selector: 'app-rich-text-red',
  imports: [ScRichTextDirective],
  host: RICH_TEXT_HOST,
  template: `
    <div class="component-content">
      <div class="text-red-600" *scRichText="contentField()"></div>
    </div>
  `,
})
class RichTextRedComponent extends RichTextBase {}

export { RichTextComponent as Default, RichTextRedComponent as Red };

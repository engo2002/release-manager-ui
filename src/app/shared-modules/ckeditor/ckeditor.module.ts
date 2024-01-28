import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { SkeletonModule } from "primeng/skeleton";
import { CkEditorComponent } from "./ck-editor/ck-editor.component";

@NgModule({
    declarations: [CkEditorComponent],
    imports: [CommonModule, CKEditorModule, SkeletonModule],
    exports: [CkEditorComponent]
})
export class CkeditorModule {}

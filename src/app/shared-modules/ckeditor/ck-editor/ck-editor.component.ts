import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CKEditorComponent } from "@ckeditor/ckeditor5-angular";
import * as Editor from "src/assets/lib/ckeditor5-38.1.0-2-engo/build/ckeditor";
// import { AuthService } from "../../../services/auth/auth.service";

@Component({
    selector: "app-ck-editor",
    templateUrl: "./ck-editor.component.html",
    styleUrls: ["./ck-editor.component.css"]
})
export class CkEditorComponent implements AfterViewInit {
    public editor = Editor;
    public loading = true;
    @Input() data = "";
    @Input() fileUploadEndpoint = "";
    @Output() newData = new EventEmitter<string>();
    @ViewChild("editor") editorElement!: ElementRef;
    editorConfig: any;
    private editorState: CKEditorComponent;

    // private readonly authService: AuthService
    constructor() {
    }

    /*private get headersBodyImageUpload() {
        return {
            Authorization: "Bearer " + this.authService.bearerToken,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
            "Cross-Origin-Resource-Policy": "cross-origin"
        };
    }*/

    ngAfterViewInit() {
        this.initEditor();
    }

    initEditor() {
        this.loading = true;
        setTimeout(() => {
            this.editorConfig = {
                heading: {
                    options: [
                        {
                            model: "paragraph",
                            title: "Paragraph",
                            class: "ck-paragraph"
                        },
                        {
                            model: "heading1",
                            view: {
                                name: "h1",
                                classes: "headings",
                                attributes: { id: "title" }
                            },
                            title: "Heading 1"
                        },
                        {
                            model: "heading2",
                            view: {
                                name: "h2",
                                classes: "headings"
                            },
                            title: "Heading 2",
                            class: "ck-heading2"
                        },
                        {
                            model: "heading3",
                            view: {
                                name: "h3",
                                classes: "headings"
                            },
                            title: "Heading 3",
                            class: "ck-heading3"
                        }
                    ]
                },
                language: "de",
                simpleUpload: {
                    uploadUrl: this.fileUploadEndpoint,
                    withCredentials: false,

                    // headers: this.headersBodyImageUpload
                }
            };
            this.loading = false;
        }, 500);
    }

    emitChange({ editor }: any) {
        if (editor) {
            this.newData.emit(editor.getData());
        }
    }

    onReady(editor: CKEditorComponent) {
        this.editorState = editor;
    }
}

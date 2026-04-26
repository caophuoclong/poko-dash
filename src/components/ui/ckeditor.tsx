import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CKEditorField({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  disabled = false,
}: CKEditorFieldProps) {
  return (
    <div className="ckeditor-theme bg-surface-2 border border-frost rounded-lg overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: "GPL",
          placeholder,
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "|",
            "undo",
            "redo",
          ],
        }}
        data={value}
        disabled={disabled}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}

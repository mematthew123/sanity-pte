import * as selectors from "@portabletext/editor/selectors";


import { useEditor, useEditorSelector } from "@portabletext/editor";
import { schemaDefinition } from "@/app/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function Styles() {
  const editor = useEditor();
  const activeStyle = useEditorSelector(editor, selectors.getActiveStyle);

  return (
    <Select
      value={activeStyle}
      onValueChange={(style: any) => {
        editor.send({
          type: "style.toggle",
          style,
        });
        editor.send({
          type: "focus",
        });
      }}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Select style" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {schemaDefinition.styles.map((style: { name: any; title: any; }) => (
          <SelectItem key={style.name} value={style.name}>
            {style.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
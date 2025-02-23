import * as selectors from "@portabletext/editor/selectors";
import { useEditor, useEditorSelector } from "@portabletext/editor";
import { schemaDefinition, type AllSchemaNameKeys } from "@/app/utils";
import { Toggle } from "../ui/toggle";

import { Link, Bold, Italic, Code, Video } from "lucide-react";

export const icons: Partial<Record<AllSchemaNameKeys, JSX.Element>> = {
  strong: <Bold className="size-4" />,
  em: <Italic className="size-4" />,
  code: <Code className="size-4" />,
  link: <Link className="size-4" />,
  video: <Video className="size-4" />,
};

export function Decorators() {
  return (
    <div className="flex">
      {schemaDefinition.decorators.map((decorator) => (
        <DecoratorButton key={decorator.name} decorator={decorator} />
      ))}
    </div>
  );
}

type DecoratorButtonProps = {
  decorator: { name: AllSchemaNameKeys };
};

function DecoratorButton({ decorator }: DecoratorButtonProps) {
  const editor = useEditor();
  const active = useEditorSelector(
    editor,
    selectors.isActiveDecorator(decorator.name)
  );

  return (
    <Toggle
      variant="outline"
      aria-label={`Toggle ${decorator.name}`}
      className="bg-white first:rounded-l-md last:rounded-r-md rounded-none -mr-px last:mr-0"
      pressed={active}
      onClick={() => {
        editor.send({
          type: "decorator.toggle",
          decorator: decorator.name,
        });
        editor.send({
          type: "focus",
        });
      }}
    >
      <span className="sr-only">Toggle {decorator.name}</span>
      {icons[decorator.name]}
    </Toggle>
  );
}
import { Link } from "@/components/pteLink";
import type { RenderDecoratorFunction } from "@portabletext/editor";
import type { RenderListItemFunction } from "@portabletext/editor";
import type { RenderStyleFunction } from "@portabletext/editor";
import { defineSchema } from "@portabletext/editor";
import type { RenderAnnotationFunction } from "@portabletext/editor";



import type { RenderBlockFunction } from "@portabletext/editor";

export const renderBlock: RenderBlockFunction = (props) => {
  if (props.listItem === "number") {
    return <ol>{props.children}</ol>;
  } else if (props.listItem === "bullet") {
    return <ul>{props.children}</ul>;
  } else if (props.style === "normal") {
    return <p className="leading-7">{props.children}</p>;

  } else if (props.style === "blockquote") {
    return (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {props.children}
      </blockquote>
    );
  } else if (props.style === "h1") {
    return (
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {props.children}
      </h1>
    );
  } else if (props.style === "h2") {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {props.children}
      </h2>
    )}

  return <div>{props.children}</div>;
};


export const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === "link") {
    return <Link {...props} />;
  }

  return <>{props.children}</>;
};

export const renderStyle: RenderStyleFunction = (props) => {
  if (props.schemaType.value === "h1") {
    return (
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {props.children}
      </h1>
    );
  } else if (props.schemaType.value === "h2") {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {props.children}
      </h2>
    );
  } else if (props.schemaType.value === "h3") {
    return (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {props.children}
      </h3>
    );
  } else if (props.schemaType.value === "blockquote") {
    return (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {props.children}
      </blockquote>
    );
  }
  return <>{props.children}</>;
};

export const renderListItem: RenderListItemFunction = (props) => {
  if (props.schemaType.value === "bullet") {
    return <li className="leading-7">{props.children}</li>;
  }

  return <li className="leading-7">{props.children}</li>;
};



export const renderDecorator: RenderDecoratorFunction = (props) => {
  if (props.value === "strong") {
    return <strong>{props.children}</strong>;
  } else if (props.value === "em") {
    return <em>{props.children}</em>;
  } else if (props.value === "code") {
    return <code>{props.children}</code>;
  }
  return <>{props.children}</>;
};




export const schemaDefinition = defineSchema({
  // Decorators are simple marks that don't hold any data
  decorators: [{ name: "strong" }, { name: "em" }, { name: "code" }],
  // Styles apply to entire text blocks
  // There's always a 'normal' style that can be considered the paragraph style
  styles: [
    { name: "normal", title: "Paragraph" },
    { name: "h1", title: "Heading 1" },
    { name: "h2", title: "Heading 2" },
    { name: "h3", title: "Heading 3" },
    { name: "blockquote", title: "Blockquote" },
  ],

  // The types below are left empty for this example.
  // See the rendering guide to learn more about each type.

  // Annotations are more complex marks that can hold data (for example, hyperlinks).
  annotations: [
    {
      name: "link",
      title: "Link",
    },
  ],
  // Lists apply to entire text blocks as well (for example, bullet, numbered).
  lists: [
    { name: "bullet", title: "Bullet" },
    { name: "number", title: "Number" },
  ],
  // Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
  inlineObjects: [],
  // Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
  blockObjects: [
    {
      name: "video",
      title: "Video",
    },
  ],
});

// 1. Helper type to extract `name` if it’s a string
type ExtractName<T> = T extends { name: infer N extends string } ? N : never;

// 2. Union of all `name` properties from the schema
export type AllSchemaNameKeys =
  | ExtractName<(typeof schemaDefinition.decorators)[number]>
  | ExtractName<(typeof schemaDefinition.styles)[number]>
  | ExtractName<(typeof schemaDefinition.annotations)[number]>
  | ExtractName<(typeof schemaDefinition.lists)[number]>
  | ExtractName<(typeof schemaDefinition.blockObjects)[number]>;
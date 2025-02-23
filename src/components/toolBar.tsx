import { Video } from "lucide-react";
import { Annotations } from "./toolbar/annontations";
import { BlockObjects } from "./toolbar/blockContent";
import { Decorators } from "./toolbar/decorators";
import { Lists } from "./toolbar/lists";
import { Styles } from "./toolbar/styles";


export function Toolbar() {
  return (
    <div className="flex items-center space-x-2">
      <Styles />
      <Decorators />
      <Lists />
      <Annotations />
      <BlockObjects />
    </div>
  );
}
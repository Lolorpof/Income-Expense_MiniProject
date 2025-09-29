import React from "react";
import LinkButton from "./LinkButton";

export default function AllLinks({ children }: { children: React.ReactNode }) {
  return React.Children.map(children, (child, index) => (
    <LinkButton key={index} isActive={true}>
      {child}
    </LinkButton>
  ));
}

import React from "react";
import { Radio, RadioGroup, Stack, Textarea } from "@chakra-ui/react";

function ResizeExample() {
  const [resize, setResize] = React.useState<
    "horizontal" | "vertical" | "none" | "both"
  >("horizontal");

  const handleResizeChange = (value: string) => {
    setResize(value as "horizontal" | "vertical" | "none" | "both");
  };

  return (
    <>
      <RadioGroup defaultValue={resize} onChange={handleResizeChange} mb={6}>
        <Stack direction="row" spacing={5}>
          <Radio value="horizontal">Horizontal</Radio>
          <Radio value="vertical">Vertical</Radio>
          <Radio value="none">None</Radio>
        </Stack>
      </RadioGroup>

      <Textarea
        placeholder="Here is a sample placeholder"
        size="sm"
        resize={resize}
      />
    </>
  );
}

export default ResizeExample;

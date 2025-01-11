import { Heading } from "@chakra-ui/react";

interface Props {
  title: string;
}

const PageTitle = ({ title }: Props) => {
  return (
    <Heading
      as="h3"
      size="md"
      width="100%"
      textAlign="center"
      fontWeight="medium"
    >
      {title}
    </Heading>
  );
};

export default PageTitle;
